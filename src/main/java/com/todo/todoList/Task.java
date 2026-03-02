package com.todo.todoList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
        @Id
        private String id;  // MongoDB uses String IDs by default
        private String title;
        private String description;
        private LocalDate dueDate;
        private boolean completed;
        private String priority; // HIGH, MEDIUM, LOW
}