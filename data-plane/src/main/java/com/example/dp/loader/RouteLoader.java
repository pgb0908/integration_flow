package com.example.dp.loader;

import com.example.dp.runtime.CamelContextManager;
import com.example.shared.api.RouteDeployRequest;
import com.example.shared.dsl.RouteDefinition;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/routes")
@ApplicationScoped
public class RouteLoader {

    private static final Logger log = LoggerFactory.getLogger(RouteLoader.class);

    private final CamelContextManager contextManager;

    public RouteLoader(CamelContextManager contextManager) {
        this.contextManager = contextManager;
    }

    @POST
    @Path("/deploy")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deployRoutes(RouteDeployRequest request) {
        int success = 0;
        int failed = 0;

        for (RouteDefinition route : request.getRoutes()) {
            try {
                String yaml = route.getYamlDsl();
                if (yaml == null || yaml.isBlank()) {
                    log.warn("Route '{}' has empty YAML DSL, skipping", route.getId());
                    failed++;
                    continue;
                }
                contextManager.addRouteFromYaml(route.getId(), yaml);
                success++;
            } catch (Exception e) {
                log.error("Failed to deploy route '{}': {}", route.getId(), e.getMessage());
                failed++;
            }
        }

        String message = String.format("Deployed %d routes, %d failed", success, failed);
        if (failed > 0) {
            return Response.status(Response.Status.PARTIAL_CONTENT)
                    .entity("{\"message\":\"" + message + "\"}")
                    .build();
        }
        return Response.ok("{\"message\":\"" + message + "\"}").build();
    }
}
