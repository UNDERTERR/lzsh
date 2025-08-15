<template>
  <div class="system-edit-vehicle-container">
    <el-dialog :title="isView ? '查看车辆信息' : '修改车辆信息'" v-model="isShowDialog" width="769px" @close="resetForm">
      <el-form :model="ruleForm" size="default" label-width="120px" ref="formRef" :disabled="isView">
        <el-row :gutter="35">
          <!-- 车牌号 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="车牌号" prop="license_plate"
              :rules="[{ required: true, message: '请输入车牌号', trigger: 'blur' }]">
              <el-input v-model="ruleForm.license_plate" placeholder="如：甘A12345" clearable></el-input>
            </el-form-item>
          </el-col>

          <!-- 车辆类型 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="车辆类型" prop="vehicle_type"
              :rules="[{ required: true, message: '请选择车辆类型', trigger: 'change' }]">
              <el-select v-model="ruleForm.vehicle_type" placeholder="请选择" clearable class="w100">
                <el-option label="私家车" value="私家车"></el-option>
                <el-option label="三轮车" value="三轮车"></el-option>
                <el-option label="微型货车" value="微型货车"></el-option>
                <el-option label="中型货车" value="中型货车"></el-option>
                <el-option label="大型货车" value="大型货车"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 卸货类型 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="卸货类型" prop="unloading_type"
              :rules="[{ required: true, message: '请选择卸货类型', trigger: 'change' }]">
              <el-select v-model="ruleForm.unloading_type" placeholder="请选择" clearable class="w100">
                <el-option label="人工卸货" value="人工卸货"></el-option>
                <el-option label="机械卸货" value="机械卸货"></el-option>
                <el-option label="混合卸货" value="混合卸货"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 驾驶员信息 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="驾驶员姓名" prop="driver_name"
              :rules="[{ required: true, message: '请输入驾驶员姓名', trigger: 'blur' }]">
              <el-input v-model="ruleForm.driver_name" placeholder="请输入驾驶员姓名" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系方式" prop="driver_phone" :rules="[
              { required: true, message: '请输入联系方式', trigger: 'blur' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.driver_phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>

          <!-- 出发地与时间 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物出发地" prop="cargo_departure"
              :rules="[{ required: true, message: '请输入货物出发地', trigger: 'blur' }]">
              <el-input v-model="ruleForm.cargo_departure" placeholder="如：甘肃省兰州市" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="预计入场时间" prop="estimated_arrival"
              :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]">
              <el-date-picker v-model="ruleForm.estimated_arrival" type="datetime" placeholder="选择日期时间"
                class="w100"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="预计停留天数" prop="estimated_stay_days" :rules="[
              { required: true, message: '请输入停留天数', trigger: 'blur' },
              { pattern: /^\d+$/, message: '请输入有效数字', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.estimated_stay_days" placeholder="请输入停留天数" clearable></el-input>
            </el-form-item>
          </el-col>

          <!-- 货物信息 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物类型" prop="cargo_type"
              :rules="[{ required: true, message: '请选择货物类型', trigger: 'change' }]">
              <el-select v-model="ruleForm.cargo_type" placeholder="请选择" clearable class="w100">
                <el-option label="水果" value="水果"></el-option>
                <el-option label="肉类" value="肉类"></el-option>
                <el-option label="蔬菜" value="蔬菜"></el-option>
                <el-option label="日用品" value="日用品"></el-option>
                <el-option label="电子产品" value="电子产品"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物名称" prop="cargo_name"
              :rules="[{ required: true, message: '请输入货物名称', trigger: 'blur' }]">
              <el-input v-model="ruleForm.cargo_name" placeholder="请输入货物名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物重量(kg)" prop="cargo_weight" :rules="[
              { required: true, message: '请输入货物重量', trigger: 'blur' },
              { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效数字，最多两位小数', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.cargo_weight" placeholder="请输入货物重量" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否有随车人员" prop="has_attendant"
              :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
              <el-radio-group v-model="ruleForm.has_attendant">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否进口" prop="is_imported"
              :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
              <el-radio-group v-model="ruleForm.is_imported">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 档口信息 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="意向档口" prop="intended_stall"
              :rules="[{ required: true, message: '请输入意向档口', trigger: 'blur' }]">
              <el-input v-model="ruleForm.intended_stall" placeholder="请输入意向档口" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="实际档口" prop="assigned_stall">
              <el-input v-model="ruleForm.assigned_stall" placeholder="系统分配的实际档口" clearable></el-input>
            </el-form-item>
          </el-col>

          <!-- 非必填信息 -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="档口联系人" prop="stall_contact">
              <el-input v-model="ruleForm.stall_contact" placeholder="请输入档口联系人" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="档口联系电话" prop="stall_phone" :rules="[
              { pattern: /^1[3-9]\d{9}$|^$/, message: '请输入正确的手机号', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.stall_phone" placeholder="请输入档口联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button v-if="!isView" type="primary" @click="onSubmit" size="default" :loading="submitLoading">
            确 定
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
  emits: ['success'],
  setup(props, { emit }) {
    const formRef = ref();
    const state = reactive({
      isShowDialog: false,
      isView: false,
      submitLoading: false,
      ruleForm: {
        id: '',
        license_plate: '',
        vehicle_type: '',
        unloading_type: '',
        driver_name: '',
        driver_phone: '',
        cargo_departure: '',
        estimated_arrival: '',
        estimated_stay_days: '',
        intended_stall: '',
        assigned_stall: '',
        cargo_type: '',
        cargo_name: '',
        cargo_weight: '',
        has_attendant: null,
        is_imported: null,
        stall_contact: '',
        stall_phone: '',
        status: '',
        import_status: '',
        report_time: '',
        update_time: '',
        approval_steps: [] as any[]
      }
    });

    // 打开弹窗（优化后）
    const openDialog = (row: any, isView: boolean = false) => {
      state.isView = isView;
      state.ruleForm = {
        ...state.ruleForm,  // 保留初始值
        ...row,             // 应用传入的数据
        approval_steps: row.approval_steps || []  // 安全处理数组字段
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
        estimated_arrival: '',
        estimated_stay_days: '',
        intended_stall: '',
        assigned_stall: '',
        cargo_type: '',
        cargo_name: '',
        cargo_weight: '',
        has_attendant: null,
        is_imported: null,
        stall_contact: '',
        stall_phone: '',
        status: '',
        import_status: '',
        report_time: '',
        update_time: '',
        approval_steps: []
      };
    };

    // 取消
    const onCancel = () => {
      closeDialog();
      resetForm();
    };

    // 提交表单（优化后）
    const onSubmit = async () => {
      // 先进行表单验证
      try {
        await formRef.value.validate();
      } catch {
        return; // 验证失败直接返回
      }

      state.submitLoading = true;
      
      try {
        emit('success', {
          ...state.ruleForm,
          update_time: new Date().toISOString()
        });
        ElMessage.success('操作成功');
        closeDialog();
      } catch (error) {
        ElMessage.error('操作失败');
        // eslint-disable-next-line no-console
        console.error('Error:', error);
      } finally {
        state.submitLoading = false;
      }
    };

    return {
      formRef,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      resetForm,
      ...toRefs(state),
    };
  },
});
</script>