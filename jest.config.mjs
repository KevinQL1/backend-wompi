export default {
  testEnvironment: 'node',

  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.int.js'
  ],

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/domain/repositories/**'
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  moduleNameMapper: {
    '^#/(.*)$': '<rootDir>/src/$1'
  },

  clearMocks: true,

  displayName: {
    name: 'Backend-Wompi-Test',
    color: 'blue'
  }
}
