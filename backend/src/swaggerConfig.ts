import {SwaggerOptions} from "swagger-ui-express";

export const SwaggerSpec = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Goal Tracker API',
                version: '1.0.0',
                description: 'API for managing goals and actions in a goal tracking application.',
            },
            servers: [
                {
                    url: process.env.APP_URL,
                    description: 'Development server: ' + process.env.APP_URL,
                },
            ],
            paths: {
                '/goals': {
                    get: {
                        summary: 'Get all goals',
                        responses: {
                            '200': {
                                description: 'A list of goals',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Goal' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    post: {
                        summary: 'Create a new goal',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Goal' },
                                },
                            },
                        },
                        responses: {
                            '201': {
                                description: 'Goal created successfully',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/Goal' },
                                    },
                                },
                            },
                        },
                    },
                },
                '/goals/{goalId}': {
                    get: {
                        summary: 'Get a specific goal by ID',
                        parameters: [
                            {
                                name: 'goalId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string', format: 'uuid' },
                            },
                        ],
                        responses: {
                            '200': {
                                description: 'Goal details',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/Goal' },
                                    },
                                },
                            },
                            '404': { description: 'Goal not found' },
                        },
                    },
                    put: {
                        summary: 'Update a specific goal by ID',
                        parameters: [
                            {
                                name: 'goalId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string', format: 'uuid' },
                            },
                        ],
                        requestBody: {
                            required: true,
                            content:
                                {'application/json': {schema:{ $ref:'#/components/schemas/Goal' }}},
                        },
                        responses: {
                            '200': {
                                description: 'Goal updated successfully',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/Goal' },
                                    },
                                },
                            },
                            '404': { description: 'Goal not found' },
                        },
                    },
                },
                '/goals/{goalId}/actions': {
                    get: {
                        summary: 'Get actions for a specific goal',
                        parameters: [
                            {
                                name: 'goalId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string', format: 'uuid' },
                            },
                        ],
                        responses: {
                            '200': {
                                description: 'List of actions for the goal',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Action' },
                                        },
                                    },
                                },
                            },
                            '404': { description: 'Goal not found' },
                        },
                    },
                    post: {
                        summary: 'Create a new action for a specific goal',
                        parameters: [
                            {
                                name: 'goalId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string', format: 'uuid' },
                            },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Action' },
                                },
                            },
                        },
                        responses: {
                            '201': {
                                description: 'Action created successfully',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/Action' },
                                    },
                                },
                            },
                            '404': { description: 'Goal not found' },
                        },
                    },
                },
                '/actions/{actionId}': {
                    put: {
                        summary: 'Update a specific action by ID',
                        parameters: [
                            {
                                name: 'actionId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string', format: 'uuid' },
                            },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Action' },
                                },
                            },
                        },
                        responses: {
                            '200': {
                                description: 'Action updated successfully',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/Action' },
                                    },
                                },
                            },
                            '404': { description: 'Action not found' },
                        },
                    },
                },
            },
            components: {
                schemas: {
                    Goal: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string' },
                            deadline: { type: 'string', format: 'date' },
                            actions: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Action' },
                            },
                        },
                    },
                    Action: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            title: { type: 'string' },
                            start_date: { type: 'string', format: 'date' },
                            end_date: { type: 'string', format: 'date' },
                            interval: { type: 'string' },
                            status: { type: 'string', enum: ['pending', 'completed'] },
                        },
                    },
                },
            },
        },
        apis: ['./src/**/*.ts'],
    } as SwaggerOptions;