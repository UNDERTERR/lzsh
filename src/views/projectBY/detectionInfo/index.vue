<template>
	<div class="detection-info">
		<el-card>
			<!-- 搜索区域 -->
			<el-form :inline="true" :model="searchForm" size="default">
				<el-form-item label="商户名称">
					<el-input v-model="searchForm.merchantName" placeholder="请输入商户名称" />
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="searchForm.productName" placeholder="请输入商品名称" />
				</el-form-item>
				<el-form-item label="检测日期">
					<el-date-picker
						v-model="searchForm.dateRange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="fetchData">查询</el-button>
					<el-button @click="resetSearchForm">重置</el-button>
					<!-- 报告下载按钮 -->
					<el-button type="success" @click="downloadReport">报告下载</el-button>
				</el-form-item>
			</el-form>

			<!-- 表格区域 -->
			<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="merchantName" label="商户名称" />
				<el-table-column prop="productName" label="商品名称" />
				<el-table-column prop="productType" label="商品类型" />
				<el-table-column prop="testItem" label="检测项目" />
				<el-table-column prop="testValue" label="检测值(%)">
					<template #default="scope">
						{{ scope.row.testValue }}
					</template>
				</el-table-column>
				<el-table-column prop="testResult" label="检测结果" />
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
		<edit-dialog v-model:visible="editDialogVisible" :data="selectedRow" @submit="handleEditSubmit" />
		<delete-dialog v-model:visible="deleteDialogVisible" :data="selectedRow" @submit="handleDeleteSubmit" />
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import EditDialog from './component/editDialog.vue';
import DeleteDialog from './component/deleteDialog.vue';
import { ElMessage } from 'element-plus';

// 定义表格数据的接口
interface TableDataItem {
	id: number;
	merchantName: string;
	productName: string;
	productType: string;
	testItem: string;
	testValue: number;
	testResult: string;
}

// 搜索表单数据
const searchForm = reactive({
	merchantName: '',
	productName: '',
	dateRange: [] as any[],
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
const editDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const selectedRow = ref<TableDataItem>();

// 获取数据 - 随机模拟数据
const fetchData = () => {
	const mockData: TableDataItem[] = [];
	for (let i = 1; i <= pageSize.value; i++) {
		const id = (currentPage.value - 1) * pageSize.value + i;
		if (id > 50) break; // 模拟总共50条数据

		mockData.push({
			id: id,
			merchantName: `商户${id}`,
			productName: `商品${id}`,
			productType: id % 3 === 0 ? '蔬菜' : id % 3 === 1 ? '水果' : '肉类',
			testItem: '有机磷及氨基甲酸酯类农药残留',
			testValue: parseFloat((Math.random() * 10).toFixed(2)),
			testResult: Math.random() > 0.1 ? '合格' : '不合格',
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
	searchForm.productName = '';
	searchForm.dateRange = [];
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

// 处理编辑事件
const handleEdit = (row: TableDataItem) => {
	selectedRow.value = row; // 直接引用，不复制对象
	editDialogVisible.value = true;
};

// 处理删除事件
const handleDelete = (row: TableDataItem) => {
	selectedRow.value = row; // 直接引用，不复制对象
	deleteDialogVisible.value = true;
};

// 处理删除提交
const handleDeleteSubmit = (row: TableDataItem) => {
	// 通过ID匹配来删除数据，而不是直接比较对象引用
	tableData.value = tableData.value.filter((item) => item.id !== row.id);
	ElMessage.success('删除成功');
};

// 处理编辑提交
const handleEditSubmit = (form: TableDataItem) => {
	// 通过ID匹配来更新数据，而不是直接比较对象引用
	const index = tableData.value.findIndex((item) => item.id === form.id);
	if (index !== -1) {
		tableData.value[index] = form;
	}
	editDialogVisible.value = false;
	ElMessage.success('修改成功');
};

// 处理复选框选择变化
const handleSelectionChange = (rows: TableDataItem[]) => {
	selectedRows.value = rows;
};

// 报告下载
const downloadReport = () => {
	if (selectedRows.value.length === 0) {
		ElMessage.warning('请选择需要下载的记录');
		return;
	}
	ElMessage.success(`报告下载成功，共下载${selectedRows.value.length}条记录`);
};
</script>

<style scoped>
.el-pagination {
	justify-content: right;
}
</style>
