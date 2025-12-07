package com.main.backend.controller;

import com.main.backend.dto.TaskRequestDto;
import com.main.backend.dto.TaskResponseDto;
import com.main.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@Valid @RequestBody TaskRequestDto requestDto) {
        log.info("POST /api/tasks - Creating new task: {}", requestDto.getTitle());
        TaskResponseDto response = taskService.createTask(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getTasks() {
        log.info("GET /api/tasks - Fetching recent tasks");
        List<TaskResponseDto> tasks = taskService.getRecentTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTask(@PathVariable Long id) {
        log.info("GET /api/tasks/{} - Fetching task", id);
        TaskResponseDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponseDto> completeTask(@PathVariable Long id) {
        log.info("PATCH /api/tasks/{}/complete - Marking task as completed", id);
        TaskResponseDto task = taskService.completeTask(id);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.info("DELETE /api/tasks/{} - Deleting task", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}