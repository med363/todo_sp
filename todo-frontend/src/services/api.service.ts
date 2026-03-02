import axios from 'axios';
import { Task, TaskStats } from '../types/task.type';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const taskService = {
    // Get all tasks
    getAllTasks: async (): Promise<Task[]> => {
        const response = await api.get('/tasks');
        return response.data;
    },

    // Get task by ID
    getTaskById: async (id: string): Promise<Task> => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    // Create task
    createTask: async (task: Task): Promise<Task> => {
        const response = await api.post('/tasks', task);
        return response.data;
    },

    // Update task
    updateTask: async (id: string, task: Task): Promise<Task> => {
        const response = await api.put(`/tasks/${id}`, task);
        return response.data;
    },

    // Delete task
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    // Get tasks by completion status
    getTasksByCompleted: async (status: boolean): Promise<Task[]> => {
        const response = await api.get(`/tasks/completed/${status}`);
        return response.data;
    },

    // Get tasks by priority
    getTasksByPriority: async (priority: string): Promise<Task[]> => {
        const response = await api.get(`/tasks/priority/${priority}`);
        return response.data;
    },

    // Get task statistics
    getTaskStats: async (): Promise<TaskStats> => {
        const response = await api.get('/tasks/stats');
        return response.data;
    },

    // Bulk delete
    deleteMultipleTasks: async (ids: string[]): Promise<void> => {
        await api.delete('/tasks/bulk', { data: ids });
    },

    // Partial update
    partialUpdateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        const response = await api.patch(`/tasks/${id}`, updates);
        return response.data;
    },
};