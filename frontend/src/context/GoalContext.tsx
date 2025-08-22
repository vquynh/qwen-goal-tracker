import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getGoals,
    createGoal as apiCreateGoal,
    updateGoal as apiUpdateGoal,
    deleteGoal as apiDeleteGoal,
    createAction as apiCreateAction,
    updateAction as apiUpdateAction,
    deleteAction as apiDeleteAction
} from '../api/goalService';
import { Goal, Action, GoalFormData, ActionFormData, ApiError } from '../types';

interface GoalContextType {
    goals: Goal[];
    loading: boolean;
    error: string | null;
    createGoal: (goalData: GoalFormData) => Promise<void>;
    updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    createAction: (goalId: string, actionData: ActionFormData) => Promise<void>;
    updateAction: (id: string, updates: Partial<Action>) => Promise<void>;
    deleteAction: (id: string, goalId: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGoals();
            setGoals(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const createGoal = async (goalData: GoalFormData) => {
        try {
            setError(null);
            const newGoal = await apiCreateGoal(goalData);

            // Ensure the new goal has an action array
            const normalizedGoal = {
                ...newGoal,
                actions: newGoal.actions || []
            };

            setGoals(prev => [...prev, normalizedGoal]);
        } catch (err: any) {
            setError(err.message || 'Failed to create goal');
            throw err;
        }
    };

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        try {
            setError(null);
            await apiUpdateGoal(id, updates);
            setGoals(prev =>
                prev.map(goal =>
                    goal.id === id ? { ...goal, ...updates } : goal
                )
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update goal');
            throw err;
        }
    };

    const deleteGoal = async (id: string) => {
        try {
            setError(null);
            await apiDeleteGoal(id);
            setGoals(prev => prev.filter(goal => goal.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete goal');
        }
    };

    const createAction = async (goalId: string, actionData: ActionFormData) => {
        try {
            setError(null);
            const newAction = await apiCreateAction(
                goalId, {
                ...actionData,
            });

            setGoals(prev =>
                prev.map(goal =>
                    goal.id === goalId
                        ? { ...goal, actions: [...goal.actions, newAction] }
                        : goal
                )
            );
        } catch (err: any) {
            setError(err.message || 'Failed to create action');
            throw err;
        }
    };

    const updateAction = async (id: string, updates: Partial<Action>) => {
        try {
            setError(null);
            await apiUpdateAction(id, updates);

            setGoals(prev =>
                prev.map(goal => ({
                    ...goal,
                    actions: goal.actions.map(action =>
                        action.id === id ? { ...action, ...updates } : action
                    )
                }))
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update action');
            throw err;
        }
    };

    const deleteAction = async (id: string, goalId: string) => {
        try {
            setError(null);
            await apiDeleteAction(id);

            setGoals(prev =>
                prev.map(goal => ({
                    ...goal,
                    actions: goal.id === goalId
                        ? goal.actions.filter(action => action.id !== id)
                        : goal.actions
                }))
            );
        } catch (err: any) {
            setError(err.message || 'Failed to delete action');
        }
    };

    return (
        <GoalContext.Provider value={{
            goals,
            loading,
            error,
            createGoal,
            updateGoal,
            deleteGoal,
            createAction,
            updateAction,
            deleteAction
        }}>
            {children}
        </GoalContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalContext);
    if (context === undefined) {
        throw new Error('useGoals must be used within a GoalProvider');
    }
    return context;
};