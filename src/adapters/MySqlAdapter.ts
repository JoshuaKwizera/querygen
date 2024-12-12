import { DatabaseAdapter } from './DatabaseAdapter';
import mysql, { Connection } from 'mysql2/promise';

export class MySQLAdapter implements DatabaseAdapter {
  private connection: Connection | null = null;

  constructor(
    private config: { host: string; user: string; password: string; database: string }
  ) {}

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection(this.config);
    console.log('Connected to MySQL database');
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log('Disconnected from MySQL database');
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.connection) throw new Error('Database not connected.');
    const [results] = await this.connection.execute(query, params);
    return results;
  }
}
