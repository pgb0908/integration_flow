package com.example.cp.store.repository;

import com.example.cp.store.entity.RouteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<RouteEntity, Long> {
    List<RouteEntity> findByProjectId(Long projectId);
}
