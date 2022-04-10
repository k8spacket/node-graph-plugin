import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldColorModeId,
  FieldType,
  MutableDataFrame,
  ScopedVars,
} from '@grafana/data';

import { NodeGraphDataSourceOptions, NodeGraphQuery } from './types';

export class DataSource extends DataSourceApi<NodeGraphQuery, NodeGraphDataSourceOptions> {
  baseUrl?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<NodeGraphDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url;
  }

  async doRequest(query: NodeGraphQuery, scopedVars: ScopedVars) {
    if (query.metricsContext) {
      return getBackendSrv().datasourceRequest({
        method: 'GET',
        url: this.baseUrl + '/apiroute' + getTemplateSrv().replace(query.metricsContext, scopedVars),
      });
    } else {
      return Promise.resolve();
    }
  }

  async query(options: DataQueryRequest<NodeGraphQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.flatMap((query) =>
      this.doRequest(query, options.scopedVars).then((response) => {
        const nodesFrame = new MutableDataFrame({
          name: 'nodes',
          meta: {
            preferredVisualisationType: 'nodeGraph',
          },
          fields: [
            { name: 'id', type: FieldType.string },
            { name: 'title', type: FieldType.string },
            { name: 'subTitle', type: FieldType.string },
            {
              name: 'mainStat',
              type: FieldType.string,
              config: {
                displayName: response?.data.config.mainStat.displayName,
              },
            },
            {
              name: 'secondaryStat',
              type: FieldType.string,
              config: {
                displayName: response?.data.config.secondaryStat.displayName,
              },
            },
            {
              name: 'arc__1',
              type: FieldType.number,
              config: {
                displayName: response?.data.config.arc__1.displayName,
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: response?.data.config.arc__1.color,
                },
              },
            },
            {
              name: 'arc__2',
              type: FieldType.number,
              config: {
                displayName: response?.data.config.arc__2.displayName,
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: response?.data.config.arc__2.color,
                },
              },
            },
            {
              name: 'arc__3',
              type: FieldType.number,
              config: {
                displayName: response?.data.config.arc__3.displayName,
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: response?.data.config.arc__3.color,
                },
              },
            },
          ],
        });

        const edgesFrame = new MutableDataFrame({
          name: 'edges',
          meta: {
            preferredVisualisationType: 'nodeGraph',
          },
          fields: [
            { name: 'id', type: FieldType.string },
            { name: 'source', type: FieldType.string },
            { name: 'target', type: FieldType.string },
            { name: 'mainStat', type: FieldType.string },
            { name: 'secondaryStat', type: FieldType.string },
          ],
        });

        if (response) {
          response.data.nodes.forEach((point: any) => {
            nodesFrame.appendRow([
              point.id,
              point.title,
              point.subTitle,
              point.mainStat,
              point.secondaryStat,
              point.arc__1,
              point.arc__2,
              point.arc__3,
            ]);
          });

          response.data.edges.forEach((point: any) => {
            edgesFrame.appendRow([point.id, point.source, point.target, point.mainStat, point.secondaryStat]);
          });
        }

        return [nodesFrame, edgesFrame];
      })
    );

    return await Promise.all(promises).then(([data]) => ({ data: data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
