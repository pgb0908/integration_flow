package com.example.dp.runtime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.camel.CamelContext;
import org.apache.camel.model.ModelCamelContext;
import org.apache.camel.model.RouteDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Route 동적 추가/제거/갱신 관리
 */
@ApplicationScoped
public class RouteManager {
    private static final Logger logger = LoggerFactory.getLogger(RouteManager.class);

    @Inject
    CamelContext camelContext;

    /**
     * Route 추가
     */
    public void addRoute(RouteDefinition routeDefinition) throws Exception {
        logger.info("Adding route: {}", routeDefinition.getId());

        ((ModelCamelContext) camelContext).addRouteDefinitions(List.of(routeDefinition));
        camelContext.getRouteController().startRoute(routeDefinition.getId());

        logger.info("Route added and started: {}", routeDefinition.getId());
    }

    /**
     * 여러 Route 추가
     */
    public void addRoutes(List<RouteDefinition> routeDefinitions) throws Exception {
        logger.info("Adding {} routes", routeDefinitions.size());

        ((ModelCamelContext) camelContext).addRouteDefinitions(routeDefinitions);

        // Start all routes
        for (RouteDefinition routeDef : routeDefinitions) {
            camelContext.getRouteController().startRoute(routeDef.getId());
        }

        logger.info("All routes added and started");
    }

    /**
     * Route 제거
     */
    public void removeRoute(String routeId) throws Exception {
        logger.info("Removing route: {}", routeId);

        // Stop route first
        camelContext.getRouteController().stopRoute(routeId);

        // Remove route
        boolean removed = camelContext.removeRoute(routeId);

        if (removed) {
            logger.info("Route removed: {}", routeId);
        } else {
            logger.warn("Route not found for removal: {}", routeId);
        }
    }

    /**
     * Route 시작
     */
    public void startRoute(String routeId) throws Exception {
        logger.info("Starting route: {}", routeId);
        camelContext.getRouteController().startRoute(routeId);
        logger.info("Route started: {}", routeId);
    }

    /**
     * Route 정지
     */
    public void stopRoute(String routeId) throws Exception {
        logger.info("Stopping route: {}", routeId);
        camelContext.getRouteController().stopRoute(routeId);
        logger.info("Route stopped: {}", routeId);
    }

    /**
     * Route 재시작
     */
    public void restartRoute(String routeId) throws Exception {
        logger.info("Restarting route: {}", routeId);
        stopRoute(routeId);
        Thread.sleep(100); // Small delay
        startRoute(routeId);
        logger.info("Route restarted: {}", routeId);
    }

    /**
     * 모든 Route 정지
     */
    public void stopAllRoutes() throws Exception {
        logger.info("Stopping all routes");

        var routeIds = camelContext.getRoutes().stream()
                .map(route -> route.getId())
                .toList();

        for (String routeId : routeIds) {
            stopRoute(routeId);
        }

        logger.info("All routes stopped");
    }

    /**
     * Route 존재 여부 확인
     */
    public boolean routeExists(String routeId) {
        return camelContext.getRoute(routeId) != null;
    }
}
