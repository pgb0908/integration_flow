package com.example.shared.api;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RouteDeployRequest {
    private String routeId;
    private String yamlDsl;
    private String targetDataPlane;

    public RouteDeployRequest() {
    }

    public RouteDeployRequest(String routeId, String yamlDsl, String targetDataPlane) {
        this.routeId = routeId;
        this.yamlDsl = yamlDsl;
        this.targetDataPlane = targetDataPlane;
    }

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getYamlDsl() {
        return yamlDsl;
    }

    public void setYamlDsl(String yamlDsl) {
        this.yamlDsl = yamlDsl;
    }

    public String getTargetDataPlane() {
        return targetDataPlane;
    }

    public void setTargetDataPlane(String targetDataPlane) {
        this.targetDataPlane = targetDataPlane;
    }
}
