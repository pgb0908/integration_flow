package com.example.dp.health;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.camel.CamelContext;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.HealthCheckResponseBuilder;
import org.eclipse.microprofile.health.Readiness;

/**
 * Route 헬스체크
 */
@Readiness
@ApplicationScoped
public class RouteHealthCheck implements HealthCheck {

    @Inject
    CamelContext camelContext;

    @Override
    public HealthCheckResponse call() {
        HealthCheckResponseBuilder builder = HealthCheckResponse.named("Camel Routes Health Check");

        try {
            int totalRoutes = camelContext.getRoutes().size();
            long startedRoutes = camelContext.getRoutes().stream()
                    .filter(route -> {
                        var status = camelContext.getRouteController().getRouteStatus(route.getId());
                        return status != null && status.isStarted();
                    })
                    .count();

            builder.withData("totalRoutes", totalRoutes);
            builder.withData("startedRoutes", startedRoutes);
            builder.withData("contextStatus", camelContext.getStatus().name());
            builder.withData("contextUptime", camelContext.getUptime().toString());

            // Health is UP if context is started
            if (camelContext.getStatus().isStarted()) {
                builder.up();
            } else {
                builder.down();
            }

        } catch (Exception e) {
            builder.down().withData("error", e.getMessage());
        }

        return builder.build();
    }
}
