// src/api/car.ts
import request from '/@/utils/request';

/**
 * Apifox测试
 */
export function useCarApi() {
	return {
		getCarDetailsList: (page: number , size: number) => {
			return request({
				url: 'http://127.0.0.1:4523/m1/6918002-6634022-default/car/details',
				method: 'get',
				params:{
          page,
          size
        }
			});
		},
		addCarDetail: (data: object) => {
			return request({
				url: '/car/details',
				method: 'post',
				data,
			});
		},
		deleteCarDetail: (id: string) => {
			return request({
				url: `http://127.0.0.1:4523/m1/6918002-6634022-default/car/details?id=${id}`,
				method: 'delete',
			});
		},
		updateCarDetail: (id: string, data: object) => {
			return request({
				url: `http://127.0.0.1:4523/m1/6918002-6634022-default/car/details?id=${id}`,
				method: 'put',
				data,
			});
		},
	};
}
