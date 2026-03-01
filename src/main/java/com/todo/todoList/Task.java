package com.todo.todoList;


import jakarta.persistence.GeneratedValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "task")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
        @Id
        @GeneratedValue
        private Long id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private boolean completed;
        private String priority; // HIGH, MEDIUM, LOW
    }

