package com.example.shared.api;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RouteStatusResponse {
    private String routeId;
    private String status;
    private String message;
    private Long throughput;

    public RouteStatusResponse() {
    }

    public RouteStatusResponse(String routeId, String status) {
        this.routeId = routeId;
        this.status = status;
    }

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getThroughput() {
        return throughput;
    }

    public void setThroughput(Long throughput) {
        this.throughput = throughput;
    }
}
