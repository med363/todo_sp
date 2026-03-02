import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task, Priority } from '../types/task.type';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id'>) => void;
    initialTask?: Task;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSubmit,
                                                             initialTask
                                                         }) => {
    const [formData, setFormData] = useState<Omit<Task, 'id'>>({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        dueDate: initialTask?.dueDate || new Date().toISOString().split('T')[0],
        completed: initialTask?.completed || false,
        priority: initialTask?.priority || 'MEDIUM',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});

    const validateForm = () => {
        const newErrors: Partial<Record<keyof Task, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof Task]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <h2 className="text-xl font-semibold">
                                    {initialTask ? 'Edit Task' : 'Create New Task'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`input-field ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                        placeholder="Enter task title"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`input-field ${errors.description ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                        placeholder="Enter task description"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleChange}
                                            className={`input-field ${errors.dueDate ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                        />
                                        {errors.dueDate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="HIGH">High 🚨</option>
                                            <option value="MEDIUM">Medium ⚠️</option>
                                            <option value="LOW">Low 📝</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="completed"
                                        checked={formData.completed}
                                        onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Mark as completed
                                    </label>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1"
                                    >
                                        {initialTask ? 'Update Task' : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;