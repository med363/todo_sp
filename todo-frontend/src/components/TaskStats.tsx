import React from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import { TaskStats as StatsType } from '../types/task.type';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TaskStatsProps {
    stats: StatsType;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
    const completionData = [
        { name: 'Completed', value: stats.completed, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    ];

    const priorityData = [
        { name: 'High', value: stats.byPriority.HIGH || 0, color: '#ef4444' },
        { name: 'Medium', value: stats.byPriority.MEDIUM || 0, color: '#f59e0b' },
        { name: 'Low', value: stats.byPriority.LOW || 0, color: '#10b981' },
    ];

    const completionPercentage = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 col-span-1"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
                    <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Tasks</span>
                        <span className="text-2xl font-bold text-indigo-600">{stats.total}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completed</span>
                        <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending</span>
                        <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Completion Rate</span>
                            <span className="text-sm font-semibold text-indigo-600">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 col-span-1"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Completion Status</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={completionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {completionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 col-span-1"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Distribution</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={priorityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default TaskStats;