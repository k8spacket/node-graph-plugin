import jsonpath from 'jsonpath';
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

import { MyDataSourceOptions, MyQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  jp(json: object, query: string): any[] {
    return jsonpath.query(json, query);
  }

  async doRequest(query: MyQuery, scopedVars: ScopedVars) {
    if (query.dataUrl) {
      return getBackendSrv().get(getTemplateSrv().replace(query.dataUrl, scopedVars));
    } else {
      return Promise.resolve();
    }
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
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
                displayName: this.jp(response, '$.config.mainStat.displayName')[0],
              },
            },
            {
              name: 'secondaryStat',
              type: FieldType.string,
              config: {
                displayName: this.jp(response, '$.config.secondaryStat.displayName')[0],
              },
            },
            {
              name: 'arc__1',
              type: FieldType.number,
              config: {
                displayName: this.jp(response, '$.config.arc__1.displayName')[0],
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: this.jp(response, '$.config.arc__1.color')[0],
                },
              },
            },
            {
              name: 'arc__2',
              type: FieldType.number,
              config: {
                displayName: this.jp(response, '$.config.arc__2.displayName')[0],
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: this.jp(response, '$.config.arc__2.color')[0],
                },
              },
            },
            {
              name: 'arc__3',
              type: FieldType.number,
              config: {
                displayName: this.jp(response, '$.config.arc__3.displayName')[0],
                color: {
                  mode: FieldColorModeId.Fixed,
                  fixedColor: this.jp(response, '$.config.arc__3.color')[0],
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
          response.nodes.forEach((point: any) => {
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

          response.edges.forEach((point: any) => {
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
