package com.example.cp.api;

import com.example.shared.api.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "http://localhost:5173")
public class CatalogController {

    @GetMapping("/components")
    public ApiResponse<List<Map<String, Object>>> getComponents() {
        // Hardcoded Camel components catalog for now
        List<Map<String, Object>> components = List.of(
                Map.of("category", "Source", "items", List.of(
                        Map.of("icon", "🌐", "name", "HTTP", "component", "platform-http"),
                        Map.of("icon", "📨", "name", "Kafka", "component", "kafka"),
                        Map.of("icon", "📁", "name", "FTP", "component", "ftp"),
                        Map.of("icon", "🔌", "name", "MQTT", "component", "mqtt")
                )),
                Map.of("category", "Processor", "items", List.of(
                        Map.of("icon", "🔄", "name", "Transform", "component", "transform"),
                        Map.of("icon", "🔀", "name", "Filter", "component", "filter"),
                        Map.of("icon", "📋", "name", "Marshal", "component", "marshal"),
                        Map.of("icon", "⚡", "name", "Split", "component", "split")
                )),
                Map.of("category", "Sink", "items", List.of(
                        Map.of("icon", "🗄️", "name", "Database", "component", "jdbc"),
                        Map.of("icon", "📨", "name", "Kafka", "component", "kafka"),
                        Map.of("icon", "📡", "name", "REST API", "component", "http"),
                        Map.of("icon", "📁", "name", "File", "component", "file")
                ))
        );
        return ApiResponse.success(components);
    }
}
