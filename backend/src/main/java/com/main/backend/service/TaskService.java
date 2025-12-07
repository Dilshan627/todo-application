package com.main.backend.service;

import com.main.backend.dto.TaskRequestDto;
import com.main.backend.dto.TaskResponseDto;

import java.util.List;

public interface TaskService {

    TaskResponseDto createTask(TaskRequestDto requestDto);

    List<TaskResponseDto> getRecentTasks();

    TaskResponseDto completeTask(Long id);

    TaskResponseDto getTaskById(Long id);

    void deleteTask(Long id);
}