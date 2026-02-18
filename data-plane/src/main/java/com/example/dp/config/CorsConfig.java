package com.example.dp.config;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * CORS 및 기타 설정
 */
@ApplicationScoped
public class CorsConfig {
    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    void onStart(@Observes StartupEvent ev) {
        logger.info("Data-Plane starting...");
        logger.info("CORS configured for Control-Plane communication");
    }
}
