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
  };
}
