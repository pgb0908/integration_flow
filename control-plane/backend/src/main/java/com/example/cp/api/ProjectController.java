package com.example.cp.api;

import com.example.cp.service.ProjectService;
import com.example.cp.store.entity.ProjectEntity;
import com.example.shared.api.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ApiResponse<List<ProjectEntity>> getAllProjects() {
        return ApiResponse.success(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjectEntity> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("Project not found"));
    }

    @PostMapping
    public ApiResponse<ProjectEntity> createProject(@RequestBody ProjectEntity project) {
        return ApiResponse.success(projectService.createProject(project), "Project created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<ProjectEntity> updateProject(@PathVariable Long id, @RequestBody ProjectEntity project) {
        try {
            return ApiResponse.success(projectService.updateProject(id, project), "Project updated successfully");
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ApiResponse.success(null, "Project deleted successfully");
    }
}
