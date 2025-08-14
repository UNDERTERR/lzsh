<template>
	<el-dialog title="退费记录详情" v-model="visible" width="600px">
		<el-descriptions :column="2" border>
			<el-descriptions-item label="单据号">{{ detail?.transactionId }}</el-descriptions-item>
			<el-descriptions-item label="车牌号码">{{ detail?.plateNumber }}</el-descriptions-item>
			<el-descriptions-item label="车辆类型">{{ detail?.vehicleType }}</el-descriptions-item>
			<el-descriptions-item label="费用类型">{{ detail?.feeType }}</el-descriptions-item>
			<el-descriptions-item label="入场时间">{{ detail?.entryTime }}</el-descriptions-item>
			<el-descriptions-item label="入场毛重(kg)">{{ detail?.entryWeight }}</el-descriptions-item>
			<el-descriptions-item label="入场收费(元)">{{ detail?.entryFee }}</el-descriptions-item>
			<el-descriptions-item label="支付方式">{{ detail?.paymentMethod }}</el-descriptions-item>
			<el-descriptions-item label="出场时间">{{ detail?.exitTime }}</el-descriptions-item>
			<el-descriptions-item label="计费重量(kg)">{{ detail?.exitWeight }}</el-descriptions-item>
			<el-descriptions-item label="出场退费(元)">{{ detail?.exitFee }}</el-descriptions-item>
			<el-descriptions-item label="停留时长">{{ detail?.parkingDuration }}</el-descriptions-item>
			<el-descriptions-item label="停车费金额(元)">{{ detail?.parkingFee }}</el-descriptions-item>
			<el-descriptions-item label="退费金额(元)">{{ detail?.refundAmount }}</el-descriptions-item>
			<el-descriptions-item label="退费方式">{{ detail?.refundMethod }}</el-descriptions-item>
			<el-descriptions-item label="订单状态">{{ detail?.orderStatus }}</el-descriptions-item>
			<el-descriptions-item label="退费员">{{ detail?.refundOperator }}</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="visible = false">确定</el-button>
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
	detail: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(['update:visible']);

const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});
</script>
