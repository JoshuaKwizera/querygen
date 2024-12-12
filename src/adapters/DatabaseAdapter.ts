// DatabaseAdapter.ts

export interface DatabaseAdapter {
    /**
     * Establish a connection to the database.
     */
    connect(): Promise<void>;
  
    /**
     * Close the database connection.
     */
    disconnect(): Promise<void>;
  
    /**
     * Execute a query on the database.
     * @param query - The SQL query string to execute.
     * @param params - Optional parameters for the query.
     * @returns A Promise resolving to the query result.
     */
    executeQuery(query: string, params?: any[]): Promise<any>;
  }
  