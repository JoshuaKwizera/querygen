import { Pool } from 'pg';  // PostgreSQL client library
import { DatabaseAdapter } from './DatabaseAdapter';

export class PostgreAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor(private connectionString: string) {
    this.pool = new Pool({
      connectionString: this.connectionString,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.log('Connected to PostgreSQL database');
    } catch (err) {
      throw new Error('Failed to connect to PostgreSQL database');
    }
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    console.log('Disconnected from PostgreSQL database');
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
