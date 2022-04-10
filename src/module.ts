import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { NodeGraphQuery, NodeGraphDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, NodeGraphQuery, NodeGraphDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
