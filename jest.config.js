module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'], // Match your test files
  };
  