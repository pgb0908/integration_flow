package com.example.dp.health;

import com.example.shared.api.RouteStatusResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.Collections;
import java.util.List;

/**
 * Route 실행 상태를 Control-Plane에 보고하는 Health 엔드포인트.
 */
@Path("/health")
@ApplicationScoped
public class HealthReporter {

    @GET
    @Path("/routes")
    @Produces(MediaType.APPLICATION_JSON)
    public List<RouteStatusResponse> getRouteStatus() {
        // TODO: CamelContext에서 실행 중인 Route 상태 조회
        return Collections.emptyList();
    }
}
