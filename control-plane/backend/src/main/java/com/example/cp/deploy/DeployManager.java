package com.example.cp.deploy;

import com.example.shared.api.RouteDeployRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DeployManager {

    private static final Logger log = LoggerFactory.getLogger(DeployManager.class);

    private final RestTemplate restTemplate;
    private final String dataPlaneUrl;

    public DeployManager(@Value("${data-plane.url}") String dataPlaneUrl) {
        this.restTemplate = new RestTemplate();
        this.dataPlaneUrl = dataPlaneUrl;
    }

    public void deploy(RouteDeployRequest request) {
        String url = dataPlaneUrl + "/routes/deploy";
        try {
            restTemplate.postForEntity(url, request, String.class);
            log.info("Deployed {} routes to Data-Plane", request.getRoutes().size());
        } catch (Exception e) {
            log.error("Failed to deploy to Data-Plane: {}", e.getMessage());
            throw new RuntimeException("Data-Plane deployment failed", e);
        }
    }
}
