export interface Goal {
    id: string;
    title: string;
    deadline: string;
    actions: Action[];
}

export interface Action {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    interval: 'daily' | 'weekly' | 'monthly';
    status: 'pending' | 'completed' | 'overdue';
}

export interface GoalFormData {
    title: string;
    deadline: string;
}

export interface ActionFormData {
    title: string;
    start_date: string;
    end_date: string;
    interval: 'daily' | 'weekly' | 'monthly';
}

export interface ApiError {
    message: string;
    fieldErrors?: Record<string, string>;
}