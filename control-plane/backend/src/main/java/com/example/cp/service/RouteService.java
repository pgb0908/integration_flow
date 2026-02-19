package com.example.cp.service;

import com.example.cp.deploy.DataPlaneClient;
import com.example.cp.exception.BusinessException;
import com.example.cp.exception.DataPlaneException;
import com.example.cp.exception.ResourceNotFoundException;
import com.example.cp.store.entity.RouteEntity;
import com.example.cp.store.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RouteService {
    private final RouteRepository routeRepository;
    private final DataPlaneClient dataPlaneClient;

    public RouteService(RouteRepository routeRepository, DataPlaneClient dataPlaneClient) {
        this.routeRepository = routeRepository;
        this.dataPlaneClient = dataPlaneClient;
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

    public RouteEntity deployRoute(Long id) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));

        if (route.getYamlDsl() == null || route.getYamlDsl().isBlank()) {
            throw new BusinessException("YAML_DSL_REQUIRED",
                    "Route [" + id + "] has no YAML DSL. Please configure the route before deploying.");
        }

        updateRouteStatus(id, "deploying");

        String camelRouteId = "cp-route-" + id;
        String currentStatus = route.getStatus();

        try {
            if ("deployed".equals(currentStatus) || "running".equals(currentStatus)) {
                dataPlaneClient.reloadRoute(camelRouteId, route.getYamlDsl());
            } else {
                dataPlaneClient.deployRoute(camelRouteId, route.getYamlDsl());
            }
            updateRouteStatus(id, "deployed");
            return routeRepository.findById(id).orElseThrow();
        } catch (DataPlaneException e) {
            updateRouteStatus(id, "deploy_failed");
            throw e;
        }
    }

    public RouteEntity startRoute(Long id) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));

        if (!"deployed".equals(route.getStatus())) {
            throw new BusinessException("INVALID_STATE",
                    "Route [" + id + "] must be in 'deployed' state to start. Current state: " + route.getStatus());
        }

        String camelRouteId = "cp-route-" + id;
        try {
            dataPlaneClient.startRoute(camelRouteId);
            updateRouteStatus(id, "running");
            return routeRepository.findById(id).orElseThrow();
        } catch (DataPlaneException e) {
            updateRouteStatus(id, "deployed");
            throw e;
        }
    }

    public RouteEntity stopRoute(Long id) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));

        if (!"running".equals(route.getStatus())) {
            throw new BusinessException("INVALID_STATE",
                    "Route [" + id + "] must be in 'running' state to stop. Current state: " + route.getStatus());
        }

        String camelRouteId = "cp-route-" + id;
        try {
            dataPlaneClient.stopRoute(camelRouteId);
            updateRouteStatus(id, "deployed");
            return routeRepository.findById(id).orElseThrow();
        } catch (DataPlaneException e) {
            updateRouteStatus(id, "running");
            throw e;
        }
    }

    public Map<String, Object> getRouteRuntimeStatus(Long id) {
        RouteEntity route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));

        String camelRouteId = "cp-route-" + id;
        Map<String, Object> dpStatus = dataPlaneClient.getRouteStatus(camelRouteId);

        return Map.of(
                "routeId", id,
                "routeName", route.getName(),
                "cpStatus", route.getStatus(),
                "dpStatus", dpStatus
        );
    }
}
