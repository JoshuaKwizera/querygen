import { SQLiteAdapter } from '../src/adapters/SQLiteAdapter';

describe('SQLiteAdapter Tests', () => {
  const testDBPath = ':memory:'; // Use an in-memory SQLite database for testing
  let adapter: SQLiteAdapter;

  beforeAll(async () => {
    adapter = new SQLiteAdapter(testDBPath);
    await adapter.connect();
  });

  afterAll(async () => {
    await adapter.disconnect();
  });

  test('Connect to SQLite database', async () => {
    expect(adapter).toBeDefined();
    // Ensure adapter.db is initialized after connection
    // @ts-ignore: Accessing private property for testing
    expect(adapter.db).not.toBeNull();
  });

  test('Execute a simple query', async () => {
    const createTableQuery = `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)`;
    const insertQuery = `INSERT INTO users (name) VALUES (?)`;
    const selectQuery = `SELECT * FROM users`;

    await adapter.executeQuery(createTableQuery);
    await adapter.executeQuery(insertQuery, ['John Doe']);

    const results = await adapter.executeQuery(selectQuery);
    expect(results).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  test('Handles parameterized query', async () => {
    const insertQuery = `INSERT INTO users (name) VALUES (?)`;
    const selectQuery = `SELECT * FROM users WHERE name = ?`;

    await adapter.executeQuery(insertQuery, ['Jane Doe']);
    const results = await adapter.executeQuery(selectQuery, ['Jane Doe']);

    expect(results).toEqual([{ id: 2, name: 'Jane Doe' }]);
  });
});
