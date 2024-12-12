import { QueryBuilder } from '../src/query-builder/QueryBuilder';

describe('QueryBuilder', () => {
  test('should build a simple SELECT query', () => {
    const queryBuilder = new QueryBuilder().table('users').select(['id', 'name']);
    const { query, params } = queryBuilder.build();

    expect(query).toBe('SELECT id, name FROM users');
    expect(params).toEqual([]);
  });

  test('should build a SELECT query with a WHERE clause', () => {
    const queryBuilder = new QueryBuilder()
      .table('users')
      .select(['id', 'name'])
      .where('name = ?', 'John Doe');
    const { query, params } = queryBuilder.build();

    expect(query).toBe('SELECT id, name FROM users WHERE name = ?');
    expect(params).toEqual(['John Doe']);
  });

  test('should build a SELECT query with multiple WHERE conditions', () => {
    const queryBuilder = new QueryBuilder()
      .table('users')
      .select(['id', 'name'])
      .where('age > ?', 18)
      .where('status = ?', 'active');
    const { query, params } = queryBuilder.build();

    expect(query).toBe('SELECT id, name FROM users WHERE age > ? AND status = ?');
    expect(params).toEqual([18, 'active']);
  });

  test('should build a SELECT query with JOINs', () => {
    const queryBuilder = new QueryBuilder()
      .table('users')
      .select(['users.id', 'profiles.bio'])
      .join('INNER', 'profiles', 'users.id = profiles.user_id');
    const { query, params } = queryBuilder.build();

    expect(query).toBe(
      'SELECT users.id, profiles.bio FROM users INNER JOIN profiles ON users.id = profiles.user_id'
    );
    expect(params).toEqual([]);
  });

  test('should build a query with aggregations', () => {
    const queryBuilder = new QueryBuilder()
      .table('orders')
      .aggregate('SUM', 'amount')
      .aggregate('COUNT', '*');
    const { query, params } = queryBuilder.build();

    expect(query).toBe('SELECT SUM(amount), COUNT(*) FROM orders');
    expect(params).toEqual([]);
  });

  test('should build a query with all features combined', () => {
    const queryBuilder = new QueryBuilder()
      .table('orders')
      .select(['id', 'customer_id'])
      .where('status = ?', 'completed')
      .join('LEFT', 'customers', 'orders.customer_id = customers.id')
      .aggregate('SUM', 'amount');
    const { query, params } = queryBuilder.build();

    expect(query).toBe(
      'SELECT id, customer_id, SUM(amount) FROM orders LEFT JOIN customers ON orders.customer_id = customers.id WHERE status = ?'
    );
    expect(params).toEqual(['completed']);
  });

  test('should throw an error if table name is not provided', () => {
    const queryBuilder = new QueryBuilder();
    expect(() => queryBuilder.build()).toThrow('Table name is required.');
  });
});
