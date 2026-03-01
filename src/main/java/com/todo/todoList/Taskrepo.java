package com.todo.todoList;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Taskrepo extends MongoRepository<Task,String> {
    List<Task> findByCompleted(boolean completed);
    List<Task> findByPriority(String priority);



}
