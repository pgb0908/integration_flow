package com.example.cp.api;

import com.example.cp.deploy.DeployManager;
import com.example.cp.service.RouteService;
import com.example.shared.api.RouteDeployRequest;
import com.example.shared.dsl.RouteDefinition;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {

    private final RouteService routeService;
    private final DeployManager deployManager;

    public RouteController(RouteService routeService, DeployManager deployManager) {
        this.routeService = routeService;
        this.deployManager = deployManager;
    }

    @GetMapping
    public List<RouteDefinition> listRoutes() {
        return routeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDefinition> getRoute(@PathVariable String id) {
        RouteDefinition route = routeService.findById(id);
        return route != null ? ResponseEntity.ok(route) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public RouteDefinition createRoute(@RequestBody RouteDefinition route) {
        return routeService.save(route);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteDefinition> updateRoute(@PathVariable String id, @RequestBody RouteDefinition route) {
        RouteDefinition updated = routeService.update(id, route);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteRoute(@PathVariable String id) {
        routeService.delete(id);
    }

    @PostMapping("/{id}/deploy")
    public ResponseEntity<String> deployRoute(@PathVariable String id) {
        RouteDefinition route = routeService.findById(id);
        if (route == null) {
            return ResponseEntity.notFound().build();
        }
        RouteDeployRequest request = new RouteDeployRequest(
                UUID.randomUUID().toString(),
                Collections.singletonList(route)
        );
        deployManager.deploy(request);
        routeService.updateStatus(id, "RUNNING");
        return ResponseEntity.ok("Deployed");
    }
}
