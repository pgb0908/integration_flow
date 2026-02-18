package com.example.cp.api;

import com.example.cp.service.RouteService;
import com.example.cp.store.entity.RouteEntity;
import com.example.shared.api.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {
    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ApiResponse<List<RouteEntity>> getAllRoutes(@RequestParam(required = false) Long projectId) {
        if (projectId != null) {
            return ApiResponse.success(routeService.getRoutesByProjectId(projectId));
        }
        return ApiResponse.success(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    public ApiResponse<RouteEntity> getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("Route not found"));
    }

    @PostMapping
    public ApiResponse<RouteEntity> createRoute(@RequestBody RouteEntity route) {
        return ApiResponse.success(routeService.createRoute(route), "Route created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<RouteEntity> updateRoute(@PathVariable Long id, @RequestBody RouteEntity route) {
        try {
            return ApiResponse.success(routeService.updateRoute(id, route), "Route updated successfully");
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ApiResponse.success(null, "Route deleted successfully");
    }

    @PostMapping("/{id}/deploy")
    public ApiResponse<String> deployRoute(@PathVariable Long id) {
        return routeService.getRouteById(id)
                .map(route -> {
                    // TODO: Implement Data-Plane deployment
                    return ApiResponse.success("Deployment initiated", "Route deployment started");
                })
                .orElse(ApiResponse.error("Route not found"));
    }

    @PostMapping("/{id}/start")
    public ApiResponse<String> startRoute(@PathVariable Long id) {
        routeService.updateRouteStatus(id, "running");
        return ApiResponse.success("started", "Route started successfully");
    }

    @PostMapping("/{id}/stop")
    public ApiResponse<String> stopRoute(@PathVariable Long id) {
        routeService.updateRouteStatus(id, "stopped");
        return ApiResponse.success("stopped", "Route stopped successfully");
    }
}
