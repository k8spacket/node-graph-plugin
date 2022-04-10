import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { NodeGraphDataSourceOptions } from './types';

const { FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<NodeGraphDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onBaseUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      baseUrl: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="BaseUrl"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onBaseUrlChange}
            value={jsonData.baseUrl || ''}
            tooltip="Base url to metrics service"
            placeholder="Base url to metrics service"
          />
        </div>
      </div>
    );
  }
}
