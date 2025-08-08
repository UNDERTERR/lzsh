<template>
  <el-dialog v-model="visible" title="编辑车辆信息" width="600px" :before-close="handleClose">
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules" size="small">
      <el-form-item label="车牌号" prop="plateNumber" required>
        <el-input v-model="formData.plateNumber" maxlength="20" />
      </el-form-item>

      <el-form-item label="车辆类型" prop="vehicleType" required>
        <el-select v-model="formData.vehicleType" placeholder="请选择车辆类型">
          <el-option label="小型汽车" value="小型汽车" />
          <el-option label="货车" value="货车" />
          <el-option label="电动车" value="电动车" />
          <!-- 其他类型 -->
        </el-select>
      </el-form-item>

      <el-form-item label="车主" prop="ownerName" required>
        <el-input v-model="formData.ownerName" maxlength="30" />
      </el-form-item>

      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber" maxlength="15" />
      </el-form-item>

      <!-- 这里你可以根据需要继续添加表单项 -->

    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, toRefs, defineProps, defineEmits } from 'vue';
import type { FormInstance } from 'element-plus';

interface VehicleForm {
  plateNumber: string;
  vehicleType: string;
  ownerName: string;
  phoneNumber: string;
  // 你可以继续添加字段
}

const props = defineProps<{
  modelValue: boolean;
  row: VehicleForm;
}>();

const emit = defineEmits(['update:modelValue', 'save']);

const visible = ref(props.modelValue);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 初始化表单数据，防止直接修改传入的props
const formData = reactive<VehicleForm>({
  plateNumber: '',
  vehicleType: '',
  ownerName: '',
  phoneNumber: '',
});

// 表单校验规则
const rules = {
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  vehicleType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
  ownerName: [{ required: true, message: '请输入车主姓名', trigger: 'blur' }],
};

watch(() => props.modelValue, (val) => {
  visible.value = val;
  if (val) {
    // 打开弹窗时初始化表单数据（深拷贝避免双向绑定修改props）
    Object.assign(formData, props.row || {
      plateNumber: '',
      vehicleType: '',
      ownerName: '',
      phoneNumber: '',
    });
  }
});

watch(visible, (val) => {
  emit('update:modelValue', val);
});

const handleCancel = () => {
  visible.value = false;
};

const handleClose = (done: () => void) => {
  if (!loading.value) done();
};

const handleSave = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      // 模拟异步保存操作，比如请求接口
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 保存成功后发事件给父组件
      emit('save', { ...formData });

      visible.value = false;
    } catch (error) {
      // 处理错误
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped></style>
