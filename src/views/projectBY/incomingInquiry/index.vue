<template>
	<div class="incoming-inquiry">
		<el-card>
			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" size="default">
				<el-form-item label="商户名称">
					<el-input v-model="searchForm.merchantName" placeholder="请输入商户名称" />
				</el-form-item>
				<el-form-item label="货物类型">
					<el-input v-model="searchForm.goodsType" placeholder="请输入货物类型" />
				</el-form-item>
				<el-form-item label="到货时间">
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
					<el-button type="success" @click="handleBatchPrint">打印</el-button>
				</el-form-item>
			</el-form>

			<!-- 表格区域 -->
			<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="incomingId" label="到货单号" width="180" />
				<el-table-column prop="merchantName" label="商户名称" width="100" />
				<el-table-column prop="contactPerson" label="联系人" width="120" />
				<el-table-column prop="contactPhone" label="联系电话" width="120" />
				<el-table-column prop="goodsType" label="货物类型" width="120" />
				<el-table-column prop="goodsName" label="货物名称" width="150" />
				<el-table-column prop="quantity" label="数量" width="100" />
				<el-table-column prop="unit" label="单位" width="80" />
				<el-table-column prop="arrivalTime" label="到货时间" width="180" />
				<el-table-column prop="supplier" label="供应商" width="150" />
				<el-table-column prop="inspector" label="检验员" width="120" />
				<el-table-column prop="status" label="状态" width="120">
					<template #default="scope">
						<el-tag :type="getTagType(scope.row.status)">
							{{ scope.row.status }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button size="small" @click="handleView(scope.row)">查看</el-button>
						<el-button size="small" type="primary" @click="handlePrint(scope.row)">打印</el-button>
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
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import FilterDialog from './component/filterDialog.vue';
import ViewDialog from './component/viewDialog.vue';
import { ElMessage } from 'element-plus';

// 定义表格数据的接口
interface TableDataItem {
	id: number;
	incomingId: string;
	merchantName: string;
	contactPerson: string;
	contactPhone: string;
	goodsType: string;
	goodsName: string;
	quantity: number;
	unit: string;
	arrivalTime: string;
	supplier: string;
	inspector: string;
	status: string;
}

// 搜索表单数据
const searchForm = reactive({
	merchantName: '',
	goodsType: '',
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
const selectedRow = ref<TableDataItem | null>(null);

// 获取数据 - 随机模拟数据
const fetchData = () => {
	const mockData: TableDataItem[] = [];
	for (let i = 1; i <= pageSize.value; i++) {
		const id = (currentPage.value - 1) * pageSize.value + i;
		if (id > 50) break; // 模拟总共50条数据

		// 生成随机到货时间
		const hours = Math.floor(Math.random() * 24);
		const arrivalTime = `2025-08-08 ${hours}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`;

		mockData.push({
			id: id,
			incomingId: `DH250808${String(id).padStart(4, '0')}`, // 到货单号
			merchantName: `商户${Math.floor(Math.random() * 100) + 1}`, // 商户名称
			contactPerson: `联系人${Math.floor(Math.random() * 100) + 1}`, // 联系人
			contactPhone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 1000000000)
				.toString()
				.padStart(10, '0')}`, // 联系电话
			goodsType: Math.random() > 0.5 ? '蔬菜' : '水果', // 货物类型
			goodsName: Math.random() > 0.5 ? (Math.random() > 0.5 ? '西红柿' : '黄瓜') : Math.random() > 0.5 ? '苹果' : '香蕉', // 货物名称
			quantity: Math.floor(Math.random() * 1000) + 50, // 数量
			unit: Math.random() > 0.5 ? '公斤' : '箱', // 单位
			arrivalTime: arrivalTime, // 到货时间
			supplier: `供应商${Math.floor(Math.random() * 50) + 1}`, // 供应商
			inspector: `检验员${Math.floor(Math.random() * 10) + 1}`, // 检验员
			status: Math.random() > 0.7 ? '待检验' : Math.random() > 0.4 ? '已检验' : '已完成', // 状态
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
	searchForm.merchantName = '';
	searchForm.goodsType = '';
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

// 获取标签类型
const getTagType = (status: string) => {
	switch (status) {
		case '已完成':
			return 'success';
		case '已检验':
			return '';
		case '待检验':
			return 'warning';
		default:
			return 'info';
	}
};

// 处理打印
const handlePrint = (row: TableDataItem) => {
	ElMessage.success(`正在打印到货单 ${row.incomingId}`);
};

// 处理批量打印
const handleBatchPrint = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('请选择需要打印的记录');
		return;
	}
	ElMessage.success(`正在打印 ${selectedRows.value.length} 条到货记录`);
};

// 处理复选框选择变化
const handleSelectionChange = (rows: TableDataItem[]) => {
	selectedRows.value = rows;
};
</script>

<style scoped>
.el-pagination {
	justify-content: right;
}
</style>
