<template>
	<el-dialog title="更多筛选" v-model="visible" width="500px">
		<el-form :model="form" label-width="100px" size="default">
			<el-form-item label="车牌号">
				<el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
			</el-form-item>
			<el-form-item label="司机姓名">
				<el-input v-model="form.driverName" placeholder="请输入司机姓名" />
			</el-form-item>
			<el-form-item label="车辆类型">
				<el-select v-model="form.vehicleType" placeholder="请选择车辆类型" clearable>
					<el-option label="货车" value="货车" />
					<el-option label="小货车" value="小货车" />
				</el-select>
			</el-form-item>
			<el-form-item label="货物类型">
				<el-select v-model="form.goodsType" placeholder="请选择货物类型" clearable>
					<el-option label="蔬菜" value="蔬菜" />
					<el-option label="水果" value="水果" />
				</el-select>
			</el-form-item>
			<el-form-item label="核验状态">
				<el-select v-model="form.status" placeholder="请选择核验状态" clearable>
					<el-option label="已核验" value="已核验" />
					<el-option label="待核验" value="待核验" />
				</el-select>
			</el-form-item>
			<el-form-item label="入场时间">
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
	plateNumber: '',
	driverName: '',
	vehicleType: '',
	goodsType: '',
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
