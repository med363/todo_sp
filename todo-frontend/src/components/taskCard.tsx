import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types/task.type';
import {
    CheckCircleIcon,
    ClockIcon,
    FlagIcon,
    PencilIcon,
    TrashIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityColors = {
    HIGH: 'text-red-600 bg-red-50 border-red-200',
    MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    LOW: 'text-green-600 bg-green-50 border-green-200',
};

const priorityIcons = {
    HIGH: '🚨',
    MEDIUM: '⚠️',
    LOW: '📝',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
    const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            className={`task-card p-6 ${task.completed ? 'opacity-75' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                    <button
                        onClick={() => onToggle(task.id!)}
                        className="mt-1 focus:outline-none"
                    >
                        {task.completed ? (
                            <CheckCircleSolid className="w-6 h-6 text-green-500" />
                        ) : (
                            <CheckCircleIcon className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
                        )}
                    </button>

                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {task.title}
                        </h3>

                        <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                        </p>

                        <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                  })}
                </span>
                                {isOverdue && <span className="ml-2 text-red-500">⚠️ Overdue</span>}
                            </div>

                            <div className={`flex items-center px-3 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                                <span className="mr-1">{priorityIcons[task.priority]}</span>
                                <span className="text-sm font-medium">{task.priority}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task.id!)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;