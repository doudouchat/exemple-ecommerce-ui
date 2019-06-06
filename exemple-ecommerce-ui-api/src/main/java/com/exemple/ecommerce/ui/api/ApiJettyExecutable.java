package com.exemple.ecommerce.ui.api;

import java.io.File;
import java.io.FileInputStream;
import java.util.Map;

import org.apache.curator.test.TestingServer;
import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.plus.jndi.EnvEntry;
import org.eclipse.jetty.plus.webapp.EnvConfiguration;
import org.eclipse.jetty.plus.webapp.PlusConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.FragmentConfiguration;
import org.eclipse.jetty.webapp.JettyWebXmlConfiguration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.yaml.snakeyaml.Yaml;

import info.archinnov.achilles.embedded.CassandraEmbeddedServerBuilder;

public class ApiJettyExecutable {

    private static TestingServer embeddedZookeeper(int port) throws Exception {

        return new TestingServer(port, true);
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
        Map<String, Map<String, Object>> properties = yaml.load(new FileInputStream(resource));

        System.setProperty("logback.configurationFile", System.getProperty("logging.config"));

        // ZOOKEEPER

        embeddedZookeeper((int) properties.get("zookeeper").get("port"));

        // CASSANDRA

        embeddedServer((int) properties.get("cassandra").get("port")).buildServer();

        // SERVER

        Server server = new Server();

        Configuration.ClassList jndiConfiguration = Configuration.ClassList.setServerDefault(server);
        jndiConfiguration.addAfter(FragmentConfiguration.class.getName(), EnvConfiguration.class.getName(), PlusConfiguration.class.getName());
        jndiConfiguration.addBefore(JettyWebXmlConfiguration.class.getName(), AnnotationConfiguration.class.getName());

        ServerConnector connectorAuthorization = new ServerConnector(server);
        connectorAuthorization.setPort((int) properties.get("authorization").get("port"));
        connectorAuthorization.setName("authorization");

        ServerConnector connectorApi = new ServerConnector(server);
        connectorApi.setPort((int) properties.get("api").get("port"));
        connectorApi.setName("api");

        server.addConnector(connectorAuthorization);
        server.addConnector(connectorApi);

        HandlerCollection contexts = new HandlerCollection();
        server.setHandler(contexts);

        System.setProperty("spring.profiles.active", "etude,noEvent");

        // AUTHORIZATION

        File authorizationDir = new File((String) properties.get("authorization").get("dir"));

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

        File apiDir = new File((String) properties.get("api").get("dir"));

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

        server.start();
        server.join();

    }
}
