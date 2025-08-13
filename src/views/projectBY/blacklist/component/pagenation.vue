<template>
	<div class="pagenation-container">
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			class="mt15"
			:page-sizes="[10, 20, 50, 100]"
			:small="false"
			:disabled="false"
			:background="true"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// 定义传入的属性
const props = defineProps<{
	total: number;
	currentPage: number;
	pageSize: number;
}>();

// 定义触发的事件
const emit = defineEmits<{
	// ts专属写法 e：事件， value：传递的值
	(e: 'update:currentPage', value: number): void;
	(e: 'update:pageSize', value: number): void;
	(e: 'change'): void;
}>();

// 当前页码
const currentPage = ref(props.currentPage);

// 每页条数
const pageSize = ref(props.pageSize);

// 监听每页条数变化
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	emit('update:pageSize', val);
	emit('change');
};

// 监听当前页变化
const handleCurrentChange = (val: number) => {
	currentPage.value = val;
	emit('update:currentPage', val);
	emit('change');
};
</script>

<style scoped lang="scss">
.pagenation-container {
	display: flex;
	justify-content: right;
}
</style>
