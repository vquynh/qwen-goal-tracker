// test/utils.ts
import request from 'supertest';
import app from '../app';
import { Goal } from '../entities/Goal';
import { Action } from '../entities/Action';
import { AppDataSource } from '../data-source';

// Helper to ensure DataSource is ready
const ensureDataSourceReady = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
};

export const createTestGoal = async (overrides = {}): Promise<Goal> => {
    await ensureDataSourceReady();
    const goalRepository = AppDataSource.getRepository(Goal);
    const goal = goalRepository.create({
        title: 'Test Goal',
        deadline: '2025-12-31',
        ...overrides
    });
    return goalRepository.save(goal);
};

export const createTestAction = async (goalId: string, overrides = {}): Promise<Action> => {
    await ensureDataSourceReady();
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

export const getGoals = async () => {
    return request(app).get('/goals');
};

export const createGoal = async (goalData = {}) => {
    return request(app)
        .post('/goals')
        .send({
            title: 'New Goal',
            deadline: '2025-12-31',
            ...goalData
        });
};

export const updateGoal = async (id: string, updates = {}) => {
    return request(app)
        .put(`/goals/${id}`)
        .send(updates);
};

export const deleteGoal = async (id: string) => {
    return request(app).delete(`/goals/${id}`);
};

export const createAction = async (goalId: string, actionData = {}) => {
    return request(app)
        .post(`/goals/${goalId}/actions`)
        .send({
            title: 'New Action',
            start_date: '2024-01-01',
            end_date: '2024-01-31',
            interval: 'daily',
            ...actionData
        });
};

export const updateAction = async (id: string, updates = {}) => {
    return request(app)
        .put(`/actions/${id}`)
        .send(updates);
};

export const deleteAction = async (id: string) => {
    return request(app).delete(`/actions/${id}`);
};