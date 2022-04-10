import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { Alert, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, NodeGraphDataSourceOptions, NodeGraphQuery } from './types';

type Props = QueryEditorProps<DataSource, NodeGraphQuery, NodeGraphDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onMetricsContextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, metricsContext: event.target.value });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { metricsContext } = query;

    return (
      <div style={{ width: '100%' }}>
        <InlineFieldRow>
          <Alert title="Check required JSON format on https://github.com/k8spacket/node-graph-plugin" severity="info" />
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="Metrics context" grow>
            <Input type="text" value={metricsContext || ''} onChange={this.onMetricsContextChange} />
          </InlineField>
        </InlineFieldRow>
      </div>
    );
  }
}
