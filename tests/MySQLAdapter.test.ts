import { MySQLAdapter } from '../src/adapters/MySqlAdapter';
import mysql from 'mysql2';

describe('MySQLAdapter Tests', () => {
  const testDBConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Use your MySQL credentials
    database: 'users',
  };

  let adapter: MySQLAdapter;

  beforeAll(async () => {
    adapter = new MySQLAdapter(testDBConfig);
    await adapter.connect();
  });

  afterAll(async () => {
    await adapter.disconnect();
  });

  test('Connect to MySQL database', async () => {
    expect(adapter).toBeDefined();
    const result = await adapter.executeQuery('SELECT 1');
    expect(result).toBeDefined();
  });

  test('Execute a simple query', async () => {
    const dropTableQuery = `DROP TABLE IF EXISTS users`;  // Drop the table if it already exists
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`;
    const insertQuery = `INSERT INTO users (name) VALUES (?)`;
    const selectQuery = `SELECT * FROM users`;

    await adapter.executeQuery(dropTableQuery);
    await adapter.executeQuery(createTableQuery);
    await adapter.executeQuery(insertQuery, ['John Doe']);

    const results = await adapter.executeQuery(selectQuery);
    expect(results).toEqual(expect.arrayContaining([{ id: expect.any(Number), name: 'John Doe' }]));
  });

  test('Handles parameterized query', async () => {
    const insertQuery = `INSERT INTO users (name) VALUES (?)`;
    const selectQuery = `SELECT * FROM users WHERE name = ?`;

    await adapter.executeQuery(insertQuery, ['Jane Doe']);
    const results = await adapter.executeQuery(selectQuery, ['Jane Doe']);

    // Adjust the expected result to match the actual table structure
    expect(results).toEqual(expect.arrayContaining([
      { id: expect.any(Number), name: 'Jane Doe' }
    ]));
  });
});
