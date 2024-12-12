import { QueryBuilder } from '../src/query-builder/QueryBuilder';
import { DatabaseManager } from './DatabaseManager';

// Example connection strings
const sqliteConnectionString = './database.sqlite';
const mysqlConnectionString = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users',
};
const postgresConnectionString = 'postgresql://postgres:1234567@localhost:5432/postgres';

// Capture the database type from command-line arguments
const dbType: 'sqlite' | 'mysql' | 'postgres' = process.argv[2] as 'sqlite' | 'mysql' | 'postgres';

// Ensure the user provided a valid database type
if (!dbType || !['sqlite', 'mysql', 'postgres'].includes(dbType)) {
  console.error('Please specify a valid database type: sqlite, mysql, or postgres.');
  process.exit(1); // Exit the program if the input is invalid
}

// Choose the appropriate connection string based on the provided database type
const connectionString = dbType === 'mysql'
  ? mysqlConnectionString
  : dbType === 'postgres'
  ? postgresConnectionString
  : sqliteConnectionString;

// Instantiate the DatabaseManager with the selected database type and connection string
const databaseManager = new DatabaseManager(dbType, connectionString);

// Function to demonstrate QueryBuilder usage
function demonstrateQueryBuilder(placeholderFormat: 'question' | 'dollar') {
  try {
    // Build a query using QueryBuilder
    const queryBuilder = new QueryBuilder(placeholderFormat);

    const selectWithWhere = queryBuilder
      .table('users')
      .select(['id', 'name'])
      .where('age > ?', 18)
      .where('status = ?', 'active')
      .build();

    console.log('Generated Query:', selectWithWhere.query);
    console.log('Query Parameters:', selectWithWhere.params);

    return selectWithWhere;
  } catch (error) {
    console.error('Error demonstrating QueryBuilder:', error);
    throw error;
  }
}

// Main function to connect to the database, execute queries, and disconnect
async function main() {
  try {
    // Determine placeholder format based on database type
    const placeholderFormat = dbType === 'postgres' ? 'dollar' : 'question';

    // Connect to the selected database
    await databaseManager.connect();
    console.log('Database connected successfully.');

    // Demonstrate QueryBuilder and execute the generated query
    const { query, params } = demonstrateQueryBuilder(placeholderFormat);
    const results = await databaseManager.executeQuery(query, params);

    console.log('Query Results:', results);

    // Disconnect after the operations
    await databaseManager.disconnect();
    console.log('Database disconnected successfully.');
  } catch (error) {
    console.error('Error during database operation:', error);
  }
}

// Run the main function
main();
