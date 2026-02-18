package com.example.cp.service;

import com.example.cp.exception.ResourceNotFoundException;
import com.example.cp.store.entity.ProjectEntity;
import com.example.cp.store.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectEntity> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<ProjectEntity> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Transactional
    public ProjectEntity createProject(ProjectEntity project) {
        return projectRepository.save(project);
    }

    @Transactional
    public ProjectEntity updateProject(Long id, ProjectEntity project) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setName(project.getName());
                    existing.setDescription(project.getDescription());
                    return projectRepository.save(existing);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
