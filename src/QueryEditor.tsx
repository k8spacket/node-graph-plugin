import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { Alert, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onDataUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, dataUrl: event.target.value });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { dataUrl } = query;

    return (
      <div style={{ width: '100%' }}>
        <InlineFieldRow>
          <Alert title="Check required JSON format on https://github.com/k8spacket/node-graph-plugin" severity="info" />
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="Data url" grow>
            <Input type="text" value={dataUrl || ''} onChange={this.onDataUrlChange} />
          </InlineField>
        </InlineFieldRow>
      </div>
    );
  }
}
