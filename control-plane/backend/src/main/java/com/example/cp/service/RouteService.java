package com.example.cp.service;

import com.example.cp.store.RouteEntity;
import com.example.cp.store.RouteRepository;
import com.example.shared.dsl.RouteDefinition;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository repository;

    public RouteService(RouteRepository repository) {
        this.repository = repository;
    }

    public List<RouteDefinition> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public RouteDefinition findById(String id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public RouteDefinition save(RouteDefinition route) {
        RouteEntity entity = toEntity(route);
        RouteEntity saved = repository.save(entity);
        return toDto(saved);
    }

    public RouteDefinition update(String id, RouteDefinition route) {
        return repository.findById(id).map(entity -> {
            entity.setName(route.getName());
            entity.setDescription(route.getDescription());
            entity.setYamlDsl(route.getYamlDsl());
            return toDto(repository.save(entity));
        }).orElse(null);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public void updateStatus(String id, String status) {
        repository.findById(id).ifPresent(entity -> {
            entity.setStatus(status);
            repository.save(entity);
        });
    }

    private RouteDefinition toDto(RouteEntity entity) {
        RouteDefinition dto = new RouteDefinition();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setYamlDsl(entity.getYamlDsl());
        return dto;
    }

    private RouteEntity toEntity(RouteDefinition dto) {
        RouteEntity entity = new RouteEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setYamlDsl(dto.getYamlDsl());
        return entity;
    }
}
