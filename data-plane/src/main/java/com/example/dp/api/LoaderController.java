package com.example.dp.api;

import com.example.dp.loader.YamlRouteLoader;
import com.example.dp.runtime.CamelContextManager;
import com.example.dp.runtime.RouteManager;
import com.example.shared.api.ApiResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * DSL 수신 및 Route 제어 REST API
 */
@Path("/api/loader")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LoaderController {
    private static final Logger logger = LoggerFactory.getLogger(LoaderController.class);

    @Inject
    YamlRouteLoader yamlRouteLoader;

    @Inject
    RouteManager routeManager;

    @Inject
    CamelContextManager contextManager;

    /**
     * YAML DSL로 Route 로드
     */
    @POST
    @Path("/load")
    public ApiResponse<String> loadRoute(RouteLoadRequest request) {
        try {
            logger.info("Received route load request for: {}", request.routeId());
            yamlRouteLoader.loadRoutesFromYaml(request.yamlDsl());
            return ApiResponse.success("loaded", "Route loaded successfully");
        } catch (Exception e) {
            logger.error("Failed to load route", e);
            return ApiResponse.error("Failed to load route: " + e.getMessage());
        }
    }

    /**
     * Route 재로드
     */
    @POST
    @Path("/reload/{routeId}")
    public ApiResponse<String> reloadRoute(@PathParam("routeId") String routeId, RouteLoadRequest request) {
        try {
            logger.info("Reloading route: {}", routeId);
            yamlRouteLoader.reloadRoute(routeId, request.yamlDsl());
            return ApiResponse.success("reloaded", "Route reloaded successfully");
        } catch (Exception e) {
            logger.error("Failed to reload route", e);
            return ApiResponse.error("Failed to reload route: " + e.getMessage());
        }
    }

    /**
     * Route 제거
     */
    @DELETE
    @Path("/unload/{routeId}")
    public ApiResponse<String> unloadRoute(@PathParam("routeId") String routeId) {
        try {
            logger.info("Unloading route: {}", routeId);
            yamlRouteLoader.unloadRoute(routeId);
            return ApiResponse.success("unloaded", "Route unloaded successfully");
        } catch (Exception e) {
            logger.error("Failed to unload route", e);
            return ApiResponse.error("Failed to unload route: " + e.getMessage());
        }
    }

    /**
     * Route 시작
     */
    @POST
    @Path("/start/{routeId}")
    public ApiResponse<String> startRoute(@PathParam("routeId") String routeId) {
        try {
            logger.info("Starting route: {}", routeId);
            routeManager.startRoute(routeId);
            return ApiResponse.success("started", "Route started successfully");
        } catch (Exception e) {
            logger.error("Failed to start route", e);
            return ApiResponse.error("Failed to start route: " + e.getMessage());
        }
    }

    /**
     * Route 정지
     */
    @POST
    @Path("/stop/{routeId}")
    public ApiResponse<String> stopRoute(@PathParam("routeId") String routeId) {
        try {
            logger.info("Stopping route: {}", routeId);
            routeManager.stopRoute(routeId);
            return ApiResponse.success("stopped", "Route stopped successfully");
        } catch (Exception e) {
            logger.error("Failed to stop route", e);
            return ApiResponse.error("Failed to stop route: " + e.getMessage());
        }
    }

    /**
     * Route 상태 조회
     */
    @GET
    @Path("/status/{routeId}")
    public ApiResponse<Map<String, Object>> getRouteStatus(@PathParam("routeId") String routeId) {
        try {
            String status = contextManager.getRouteStatus(routeId);
            boolean exists = routeManager.routeExists(routeId);

            return ApiResponse.success(Map.of(
                    "routeId", routeId,
                    "status", status,
                    "exists", exists
            ));
        } catch (Exception e) {
            logger.error("Failed to get route status", e);
            return ApiResponse.error("Failed to get route status: " + e.getMessage());
        }
    }

    /**
     * 모든 Route 조회
     */
    @GET
    @Path("/routes")
    public ApiResponse<Map<String, Object>> getAllRoutes() {
        try {
            var routeIds = contextManager.getRunningRouteIds();
            var stats = contextManager.getContextStats();

            return ApiResponse.success(Map.of(
                    "routes", routeIds,
                    "totalCount", routeIds.size(),
                    "contextStats", stats
            ));
        } catch (Exception e) {
            logger.error("Failed to get routes", e);
            return ApiResponse.error("Failed to get routes: " + e.getMessage());
        }
    }

    /**
     * 테스트 Route 로드 (개발용)
     */
    @POST
    @Path("/test")
    public ApiResponse<String> loadTestRoute() {
        try {
            logger.info("Loading test route");
            yamlRouteLoader.loadTestRoute();
            return ApiResponse.success("loaded", "Test route loaded successfully");
        } catch (Exception e) {
            logger.error("Failed to load test route", e);
            return ApiResponse.error("Failed to load test route: " + e.getMessage());
        }
    }

    public record RouteLoadRequest(String routeId, String yamlDsl) {}
}
