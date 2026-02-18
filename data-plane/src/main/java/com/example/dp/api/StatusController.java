package com.example.dp.api;

import com.example.dp.runtime.CamelContextManager;
import com.example.shared.api.ApiResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Data-Plane 상태 조회 API
 */
@Path("/api/status")
@Produces(MediaType.APPLICATION_JSON)
public class StatusController {

    @Inject
    CamelContextManager contextManager;

    @GET
    public ApiResponse<CamelContextManager.ContextStats> getStatus() {
        try {
            var stats = contextManager.getContextStats();
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get status: " + e.getMessage());
        }
    }

    @GET
    @Path("/ping")
    public ApiResponse<String> ping() {
        return ApiResponse.success("pong", "Data-Plane is running");
    }
}
