module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    projects: [
        {
            displayName: 'unit',
            testMatch: ['**/tests/unit/**/*.test.ts'],
        },
        {
            displayName: 'integration',
            testMatch: ['**/tests/integration/**/*.test.ts'],
        },
    ],
};