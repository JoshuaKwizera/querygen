import { DatabaseManager } from '../src/DatabaseManager';

jest.setTimeout(300000); // Increased timeout for PostgreSQL

describe('DatabaseManager', () => {
  let databaseManager: DatabaseManager;

  const sqliteConnectionString = './test-database.sqlite';
  const mysqlConnectionString = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users',
  };
  const postgresConnectionString = 'postgresql://postgres:1234567@localhost:5432/postgres';

  afterEach(async () => {
    if (databaseManager) {
      await databaseManager.disconnect().catch(err => console.error('Cleanup error:', err));
    }
  });

  test('should connect to SQLite and execute a query', async () => {
    databaseManager = new DatabaseManager('sqlite', sqliteConnectionString);

    await databaseManager.connect();
    await expect(databaseManager.executeQuery('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)')).resolves.not.toThrow();

    await databaseManager.executeQuery('INSERT INTO test (name) VALUES (?)', ['Test Name']);
    const results = await databaseManager.executeQuery('SELECT * FROM test');
    expect(results).toContainEqual({ id: 1, name: 'Test Name' });
  });

  test('should connect to MySQL and execute a query', async () => {
    databaseManager = new DatabaseManager('mysql', mysqlConnectionString);

    await databaseManager.connect();
    await expect(databaseManager.executeQuery('CREATE TABLE IF NOT EXISTS test (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))')).resolves.not.toThrow();

    await databaseManager.executeQuery('INSERT INTO test (name) VALUES (?)', ['Test Name']);
    const results = await databaseManager.executeQuery('SELECT * FROM test');
    expect(results).toContainEqual({ id: 1, name: 'Test Name' });
  });

  test('should connect to PostgreSQL and execute a query', async () => {
    databaseManager = new DatabaseManager('postgres', postgresConnectionString);

    await databaseManager.connect();
    await expect(databaseManager.executeQuery('CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY, name VARCHAR(255))')).resolves.not.toThrow();

    await databaseManager.executeQuery('INSERT INTO test (name) VALUES ($1)', ['Test Name']);
    const results = await databaseManager.executeQuery('SELECT * FROM test');
    expect(results).toContainEqual({ id: 1, name: 'Test Name' });
  });
});
