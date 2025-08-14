<template>
	<el-dialog title="入场核验详情" v-model="visible" width="600px">
		<el-descriptions :column="2" border>
			<el-descriptions-item label="入场单号">{{ detail?.entryId }}</el-descriptions-item>
			<el-descriptions-item label="车牌号">{{ detail?.plateNumber }}</el-descriptions-item>
			<el-descriptions-item label="车辆类型">{{ detail?.vehicleType }}</el-descriptions-item>
			<el-descriptions-item label="司机姓名">{{ detail?.driverName }}</el-descriptions-item>
			<el-descriptions-item label="联系电话">{{ detail?.driverPhone }}</el-descriptions-item>
			<el-descriptions-item label="货物类型">{{ detail?.goodsType }}</el-descriptions-item>
			<el-descriptions-item label="货物重量">{{ detail?.goodsWeight }}kg</el-descriptions-item>
			<el-descriptions-item label="入场时间">{{ detail?.entryTime }}</el-descriptions-item>
			<el-descriptions-item label="入场岗亭">{{ detail?.entryGate }}</el-descriptions-item>
			<el-descriptions-item label="核验员">{{ detail?.verifier }}</el-descriptions-item>
			<el-descriptions-item label="状态">
				<el-tag :type="detail?.status === '已核验' ? 'success' : 'warning'">
					{{ detail?.status }}
				</el-tag>
			</el-descriptions-item>
		</el-descriptions>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

<style scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
}
</style>
