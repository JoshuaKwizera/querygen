interface QueryOptions {
    table: string;
    fields?: string[];
    conditions?: string[];
    joins?: { type: string; table: string; on: string }[];
    aggregations?: { func: string; field: string }[];
  }
  
  export class QueryBuilder {
    private options: QueryOptions;
    private params: any[] = [];
    private placeholderFormat: 'question' | 'dollar';
  
    constructor(placeholderFormat: 'question' | 'dollar' = 'question') {
      this.options = { table: '' };
      this.placeholderFormat = placeholderFormat;
    }
  
    public table(tableName: string): QueryBuilder {
      this.options.table = tableName;
      return this;
    }
  
    public select(fields: string[] = ['*']): QueryBuilder {
      this.options.fields = fields;
      return this;
    }
  
    public where(condition: string, param?: any): QueryBuilder {
      this.options.conditions = this.options.conditions || [];
  
      const placeholder =
        this.placeholderFormat === 'dollar'
          ? `$${this.params.length + 1}` // PostgreSQL style
          : '?'; // MySQL/SQLite style
  
      // Replace '?' in the condition with the appropriate placeholder format
      const formattedCondition = condition.replace('?', placeholder);
  
      this.options.conditions.push(formattedCondition);
  
      if (param !== undefined) {
        this.params.push(param);
      }
  
      return this;
    }
  
    public join(type: 'INNER' | 'LEFT' | 'RIGHT', table: string, on: string): QueryBuilder {
      this.options.joins = this.options.joins || [];
      this.options.joins.push({ type, table, on });
      return this;
    }
  
    public aggregate(func: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX', field: string): QueryBuilder {
      this.options.aggregations = this.options.aggregations || [];
      this.options.aggregations.push({ func, field });
      return this;
    }
  
    private buildSelect(): string {
      const { fields, aggregations } = this.options;
  
      if (aggregations && aggregations.length > 0) {
        const aggregateClauses = aggregations.map((agg) => `${agg.func}(${agg.field})`);
        return aggregateClauses.join(', ');
      }
  
      return fields?.join(', ') || '*';
    }
  
    public build(): { query: string; params: any[] } {
      const { table, conditions, joins } = this.options;
  
      if (!table) throw new Error('Table name is required.');
  
      const query: string[] = [];
      query.push(`SELECT ${this.buildSelect()} FROM ${table}`);
  
      if (joins && joins.length > 0) {
        joins.forEach((join) => {
          query.push(`${join.type} JOIN ${join.table} ON ${join.on}`);
        });
      }
  
      if (conditions && conditions.length > 0) {
        query.push(`WHERE ${conditions.join(' AND ')}`);
      }
  
      return { query: query.join(' '), params: this.params };
    }
  }
  