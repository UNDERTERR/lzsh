<template>
	<el-dialog title="车辆核验" v-model="visible" width="500px">
		<el-form :model="form" label-width="100px" size="default">
			<el-form-item label="入场单号">
				<el-input v-model="form.entryId" disabled />
			</el-form-item>
			<el-form-item label="车牌号">
				<el-input v-model="form.plateNumber" disabled />
			</el-form-item>
			<el-form-item label="司机姓名">
				<el-input v-model="form.driverName" disabled />
			</el-form-item>
			<el-form-item label="货物类型">
				<el-input v-model="form.goodsType" disabled />
			</el-form-item>
			<el-form-item label="货物重量">
				<el-input v-model="form.goodsWeight" disabled>
					<template #append>kg</template>
				</el-input>
			</el-form-item>
			<el-form-item label="核验员" prop="verifier" :rules="[{ required: true, message: '请输入核验员', trigger: 'blur' }]">
				<el-input v-model="form.verifier" placeholder="请输入核验员" />
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" :rows="3" />
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
import type { FormInstance } from 'element-plus';

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

const formRef = ref<FormInstance>();
const form = ref({
	id: 0,
	entryId: '',
	plateNumber: '',
	driverName: '',
	goodsType: '',
	goodsWeight: 0,
	verifier: '',
	remark: '',
});

const visible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

watch(
	() => props.data,
	(newVal) => {
		if (newVal) {
			form.value = {
				id: newVal.id,
				entryId: newVal.entryId,
				plateNumber: newVal.plateNumber,
				driverName: newVal.driverName,
				goodsType: newVal.goodsType,
				goodsWeight: newVal.goodsWeight,
				verifier: '',
				remark: '',
			};
		}
	},
	{ immediate: true }
);

const handleSubmit = async () => {
	if (!formRef.value) return;

	await formRef.value.validate((valid) => {
		if (valid) {
			emit('submit', form.value);
		}
	});
};
</script>

<style scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}
</style>
