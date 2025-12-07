package com.main.backend.service.impl;

import com.main.backend.dto.TaskRequestDto;
import com.main.backend.dto.TaskResponseDto;
import com.main.backend.entity.Task;
import com.main.backend.exception.TaskNotFoundException;
import com.main.backend.repositary.TaskRepository;
import com.main.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskServiceImpl implements TaskService {

    private static final int MAX_RECENT_TASKS = 5;
    private final TaskRepository taskRepository;

    @Override
    public TaskResponseDto createTask(TaskRequestDto requestDto) {
        log.debug("Creating new task with title: {}", requestDto.getTitle());

        Task task = new Task(
                requestDto.getTitle().trim(),
                requestDto.getDescription() != null ? requestDto.getDescription().trim() : ""
        );

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with ID: {}", savedTask.getId());

        return TaskResponseDto.fromEntity(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getRecentTasks() {
        log.debug("Fetching recent incomplete tasks");

        PageRequest pageRequest = PageRequest.of(0, MAX_RECENT_TASKS);
        List<Task> tasks = taskRepository.findRecentIncompleteTasks(pageRequest);

        log.info("Found {} incomplete tasks", tasks.size());

        return tasks.stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto completeTask(Long id) {
        log.debug("Marking task {} as completed", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        if (task.getCompleted()) {
            log.warn("Task {} is already completed", id);
            throw new IllegalStateException("Task is already completed");
        }

        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);

        log.info("Task {} marked as completed", id);

        return TaskResponseDto.fromEntity(updatedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDto getTaskById(Long id) {
        log.debug("Fetching task with ID: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        return TaskResponseDto.fromEntity(task);
    }

    @Override
    public void deleteTask(Long id) {
        log.debug("Deleting task with ID: {}", id);

        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException("Task not found with id: " + id);
        }

        taskRepository.deleteById(id);
        log.info("Task {} deleted successfully", id);
    }
}