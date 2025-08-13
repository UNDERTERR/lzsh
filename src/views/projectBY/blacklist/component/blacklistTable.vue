<template>
	<div class="blacklist-table">
		<el-table :data="props.list" style="width: 100%" border>
			<el-table-column prop="id" label="ID" width="80" />
			<el-table-column prop="plateNumber" label="车牌号" />
			<el-table-column prop="reason" label="加入原因" />
			<el-table-column prop="createTime" label="加入时间" />
			<el-table-column prop="operator" label="操作人" />
			<el-table-column label="操作" width="150">
				<template #default="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
// 定义传入的属性
const props = defineProps<{
	list: Array<any>;
}>();

// 定义触发的事件
const emit = defineEmits<{
	(e: 'edit', row: any): void;
	(e: 'del', row: any): void;
}>();

// 处理编辑事件
const handleEdit = (row: any) => {
	emit('edit', row);
};

// 处理删除事件
const handleDelete = (row: any) => {
	emit('del', row);
};
</script>
