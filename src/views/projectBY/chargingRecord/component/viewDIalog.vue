<template>
	<el-dialog v-model="visibleProxy" title="查看" width="50%">
		<el-descriptions :column="2" border>
			<el-descriptions-item label="单据号">{{ detail?.transactionId }}</el-descriptions-item>
			<el-descriptions-item label="车牌号">{{ detail?.plateNumber }}</el-descriptions-item>
			<el-descriptions-item label="费用类型">{{ detail?.feeType }}</el-descriptions-item>
			<el-descriptions-item label="入场时间">{{ detail?.entryTime }}</el-descriptions-item>
			<el-descriptions-item label="停车时长">{{ detail?.parkingDuration }}</el-descriptions-item>
			<el-descriptions-item label="岗亭">{{ detail?.boothName }}</el-descriptions-item>
			<el-descriptions-item label="交易时间">{{ detail?.transactionTime }}</el-descriptions-item>
			<el-descriptions-item label="车辆类型">{{ detail?.vehicleType }}</el-descriptions-item>
			<el-descriptions-item label="订单状态">{{ detail?.orderStatus }}</el-descriptions-item>
			<el-descriptions-item label="出场时间">{{ detail?.exitTime }}</el-descriptions-item>
			<el-descriptions-item label="收费">{{ detail?.cost }}</el-descriptions-item>
			<el-descriptions-item label="收费员">{{ detail?.cashier }}</el-descriptions-item>
			<el-descriptions-item label="支付方式">{{ detail?.paymentMethod }}</el-descriptions-item>
			<el-descriptions-item label="支付状态">{{ detail?.paymentStatus }}</el-descriptions-item>
			<el-descriptions-item label="出场拍照" :span="2">
				<img v-if="detail?.exitPhoto" :src="detail.exitPhoto" alt="出场照片" style="max-width: 100%; max-height: 200px" />
				<span v-else>无照片</span>
			</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visibleProxy = false">取消</el-button>
				<el-button type="primary" @click="visibleProxy = false">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义组件属性接口
interface TableDataItem {
	transactionId: string; // 单据号
	plateNumber: string; // 车牌号码
	vehicleType: string; // 车辆类型
	feeType: string; // 费用类型
	plateType: string; // 车牌类型
	cost: string; // 费用
	paymentMethod: string; // 支付方式
	paymentStatus: string; // 支付状态
	orderStatus: string; // 订单状态
	transactionTime: string; // 交易时间
	boothName: string; // 岗亭名称
	cashier: string; // 收银员
	entryTime?: string; // 入场时间
	exitTime?: string; // 出场时间
	parkingDuration?: string; // 停车时长
	exitPhoto?: string; // 出场照片
}

const props = defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
	detail: {
		type: Object as () => TableDataItem,
		default: () => ({}),
	},
});

const emit = defineEmits(['update:visible']);

// 使用计算属性实现v-model双向绑定，避免额外的状态管理
const visibleProxy = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});
</script>
