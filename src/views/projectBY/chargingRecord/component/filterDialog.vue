<template>
	<el-dialog v-model="visibleProxy" title="更多筛选" width="50%">
		<el-form :model="formData" label-width="120px">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="交易时间:">
						<el-date-picker
							v-model="formData.timeRange"
							type="daterange"
							range-separator="至"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							style="width: 100%"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="单据号:">
						<el-input v-model="formData.invoiceNum" placeholder="请输入单据号" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="车牌号:">
						<el-input v-model="formData.licensePlateNum" placeholder="请输入车牌号" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="费用类型:">
						<el-select v-model="formData.feeType" placeholder="请选择费用类型" clearable style="width: 100%">
							<el-option label="私家车出场收费" value="私家车出场收费" />
							<el-option label="货车出场收费" value="货车出场收费" />
							<el-option label="月租车出场收费" value="月租车出场收费" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="支付方式:">
						<el-select v-model="formData.paymentMethod" placeholder="请选择支付方式" clearable style="width: 100%">
							<el-option label="扫码支付" value="扫码支付" />
							<el-option label="现金支付" value="现金支付" />
							<el-option label="ETC支付" value="ETC支付" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="支付状态:">
						<el-select v-model="formData.paymentStatus" placeholder="请选择支付状态" clearable style="width: 100%">
							<el-option label="已支付" value="已支付" />
							<el-option label="未支付" value="未支付" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="车辆类型:">
						<el-select v-model="formData.vehicleType" placeholder="请选择车辆类型" clearable style="width: 100%">
							<el-option label="私家车" value="私家车" />
							<el-option label="货车" value="货车" />
							<el-option label="客车" value="客车" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="订单状态:">
						<el-select v-model="formData.orderStatus" placeholder="请选择订单状态" clearable style="width: 100%">
							<el-option label="已完成" value="已完成" />
							<el-option label="待支付" value="待支付" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="岗亭:">
						<el-select v-model="formData.boothName" placeholder="请选择岗亭" clearable style="width: 100%">
							<el-option label="混合西门出口4" value="混合西门出口4" />
							<el-option label="混合南门入口1" value="混合南门入口1" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="收费员:">
						<el-input v-model="formData.cashier" placeholder="请输入收费员" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">重置</el-button>
				<el-button @click="visibleProxy = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

const props = defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(['update:visible', 'submit']);

// 使用计算属性实现v-model双向绑定，避免额外的状态管理
const visibleProxy = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

const formData = reactive({
	timeRange: [],
	invoiceNum: '',
	licensePlateNum: '',
	feeType: '',
	paymentMethod: '',
	paymentStatus: '',
	vehicleType: '',
	orderStatus: '',
	boothName: '',
	cashier: '',
});

const submitForm = () => {
	emit('submit', formData);
	visibleProxy.value = false;
};

// 重置表单
const resetForm = () => {
	formData.timeRange = [];
	formData.invoiceNum = '';
	formData.licensePlateNum = '';
	formData.feeType = '';
	formData.paymentMethod = '';
	formData.paymentStatus = '';
	formData.vehicleType = '';
	formData.orderStatus = '';
	formData.boothName = '';
	formData.cashier = '';
};
</script>

<style scoped lang="scss">
.el-row {
	margin-bottom: 20px;
}

.el-row:last-child {
	margin-bottom: 0;
}
</style>
