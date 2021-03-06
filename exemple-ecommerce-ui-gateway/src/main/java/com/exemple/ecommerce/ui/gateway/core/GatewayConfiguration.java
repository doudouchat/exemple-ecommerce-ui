package com.exemple.ecommerce.ui.gateway.core;

import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.exemple.ecommerce.ui.gateway.security.GatewaySecurityConfiguration;
import com.exemple.ecommerce.ui.gateway.session.GatewaySessionConfiguration;

@Configuration
@EnableZuulProxy
@Import({ GatewaySecurityConfiguration.class, GatewaySessionConfiguration.class })
@ComponentScan(basePackages = { "com.exemple.ecommerce.ui.gateway.location", "com.exemple.ecommerce.ui.gateway.routing" })
public class GatewayConfiguration {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/ExempleEcommerce/**").allowedOrigins("*").allowedHeaders("*")
                        .allowedMethods("GET", "POST", "PUT", "HEAD", "PATCH").allowCredentials(true);
                registry.addMapping("/ExempleAuthorization/**").allowedOrigins("*").allowedHeaders("*").allowedMethods("GET", "POST")
                        .allowCredentials(true);
            }
        };
    }
}
