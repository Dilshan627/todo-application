package com.main.backend.repositary;

import com.main.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCompletedOrderByCreatedAtDesc(Boolean completed, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<Task> findRecentIncompleteTasks(Pageable pageable);

    long countByCompleted(Boolean completed);
}