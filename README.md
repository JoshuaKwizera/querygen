# QueryGen

QueryGen is a dynamic SQL query builder and database management library supporting SQLite, MySQL, and PostgreSQL. It provides a simple yet powerful API to construct and execute queries programmatically, making database interactions seamless and maintainable.

## Features
- Support for multiple databases: SQLite, MySQL, and PostgreSQL.
- Chainable API for building complex SQL queries.
- Dynamic query generation with parameterized inputs for security.
- Lightweight and modular design.

---

## Installation

Install the library via npm:

```bash
npm install querygen
```

---

## Usage

### Setup
To use QueryGen, import and configure it with your preferred database type and connection details.

```typescript
import { DatabaseManager } from 'querygen';

// Connection details for supported databases
const dbType: 'sqlite' | 'mysql' | 'postgres' = 'mysql';
const connectionString = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database',
};

const databaseManager = new DatabaseManager(dbType, connectionString);
```

### Building Queries

Use the `QueryBuilder` to construct SQL queries programmatically:

```typescript
import { QueryBuilder } from 'querygen';

const queryBuilder = new QueryBuilder()
  .table('users')
  .select(['id', 'name'])
  .where('age > ?', 18)
  .where('status = ?', 'active');

const { query, params } = queryBuilder.build();
console.log('Generated Query:', query); // SELECT id, name FROM users WHERE age > ? AND status = ?
console.log('Query Parameters:', params); // [18, 'active']
```

### Executing Queries

Once you build a query, execute it using the `DatabaseManager`:

```typescript
async function fetchActiveUsers() {
  try {
    await databaseManager.connect();
    const { query, params } = queryBuilder.build();
    const results = await databaseManager.executeQuery(query, params);
    console.log('Query Results:', results);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await databaseManager.disconnect();
  }
}

fetchActiveUsers();
```

---

## API Documentation

### QueryBuilder

#### Methods

- `table(tableName: string): QueryBuilder`
  - Specifies the table for the query.

- `select(fields: string[]): QueryBuilder`
  - Specifies the fields to select. Defaults to `*` if not provided.

- `where(condition: string, param?: any): QueryBuilder`
  - Adds a conditional clause with optional parameterization.

- `join(type: 'INNER' | 'LEFT' | 'RIGHT', table: string, on: string): QueryBuilder`
  - Adds a JOIN clause.

- `aggregate(func: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX', field: string): QueryBuilder`
  - Adds an aggregation function to the query.

- `build(): { query: string; params: any[] }`
  - Builds the query string and returns it along with parameters.

#### Example

```typescript
const queryBuilder = new QueryBuilder()
  .table('orders')
  .select(['id', 'total'])
  .where('customer_id = ?', 123)
  .build();

console.log(queryBuilder.query); // SELECT id, total FROM orders WHERE customer_id = ?
console.log(queryBuilder.params); // [123]
```

### DatabaseManager

#### Methods

- `constructor(dbType: 'sqlite' | 'mysql' | 'postgres', connectionString: string | object)`
  - Initializes the database manager with the specified type and connection details.

- `connect(): Promise<void>`
  - Establishes a connection to the database.

- `disconnect(): Promise<void>`
  - Closes the database connection.

- `executeQuery(query: string, params: any[]): Promise<any[]>`
  - Executes a parameterized query and returns the results.

#### Example

```typescript
const databaseManager = new DatabaseManager('sqlite', './database.sqlite');

async function fetchProducts() {
  try {
    await databaseManager.connect();
    const results = await databaseManager.executeQuery('SELECT * FROM products WHERE price > ?', [50]);
    console.log('Products:', results);
  } finally {
    await databaseManager.disconnect();
  }
}

fetchProducts();
```

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests on the [GitHub repository](https://github.com/your-username/querygen).

---

## License

QueryGen is licensed under the [MIT License](LICENSE).

