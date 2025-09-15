// src/index.ts
import express from 'express';
import cors from 'cors';
import {AppDataSource} from './data-source';
import {Goal} from './entities/Goal';
import {Action} from './entities/Action';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import {SwaggerSpec} from './swaggerConfig';
import dotenv from 'dotenv';

const allowedOrigins = [
    'http://localhost:3000',
    'https://qwen-goal-tracker-plf4.vercel.app'
];

dotenv.config();
const app = express();
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

    goalRepository.merge(goal, req.body);
    await goalRepository.save(goal);
    res.json(goal);
});

app.post('/goals/:id/actions', async (req, res) => {
    const action = actionRepository.create(req.body) as unknown as Action;
    action.goal = await goalRepository.findOneBy({id: req.params.id});
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

    actionRepository.merge(action, req.body);
    await actionRepository.save(action);
    res.json(action);
});

// Start server
AppDataSource.initialize()
    .then(() => {
        app.listen(process.env.PORT, () => console.log('Server running on port ' + process.env.PORT));
    })
    .catch((error) => console.log('Data Source initialization error:', error));