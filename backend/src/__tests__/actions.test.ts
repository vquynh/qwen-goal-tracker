// src/__tests__/actions.test.ts
import request from 'supertest';
import {createTestGoal, createAction, updateAction, deleteAction, createTestAction} from '../test/utils';
import { AppDataSource } from '../data-source';
import { Goal } from '../entities/Goal';
import { Action } from '../entities/Action';
import app from "../app";

describe('Actions API', () => {
    let goal: Goal;
    beforeAll(async () => {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }

            // Enable foreign key constraints for SQLite in test environment
            if (process.env.NODE_ENV === 'test' && AppDataSource.options.type === 'sqlite') {
                console.log('Enabling foreign key constraints for SQLite in test environment...');
                await AppDataSource.query('PRAGMA foreign_keys=ON;');
            }
        } catch (error) {
            console.error('Error initializing test DataSource:', error);
            throw error;
        }
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    beforeEach(async () => {
        const goalRepository = AppDataSource.getRepository(Goal);
        await goalRepository.clear();

        goal = await createTestGoal();
    });

    describe('POST /goals/:goalId/actions', () => {
        it('should create a new action with valid data', async () => {
            const response = await createAction(goal.id);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New Action');
            expect(response.body.start_date).toBe('2024-01-01');
            expect(response.body.end_date).toBe('2024-01-31');
            expect(response.body.interval).toBe('daily');
            expect(response.body.status).toBe('pending');
            expect(response.body.id).toBeDefined();

            // Verify the action is associated with the goal
            const getGoalsResponse = await request(app).get('/goals');
            expect(getGoalsResponse.body[0].actions).toHaveLength(1);
            expect(getGoalsResponse.body[0].actions[0].id).toBe(response.body.id);
        });

        it('should return 400 for missing title', async () => {
            const response = await createAction(goal.id, { title: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Title is required');
        });

        it('should return 400 for missing start date', async () => {
            const response = await createAction(goal.id, { start_date: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Start date is required');
        });

        it('should return 400 for missing end date', async () => {
            const response = await createAction(goal.id, { end_date: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('End date is required');
        });

        it('should return 400 for end date before start date', async () => {
            const response = await createAction(goal.id, {
                start_date: '2024-01-10',
                end_date: '2024-01-01'
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Start date must be before end date');
        });

        it('should return 404 for non-existent goal', async () => {
            const response = await createAction('non-existent-id');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Goal not found');
        });
    });

    describe('PUT /actions/:id', () => {
        let action: Action;

        beforeEach(async () => {
            action = await createTestAction(goal.id);
        });

        it('should update action title', async () => {
            const response = await updateAction(action.id, { title: 'Updated Action' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Action');
            expect(response.body.start_date).toBe(action.start_date);
        });

        it('should update action dates', async () => {
            const newStartDate = '2024-02-01';
            const newEndDate = '2024-02-28';

            const response = await updateAction(action.id, {
                start_date: newStartDate,
                end_date: newEndDate
            });

            expect(response.status).toBe(200);
            expect(response.body.start_date).toBe(newStartDate);
            expect(response.body.end_date).toBe(newEndDate);
        });

        it('should return 400 for end date before start date', async () => {
            const response = await updateAction(action.id, {
                start_date: '2024-01-10',
                end_date: '2024-01-01'
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Start date must be before end date');
        });

        it('should return 404 for non-existent action', async () => {
            const response = await updateAction('non-existent-id', { title: 'Updated Action' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Action not found');
        });
    });
});