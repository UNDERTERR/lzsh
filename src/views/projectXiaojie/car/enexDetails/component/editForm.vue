<template>
  <el-dialog v-model="visible" title="编辑车辆信息" width="600px" :before-close="handleClose">
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules" size="small">
      <el-form-item label="车牌号" prop="plateNumber" required>
        <el-input v-model="formData.plateNumber" maxlength="20" />
      </el-form-item>

      <el-form-item label="车辆类型" prop="vehicleType" required>
        <el-select v-model="formData.vehicleType" placeholder="请选择车辆类型">
          <el-option label="私家车" value="私家车" />
          <el-option label="未载货车" value="未载货车" />
          <el-option label="载货车" value="载货车" />
          <!-- 其他类型 -->
        </el-select>
      </el-form-item>

      <el-form-item label="车主" prop="ownerName" required>
        <el-input v-model="formData.ownerName" maxlength="30" />
      </el-form-item>

      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber" maxlength="15" />
      </el-form-item>


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
import { useCarApi } from '/@/api/projectXiaojie/car';
import { verifyPhone,verifyTelPhone } from '/@/utils/toolsValidate';
interface VehicleForm {
  billNo: string;
  plateNumber: string;
  vehicleType: string;
  ownerName: string;
  phoneNumber: string;
  // 你可以继续添加字段
}

const props = defineProps<{
  show: boolean;
  row: VehicleForm;
}>();

const emit = defineEmits(['update:show', 'edited']);

// 初始化表单数据，防止直接修改传入的props
const formData = reactive<VehicleForm>({
  billNo: '',
  plateNumber: '',
  vehicleType: '',
  ownerName: '',
  phoneNumber: '',
});

const rules = {
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  vehicleType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
  ownerName: [{ required: true, message: '请输入车主姓名', trigger: 'blur' }],
  phoneNumber: [
  { 
    validator: (rule:any, value:any, callback:any) => {
      if (!value) {
        // 可选项，没填直接通过
        return callback();
      }
      if (!verifyPhone(value) || !verifyTelPhone(value)) {
        callback(new Error('请输入正确的联系方式'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }
]
};
const visible = ref(props.show);
//保证存储成功后再关闭
const loading = ref(false);
const formRef = ref<FormInstance>();
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
      await useCarApi().updateCarDetail(props.row.billNo, formData);
      // 保存成功后发事件给父组件
      emit('edited', { ...formData });
      visible.value = false;
    } catch (error) {
      // 处理错误
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
};

watch(() => props.show, (val) => {
  visible.value = val;
  if (val) {
    Object.assign(formData, props.row || {
      plateNumber: '',
      vehicleType: '',
      ownerName: '',
      phoneNumber: '',
    });
  }
});

watch(visible, (val) => {
  emit('update:show', val);
});
</script>

<style scoped></style>
