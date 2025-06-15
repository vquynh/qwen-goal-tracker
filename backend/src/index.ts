// src/index.ts
import express from 'express';
import { AppDataSource } from './data-source';
import { Goal } from './entities/Goal';
import { Action } from './entities/Action';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { SwaggerSpec } from './swaggerConfig';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Initialize Swagger

const swaggerDocs = swaggerJsDoc(SwaggerSpec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Get repositories
const goalRepository = AppDataSource.getRepository(Goal);
const actionRepository = AppDataSource.getRepository(Action);

// Routes
/**
 * @openapi
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Created goal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 */
app.post('/goals', async (req, res) => {
    const goal = goalRepository.create(req.body);
    await goalRepository.save(goal);
    res.status(201).json(goal);
});

app.get('/goals', async (_req, res) => {
    const goals = await goalRepository.find({ relations: ['actions'] });
    res.json(goals);
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

/**
 * @openapi
 * /actions:
 *   post:
 *     summary: Create a new action
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               interval:
 *                 type: string
 *                 example: daily
 *               status:
 *                 type: string
 *                 example: pending
 *               goal_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 */
app.post('/actions', async (req, res) => {
    const action = actionRepository.create(req.body);
    await actionRepository.save(action);
    res.status(201).json(action);
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