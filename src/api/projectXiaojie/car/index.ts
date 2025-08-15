// src/api/car.ts
import request from '/@/utils/request'

/**
 * Apifox测试
 */
export function useCarApi() {
  return {
    getCarDetailsList: (
      page: number,
      size: number,
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/car/details',
        method: 'get',
        params: {
          page,
          size,
          ...query // 展开查询条件
        }
      });
    },
    addCarDetail: (data: object) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/car/details',
        method: 'post',
        data,
      });
    },
    deleteCarDetail: (id: string) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/car/details?id=${id}`,
        method: 'delete',
      });
    },
    updateCarDetail: (id: string, data: object) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/car/details?id=${id}`,
        method: 'put',
        data,
      });
    },
    //在场车辆管理
    getOnlineCarList: (
      page: number,
      size: number,
      query?: Record<string, any>
    ) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/car/operation',
        method: 'get',
        params: {
          page,
          size,
          ...query // 展开查询条件
        }
      });
    },
    forceExit: (id: string) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/car/operation?id=${id}`,
        method: 'put',
      });
    },
    closeOrder: (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id];

      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/car/operation`,
        method: 'delete',
        data: { ids } // 后端接收 { ids: ['123', '456'] }
      });
    },

  };
}
