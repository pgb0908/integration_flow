package com.example.shared.dsl;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RouteDefinition {
    private String id;
    private String name;
    private String description;
    private List<NodeDefinition> nodes;
    private List<EdgeDefinition> edges;
    private String yamlDsl;

    public RouteDefinition() {
    }

    public RouteDefinition(String id, String name, String description,
                          List<NodeDefinition> nodes, List<EdgeDefinition> edges) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.nodes = nodes;
        this.edges = edges;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<NodeDefinition> getNodes() {
        return nodes;
    }

    public void setNodes(List<NodeDefinition> nodes) {
        this.nodes = nodes;
    }

    public List<EdgeDefinition> getEdges() {
        return edges;
    }

    public void setEdges(List<EdgeDefinition> edges) {
        this.edges = edges;
    }

    public String getYamlDsl() {
        return yamlDsl;
    }

    public void setYamlDsl(String yamlDsl) {
        this.yamlDsl = yamlDsl;
    }
}
