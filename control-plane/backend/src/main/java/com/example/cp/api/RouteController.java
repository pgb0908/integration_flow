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
        return ApiResponse.success(routeService.updateRoute(id, route), "Route updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ApiResponse.success(null, "Route deleted successfully");
    }

    @PostMapping("/{id}/deploy")
    public ApiResponse<RouteEntity> deployRoute(@PathVariable Long id) {
        return ApiResponse.success(routeService.deployRoute(id), "Route deployed successfully");
    }

    @PostMapping("/{id}/start")
    public ApiResponse<RouteEntity> startRoute(@PathVariable Long id) {
        return ApiResponse.success(routeService.startRoute(id), "Route started successfully");
    }

    @PostMapping("/{id}/stop")
    public ApiResponse<RouteEntity> stopRoute(@PathVariable Long id) {
        return ApiResponse.success(routeService.stopRoute(id), "Route stopped successfully");
    }
}
