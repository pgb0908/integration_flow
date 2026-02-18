package com.example.dp.health;

import com.example.dp.runtime.CamelContextManager;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 주기적 상태 보고 (Control-Plane으로)
 */
@ApplicationScoped
public class HealthReporter {
    private static final Logger logger = LoggerFactory.getLogger(HealthReporter.class);

    @Inject
    CamelContextManager contextManager;

    /**
     * 1분마다 상태 보고
     */
    @Scheduled(every = "60s")
    void reportHealth() {
        try {
            var stats = contextManager.getContextStats();

            logger.info("Health Report - Context: {}, Status: {}, Routes: {}/{}, Uptime: {}",
                    stats.name(),
                    stats.status(),
                    stats.startedRoutes(),
                    stats.totalRoutes(),
                    stats.uptime());

            // TODO: HTTP POST to Control-Plane
            // Example: POST http://localhost:8080/api/data-planes/report
            // Body: stats

        } catch (Exception e) {
            logger.error("Failed to report health", e);
        }
    }

    /**
     * 수동 상태 보고
     */
    public void reportNow() {
        logger.info("Manual health report triggered");
        reportHealth();
    }
}
