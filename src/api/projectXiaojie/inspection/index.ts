import request from '/@/utils/request';

/**
 * Apifox测试
 */
export function useInspectionApi() {
  return {
    //location
    getLocationList: (
      page: number,
      size: number,
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/location',
        method: 'get',
        params: {
          page,
          size,
          ...query // 展开查询条件
        }
      });
    },
    addLocation: (data: object) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/location',
        method: 'post',
        data,
      });
    },
    deleteLocation: (id: string) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/location?id=${id}`,
        method: 'delete',
      });
    },
    updateLocation: (id: string, data: object) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/location?id=${id}`,
        method: 'put',
        data,
      });
    },
    //record
    getRecordList: (
      page: number,
      size: number,
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inpection/record',
        method: 'get',
        params: {
          page,
          size,
          ...query // 展开查询条件
        }
      });
    },
    getDetailRecordList: (
      page: number,
      size: number,
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/detail',
        method: 'get',
        params: {
          page,
          size,
          ...query // 展开查询条件
        }
      });
    },
    //project
    getProjectSummary: () => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/project',
        method: 'get',
      });
    },
    addProject: (data: object) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/project',
        method: 'post',
        data,
      });
    },
    //performance
    setPerformance: (data: object) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/project',
        method: 'put',
        data,
      });
    },
    getPerformanceList: (
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/inspection/performance',
        method: 'get',
        params: {
          ...query // 展开查询条件
        }
      });
    },
  };
}