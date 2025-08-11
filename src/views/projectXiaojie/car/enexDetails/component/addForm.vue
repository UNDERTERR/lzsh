<template>
  <el-dialog title="新增车辆明细" v-model="modelValue" width="400px" :before-close="handleClose">

    <el-form  :model="form" ref="formRef" label-width="80px" :rules="rules" style=" gap: 20px;">
      <el-form-item label="单据" prop="billNo" style="width: 330px;">
        <el-input v-model="form.billNo" placeholder="请输入单据编号" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber" style="width: 330px;">
        <el-input v-model="form.plateNumber" placeholder="请输入车牌号" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="车辆类型" prop="vehicleType" style="width: 330px;">
        <el-select v-model="form.vehicleType" placeholder="请选择车辆类型" style="width: 100%;">
          <el-option label="小型汽车" value="小型汽车" />
          <el-option label="货车" value="货车" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="车主" prop="ownerName" style="width: 330px;">
        <el-input v-model="form.ownerName" placeholder="请输入车主姓名" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber" style="width: 330px;">
        <el-input v-model="form.phoneNumber" placeholder="请输入联系方式" style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="进场时间" prop="entryTime" style="width: 330px;">
        <el-date-picker v-model="form.enTime" type="datetime" placeholder="选择进场时间" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="出场时间" prop="exitTime" style="width: 330px;">
        <el-date-picker v-model="form.exTime" type="datetime" placeholder="选择出场时间" style="width: 100%;" />
      </el-form-item>
    </el-form>


    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; padding-right: 30px;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const formRef = ref()
const form = ref({
  billNo: '',
  plateNumber: '',
  vehicleType: '',
  ownerName: '',
  phoneNumber: '',
  enTime: '',
  exTime: '',
  // 更多字段自己补充
})

const rules = {
  billNo: [{ required: true, message: '请输入单据编号', trigger: 'blur' }],
  plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  // 你可以继续添加规则
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.value = {
    billNo: '',
    plateNumber: '',
    vehicleType: '',
    ownerName: '',
    phoneNumber: '',
    enTime: '',
    exTime: '',
  }
  if (formRef.value) formRef.value.clearValidate()
}

const submitForm = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('saved', form.value)
      handleClose()
    }
  })
}
</script>
