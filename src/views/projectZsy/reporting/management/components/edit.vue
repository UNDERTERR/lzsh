<template>
  <div class="system-edit-vehicle-container">
    <el-dialog title="编辑车辆报备" v-model="isShowDialog" width="769px" @close="resetForm">
      <el-form :model="ruleForm" size="default" label-width="120px" ref="formRef">
        <el-row :gutter="20">
          <!-- 车牌号 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="车牌号" prop="license_plate"
              :rules="[{ required: true, message: '请输入车牌号', trigger: 'blur' }]">
              <el-input v-model="ruleForm.license_plate" placeholder="请输入车牌号" clearable class="w100" />
            </el-form-item>
          </el-col>

          <!-- 车辆类型 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="车辆类型" prop="vehicle_type"
              :rules="[{ required: true, message: '请选择车辆类型', trigger: 'change' }]">
              <el-select v-model="ruleForm.vehicle_type" placeholder="请选择" clearable class="w100">
                <el-option-group label="私家车">
                  <el-option label="私家车" value="私家车" />
                </el-option-group>
                <el-option-group label="采购">
                  <el-option label="三轮车" value="三轮车" />
                  <el-option label="微型货车" value="微型货车" />
                  <el-option label="中型货车" value="中型货车" />
                </el-option-group>
                <el-option-group label="卖货车">
                  <el-option label="大型货车" value="大型货车" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 卸货类型 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="卸货类型" prop="unloading_type"
              :rules="[{ required: true, message: '请选择卸货类型', trigger: 'change' }]">
              <el-select v-model="ruleForm.unloading_type" placeholder="请选择" clearable class="w100">
                <el-option label="人工卸货" value="人工卸货" />
                <el-option label="机械卸货" value="机械卸货" />
                <el-option label="混合卸货" value="混合卸货" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 驾驶员姓名 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="驾驶员姓名" prop="driver_name"
              :rules="[{ required: true, message: '请输入驾驶员姓名', trigger: 'blur' }]">
              <el-input v-model="ruleForm.driver_name" placeholder="请输入驾驶员姓名" clearable class="w100" />
            </el-form-item>
          </el-col>

          <!-- 驾驶员电话 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="驾驶员电话" prop="driver_phone" :rules="[
              { required: true, message: '请输入驾驶员电话', trigger: 'blur' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.driver_phone" placeholder="请输入驾驶员电话" clearable class="w100" />
            </el-form-item>
          </el-col>

          <!-- 货物出发地 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物出发地" prop="cargo_departure"
              :rules="[{ required: true, message: '请输入货物出发地', trigger: 'blur' }]">
              <el-input v-model="ruleForm.cargo_departure" placeholder="请输入货物出发地" clearable class="w100" />
            </el-form-item>
          </el-col>

          <!-- 预计入场时间 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="预计入场时间" prop="estimated_arrival"
              :rules="[{ required: true, message: '请选择预计入场时间', trigger: 'change' }]">
              <el-date-picker v-model="ruleForm.estimated_arrival" type="datetime" placeholder="请选择预计入场时间"
                value-format="YYYY-MM-DD HH:mm:ss" class="w100" />
            </el-form-item>
          </el-col>

          <!-- 预计停留天数 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="预计停留天数" prop="stay_days" :rules="[
              { required: true, message: '请输入停留天数', trigger: 'blur' },
              { type: 'number', min: 1, message: '停留天数必须大于0', trigger: 'blur' }
            ]">
              <el-input-number v-model="ruleForm.stay_days" :min="1" :max="30" controls-position="right" class="w100" />
            </el-form-item>
          </el-col>

          <!-- 报备时间 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="报备时间" prop="report_time">
              <el-input v-model="ruleForm.report_time" placeholder="报备时间" disabled class="w100" />
            </el-form-item>
          </el-col>

          <!-- 更新时间 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="更新时间" prop="update_time">
              <el-input v-model="ruleForm.update_time" placeholder="更新时间" disabled class="w100" />
            </el-form-item>
          </el-col>

          <!-- 审批进度 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="审批进度" prop="approval_progress">
              <el-input v-model="ruleForm.approval_progress" placeholder="审批进度" disabled class="w100" />
            </el-form-item>
          </el-col>

          <!-- 档口信息 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="意向档口" prop="intended_stall">
              <el-input v-model="ruleForm.intended_stall" placeholder="请输入意向档口" clearable class="w100" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="实际档口" prop="assigned_stall">
              <el-input v-model="ruleForm.assigned_stall" placeholder="系统分配的实际档口" clearable class="w100" />
            </el-form-item>
          </el-col>

          <!-- 进口状态 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="进口状态" prop="is_imported">
              <el-select v-model="ruleForm.is_imported" placeholder="请选择" clearable class="w100">
                <el-option label="已进口" value="已进口" />
                <el-option label="未进口" value="未进口" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="submitLoading">
            保 存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'vehicleEdit',
  emits: ['confirm'],
  setup(props, { emit }) {
    const formRef = ref();
    const state = reactive({
      isShowDialog: false,
      submitLoading: false,
      ruleForm: {
        id: '',
        license_plate: '',
        vehicle_type: '',
        unloading_type: '',
        driver_name: '',
        driver_phone: '',
        cargo_departure: '',
        report_time: '',
        estimated_arrival: '',
        stay_days: 1,
        intended_stall: '',
        assigned_stall: '',
        import_status: '',
        status: '',
        update_time: '',
        approval_progress: '',
        is_imported: ''
      }
    });

    // 打开弹窗并初始化数据
    const open = (rowData: any) => {
      state.ruleForm = {
        ...rowData,
        stay_days: rowData.estimated_stay_days ? parseInt(rowData.estimated_stay_days) : 1,
        report_time: rowData.report_time,
        update_time: rowData.update_time,
        status: rowData.status,
        approval_progress: rowData.approval_progress,
        is_imported: rowData.is_imported || '未进口'
      };
      state.isShowDialog = true;
    };

    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };

    // 重置表单
    const resetForm = () => {
      formRef.value?.resetFields();
      state.ruleForm = {
        id: '',
        license_plate: '',
        vehicle_type: '',
        unloading_type: '',
        driver_name: '',
        driver_phone: '',
        cargo_departure: '',
        report_time: '',
        estimated_arrival: '',
        stay_days: 1,
        intended_stall: '',
        assigned_stall: '',
        import_status: '',
        status: '',
        update_time: '',
        approval_progress: '',
        is_imported: '未进口'
      };
    };

    // 取消
    const onCancel = () => {
      closeDialog();
      resetForm();
    };

    // 提交表单
    const onSubmit = async () => {
      try {
        const valid = await formRef.value?.validate();
        if (!valid) return;

        state.submitLoading = true;

        // 生成更新后的车辆数据
        const updatedVehicle = {
          ...state.ruleForm,
          update_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          estimated_stay_days: state.ruleForm.stay_days.toString(),
          approval_progress: state.ruleForm.approval_progress
        };

        setTimeout(() => {
          emit('confirm', updatedVehicle);
          ElMessage.success('修改成功');
          closeDialog();
          resetForm();
          state.submitLoading = false;
        }, 500);
      } catch (error) {
        state.submitLoading = false;
        ElMessage.error('表单验证失败');
      }
    };

    return {
      formRef,
      open,
      onCancel,
      onSubmit,
      resetForm,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.system-edit-vehicle-container {
  position: relative;
}

.mb20 {
  margin-bottom: 20px;
}

.w100 {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>