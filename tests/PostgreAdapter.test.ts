import { PostgreAdapter } from '../src/adapters/PostgresAdapter';

// Set the timeout for the test suite to 10 seconds
jest.setTimeout(300000); // Set timeout to 20 seconds

describe('PostgreAdapter Tests', () => {
  const testConnectionString = 'postgresql://postgres:1234567@localhost:5432/postgres'; // Replace with your connection string
  let adapter: PostgreAdapter;

  beforeAll(async () => {
    adapter = new PostgreAdapter(testConnectionString);
    await adapter.connect();
  });

  afterAll(async () => {
    await adapter.disconnect();
  });

  beforeEach(async () => {
    // Clean up the users table before each test
    const deleteQuery = 'DELETE FROM users';
    await adapter.executeQuery(deleteQuery);
  });

  test('Connect to PostgreSQL database', async () => {
    expect(adapter).toBeDefined();
  });

  test('Execute a simple query', async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) DEFAULT NULL,
        age INT DEFAULT NULL,
        CONSTRAINT users_email_key UNIQUE (email)
      )`;
    const insertQuery = `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`;
    const selectQuery = `SELECT * FROM users`;

    await adapter.executeQuery(createTableQuery); // Create table if not exists
    await adapter.executeQuery(insertQuery, ['John Doe', 'john.doe@example.com', 30]); // Insert John Doe with email and age

    const results = await adapter.executeQuery(selectQuery);
    expect(results).toEqual([{ id: expect.any(Number), name: 'John Doe', email: 'john.doe@example.com', age: 30 }]);
  });

  test('Handles parameterized query', async () => {
    const insertQuery = `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`;
    const selectQuery = `SELECT * FROM users WHERE name = $1`;

    await adapter.executeQuery(insertQuery, ['Jane Doe', 'jane.doe@example.com', 25]);
    const results = await adapter.executeQuery(selectQuery, ['Jane Doe']);

    expect(results).toEqual([{ id: expect.any(Number), name: 'Jane Doe', email: 'jane.doe@example.com', age: 25 }]);
  });
});
