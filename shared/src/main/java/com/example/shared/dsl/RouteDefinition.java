package com.example.shared.dsl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Camel Route를 표현하는 DSL 모델.
 * YAML DSL을 Java 객체로 매핑할 때 사용.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RouteDefinition {

    private String id;
    private String name;
    private String description;
    private String yamlDsl;

    public RouteDefinition() {
    }

    public RouteDefinition(String id, String name, String yamlDsl) {
        this.id = id;
        this.name = name;
        this.yamlDsl = yamlDsl;
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

    public String getYamlDsl() {
        return yamlDsl;
    }

    public void setYamlDsl(String yamlDsl) {
        this.yamlDsl = yamlDsl;
    }
}
