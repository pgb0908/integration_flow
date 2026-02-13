package com.example.cp.api;

import com.example.cp.service.RouteService;
import com.example.shared.dsl.RouteDefinition;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public List<RouteDefinition> listRoutes() {
        return routeService.findAll();
    }

    @GetMapping("/{id}")
    public RouteDefinition getRoute(@PathVariable String id) {
        return routeService.findById(id);
    }

    @PostMapping
    public RouteDefinition createRoute(@RequestBody RouteDefinition route) {
        return routeService.save(route);
    }

    @DeleteMapping("/{id}")
    public void deleteRoute(@PathVariable String id) {
        routeService.delete(id);
    }
}
