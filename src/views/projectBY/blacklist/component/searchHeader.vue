<template>
	<div class="mb15">
		<!-- 搜索区域 -->
		<span>车牌号：</span>
		<el-input
			size="default"
			placeholder="请输入车牌号"
			v-model="searchKeyword"
			class="search-input"
			clearable
			@keyup.enter="handleSearch"
			style="max-width: 180px"
		>
		</el-input>

		<el-button size="default" class="ml10" type="primary" @click="handleSearch" icon="ele-Search" :loading="searchLoading"> 查询 </el-button>
		<el-button size="default" class="ml10" type="warning" @click="handleAdd" icon="ele-Plus"> 添加 </el-button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['search', 'add']);

// 搜索关键词
const searchKeyword = ref('');

// 搜索加载状态
const searchLoading = ref(false);

// 防抖和节流相关变量
let debounceTimer: NodeJS.Timeout | null = null;
let throttleTimer: NodeJS.Timeout | null = null;
const throttleDelay = 300; // 节流延迟时间（毫秒）
const debounceDelay = 800; // 防抖延迟时间（毫秒）
/* 
// 输入处理（防抖）
const handleInput = () => {
	// 清除之前的防抖定时器
	if (debounceTimer) {
		clearTimeout(debounceTimer);
	}

	// 设置新的防抖定时器
	debounceTimer = setTimeout(() => {
		// 执行搜索
		performSearch();
	}, debounceDelay);
};
 */
// 搜索处理（节流）
const handleSearch = () => {
	// 如果已有节流定时器，则直接返回
	if (throttleTimer) {
		return;
	}

	// 设置节流定时器
	throttleTimer = setTimeout(() => {
		// 清除节流定时器
		if (throttleTimer) {
			clearTimeout(throttleTimer);
			throttleTimer = null;
		}
	}, throttleDelay);

	// 执行搜索
	performSearch();
};

// 执行实际搜索
const performSearch = () => {
	searchLoading.value = true;

	// 模拟搜索过程
	setTimeout(() => {
		emit('search', searchKeyword.value);
		searchLoading.value = false;
	}, 500);
};

// 触发添加事件
const handleAdd = () => {
	emit('add');
};
</script>
