<template>
	<el-dialog title="修改检测信息" v-model="visible" width="500px">
		<el-form :model="form" label-width="100px" size="default">
			<el-form-item label="商户名称">
				<el-input v-model="form.merchantName" placeholder="请输入商户名称" />
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="form.productName" placeholder="请输入商品名称" />
			</el-form-item>
			<el-form-item label="检测项目">
				<el-input v-model="form.testItem" placeholder="请输入检测项目" />
			</el-form-item>
			<el-form-item label="检测值(%)">
				<el-input v-model="form.testValue" placeholder="请输入检测值" />
			</el-form-item>
			<el-form-item label="检测结果">
				<el-input v-model="form.testResult" placeholder="请输入检测结果" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	data: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(['update:visible', 'submit']);

const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

const form = ref<any>({
	id: 0,
	merchantName: '',
	productName: '',
	testItem: '',
	testValue: '',
	testResult: '',
});

watch(
	() => props.data,
	(newVal) => {
		if (newVal) {
			// 浅拷贝对象，保留ID等属性
			form.value = { ...newVal };
		}
	},
	{ immediate: true }
);

const handleSubmit = () => {
	emit('submit', form.value);
	visible.value = false;
};
</script>