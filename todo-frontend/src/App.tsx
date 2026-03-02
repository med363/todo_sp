import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

import { taskService } from './services/api.service';
import { Task, Priority } from './types/task.type';
import TaskCard from './components/taskCard';
import CreateTaskModal from './components/CreateTaskModal';
import TaskStats from './components/TaskStats';

const queryClient = new QueryClient();

function TodoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: taskService.getTaskStats,
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task created successfully!');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: Task }) =>
        taskService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  // Toggle task completion
  const toggleCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateMutation.mutate({
        id,
        task: { ...task, completed: !task.completed }
      });
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'pending' && task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower);
    }

    return true;
  });

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    createMutation.mutate(taskData as Task);
    setIsModalOpen(false);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask?.id) {
      updateMutation.mutate({
        id: editingTask.id,
        task: { ...taskData, id: editingTask.id } as Task
      });
      setEditingTask(undefined);
      setIsModalOpen(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">Failed to load tasks. Please try again later.</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TaskMaster Pro
                </h1>
              </motion.div>

              <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingTask(undefined);
                    setIsModalOpen(true);
                  }}
                  className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Task</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {stats && <TaskStats stats={stats} />}

          {/* Filters */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="input-field"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Priority Filter */}
              <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                  className="input-field"
              >
                <option value="all">All Priorities</option>
                <option value="HIGH">High 🚨</option>
                <option value="MEDIUM">Medium ⚠️</option>
                <option value="LOW">Low 📝</option>
              </select>

              {/* Reset Filters */}
              <button
                  onClick={() => {
                    setFilter('all');
                    setPriorityFilter('all');
                    setSearchTerm('');
                  }}
                  className="btn-secondary flex items-center justify-center space-x-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </motion.div>

          {/* Tasks Grid */}
          {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
          ) : (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                          <TaskCard
                              key={task.id}
                              task={task}
                              onToggle={toggleCompletion}
                              onEdit={handleEditTask}
                              onDelete={(id) => deleteMutation.mutate(id)}
                          />
                      ))
                  ) : (
                      <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="col-span-full text-center py-12"
                      >
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
                        <p className="text-gray-500">Create your first task to get started!</p>
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
          )}
        </main>

        {/* Create/Edit Modal */}
        <CreateTaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(undefined);
            }}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            initialTask={editingTask}
        />
      </div>
  );
}

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <TodoApp />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}

export default App;