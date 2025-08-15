<template>
  <el-dialog title="报备审批" v-model="isShowDialog" width="769px" @close="closeDialog">
    <!-- 步骤条 -->
    <el-steps :active="activeStep" align-center>
      <el-step 
        v-for="(step, index) in detailData.approval_steps" 
        :key="index" 
        :title="step.step"
        :status="getStepStatus(index)"
      >
        <template #description>
          {{ stepDescription(index) }}
        </template>
      </el-step>
    </el-steps>

    <!-- 状态和登记编号 -->
    <div class="status-container">
      <span class="status-label">当前状态：</span>
      <el-tag :type="statusTagType">{{ currentStatus }}</el-tag>
      <span class="status-label">登记编号：{{ detailData.id }}</span>
    </div>

    <!-- 详细信息 -->
    <div class="detail-container">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="车牌号">{{ detailData.license_plate }}</el-descriptions-item>
        <el-descriptions-item label="车辆类型">{{ detailData.vehicle_type }}</el-descriptions-item>
        <el-descriptions-item label="卸货类型">{{ detailData.unloading_type }}</el-descriptions-item>
        <el-descriptions-item label="驾驶员姓名">{{ detailData.driver_name }}</el-descriptions-item>
        <el-descriptions-item label="驾驶员电话">{{ detailData.driver_phone }}</el-descriptions-item>
        <el-descriptions-item label="货物出发地">{{ detailData.cargo_departure }}</el-descriptions-item>
        <el-descriptions-item label="货物类型">{{ detailData.cargo_type }}</el-descriptions-item>
        <el-descriptions-item label="货物名称">{{ detailData.cargo_name }}</el-descriptions-item>
        <el-descriptions-item label="随车人员">{{ detailData.has_attendant }}</el-descriptions-item>
        <el-descriptions-item label="是否进口">{{ detailData.is_imported }}</el-descriptions-item>
        <el-descriptions-item label="预计入场时间">{{ formatDateTime(detailData.estimated_arrival) }}</el-descriptions-item>
        <el-descriptions-item label="预计停留天数">{{ detailData.estimated_stay_days }}天</el-descriptions-item>
        <el-descriptions-item label="意向档口">{{ detailData.intended_stall }}</el-descriptions-item>
        <el-descriptions-item label="实际档口">{{ detailData.assigned_stall || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报备时间">{{ formatDateTime(detailData.report_time) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDateTime(detailData.update_time) }}</el-descriptions-item>
        <el-descriptions-item label="当前进度">{{ currentStatus }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog" size="default">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue';

// 定义步骤类型接口
interface ApprovalStep {
  step: string;
  result: string;
  officer: string;
  remark: string;
  risk_level?: string;
  time: string;
}

// 定义详情数据接口
interface DetailData {
  id: string;
  license_plate: string;
  vehicle_type: string;
  unloading_type: string;
  driver_name: string;
  driver_phone: string;
  cargo_departure: string;
  estimated_arrival: string;
  estimated_stay_days: string;
  intended_stall: string;
  assigned_stall: string;
  report_time: string;
  update_time: string;
  is_imported: string;
  cargo_type: string;
  cargo_name: string;
  has_attendant: string;
  approval_steps: ApprovalStep[]; 
}

export default defineComponent({
  name: 'ViewDetail',
  components: {
  },
  setup() {
    const state = reactive({
      isShowDialog: false,
      detailData: {
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
        report_time: '',
        update_time: '',
        is_imported: '',
        cargo_type: '',
        cargo_name: '',
        has_attendant: '',
        approval_steps: [] 
      } as DetailData
    });

    const completedStatus = ['通过', '已消杀', '已入场', '已出场'];
    const incompleteStatus = ['', '未开始', '驳回', '不通过', '未入场'];

    // 计算当前活跃步骤
    const activeStep = computed(() => {
      const steps = state.detailData.approval_steps;
      if (!steps.length) return 0;

      // 遍历步骤找到第一个未完成的步骤
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        // 未完成状态或待处理状态都视为当前活跃步骤
        if (incompleteStatus.includes(step.result) || step.result.startsWith('待')) {
          return i;
        }
      }

      return steps.length - 1;
    });

    // 计算当前状态文本
    const currentStatus = computed(() => {
      const steps = state.detailData.approval_steps;
      if (!steps.length) return '未开始';

      // 找到第一个未完成或待处理的步骤
      for (const step of steps) {
        if (incompleteStatus.includes(step.result) || step.result.startsWith('待')) {
          return step.result || '未开始';
        }
      }

      return steps[steps.length - 1].result;
    });

    // 计算状态标签类型
    const statusTagType = computed(() => {
      const status = currentStatus.value;
      if (status.includes('待')) return 'warning';
      if (status === '通过' || status === '已入场' || status === '已出场') return 'success';
      if (status === '驳回' || status === '不通过') return 'danger';
      return '';
    });

    // 获取步骤状态
    const getStepStatus = (index: number) => {
      const step = state.detailData.approval_steps[index];
      if (!step) return 'wait';
      
      if (step.result === '驳回' || step.result === '不通过') {
        return 'error';
      }
      
      if (index < activeStep.value) {
        return 'finish';
      }
      
      if (index === activeStep.value) {
        return 'process';
      }
      
      return 'wait';
    };

    // 格式化日期时间
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 步骤状态描述（关联result、officer、time）
    const stepDescription = (stepIndex: number) => {
      const step = state.detailData.approval_steps[stepIndex];
      if (!step) return '';

      // 基础状态文本
      let baseText = '';
      if (completedStatus.includes(step.result)) {
        baseText = '已完成';
      } else if (step.result.startsWith('待')) {
        baseText = step.result;
      } else {
        baseText = step.result || '未开始';
      }

      // 补充处理人及时间
      if (step.officer && step.time) {
        return `${baseText}（${step.officer}，${formatDateTime(step.time)}）`;
      }

      return baseText;
    };

    // 打开弹窗
    const open = (rowData: DetailData) => {
      state.detailData = { ...rowData };
      state.isShowDialog = true;
    };

    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };

    return {
      ...toRefs(state),
      open,
      closeDialog,
      activeStep,
      statusTagType,
      currentStatus,
      formatDateTime,
      stepDescription,
      getStepStatus
    };
  },
});
</script>

<style scoped>
.status-container {
  margin: 20px 0;
  text-align: center;
}

.status-label {
  margin: 0 10px;
  font-size: 14px;
  color: #606266;
}

.detail-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-top: 15px;
}
</style>