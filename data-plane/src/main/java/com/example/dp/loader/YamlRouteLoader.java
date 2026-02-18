package com.example.dp.loader;

import com.example.dp.runtime.RouteManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.RouteDefinition;
import org.apache.camel.model.RoutesDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * YAML DSL → Camel Route 변환 및 로딩
 */
@ApplicationScoped
public class YamlRouteLoader {
    private static final Logger logger = LoggerFactory.getLogger(YamlRouteLoader.class);

    @Inject
    CamelContext camelContext;

    @Inject
    RouteManager routeManager;

    /**
     * YAML 문자열에서 Route 로드
     */
    public void loadRoutesFromYaml(String yamlContent) throws Exception {
        logger.info("Loading routes from YAML");
        logger.debug("YAML content:\n{}", yamlContent);

        try {
            // Parse YAML to RouteDefinition
            var inputStream = new ByteArrayInputStream(yamlContent.getBytes(StandardCharsets.UTF_8));
            var routes = camelContext.loadRoutesDefinition(inputStream);

            if (routes != null && !routes.getRoutes().isEmpty()) {
                logger.info("Parsed {} route(s) from YAML", routes.getRoutes().size());

                // Add routes to context
                routeManager.addRoutes(routes.getRoutes());

                logger.info("Successfully loaded {} route(s)", routes.getRoutes().size());
            } else {
                logger.warn("No routes found in YAML");
            }
        } catch (Exception e) {
            logger.error("Failed to load routes from YAML", e);
            throw new RuntimeException("Failed to load routes: " + e.getMessage(), e);
        }
    }

    /**
     * Route ID로 특정 Route 언로드
     */
    public void unloadRoute(String routeId) throws Exception {
        logger.info("Unloading route: {}", routeId);
        routeManager.removeRoute(routeId);
        logger.info("Route unloaded: {}", routeId);
    }

    /**
     * 모든 Route 언로드
     */
    public void unloadAllRoutes() throws Exception {
        logger.info("Unloading all routes");

        var routeIds = camelContext.getRoutes().stream()
                .map(route -> route.getId())
                .toList();

        for (String routeId : routeIds) {
            routeManager.removeRoute(routeId);
        }

        logger.info("All routes unloaded");
    }

    /**
     * Route 재로드 (기존 제거 후 새로 로드)
     */
    public void reloadRoute(String routeId, String yamlContent) throws Exception {
        logger.info("Reloading route: {}", routeId);

        // Remove existing route if exists
        if (routeManager.routeExists(routeId)) {
            routeManager.removeRoute(routeId);
            logger.debug("Removed existing route: {}", routeId);
        }

        // Load new route
        loadRoutesFromYaml(yamlContent);

        logger.info("Route reloaded: {}", routeId);
    }

    /**
     * 간단한 테스트 Route 생성 (개발용)
     */
    public void loadTestRoute() throws Exception {
        logger.info("Loading test route");

        String testYaml = """
                - route:
                    id: test-route
                    from:
                      uri: timer:test?period=5000
                      steps:
                        - log:
                            message: "Test route is working! Time: ${date:now:yyyy-MM-dd HH:mm:ss}"
                        - to:
                            uri: log:test-output
                """;

        loadRoutesFromYaml(testYaml);
        logger.info("Test route loaded successfully");
    }
}
