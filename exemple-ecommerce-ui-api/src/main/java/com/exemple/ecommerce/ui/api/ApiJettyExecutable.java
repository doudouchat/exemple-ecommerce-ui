package com.exemple.ecommerce.ui.api;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.nodes.PersistentNode;
import org.apache.curator.retry.RetryNTimes;
import org.apache.curator.test.TestingServer;
import org.apache.zookeeper.CreateMode;
import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.plus.jndi.EnvEntry;
import org.eclipse.jetty.plus.webapp.EnvConfiguration;
import org.eclipse.jetty.plus.webapp.PlusConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.server.handler.ShutdownHandler;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.FragmentConfiguration;
import org.eclipse.jetty.webapp.JettyWebXmlConfiguration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.mindrot.jbcrypt.BCrypt;
import org.yaml.snakeyaml.Yaml;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import info.archinnov.achilles.embedded.CassandraEmbeddedServerBuilder;
import info.archinnov.achilles.embedded.CassandraShutDownHook;

public final class ApiJettyExecutable {

    private static final String API_APP = "api";

    private static final String AUTHORIZATION_APP = "authorization";

    private static final String GATEWAY_APP = "gateway";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ApiJettyExecutable() {

    }

    private static TestingServer embeddedZookeeper(int port) throws Exception {

        return new TestingServer(port, true);

    }

    private static CuratorFramework createClientZookeeper(TestingServer embeddedZookeeper) {

        CuratorFramework clientZookeeper = CuratorFrameworkFactory.newClient(embeddedZookeeper.getConnectString(), new RetryNTimes(1, 1_000));
        clientZookeeper.start();

        return clientZookeeper;

    }

    private static PersistentNode createClientDetails(CuratorFramework client, String clientId, Map<String, Object> clientDetails) {

        PersistentNode node = new PersistentNode(client, CreateMode.PERSISTENT, false, "/" + clientId,
                MAPPER.convertValue(clientDetails, JsonNode.class).toString().getBytes(StandardCharsets.UTF_8));
        node.start();

        return node;

    }

    private static CassandraEmbeddedServerBuilder embeddedServer(int port) {

        System.setProperty("cassandra.unsafesystem", "true");
        System.setProperty("com.datastax.driver.FORCE_NIO", "true");

        return CassandraEmbeddedServerBuilder.builder().withScript("cassandra/keyspace.cql").withScript("cassandra/schema.cql")
                .withScript("cassandra/exec.cql").withClusterName("test").withCQLPort(port).cleanDataFilesAtStartup(true);
    }

