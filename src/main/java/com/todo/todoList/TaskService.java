package com.todo.todoList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TaskService {
    @Autowired
    private Taskrepo taskrepo;
    public List<Task> getAllTasks() {
        return taskrepo.findAll();
    }

    public Task getTaskById(String id) {  // Changed Long to String for MongoDB
        return taskrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public Task createTask(Task task) {
        return taskrepo.save(task);
    }

    public Task updateTask(String id, Task taskDetails) {  // Changed Long to String
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.isCompleted());
        task.setPriority(taskDetails.getPriority());
        // ... update other fields
        return taskrepo.save(task);
    }

    public void deleteTask(String id) {  // Changed Long to String
        taskrepo.deleteById(id);
    }

    // Using your custom methods
    public List<Task> getTasksByCompleted(boolean completed) {
        return taskrepo.findByCompleted(completed);
    }

    public List<Task> getTasksByPriority(String priority) {
        return taskrepo.findByPriority(priority);
    }


}
