package com.example.cp.service;

import com.example.shared.dsl.RouteDefinition;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RouteService {

    private final Map<String, RouteDefinition> store = new ConcurrentHashMap<>();

    public List<RouteDefinition> findAll() {
        return new ArrayList<>(store.values());
    }

    public RouteDefinition findById(String id) {
        return store.get(id);
    }

    public RouteDefinition save(RouteDefinition route) {
        store.put(route.getId(), route);
        return route;
    }

    public void delete(String id) {
        store.remove(id);
    }
}