    public static void main(String[] args) throws Exception {

        // RESOURCE

        File resource = new File(args[0]);

        // PROPERTIES

        Yaml yaml = new Yaml();
        Map<String, Map<String, Object>> properties = yaml.load(Files.newInputStream(Paths.get(resource.toURI())));

        System.setProperty("logback.configurationFile", System.getProperty("logging.config"));

        // ZOOKEEPER

        TestingServer embeddedZookeeper = embeddedZookeeper((int) properties.get("zookeeper").get("port"));

        final CuratorFramework clientZookeeper = createClientZookeeper(embeddedZookeeper);

        final CuratorFramework clientAuthorizationZookeeper = clientZookeeper.usingNamespace(AUTHORIZATION_APP);

        // CREATE CLIENT RESOURCE

        String password = "{bcrypt}" + BCrypt.hashpw("secret", BCrypt.gensalt());
        Map<String, Object> clientDetails = new HashMap<>();
        clientDetails.put("client_id", "resource");
        clientDetails.put("client_secret", password);
        clientDetails.put("authorized_grant_types", Collections.singletonList("client_credentials"));
        clientDetails.put("authorities", Collections.singletonList("ROLE_TRUSTED_CLIENT"));
        createClientDetails(clientAuthorizationZookeeper, "resource", clientDetails);

        // CASSANDRA
        CassandraShutDownHook cassandraShutDownHook = new CassandraShutDownHook();
        embeddedServer((int) properties.get("cassandra").get("port")).withShutdownHook(cassandraShutDownHook).buildServer();

        // SERVER

        Server server = new Server();

        Configuration.ClassList jndiConfiguration = Configuration.ClassList.setServerDefault(server);
        jndiConfiguration.addAfter(FragmentConfiguration.class.getName(), EnvConfiguration.class.getName(), PlusConfiguration.class.getName());
        jndiConfiguration.addBefore(JettyWebXmlConfiguration.class.getName(), AnnotationConfiguration.class.getName());

        ServerConnector connectorAuthorization = new ServerConnector(server);
        connectorAuthorization.setPort((int) properties.get(AUTHORIZATION_APP).get("port"));
        connectorAuthorization.setName(AUTHORIZATION_APP);

        ServerConnector connectorApi = new ServerConnector(server);
        connectorApi.setPort((int) properties.get(API_APP).get("port"));
        connectorApi.setName(API_APP);

        ServerConnector connectorGateway = new ServerConnector(server);
        connectorGateway.setPort((int) properties.get(GATEWAY_APP).get("port"));
        connectorGateway.setName(GATEWAY_APP);

        server.addConnector(connectorAuthorization);
        server.addConnector(connectorApi);
        server.addConnector(connectorGateway);

        HandlerCollection contexts = new HandlerCollection();
        contexts.addHandler(new ShutdownHandler("secret", true, true));
        server.setHandler(contexts);

        System.setProperty("spring.profiles.active", "etude,noEvent");

        // AUTHORIZATION

        File authorizationDir = new File((String) properties.get(AUTHORIZATION_APP).get("dir"));

        try (Resource authorizationResource = Resource.newClassPathResource("webapp/exemple-ecommerce-authorization.war")) {
            authorizationResource.copyTo(authorizationDir);
        }

        WebAppContext appAuthorization = new WebAppContext();
        appAuthorization.setContextPath("/ExempleAuthorization");
        appAuthorization.setWar(new File(authorizationDir, "webapp/exemple-ecommerce-authorization.war").getAbsolutePath());
        appAuthorization.setVirtualHosts(new String[] { "@authorization" });

        new EnvEntry(appAuthorization, "exemple-ecommerce-authorization-configuration", resource.getAbsolutePath(), true);

        contexts.addHandler(appAuthorization);

        // API

        File apiDir = new File((String) properties.get(API_APP).get("dir"));

        try (Resource apiResource = Resource.newClassPathResource("webapp/exemple-ecommerce-api.war")) {
            apiResource.copyTo(apiDir);
        }

        WebAppContext appApi = new WebAppContext();
        appApi.setContextPath("/ExempleEcommerce");
        appApi.setWar(new File(apiDir, "webapp/exemple-ecommerce-api.war").getAbsolutePath());
        appApi.setVirtualHosts(new String[] { "@api" });
        appApi.setAttribute("org.eclipse.jetty.server.webapp.ContainerIncludeJarPattern",
                ".*/[^/]*servlet-api-[^/]*\\.jar$|.*/javax.servlet.jsp.jstl-.*\\.jar$|.*/[^/]*taglibs.*\\.jar$");

        new EnvEntry(appApi, "exemple-ecommerce-configuration", resource.getAbsolutePath(), true);

        contexts.addHandler(appApi);

        // GATEWAY

        File gatewayDir = new File((String) properties.get(GATEWAY_APP).get("dir"));

        try (Resource gatewayResource = Resource.newClassPathResource("webapp/exemple-ecommerce-ui-gateway.war")) {
            gatewayResource.copyTo(gatewayDir);
        }

        WebAppContext gateway = new WebAppContext();
        gateway.setContextPath("/");
        gateway.setWar(new File(gatewayDir, "webapp/exemple-ecommerce-ui-gateway.war").getAbsolutePath());
        gateway.setVirtualHosts(new String[] { "@gateway" });

        new EnvEntry(gateway, "exemple-ecommerce-gateway-configuration", resource.getAbsolutePath(), true);
        new EnvEntry(gateway, "spring.config.location", resource.getAbsolutePath(), true);

        contexts.addHandler(gateway);

        server.start();
        server.join();

        cassandraShutDownHook.shutDownNow();

    }
}
