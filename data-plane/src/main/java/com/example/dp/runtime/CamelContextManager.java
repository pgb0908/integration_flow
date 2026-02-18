package com.example.dp.runtime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.camel.CamelContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * CamelContext 라이프사이클 관리
 */
@ApplicationScoped
public class CamelContextManager {
    private static final Logger logger = LoggerFactory.getLogger(CamelContextManager.class);

    @Inject
    CamelContext camelContext;

    /**
     * CamelContext 상태 조회
     */
    public String getContextStatus() {
        return camelContext.getStatus().name();
    }

    /**
     * 실행 중인 모든 Route ID 조회
     */
    public List<String> getRunningRouteIds() {
        return camelContext.getRoutes().stream()
                .map(route -> route.getId())
                .toList();
    }

    /**
     * 특정 Route의 상태 조회
     */
    public String getRouteStatus(String routeId) {
        var route = camelContext.getRoute(routeId);
        if (route == null) {
            logger.warn("Route not found: {}", routeId);
            return "NOT_FOUND";
        }

        var status = camelContext.getRouteController().getRouteStatus(routeId);
        return status != null ? status.name() : "UNKNOWN";
    }

    /**
     * CamelContext 통계 조회
     */
    public ContextStats getContextStats() {
        int totalRoutes = camelContext.getRoutes().size();
        int startedRoutes = (int) camelContext.getRoutes().stream()
                .filter(route -> camelContext.getRouteController()
                        .getRouteStatus(route.getId()).isStarted())
                .count();

        return new ContextStats(
                camelContext.getName(),
                camelContext.getVersion(),
                camelContext.getStatus().name(),
                totalRoutes,
                startedRoutes,
                camelContext.getUptime()
        );
    }

    public record ContextStats(
            String name,
            String version,
            String status,
            int totalRoutes,
            int startedRoutes,
            String uptime
    ) {}
}
