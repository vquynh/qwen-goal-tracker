// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/index.ts', // Exclude main entry point
        '!src/entities/*.ts', // Exclude entities if they're just TypeORM models
    ]
};