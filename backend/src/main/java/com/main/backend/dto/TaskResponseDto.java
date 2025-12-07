package com.main.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.main.backend.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDto {

    private Long id;
    private String title;
    private String description;
    private Boolean completed;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public static TaskResponseDto fromEntity(Task task) {
        return new TaskResponseDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCompleted(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}