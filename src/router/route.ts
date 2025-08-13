import { RouteRecordRaw } from 'vue-router';

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			// 示例1：基础页面（首页）
			{
				path: '/home',
				name: 'home',
				component: () => import('/@/views/home/index.vue'),
				meta: {
					title: 'message.router.home', // 多语言示例
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true, // 固定标签页
					isIframe: false,
					roles: ['admin', 'common'], // 权限控制
					icon: 'iconfont icon-shouye', // 图标示例
				},
			},

			// 示例2：嵌套路由（系统管理）
			{
				path: '/system',
				name: 'system',
				component: () => import('/@/layout/routerView/parent.vue'), // 嵌套路由父组件
				redirect: '/system/user',
				meta: {
					title: 'message.router.system',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'], // 仅管理员可见
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					// 用户管理
					{
						path: '/system/user',
						name: 'systemUser',
						component: () => import('/@/views/system/user/index.vue'),
						meta: {
							title: 'message.router.systemUser',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-',
						},
					},

					// 角色管理
					{
						path: '/system/role',
						name: 'systemRole',
						component: () => import('/@/views/system/role/index.vue'),
						meta: {
							title: 'message.router.systemRole',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-ColdDrink', // Element Plus图标示例
						},
					},
				],
			},
			// 费用规则_LJH
			{
				path: '/feeRules',
				name: 'feeRules',
				component: () => import('/@/views/projectLJH/feeRules/parent.vue'), // 嵌套路由父组件
				redirect: '/project/feeRules',
				meta: {
					title: '费用规则',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'ele-Money',
				},
				children: [
					{
						path: '/feeRules/pricing',
						name: 'pricingRules',
						component: () => import('/@/views/projectLJH/feeRules/pricingRules.vue'),
						meta: {
							title: '收费规则',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-PriceTag',
						},
					},
					{
						path: '/feeRules/refund',
						name: 'refundRules',
						component: () => import('/@/views/projectLJH/feeRules/refundRules.vue'),
						meta: {
							title: '退费规则',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-RefreshLeft',
						},
					},
				],
			},
			/**
			 * 车辆进出场明细_xiaojie
			 */
			{
				path: '/car',
				name: 'car',
				component: () => import('/@/layout/routerView/parent.vue'), // 父级容器组件
				redirect: '/car/enexDetails',
				meta: {
					title: 'message.router.car', // 可以在语言包中配置为“车辆管理”或类似
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'ele-Cherry',
				},
				children: [
					{
						path: '/car/enexDetails',
						name: 'carEnexDetails',
						component: () => import('/@/views/projectXiaojie/car/enexDetails/index.vue'),
						meta: {
							title: 'message.router.carEnexDetails', // 对应“车辆进出场明细”
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'ele-DocumentAdd',
						},
					},
				],
			},
			/* 赵师一 */
			{
				path: '/reporting',
				name: 'reportingIndex',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/reporting/registration',
				meta: {
					title: '报备报检',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-fuzhiyemian',
				},
				children: [
					{
						path: '/reporting/registration',
						name: 'reportingregistration',
						component: () => import('/@/views/reporting/registration/index.vue'),
						meta: {
							title: '报备登记',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Sell',
						},
					},
				],
			},
			// 白云
			{
				path: '/projectBY',
				name: 'projectBY',
				component: () => import('/@/layout/routerView/parent.vue'),
				redirect: '/projectBY/blacklist',
				meta: {
					title: '白云',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'ele-Cloudy',
				},
				children: [
					{
						path: '/projectBY/blacklist',
						name: 'projectBYBlacklist',
						component: () => import('/@/views/projectBY/blacklist/index.vue'),
						meta: {
							title: '黑名单管理',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Failed',
						},
					},
					{
						path: '/projectBY/chargingRecord',
						name: 'projectBYChargingRecord',
						component: () => import('/@/views/projectBY/chargingRecord/index.vue'),
						meta: {
							title: '收费记录',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Collection',
						},
					},
					{
						path: '/projectBY/refundRecord',
						name: 'projectBYRefundRecord',
						component: () => import('/@/views/projectBY/refundRecord/index.vue'),
						meta: {
							title: '退费记录',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Notebook',
						},
					},
					{
						path: '/projectBY/detectionInfo',
						name: 'projectBYDetectionInfo',
						component: () => import('/@/views/projectBY/detectionInfo/index.vue'),
						meta: {
							title: '检测信息',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-FirstAidKit',
						},
					},
					{
						path: '/projectBY/entryVerify',
						name: 'projectBYEntryVerify',
						component: () => import('/@/views/projectBY/entryVerify/index.vue'),
						meta: {
							title: '进场核验',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Smoking',
						},
					},
					{
						path: '/projectBY/incomingInquiry',
						name: 'projectBYIncomingInquiry',
						component: () => import('/@/views/projectBY/incomingInquiry/index.vue'),
						meta: {
							title: '来货查询',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Orange',
						},
					},
				],
			},
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	/**
	 * 提示：写在这里的为全屏界面，不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	{
		path: '/visualizingDemo1',
		name: 'visualizingDemo1',
		component: () => import('/@/views/visualizing/demo1.vue'),
		meta: {
			title: 'message.router.visualizingLinkDemo1',
		},
	},
	{
		path: '/visualizingDemo2',
		name: 'visualizingDemo2',
		component: () => import('/@/views/visualizing/demo2.vue'),
		meta: {
			title: 'message.router.visualizingLinkDemo2',
		},
	},
];
