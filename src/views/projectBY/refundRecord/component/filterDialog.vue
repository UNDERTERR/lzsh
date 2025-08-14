<template>
	<el-dialog title="更多筛选" v-model="visible" width="500px">
		<el-form :model="form" label-width="100px" size="default">
			<el-form-item label="车牌号">
				<el-input v-model="form.licensePlateNum" placeholder="请输入车牌号" />
			</el-form-item>
			<el-form-item label="单据号">
				<el-input v-model="form.invoiceNum" placeholder="请输入单据号" />
			</el-form-item>
			<el-form-item label="退费人员">
				<el-input v-model="form.refundOperator" placeholder="请输入退费员" />
			</el-form-item>
			<el-form-item label="退费方式">
				<el-select v-model="form.refundMethod" placeholder="请选择退费方式">
					<el-option label="全部" value="" />
					<el-option label="原路退回" value="原路退回" />
					<el-option label="现金退款" value="现金退款" />
				</el-select>
			</el-form-item>
			<el-form-item label="订单状态">
				<el-select v-model="form.orderStatus" placeholder="请选择订单状态">
					<el-option label="全部" value="" />
					<el-option label="已完成" value="已完成" />
					<el-option label="待处理" value="待处理" />
				</el-select>
			</el-form-item>
			<el-form-item label="退费时间">
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
import { ref, computed } from 'vue';

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

const form = ref({
	licensePlateNum: '',
	invoiceNum: '',
	refundOperator: '',
	refundMethod: '',
	orderStatus: '',
	timeRange: [],
});

const handleSubmit = () => {
	emit('submit', form.value);
	emit('update:visible', false);
};
</script>
