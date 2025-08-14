<template>
	<el-dialog title="更多筛选" v-model="visible" width="500px">
		<el-form :model="form" label-width="100px" size="default">
			<el-form-item label="商户名称">
				<el-input v-model="form.merchantName" placeholder="请输入商户名称" />
			</el-form-item>
			<el-form-item label="货物类型">
				<el-select v-model="form.goodsType" placeholder="请选择货物类型" clearable>
					<el-option label="蔬菜" value="蔬菜" />
					<el-option label="水果" value="水果" />
					<el-option label="肉类" value="肉类" />
					<el-option label="水产" value="水产" />
				</el-select>
			</el-form-item>
			<el-form-item label="货物名称">
				<el-input v-model="form.goodsName" placeholder="请输入货物名称" />
			</el-form-item>
			<el-form-item label="供应商">
				<el-input v-model="form.supplier" placeholder="请输入供应商" />
			</el-form-item>
			<el-form-item label="检验状态">
				<el-select v-model="form.status" placeholder="请选择检验状态" clearable>
					<el-option label="待检验" value="待检验" />
					<el-option label="已检验" value="已检验" />
					<el-option label="已完成" value="已完成" />
				</el-select>
			</el-form-item>
			<el-form-item label="到货时间">
				<el-date-picker v-model="form.timeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
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
import { reactive, computed } from 'vue';

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:visible', 'submit']);

const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

const form = reactive({
	merchantName: '',
	goodsType: '',
	goodsName: '',
	supplier: '',
	status: '',
	timeRange: [],
});

const handleSubmit = () => {
	emit('submit', { ...form });
	emit('update:visible', false);
};
</script>

<style scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
