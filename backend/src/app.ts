// src/app.ts
import express from 'express';
import { AppDataSource } from './data-source';
import cors from 'cors';
import {Action} from "./entities/Action";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import {SwaggerSpec} from "./swaggerConfig";
import swaggerUi from "swagger-ui-express";
import {Goal} from "./entities/Goal";

dotenv.config();
const app = express();

// Configure CORS for production
const allowedOrigins = [
    'http://localhost:3000',
    'https://qwen-goal-tracker-plf4.vercel.app',
    'https://qwen-goal-tracker.vercel.app'
];

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Initialize Swagger
const swaggerDocs = swaggerJsDoc(SwaggerSpec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Get repositories
const goalRepository = AppDataSource.getRepository(Goal);
const actionRepository = AppDataSource.getRepository(Action);

// Routes
app.post('/goals', async (req, res) => {
    if(req.body.title === undefined || req.body.title === ''){
        return res.status(400).json({error: 'Title is required'});
    }
    if(req.body.deadline != undefined && Date.parse(req.body.deadline) < Date.now()){
        return res.status(400).json({error: 'Deadline must be in the future'});
    }
    const goal = goalRepository.create(req.body);
    await goalRepository.save(goal);
    res.status(201).json(goal);
});

app.get('/goals', async (_req, res) => {
    const goals = await goalRepository.find({ relations: ['actions'] });
    res.json(goals);
});

app.get('/goals/:id', async (req, res) => {
    const goal = await goalRepository.findOne({
        where: { id: req.params.id },
        relations: ['actions']
    });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
});

app.put('/goals/:id', async (req, res) => {
    const goal = await goalRepository.findOne({
        where: { id: req.params.id },
        relations: ['actions']
    });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    if(req.body.deadline != undefined && Date.parse(req.body.deadline) < Date.now()){
        return res.status(400).json({error: 'Deadline must be in the future'});
    }
    goalRepository.merge(goal, req.body);
    await goalRepository.save(goal);
    res.json(goal);
});

app.post('/goals/:id/actions', async (req, res) => {
    const action = actionRepository.create(req.body) as unknown as Action;
    if(req.body.title === undefined || req.body.title === ''){
        return res.status(400).json({error: 'Title is required'});
    }

    if(req.body.start_date === undefined || req.body.start_date === ''){
        return res.status(400).json({error: 'Start date is required'});
    }
    if(req.body.end_date === undefined || req.body.end_date === ''){
        return res.status(400).json({error: 'End date is required'});
    }
    if(req.body.start_date != undefined && req.body.end_date != undefined
        && Date.parse(req.body.start_date) > Date.parse(req.body.end_date)){
        return res.status(400).json({error: 'Start date must be before end date'});
    }
    const goal = await goalRepository.findOneBy({id: req.params.id});
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    action.goal = goal;
    await actionRepository.save(action);
    res.status(201).json(action);
});

app.get('/goals/:id/actions', async (req, res) => {
    const actions = await actionRepository.findBy({goal: { id: req.params.id }});
    res.status(200).json(actions);
});

app.put('/actions/:id', async (req, res) => {
    const action = await actionRepository.findOneBy({ id: req.params.id });
    if (!action) return res.status(404).json({ error: 'Action not found' });
    if(req.body.start_date != undefined && req.body.end_date != undefined
        && Date.parse(req.body.start_date) > Date.parse(req.body.end_date)){
        return res.status(400).json({error: 'Start date must be before end date'});
    }
    actionRepository.merge(action, req.body);
    await actionRepository.save(action);
    res.json(action);
});


export default app;