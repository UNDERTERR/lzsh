<template>
	<el-dialog v-model="visible" title="删除确认" width="400px" @close="handleClose">
		<div class="delete-content">
			<el-alert title="确定要删除这条黑名单记录吗？" type="warning" show-icon :closable="false" />
			<div class="delete-info" v-if="data">
				<p><span class="label">车牌号：</span>{{ data.plateNumber }}</p>
				<p><span class="label">加入原因：</span>{{ data.reason }}</p>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="danger" @click="handleSubmit" :loading="loading">确定删除</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义传入的属性
const props = defineProps<{
	visible: boolean;
	data: any;
}>();

// 定义触发的事件
const emit = defineEmits<{
	(e: 'update:visible', value: boolean): void;
	(e: 'submit', id: number): void;
}>();

// 使用计算属性实现v-model双向绑定
const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

// 加载状态
const loading = ref(false);

// 关闭对话框
const handleClose = () => {
	visible.value = false;
};

// 提交删除
const handleSubmit = () => {
	if (!props.data) return;

	loading.value = true;

	// 模拟删除操作
	setTimeout(() => {
		emit('submit', props.data.id);
		loading.value = false;
		handleClose();
	}, 1000);
};
</script>

<style scoped lang="scss">
.delete-content {
	.delete-info {
		margin-top: 20px;
		padding: 15px;
		background-color: var(--el-fill-color-light);
		border-radius: 4px;

		p {
			margin: 5px 0;
			.label {
				font-weight: bold;
			}
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
