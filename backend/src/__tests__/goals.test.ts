// src/__tests__/goals.test.ts
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    createTestGoal, createTestAction
} from '../test/utils';
import { AppDataSource } from '../data-source';
import { Goal } from '../entities/Goal';

describe('Goals API', () => {
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
    });

    describe('GET /goals', () => {
        it('should return empty array when no goals exist', async () => {
            const response = await getGoals();

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return all goals with actions', async () => {
            const goal1 = await createTestGoal({ title: 'Goal 1' });
            const goal2 = await createTestGoal({ title: 'Goal 2' });

            await createTestAction(goal1.id, { title: 'Action 1' });
            await createTestAction(goal1.id, { title: 'Action 2' });

            const response = await getGoals();

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);

            const returnedGoal1 = response.body.find((g: Goal) => g.id === goal1.id);
            expect(returnedGoal1).toBeDefined();
            expect(returnedGoal1.actions).toHaveLength(2);

            const returnedGoal2 = response.body.find((g: Goal) => g.id === goal2.id);
            expect(returnedGoal2).toBeDefined();
            expect(returnedGoal2.actions).toHaveLength(0);
        });
    });

    describe('POST /goals', () => {
        it('should create a new goal with valid data', async () => {
            const response = await createGoal({});

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New Goal');
            expect(response.body.deadline).toBe('2025-12-31');
            expect(response.body.actions).toBeUndefined();
            expect(response.body.id).toBeDefined();
        });

        it('should return 400 for missing title', async () => {
            const response = await createGoal({
                title: '',
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Title is required');
        });

        it('should return 400 for past deadline', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const response = await createGoal({
                deadline: yesterday.toISOString().split('T')[0]
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Deadline must be in the future');
        });
    });

    describe('PUT /goals/:id', () => {
        it('should update goal title', async () => {
            const goal = await createTestGoal();

            const response = await updateGoal(goal.id, { title: 'Updated Goal' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Goal');
            expect(response.body.deadline).toBe(goal.deadline);
        });

        it('should update goal deadline', async () => {
            const goal = await createTestGoal();

            const newDeadline = '2026-12-31';
            const response = await updateGoal(goal.id, { deadline: newDeadline });

            expect(response.status).toBe(200);
            expect(response.body.deadline).toBe(newDeadline);
        });

        it('should return 404 for non-existent goal', async () => {
            const response = await updateGoal('non-existent-id', { title: 'Updated Goal' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Goal not found');
        });

        it('should return 400 for invalid deadline', async () => {
            const goal = await createTestGoal();

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const response = await updateGoal(goal.id, {
                deadline: yesterday.toISOString().split('T')[0]
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Deadline must be in the future');
        });
    });
});