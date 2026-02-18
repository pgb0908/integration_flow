package com.example.dp;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.QuarkusApplication;
import io.quarkus.runtime.annotations.QuarkusMain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Data-Plane Main Application
 */
@QuarkusMain
public class DataPlaneApplication implements QuarkusApplication {
    private static final Logger logger = LoggerFactory.getLogger(DataPlaneApplication.class);

    public static void main(String... args) {
        logger.info("Starting Data-Plane Application...");
        Quarkus.run(DataPlaneApplication.class, args);
    }

    @Override
    public int run(String... args) {
        logger.info("Data-Plane is running!");
        logger.info("Available endpoints:");
        logger.info("  - Health: http://localhost:8081/health");
        logger.info("  - Status: http://localhost:8081/api/status");
        logger.info("  - Loader: http://localhost:8081/api/loader/*");

        Quarkus.waitForExit();
        return 0;
    }
}
