import sqlite3 from 'sqlite3'; // Only use sqlite3
import { DatabaseAdapter } from './DatabaseAdapter';

export class SQLiteAdapter implements DatabaseAdapter {
  private db: sqlite3.Database | null = null; // Use sqlite3.Database directly

  constructor(private dbPath: string) {}

  async connect(): Promise<void> {
    // Connect to the SQLite3 database directly
    this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        throw new Error('Failed to connect to the database');
      }
      console.log(`Connected to SQLite database at ${this.dbPath}`);
    });
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => { // Using the non-null assertion operator here
          if (err) {
            console.error('Failed to disconnect from database', err);
            reject(err);  // Reject the promise if there's an error
          } else {
            console.log('Disconnected from SQLite database');
            resolve();  // Resolve the promise when disconnection is successful
          }
        });
      });
    } else {
      return Promise.reject(new Error('Database is not connected'));
    }
  }
  
  

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject('Database not connected');
      }

      this.db.all(query, params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
}
