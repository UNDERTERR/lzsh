<template>
  <el-dialog v-model="props.show" title="编辑车辆信息" width="600px" :before-close="handleClose">
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
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

      <el-form-item label="收费状态">
        <el-select v-model="formData.feeStatus" placeholder="请选择收费状态" clearable>
          <el-option label="已缴费" value="已缴费" />
          <el-option label="未缴费" value="未缴费" />
          <el-option label="免费" value="免费" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常标记">
        <el-select v-model="formData.exceptionFlag" placeholder="是否异常" clearable>
          <el-option label="正常" value="正常" />
          <el-option label="超时" value="超时" />
        </el-select>
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { useCarApi } from '/@/api/projectXiaojie/car';
import { verifyPhone } from '/@/utils/toolsValidate';

// interface VehicleForm {
//   billNo: string;
//   plateNumber: string;
//   vehicleType: string;
//   ownerName: string;
//   phoneNumber: string;
//   feeStatus: string;
//   exceptionFlag: string;
// }

export default {
  name: 'EditCarForm',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    row: {
      // type: Object as () => VehicleForm,
      type: Object,
      required: true
    }
  },
  emits: ['update:show', 'edited'],
  setup(props, { emit }) {
    // 初始化表单数据，防止直接修改传入的props
    const formData = reactive<any>({
      billNo: '',
      plateNumber: '',
      vehicleType: '',
      ownerName: '',
      phoneNumber: '',
      feeStatus: '',
      exceptionFlag: ''
    });

    const rules = {
      plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
      vehicleType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
      ownerName: [{ required: true, message: '请输入车主姓名', trigger: 'blur' }],
      phoneNumber: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (!value) return callback();
            if (!verifyPhone(value)) {
              callback(new Error('请输入正确的联系方式'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ]
    };

    const loading = ref(false);
    const formRef = ref<FormInstance>();

    const handleClose = (done: Function) => {
      if (loading.value) return;
      done(); // 关闭动画执行
      emit('update:show', false);
    };

    const handleSave = () => {
      formRef.value?.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          await useCarApi().updateCarDetail(props.row.billNo, formData);
          emit('edited', { ...formData });
          emit('update:show', false);
        } catch (error) {
          console.error(error);
        } finally {
          loading.value = false;
        }
      });
    };

    watch(
      () => props.show,
      (val) => {
        if (val) {
          Object.assign(
            formData,
            props.row || {
              plateNumber: '',
              vehicleType: '',
              ownerName: '',
              phoneNumber: ''
            }
          );
        }
      }
    );

    return {
      props,
      formData,
      rules,
      loading,
      formRef,
      handleClose,
      handleSave
    };
  }
};
</script>


<style scoped></style>
