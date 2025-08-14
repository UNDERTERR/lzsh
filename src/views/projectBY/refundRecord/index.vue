<template>
	<div class="refund-record">
		<el-card>
			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" size="default">
				<!-- 搜索表单内容 -->
				<el-form-item label="车牌号">
					<el-input size="default" v-model="searchForm.licensePlateNum" placeholder="请输入车牌号" />
				</el-form-item>
				<el-form-item label="单据号">
					<el-input size="default" v-model="searchForm.invoiceNum" placeholder="请输入单据号" />
				</el-form-item>
				<el-form-item label="退费时间">
					<el-date-picker
						size="default"
						v-model="searchForm.timeRange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
					/>
				</el-form-item>
				<el-form-item>
					<el-button size="default" type="primary" @click="fetchData" icon="ele-Search">查询</el-button>
					<el-button size="default" @click="resetSearchForm" icon="ele-Refresh">重置</el-button>
					<el-button size="default" type="warning" @click="openFilterDialog" icon="ele-Filter">筛选</el-button>
				</el-form-item>
			</el-form>

			<!-- 表格区域 -->
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="transactionId" label="单据号" width="180" />
				<el-table-column prop="plateNumber" label="车牌号码" width="180" />
				<el-table-column prop="vehicleType" label="车辆类型" width="180" />
				<el-table-column prop="feeType" label="费用类型" width="180" />
				<!-- 复合表头 - 入场信息 -->
				<el-table-column label="入场信息" width="500" align="center">
					<el-table-column prop="entryTime" label="入场时间" width="180" />
					<el-table-column prop="entryWeight" label="入场毛重(kg)" width="180" />
					<el-table-column prop="entryFee" label="入场收费(元)" width="180" />
					<el-table-column prop="paymentMethod" label="支付方式" width="180" />
				</el-table-column>

				<!-- 复合表头 - 出场信息 -->
				<el-table-column label="出场信息" width="600" align="center">
					<el-table-column prop="exitTime" label="出场时间" width="180" />
					<el-table-column prop="exitWeight" label="计费重量(kg)" width="180" />
					<el-table-column prop="exitFee" label="出场退费(元)" width="180" />
					<el-table-column prop="parkingDuration" label="停留时长" width="180" />
					<el-table-column prop="parkingFee" label="停车费金额(元)" width="180" />
					<el-table-column prop="refundAmount" label="退费金额(元)" width="180" />
				</el-table-column>

				<el-table-column prop="refundMethod" label="退费方式" width="180" />
				<el-table-column prop="orderStatus" label="订单状态" width="180" />

				<!-- 其他列 -->
				<el-table-column prop="refundOperator" label="退费员" width="180" />
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button size="default" @click="handleViewDetail(scope.row)">查看</el-button>
						<el-button size="default" @click="handlePrint(scope.row)">打印</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<el-pagination
				class="mt15"
				v-model:currentPage="currentPage"
				v-model:pageSize="pageSize"
				:page-sizes="[10, 20, 30, 50]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</el-card>

		<!-- 弹窗组件 -->
		<filter-dialog v-model:visible="filterDialogVisible" @submit="handleFilterSubmit" />
		<view-dialog v-model:visible="viewDialogVisible" :detail="selectedDetail" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import FilterDialog from './component/filterDialog.vue';
import ViewDialog from './component/viewDialog.vue';
import { ElMessage } from 'element-plus';

// 定义表格数据的接口
interface TableDataItem {
	transactionId: string; // 单据号
	plateNumber: string; // 车牌号码
	vehicleType: string; // 车辆类型
	feeType: string; // 费用类型
	entryTime: string; // 入场时间
	entryWeight: number; // 入场毛重(kg)
	entryFee: number; // 入场收费(元)
	paymentMethod: string; // 支付方式
	exitTime: string; // 出场时间
	exitWeight: number; // 计费重量(kg)
	exitFee: number; // 出场退费(元)
	parkingDuration: string; // 停留时长
	parkingFee: number; // 停车费金额(元)
	refundAmount: number; // 退费金额(元)
	refundMethod: string; // 退费方式
	orderStatus: string; // 订单状态
	refundOperator: string; // 退费员
}

// 搜索表单数据
const searchForm = reactive({
	invoiceNum: '',
	licensePlateNum: '',
	timeRange: [],
});

// 表格数据
const tableData = ref<TableDataItem[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗状态
const filterDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const selectedDetail = ref<TableDataItem | undefined>();

// 获取数据 - 随机模拟数据
const fetchData = () => {
	const mockData: TableDataItem[] = [];
	for (let i = 1; i <= pageSize.value; i++) {
		const id = (currentPage.value - 1) * pageSize.value + i;
		if (id > 50) break; // 模拟总共50条数据

		// 生成随机的入场和出场时间
		const hours = Math.floor(Math.random() * 24);
		const entryTime = `2025-08-08 ${hours}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`;
		const exitTime = `2025-08-08 ${hours + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`;

		mockData.push({
			transactionId: `25080800${id}`, // 单据号
			plateNumber: `甘D${Math.floor(Math.random() * 100000)}`, // 车牌号码
			vehicleType: '私家车', // 车辆类型
			feeType: '私家车出场收费', // 费用类型
			entryTime: entryTime, // 入场时间
			entryWeight: Math.floor(Math.random() * 1000), // 入场毛重(kg)
			entryFee: Math.floor(Math.random() * 100), // 入场收费(元)
			paymentMethod: '扫码支付', // 支付方式
			exitTime: exitTime, // 出场时间
			exitWeight: Math.floor(Math.random() * 1000), // 计费重量(kg)
			exitFee: Math.floor(Math.random() * 100), // 出场退费(元)
			parkingDuration: `${Math.floor(Math.random() * 24)}小时${Math.floor(Math.random() * 60)}分钟`, // 停留时长
			parkingFee: Math.floor(Math.random() * 100), // 停车费金额(元)
			refundAmount: Math.floor(Math.random() * 100), // 退费金额(元)
			refundMethod: id % 2 === 0 ? '原路退回' : '现金退款', // 退费方式
			orderStatus: id % 2 === 0 ? '已完成' : '待处理', // 订单状态
			refundOperator: 'robot007', // 退费员
		});
	}

	tableData.value = mockData;
	total.value = 50; // 模拟总共有50条数据
};

// 组件挂载时获取数据
onMounted(() => {
	fetchData();
});

// 重置搜索表单
const resetSearchForm = () => {
	searchForm.invoiceNum = '';
	searchForm.licensePlateNum = '';
	searchForm.timeRange = [];
	fetchData();
};

// 处理分页大小变化
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	fetchData();
};

// 处理当前页变化
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	fetchData();
};

// 打开筛选弹窗
const openFilterDialog = () => {
	filterDialogVisible.value = true;
};

// 处理筛选提交
const handleFilterSubmit = (formData: any) => {
	Object.assign(searchForm, formData);
	fetchData();
	filterDialogVisible.value = false;
};

// 查看详情
const handleViewDetail = (row: TableDataItem) => {
	selectedDetail.value = row;
	viewDialogVisible.value = true;
};

const handlePrint = (row: TableDataItem) => {
	ElMessage.success(`打印${row.transactionId}的票据`);
};
</script>

<style scoped>
.el-pagination {
	justify-content: right;
}
</style>
