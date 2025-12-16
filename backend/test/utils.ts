// test/utils.ts
import request from 'supertest';
import app from '../src/app'; // Updated import path
import { Goal } from '../src/entities/Goal';
import { Action } from '../src/entities/Action';
import { AppDataSource } from '../src/data-source';

// Rest of your utility functions remain the same
export const createTestGoal = async (overrides = {}): Promise<Goal> => {
    const goalRepository = AppDataSource.getRepository(Goal);
    const goal = goalRepository.create({
        title: 'Test Goal',
        deadline: '2025-12-31',
        ...overrides
    });
    return goalRepository.save(goal);
};

export const createTestAction = async (goalId: string, overrides = {}): Promise<Action> => {
    const actionRepository = AppDataSource.getRepository(Action);
    const action = actionRepository.create({
        title: 'Test Action',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        interval: 'daily',
        status: 'pending',
        goal: { id: goalId },
        ...overrides
    });
    return actionRepository.save(action);
};

// ... rest of your utility functions