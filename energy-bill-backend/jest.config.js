module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src/'],  
    testMatch: [
        '**/__tests__/**/*.(spec|test).+(ts|tsx|js)',  
        '**/*.(spec|test).+(ts|tsx|js)' 
    ],
    transform: {
        '^.+\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    moduleNameMapper: {
        '^@services/(.*)$': '<rootDir>/src/services/$1',
    },
};