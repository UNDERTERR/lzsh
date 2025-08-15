import request from '/@/utils/request';
export function useProductApi() {
  return {
    getProductList: (query?: Record<string, any>) => {
      return request({
        url: 'https://m1.apifoxmock.com/m1/6918002-6634022-default/product/details',
        method: 'get',
        params: {
          ...query // 展开查询条件
        }
      });
    },

    deleteProduct: (id: string) => {
      return request({
        url: `https://m1.apifoxmock.com/m1/6918002-6634022-default/product/details?id=${id}`,
        method: 'delete',
      });
    },

  }
}