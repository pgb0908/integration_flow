package com.example.shared.api;

/**
 * Data-Plane → Control-Plane 상태 보고 DTO.
 */
public class RouteStatusResponse {

    public enum Status {
        RUNNING, STOPPED, ERROR
    }

    private String routeId;
    private Status status;
    private String message;

    public RouteStatusResponse() {
    }

    public RouteStatusResponse(String routeId, Status status, String message) {
        this.routeId = routeId;
        this.status = status;
        this.message = message;
    }

    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
