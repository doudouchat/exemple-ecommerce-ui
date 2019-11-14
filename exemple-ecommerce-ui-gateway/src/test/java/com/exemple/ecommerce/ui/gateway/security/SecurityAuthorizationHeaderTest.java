package com.exemple.ecommerce.ui.gateway.security;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;

import org.mockserver.client.MockServerClient;
import org.mockserver.integration.ClientAndServer;
import org.mockserver.model.Header;
import org.mockserver.model.HttpRequest;
import org.mockserver.model.HttpResponse;
import org.mockserver.model.JsonBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.exemple.ecommerce.ui.gateway.common.LoggingFilter;
import com.exemple.ecommerce.ui.gateway.core.GatewayTestConfiguration;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

@SpringBootTest(classes = GatewayTestConfiguration.class, webEnvironment = WebEnvironment.RANDOM_PORT)
public class SecurityAuthorizationHeaderTest extends AbstractTestNGSpringContextTests {

    private static final Logger LOG = LoggerFactory.getLogger(SecurityAuthorizationHeaderTest.class);

    @Autowired
    private TestRestTemplate restTemplate;

    @Value("${api.port}")
    private int apiPort;

    private RequestSpecification requestSpecification;

    private ClientAndServer apiServer;

    private MockServerClient apiClient;

    private static final Algorithm HMAC256_ALGORITHM;

    static {

        HMAC256_ALGORITHM = Algorithm.HMAC256("abc");

    }

    @BeforeClass
    private void init() {

        System.setProperty("mockserver.logLevel", "WARN");

        apiServer = ClientAndServer.startClientAndServer(apiPort);
        apiClient = new MockServerClient("localhost", apiPort);

    }

    @AfterClass
    private void stop() {

        apiServer.stop();

    }

    @BeforeMethod
    private void before() {

        requestSpecification = RestAssured.given().filters(new LoggingFilter(LOG));

        apiClient.reset();

    }

    @Test
    public void securitySuccess() {

        String token = JWT.create().withClaim("user_name", "john_doe").withAudience("test").withArrayClaim("scope", new String[] { "account:read" })
                .sign(HMAC256_ALGORITHM);

        apiClient.when(HttpRequest.request().withMethod("POST").withPath("/ExempleEcommerce/account"))
                .respond(HttpResponse.response().withHeaders(new Header("Content-Type", "application/json;charset=UTF-8"))
                        .withBody(JsonBody.json(Collections.singletonMap("name", "jean"))).withStatusCode(200));

        Response response = requestSpecification.header("Authorization", "BEARER " + token)
                .post(restTemplate.getRootUri() + "/ExempleEcommerce/account");

        assertThat(response.getStatusCode(), is(HttpStatus.OK.value()));

    }

    @Test
    public void securityFailure() {

        String token = JWT.create().withClaim("user_name", "john_doe").withAudience("test").withArrayClaim("scope", new String[] { "account:read" })
                .withExpiresAt(Date.from(Instant.now().minus(1, ChronoUnit.DAYS))).sign(HMAC256_ALGORITHM);

        apiClient.when(HttpRequest.request().withMethod("POST").withPath("/ExempleEcommerce/account"))
                .respond(HttpResponse.response().withHeaders(new Header("Content-Type", "application/json;charset=UTF-8"))
                        .withBody(JsonBody.json(Collections.singletonMap("name", "jean"))).withStatusCode(200));

        Response response = requestSpecification.header("Authorization", "BEARER " + token)
                .post(restTemplate.getRootUri() + "/ExempleEcommerce/account");

        assertThat(response.getStatusCode(), is(HttpStatus.UNAUTHORIZED.value()));

    }

}