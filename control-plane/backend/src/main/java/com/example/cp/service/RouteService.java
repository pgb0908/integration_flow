package com.example.cp.service;

import com.example.cp.exception.ResourceNotFoundException;
import com.example.cp.store.entity.RouteEntity;
import com.example.cp.store.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {
    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<RouteEntity> getAllRoutes() {
        return routeRepository.findAll();
    }

    public List<RouteEntity> getRoutesByProjectId(Long projectId) {
        return routeRepository.findByProjectId(projectId);
    }

    public Optional<RouteEntity> getRouteById(Long id) {
        return routeRepository.findById(id);
    }

    @Transactional
    public RouteEntity createRoute(RouteEntity route) {
        return routeRepository.save(route);
    }

    @Transactional
    public RouteEntity updateRoute(Long id, RouteEntity route) {
        return routeRepository.findById(id)
                .map(existing -> {
                    existing.setName(route.getName());
                    existing.setDescription(route.getDescription());
                    existing.setYamlDsl(route.getYamlDsl());
                    if (route.getProjectId() != null) {
                        existing.setProjectId(route.getProjectId());
                    }
                    return routeRepository.save(existing);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));
    }

    @Transactional
    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }

    @Transactional
    public void updateRouteStatus(Long id, String status) {
        routeRepository.findById(id).ifPresent(route -> {
            route.setStatus(status);
            routeRepository.save(route);
        });
    }
}
