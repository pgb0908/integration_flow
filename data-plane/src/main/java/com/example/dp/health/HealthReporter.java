package com.example.dp.health;

import com.example.dp.runtime.CamelContextManager;
import com.example.shared.api.RouteStatusResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.apache.camel.Route;
import org.apache.camel.ServiceStatus;

import java.util.ArrayList;
import java.util.List;

@Path("/health")
@ApplicationScoped
public class HealthReporter {

    private final CamelContextManager contextManager;

    public HealthReporter(CamelContextManager contextManager) {
        this.contextManager = contextManager;
    }

    @GET
    @Path("/routes")
    @Produces(MediaType.APPLICATION_JSON)
    public List<RouteStatusResponse> getRouteStatus() {
        List<RouteStatusResponse> statuses = new ArrayList<>();
        for (Route route : contextManager.getContext().getRoutes()) {
            String routeId = route.getRouteId();
            ServiceStatus serviceStatus = contextManager.getContext()
                    .getRouteController().getRouteStatus(routeId);
            RouteStatusResponse.Status status;
            if (serviceStatus == null) {
                status = RouteStatusResponse.Status.STOPPED;
            } else {
                status = switch (serviceStatus) {
                    case Started -> RouteStatusResponse.Status.RUNNING;
                    case Stopped, Stopping -> RouteStatusResponse.Status.STOPPED;
                    default -> RouteStatusResponse.Status.ERROR;
                };
            }
            statuses.add(new RouteStatusResponse(routeId, status, serviceStatus != null ? serviceStatus.name() : "Unknown"));
        }
        return statuses;
    }
}
