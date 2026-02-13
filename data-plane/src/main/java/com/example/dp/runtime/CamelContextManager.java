package com.example.dp.runtime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import io.quarkus.runtime.StartupEvent;
import org.apache.camel.CamelContext;
import org.apache.camel.Route;
import org.apache.camel.spi.Resource;
import org.apache.camel.spi.RoutesLoader;
import org.apache.camel.support.ResourceHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class CamelContextManager {

    private static final Logger log = LoggerFactory.getLogger(CamelContextManager.class);

    private final CamelContext camelContext;

    public CamelContextManager(CamelContext camelContext) {
        this.camelContext = camelContext;
    }

    void onStart(@Observes StartupEvent event) {
        log.info("CamelContext '{}' started with {} routes",
                camelContext.getName(), camelContext.getRoutes().size());
    }

    public CamelContext getContext() {
        return camelContext;
    }

    public void addRouteFromYaml(String routeId, String yamlDsl) throws Exception {
        Resource resource = ResourceHelper.fromString("route-" + routeId + ".yaml", yamlDsl);
        RoutesLoader loader = camelContext.getCamelContextExtension().getContextPlugin(RoutesLoader.class);
        loader.loadRoutes(resource);
        log.info("Added route '{}' to CamelContext", routeId);
    }

    public void removeRoute(String routeId) throws Exception {
        Route route = camelContext.getRoute(routeId);
        if (route != null) {
            camelContext.getRouteController().stopRoute(routeId);
            camelContext.removeRoute(routeId);
            log.info("Removed route '{}' from CamelContext", routeId);
        }
    }
}
