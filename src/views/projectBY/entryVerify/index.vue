<template>
	<div class="entry-verify">
		<el-card>
			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" size="default">
				<el-form-item label="车牌号">
					<el-input v-model="searchForm.plateNumber" placeholder="请输入车牌号" />
				</el-form-item>
				<el-form-item label="司机姓名">
					<el-input v-model="searchForm.driverName" placeholder="请输入司机姓名" />
				</el-form-item>
				<el-form-item label="入场时间">
					<el-date-picker
						v-model="searchForm.timeRange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="fetchData">查询</el-button>
					<el-button @click="resetSearchForm">重置</el-button>
					<el-button type="warning" @click="openFilterDialog">筛选</el-button>
					<el-button type="success" @click="handlePrint">打印</el-button>
				</el-form-item>
			</el-form>

			<!-- 表格区域 -->
			<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="entryId" label="入场单号" width="max-content" />
				<el-table-column prop="plateNumber" label="车牌号" width="max-content" />
				<el-table-column prop="vehicleType" label="车辆类型" width="max-content" />
				<el-table-column prop="driverName" label="司机姓名" width="max-content" />
				<el-table-column prop="driverPhone" label="联系电话" width="max-content" />
				<el-table-column prop="goodsType" label="货物类型" width="max-content" />
				<el-table-column prop="goodsWeight" label="货物重量(kg)" width="max-content" />
				<el-table-column prop="entryTime" label="入场时间" width="max-content" />
				<el-table-column prop="entryGate" label="入场岗亭" width="max-content" />
				<el-table-column prop="verifier" label="核验员" width="max-content" />
				<el-table-column prop="status" label="状态" width="max-content">
					<template #default="scope">
						<el-tag :type="scope.row.status === '已核验' ? 'success' : 'warning'">
							{{ scope.row.status }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button size="small" @click="handleView(scope.row)">查看</el-button>
						<el-button size="small" type="primary" @click="handleVerify(scope.row)" :disabled="scope.row.status === '已核验'"> 核验 </el-button>
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
		<view-dialog v-model:visible="viewDialogVisible" :detail="selectedRow" />
		<verify-dialog v-model:visible="verifyDialogVisible" :data="selectedRow" @submit="handleVerifySubmit" />
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import FilterDialog from './component/filterDialog.vue';
import ViewDialog from './component/viewDialog.vue';
import VerifyDialog from './component/verifyDialog.vue';
import { ElMessage } from 'element-plus';

// 定义表格数据的接口
interface TableDataItem {
	id: number;
	entryId: string;
	plateNumber: string;
	vehicleType: string;
	driverName: string;
	driverPhone: string;
	goodsType: string;
	goodsWeight: number;
	entryTime: string;
	entryGate: string;
	verifier: string;
	status: string;
}

// 搜索表单数据
const searchForm = reactive({
	plateNumber: '',
	driverName: '',
	timeRange: [] as any[],
});

// 表格数据
const tableData = ref<TableDataItem[]>([]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 复选框选择的数据
const selectedRows = ref<TableDataItem[]>([]);

// 弹窗状态
const filterDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const verifyDialogVisible = ref(false);
const selectedRow = ref<TableDataItem>();

// 获取数据 - 随机模拟数据
const fetchData = () => {
	const mockData: TableDataItem[] = [];
	for (let i = 1; i <= pageSize.value; i++) {
		const id = (currentPage.value - 1) * pageSize.value + i;
		if (id > 50) break; // 模拟总共50条数据

		// 生成随机入场时间
		const hours = Math.floor(Math.random() * 24);
		const entryTime = `2025-08-08 ${hours}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`;

		mockData.push({
			id: id,
			entryId: `RK250808${String(id).padStart(4, '0')}`, // 入场单号
			plateNumber: `甘D${Math.floor(Math.random() * 100000)}`, // 车牌号
			vehicleType: Math.random() > 0.5 ? '货车' : '小货车', // 车辆类型
			driverName: `司机${id}`, // 司机姓名
			driverPhone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 1000000000)
				.toString()
				.padStart(10, '0')}`, // 联系电话
			goodsType: Math.random() > 0.5 ? '蔬菜' : '水果', // 货物类型
			goodsWeight: Math.floor(Math.random() * 10000), // 货物重量
			entryTime: entryTime, // 入场时间
			entryGate: `西门入口${Math.floor(Math.random() * 3) + 1}`, // 入场岗亭
			verifier: `核验员${Math.floor(Math.random() * 10) + 1}`, // 核验员
			status: Math.random() > 0.3 ? '已核验' : '待核验', // 状态
		});
	}
	tableData.value = mockData;
	total.value = 50;
};

// 组件挂载时获取数据
onMounted(() => {
	fetchData();
});

// 重置搜索表单
const resetSearchForm = () => {
	searchForm.plateNumber = '';
	searchForm.driverName = '';
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
const handleView = (row: TableDataItem) => {
	selectedRow.value = row;
	viewDialogVisible.value = true;
};

// 处理核验
const handleVerify = (row: TableDataItem) => {
	selectedRow.value = row;
	verifyDialogVisible.value = true;
};

// 处理核验提交
const handleVerifySubmit = (form: any) => {
	// 更新表格数据中的状态
	const index = tableData.value.findIndex((item) => item.id === form.id);
	if (index !== -1) {
		tableData.value[index].status = '已核验';
		tableData.value[index].verifier = form.verifier;
	}
	verifyDialogVisible.value = false;
	ElMessage.success('核验成功');
};

// 处理复选框选择变化
const handleSelectionChange = (rows: TableDataItem[]) => {
	selectedRows.value = rows;
};

// 打印功能
const handlePrint = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('请选择需要打印的记录');
		return;
	}
	ElMessage.success(`打印成功，共打印${selectedRows.value.length}条记录`);
};
</script>

<style scoped>
.el-pagination {
	justify-content: right;
}
</style>
