<!-- eslint-disable no-console -->
<template>
  <div class="system-add-vehicle-container">
    <el-dialog title="添加车辆报备" v-model="isShowDialog" width="769px" @close="resetForm">
      <el-form :model="ruleForm" size="default" label-width="120px" ref="formRef">
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

          <!-- 预计停留天数 -->
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
              <el-select v-model="ruleForm.cargo_type" placeholder="请选择" clearable class="w100" @change="handleCargoTypeChange">
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
              <el-select v-model="ruleForm.cargo_name" placeholder="请选择货物名称" clearable class="w100">
                <el-option 
                  v-for="item in cargoNameOptions" 
                  :key="item" 
                  :label="item" 
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="货物重量(kg)" prop="cargo_weight" :rules="[
              { required: true, message: '请输入货物重量', trigger: 'blur' },
              { pattern: /^\d+$/, message: '请输入有效数字', trigger: 'blur' }
            ]">
              <el-input v-model="ruleForm.cargo_weight" placeholder="请输入货物重量" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否有随车人员" prop="has_attendant"
              :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
              <el-radio-group v-model="ruleForm.has_attendant">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否进口" prop="is_imported"
              :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
              <el-radio-group v-model="ruleForm.is_imported">
                <el-radio label="已进口">是</el-radio>
                <el-radio label="未进口">否</el-radio>
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
            <el-button type="primary" @click="onSubmit" size="default" :loading="submitLoading">
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
  name: 'vehicleAdd',
  emits: ['success'],
  setup(props, { emit }) {
    const formRef = ref();
    const state = reactive({
      isShowDialog: false,
      submitLoading: false,
      cargoNameOptions: [] as string[],
      cargoNames: {
        '水果': ['苹果', '香蕉', '橙子', '西瓜'],
        '肉类': ['猪肉', '牛肉', '羊肉', '鸡肉'],
        '蔬菜': ['白菜', '萝卜', '土豆', '西红柿'],
        '日用品': ['纸巾', '洗涤用品', '化妆品'],
        '电子产品': ['手机', '电脑', '配件']
      },
      ruleForm: {
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
        stall_contact: '',
        stall_phone: '',
        cargo_type: '',
        cargo_name: '',
        cargo_weight: '',
        has_attendant: '',
        is_imported: '',
        approval_steps: [
          { step: '报备审核', result: '待审批', officer: '', remark: '', risk_level: '', time: '' },
          { step: '车辆消杀', result: '待消杀', officer: '', remark: '', time: '' },
          { step: '进场核验', result: '待核验', officer: '', remark: '', time: '' },
          { step: '车辆入场', result: '待入场', officer: '', remark: '', time: '' },
          { step: '车辆出场', result: '待出场', officer: '', remark: '', time: '' }
        ],
        report_time: '',
        update_time: ''
      }
    });

    // 处理货物类型变化
    const handleCargoTypeChange = (val: string) => {
      state.cargoNameOptions = state.cargoNames[val as keyof typeof state.cargoNames] || [];
      state.ruleForm.cargo_name = '';
    };

    // 打开弹窗
    const openDialog = () => {
      state.isShowDialog = true;
      const currentTime = new Date().toISOString();
      state.ruleForm.report_time = currentTime;
      state.ruleForm.update_time = currentTime;
    };

    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };

    // 重置表单
    const resetForm = () => {
      formRef.value?.resetFields();
      const currentTime = new Date().toISOString();
      state.ruleForm = {
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
        stall_contact: '',
        stall_phone: '',
        cargo_type: '',
        cargo_name: '',
        cargo_weight: '',
        has_attendant: '',
        is_imported: '',
        approval_steps: [
          { step: '报备审核', result: '待审批', officer: '', remark: '', risk_level: '', time: '' },
          { step: '车辆消杀', result: '待消杀', officer: '', remark: '', time: '' },
          { step: '进场核验', result: '待核验', officer: '', remark: '', time: '' },
          { step: '车辆入场', result: '待入场', officer: '', remark: '', time: '' },
          { step: '车辆出场', result: '待出场', officer: '', remark: '', time: '' }
        ],
        report_time: currentTime,
        update_time: currentTime
      };
      state.cargoNameOptions = [];
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

        // 构造车辆数据
        const newVehicle = {
          ...state.ruleForm,
          id: Date.now() + Math.floor(Math.random() * 1000).toString(),
          estimated_arrival: state.ruleForm.estimated_arrival
            ? new Date(state.ruleForm.estimated_arrival).toISOString()
            : '',
          update_time: new Date().toISOString(),
          assigned_stall: state.ruleForm.intended_stall || `${state.ruleForm.cargo_type}区${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 10) + 1}号`
        };

        emit('success', newVehicle);
        ElMessage.success('添加成功');
        closeDialog();
      } catch (error) {
        ElMessage.error('添加失败');
        // eslint-disable-next-line no-console
        console.error('Add Vehicle Error:', error);
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
      handleCargoTypeChange,
      ...toRefs(state),
    };
  },
});
</script>