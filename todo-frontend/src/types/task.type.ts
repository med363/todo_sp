export interface Task {
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    byPriority: {
        HIGH: number;
        MEDIUM: number;
        LOW: number;
    };
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';