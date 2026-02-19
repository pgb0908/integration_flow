package com.example.dp.health;

import com.example.dp.runtime.CamelContextManager;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.ConnectException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * 주기적 상태 보고 (Control-Plane으로)
 */
@ApplicationScoped
public class HealthReporter {
    private static final Logger logger = LoggerFactory.getLogger(HealthReporter.class);

    @Inject
    CamelContextManager contextManager;

    @ConfigProperty(name = "control-plane.url", defaultValue = "http://localhost:8080")
    String controlPlaneUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    /**
     * 1분마다 상태 보고
     */
    @Scheduled(every = "60s")
    void reportHealth() {
        try {
            var stats = contextManager.getContextStats();

            logger.info("[HealthReporter] Health Report - Context: {}, Status: {}, Routes: {}/{}, Uptime: {}",
                    stats.name(),
                    stats.status(),
                    stats.startedRoutes(),
                    stats.totalRoutes(),
                    stats.uptime());

            String body = String.format(
                    "{\"name\":\"%s\",\"status\":\"%s\",\"totalRoutes\":%d,\"startedRoutes\":%d,\"uptime\":\"%s\"}",
                    stats.name(),
                    stats.status(),
                    stats.totalRoutes(),
                    stats.startedRoutes(),
                    stats.uptime()
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(controlPlaneUrl + "/api/runtime/health-report"))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            logger.debug("[HealthReporter] Health report sent, response: {}", response.statusCode());

        } catch (ConnectException e) {
            logger.warn("[HealthReporter] Control-Plane unavailable, skipping health report: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("[HealthReporter] Failed to report health", e);
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
