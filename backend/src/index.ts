import express from 'express';
import { createConnection } from 'typeorm';
import { Goal } from './entities/Goal';
import { Action } from './entities/Action';

createConnection().then(() => {
    const app = express();
    app.use(express.json());

    // Create Goal
    app.post('/goals', async (req, res) => {
        const goal = Goal.create(req.body);
        await goal.save();
        res.status(201).json(goal);
    });

    // Get All Goals with Actions
    app.get('/goals', async (_req, res) => {
        const goals = await Goal.find({ relations: ['actions'] });
        res.json(goals);
    });

    // Update Goal
    app.put('/goals/:id', async (req, res) => {
        const goal = await Goal.findOne(req.params.id);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });
        Goal.merge(goal, req.body);
        await goal.save();
        res.json(goal);
    });

    // Create Action
    app.post('/actions', async (req, res) => {
        const action = Action.create(req.body);
        await action.save();
        res.status(201).json(action);
    });

    // Update Action
    app.put('/actions/:id', async (req, res) => {
        const action = await Action.findOne(req.params.id);
        if (!action) return res.status(404).json({ error: 'Action not found' });
        Action.merge(action, req.body);
        await action.save();
        res.json(action);
    });

    app.listen(5000, () => console.log('Server running on port 5000'));
});