import axios from 'axios';
import { Goal, Action, ApiError } from '../types';

const API_URL = 'http://localhost:5678';

// Configure axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let apiError: ApiError = {
            message: error.message || 'An error occurred',
        };

        if (error.response && error.response.data) {
            apiError = {
                message: error.response.data.message || 'An error occurred',
                fieldErrors: error.response.data.errors,
            };
        }

        return Promise.reject(apiError);
    }
);

export const getGoals = async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
};

export const createGoal = async (goalData: { title: string; deadline: string }): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', goalData);
    return response.data;
};

export const updateGoal = async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    const response = await api.put<Goal>(`/goals/${id}`, updates);
    return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
};

export const createAction = async (goalId: string, actionData: {
    title: string;
    start_date: string;
    end_date: string;
    interval: string;
}): Promise<Action> => {
    // Format dates to ensure proper ISO format
    const formattedData = {
        ...actionData,
        start_date: new Date(actionData.start_date).toISOString().split('T')[0],
        end_date: new Date(actionData.end_date).toISOString().split('T')[0]
    };

    const response = await api.post<Action>(`/goals/${goalId}/actions`, formattedData);
    return response.data;
};

export const updateAction = async (id: string, updates: Partial<Action>): Promise<Action> => {
    const response = await api.put<Action>(`/actions/${id}`, updates);
    return response.data;
};

export const deleteAction = async (id: string): Promise<void> => {
    await api.delete(`/actions/${id}`);
};