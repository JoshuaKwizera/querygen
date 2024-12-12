import { DatabaseAdapter } from './adapters/DatabaseAdapter';
import { SQLiteAdapter } from './adapters/SQLiteAdapter';
import { MySQLAdapter } from './adapters/MySqlAdapter';
import { PostgreAdapter } from './adapters/PostgresAdapter';

// Define the type for available database types
type DatabaseType = 'sqlite' | 'mysql' | 'postgres';

export class DatabaseManager {
  private adapter: DatabaseAdapter | null = null;

  // Configuration for the database type
  private dbType: DatabaseType;
  private connectionString: string | { host: string; user: string; password: string; database: string };

  constructor(dbType: DatabaseType, connectionString: string | { host: string; user: string; password: string; database: string }) {
    this.dbType = dbType;
    this.connectionString = connectionString;
  }

  // Dynamically switch between database adapters based on dbType
  private async createAdapter(): Promise<void> {
    switch (this.dbType) {
      case 'sqlite':
        this.adapter = new SQLiteAdapter(this.connectionString as string);
        break;
      case 'mysql':
        if (typeof this.connectionString === 'string') {
          // If connectionString is a string, we can split it into config values
          const [host, user, password, database] = this.connectionString.split(':');
          this.adapter = new MySQLAdapter({ host, user, password, database });
        } else {
          // If connectionString is an object, pass it as is
          this.adapter = new MySQLAdapter(this.connectionString);
        }
        break;
      case 'postgres':
        this.adapter = new PostgreAdapter(this.connectionString as string);
        break;
      default:
        throw new Error(`Unsupported database type: ${this.dbType}`);
    }
  }

  // Connect to the chosen database
  public async connect(): Promise<void> {
    if (!this.adapter) {
      await this.createAdapter();
    }
  
    // Safely call connect if the adapter is not null
    if (this.adapter) {
      await this.adapter.connect();
    } else {
      throw new Error('Failed to create database adapter.');
    }
  }
  

  // Disconnect from the chosen database
  public async disconnect(): Promise<void> {
    if (this.adapter) {
      await this.adapter.disconnect();
    }
  }

  // Execute a query on the connected database
  public async executeQuery(query: string, params?: any[]): Promise<any> {
    if (!this.adapter) {
      throw new Error('Database not connected');
    }
    return await this.adapter.executeQuery(query, params);
  }
}
