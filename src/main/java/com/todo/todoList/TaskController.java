package com.todo.todoList;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")  // Allow cross-origin requests if needed
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Task task = taskService.getTaskById(id);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    // Create new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get tasks by completion status
    @GetMapping("/completed/{status}")
    public ResponseEntity<List<Task>> getTasksByCompleted(@PathVariable boolean status) {
        List<Task> tasks = taskService.getTasksByCompleted(status);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // Get tasks by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        List<Task> tasks = taskService.getTasksByPriority(priority);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // Alternative endpoint with query parameters
    @GetMapping("/filter")
    public ResponseEntity<List<Task>> filterTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String priority) {

        List<Task> tasks;

        if (completed != null) {
            tasks = taskService.getTasksByCompleted(completed);
        } else if (priority != null) {
            tasks = taskService.getTasksByPriority(priority);
        } else {
            tasks = taskService.getAllTasks();
        }

        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    // Patch endpoint for partial updates
    @PatchMapping("/{id}")
    public ResponseEntity<Task> partialUpdateTask(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Task existingTask = taskService.getTaskById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "title":
                    existingTask.setTitle((String) value);
                    break;
                case "description":
                    existingTask.setDescription((String) value);
                    break;
                case "completed":
                    existingTask.setCompleted((Boolean) value);
                    break;
                case "priority":
                    existingTask.setPriority((String) value);
                    break;
                // Add other fields as needed
            }
        });

        Task updatedTask = taskService.updateTask(id, existingTask);
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    // Bulk delete
    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteMultipleTasks(@RequestBody List<String> ids) {
        ids.forEach(id -> taskService.deleteTask(id));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get task statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats() {
        List<Task> allTasks = taskService.getAllTasks();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", allTasks.size());
        stats.put("completed", allTasks.stream().filter(Task::isCompleted).count());
        stats.put("pending", allTasks.stream().filter(t -> !t.isCompleted()).count());

        // Priority wise stats
        Map<String, Long> priorityStats = allTasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority, Collectors.counting()));
        stats.put("byPriority", priorityStats);

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}