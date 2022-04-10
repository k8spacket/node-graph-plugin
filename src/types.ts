import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface NodeGraphQuery extends DataQuery {
  metricsContext?: string;
}

export const defaultQuery: Partial<NodeGraphQuery> = {};

/**
 * These are options configured for each DataSource instance
 */
export interface NodeGraphDataSourceOptions extends DataSourceJsonData {
  baseUrl?: string;
}
