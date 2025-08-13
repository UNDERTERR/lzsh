<template>
	<el-dialog v-model="visible" title="编辑黑名单" width="500px" @close="handleClose">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="车牌号" prop="plateNumber">
				<el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
			</el-form-item>
			<el-form-item label="加入原因" prop="reason">
				<el-input v-model="form.reason" type="textarea" placeholder="请输入加入黑名单的原因" :rows="3" />
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

// 定义传入的属性
const props = defineProps<{
	visible: boolean;
	data: any;
}>();

// 定义触发的事件
const emit = defineEmits<{
	(e: 'update:visible', value: boolean): void;
	(e: 'submit', form: FormData): void;
}>();

// 使用计算属性实现v-model双向绑定
const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

// 表单引用
const formRef = ref<FormInstance>();

// 加载状态
const loading = ref(false);

// 表单数据
const form = reactive<FormData>({
	id: 0,
	plateNumber: '',
	reason: '',
});

// 表单类型定义
interface FormData {
	id: number;
	plateNumber: string;
	reason: string;
}

// 表单验证规则
const rules = reactive<FormRules>({
	plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
	reason: [{ required: true, message: '请输入加入原因', trigger: 'blur' }],
});

// 监听data变化，更新表单（这个watch是必要的，因为需要同步外部数据到本地表单）
watch(
	() => props.data,
	(newVal) => {
		if (newVal) {
			form.id = newVal.id || 0;
			form.plateNumber = newVal.plateNumber || '';
			form.reason = newVal.reason || '';
		}
	},
	{ immediate: true }
);

// 关闭对话框
const handleClose = () => {
	visible.value = false;
	// 重置表单
	formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			loading.value = true;

			// 模拟提交数据
			setTimeout(() => {
				emit('submit', { ...form });
				loading.value = false;
				handleClose();
			}, 1000);
		}
	});
};
</script>

<style scoped lang="scss">
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
