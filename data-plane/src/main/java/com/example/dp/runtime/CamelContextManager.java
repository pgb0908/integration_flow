package com.example.dp.runtime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import io.quarkus.runtime.StartupEvent;
import org.apache.camel.CamelContext;

/**
 * Camel Context 관리 및 Route 실행 제어.
 */
@ApplicationScoped
public class CamelContextManager {

    private final CamelContext camelContext;

    public CamelContextManager(CamelContext camelContext) {
        this.camelContext = camelContext;
    }

    void onStart(@Observes StartupEvent event) {
        // Camel Context 시작 시 초기화 로직
    }

    public CamelContext getContext() {
        return camelContext;
    }
}
