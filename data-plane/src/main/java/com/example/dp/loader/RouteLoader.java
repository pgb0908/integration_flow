package com.example.dp.loader;

import com.example.shared.api.RouteDeployRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Control-Plane에서 전달받은 DSL을 동적으로 로드하는 엔드포인트.
 */
@Path("/routes")
@ApplicationScoped
public class RouteLoader {

    @POST
    @Path("/deploy")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deployRoutes(RouteDeployRequest request) {
        // TODO: YAML DSL을 CamelContext에 동적으로 등록
        return Response.ok().build();
    }
}
