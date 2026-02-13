package com.example.shared.api;

import com.example.shared.dsl.RouteDefinition;

import java.util.List;

/**
 * Control-Plane → Data-Plane 배포 요청 DTO.
 */
public class RouteDeployRequest {

    private String deploymentId;
    private List<RouteDefinition> routes;

    public RouteDeployRequest() {
    }

    public RouteDeployRequest(String deploymentId, List<RouteDefinition> routes) {
        this.deploymentId = deploymentId;
        this.routes = routes;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public List<RouteDefinition> getRoutes() {
        return routes;
    }

    public void setRoutes(List<RouteDefinition> routes) {
        this.routes = routes;
    }
}
