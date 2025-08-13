<template>
	<div class="blacklist-container">
		<!-- 确保组件根节点为单个元素，避免 Transition 相关警告，template下不要直接接上注释，会导致路由跳转后白屏（刷新后正常显示） -->
		<el-card>
			<!-- 顶部 - 搜索栏、功能按钮等 -->
			<search-header @search="search" @add="() => (state.addDialogVisible = true)"></search-header>

			<!-- 主要内容 - 列表、表单、图表等 -->
			<blacklist-table :list="state.list" @edit="handleEdit" @del="handleDelete"> </blacklist-table>

			<!-- 底部 - 分页条等 -->
			<pagenation
				v-model:current-page="state.pagenationState.currentPage"
				v-model:page-size="state.pagenationState.pageSize"
				:total="state.pagenationState.total"
				@change="fetchData"
			>
			</pagenation>
		</el-card>

		<!-- 弹窗 - 添加、修改、查看等 -->
		<add-dialog v-model:visible="state.addDialogVisible" @submit="handleAddSubmit"> </add-dialog>

		<delete-dialog v-model:visible="state.delDialogVisible" :data="state.currentRow" @submit="handleDeleteSubmit"> </delete-dialog>

		<edit-dialog v-model:visible="state.editDialogVisible" :data="state.currentRow" @submit="handleEditSubmit"> </edit-dialog>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 引入组件
import AddDialog from './component/addDialog.vue';
import BlacklistTable from './component/blacklistTable.vue';
import DeleteDialog from './component/deleteDialog.vue';
import EditDialog from './component/editDialog.vue';
import Pagenation from './component/pagenation.vue';
import SearchHeader from './component/searchHeader.vue';

const state = reactive({
	// 列表数据
	list: [],
	// 分页参数
	pagenationState: {
		// 总条数
		total: 0,
		// 当前页
		currentPage: 1,
		// 每页条数
		pageSize: 10,
	},
	// 对话框显示状态
	addDialogVisible: false,
	editDialogVisible: false,
	delDialogVisible: false,
	// 当前操作行数据
	currentRow: null,
});

// 搜索处理
const search = (keyword) => {
	console.log('搜索关键字:', keyword);
	// 重置到第一页
	state.pagenationState.currentPage = 1;
	fetchData();
};

// 处理编辑事件
const handleEdit = (row) => {
	state.currentRow = { ...row };
	state.editDialogVisible = true;
};

// 处理删除事件
const handleDelete = (row) => {
	state.currentRow = { ...row };
	state.delDialogVisible = true;
};

// 处理添加提交
const handleAddSubmit = (form) => {
	console.log('添加数据:', form);
	// 模拟添加成功后刷新数据
	fetchData();
};

// 处理删除提交
const handleDeleteSubmit = (id) => {
	console.log('删除ID:', id);
	// 模拟删除成功后刷新数据
	fetchData();
};

// 处理编辑提交
const handleEditSubmit = (form) => {
	console.log('编辑数据:', form);
	// 模拟编辑成功后刷新数据
	fetchData();
};

// 获取数据
const fetchData = () => {
	// 模拟获取数据
	const mockData = [];
	for (let i = 1; i <= state.pagenationState.pageSize; i++) {
		const id = (state.pagenationState.currentPage - 1) * state.pagenationState.pageSize + i;
		if (id > 50) break; // 模拟总共50条数据

		mockData.push({
			id: id,
			plateNumber: `粤A${Math.floor(Math.random() * 100000)}`,
			reason: id % 3 === 0 ? '违规停车' : id % 3 === 1 ? '恶意逃费' : '损坏设施',
			createTime: `2023-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
			operator: id % 4 === 0 ? '张三' : id % 4 === 1 ? '李四' : id % 4 === 2 ? '王五' : '赵六',
		});
	}

	state.list = mockData;
	state.pagenationState.total = 50; // 模拟总共有50条数据
};

// 组件挂载时获取数据
onMounted(() => {
	fetchData();
});
</script>
