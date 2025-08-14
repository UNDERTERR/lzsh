<template>
	<el-dialog title="到货详情" v-model="visibleProxy" width="600px">
		<el-descriptions :column="2" border>
			<el-descriptions-item label="到货单号">{{ detail?.incomingId }}</el-descriptions-item>
			<el-descriptions-item label="商户名称">{{ detail?.merchantName }}</el-descriptions-item>
			<el-descriptions-item label="联系人">{{ detail?.contactPerson }}</el-descriptions-item>
			<el-descriptions-item label="联系电话">{{ detail?.contactPhone }}</el-descriptions-item>
			<el-descriptions-item label="货物类型">{{ detail?.goodsType }}</el-descriptions-item>
			<el-descriptions-item label="货物名称">{{ detail?.goodsName }}</el-descriptions-item>
			<el-descriptions-item label="数量">{{ detail?.quantity }} {{ detail?.unit }}</el-descriptions-item>
			<el-descriptions-item label="到货时间">{{ detail?.arrivalTime }}</el-descriptions-item>
			<el-descriptions-item label="供应商">{{ detail?.supplier }}</el-descriptions-item>
			<el-descriptions-item label="检验员">{{ detail?.inspector }}</el-descriptions-item>
			<el-descriptions-item label="状态">
				<el-tag :type="getTagType(detail?.status)">
					{{ detail?.status }}
				</el-tag>
			</el-descriptions-item>
		</el-descriptions>
		
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visibleProxy = false">关闭</el-button>
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

const visibleProxy = computed({
	get() {
		return props.visible;
	},
	set(val) {
		emit('update:visible', val);
	},
});

// 获取标签类型
const getTagType = (status: string | undefined) => {
	switch (status) {
		case '已完成':
			return 'success';
		case '已检验':
			return 'primary';
		case '待检验':
			return 'warning';
		default:
			return 'info';
	}
};
</script>

<style scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
}
</style>