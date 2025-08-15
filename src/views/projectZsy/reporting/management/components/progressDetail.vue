<template>
  <el-dialog title="报备审批" v-model="isShowDialog" width="900px" @close="closeDialog">
    <div class="progress-container">
      <!-- 步骤条 -->
      <div class="steps-container">
        <el-steps direction="vertical" :active="activeStep" process-status="success">
          <el-step v-for="(step, index) in detailData.approval_steps" :key="index" :title="step.step"
            :status="getStepStatus(step.result)" :description="renderStepDescription(step)">
          </el-step>
        </el-steps>
      </div>

      <!-- 详细信息卡片 -->
      <div class="cards-container">
        <div v-for="(step, index) in detailData.approval_steps" :key="index" class="step-card"
          :class="{ 'active-card': activeStep === index }" @click="activeStep = index">
          <div class="card-header">
            <span class="step-title">{{ step.step }}</span>
            <el-tag :type="getStatusTagType(step.result)" size="small">
              {{ step.result }}
            </el-tag>
          </div>

          <div class="card-content">
            <!-- 基本信息卡片 -->
            <div class="basic-info" v-if="index === 0">
              <p><strong>车牌号：</strong>{{ detailData.license_plate }}</p>
              <p><strong>车辆类型：</strong>{{ detailData.vehicle_type }}</p>
              <p><strong>货物类型：</strong>{{ detailData.cargo_type }}</p>
              <p><strong>货物名称：</strong>{{ detailData.cargo_name }}</p>
              <p><strong>货物重量：</strong>{{ detailData.cargo_weight }} kg</p>
              <p><strong>随车人员：</strong>{{ detailData.has_attendant }}</p>
              <p><strong>是否进口：</strong>{{ detailData.is_imported }}</p>
              <p><strong>实际档口：</strong>{{ detailData.assigned_stall || '-' }}</p>
            </div>

            <!-- 步骤特有信息 -->
            <template v-if="step.step === '报备审核'">
              <div v-if="step.result !== '待审批'">
                <p><strong>审批结果：</strong>{{ step.result }}</p>
                <p><strong>审批人员：</strong>{{ step.officer || '-' }}</p>
                <p v-if="step.remark"><strong>审批备注：</strong>{{ step.remark }}</p>
                <p><strong>风险等级：</strong>{{ step.risk_level || '-' }}</p>
                <p><strong>审批时间：</strong>{{ formatDateTime(step.time) || '-' }}</p>
              </div>
              <div v-else>
                <p>等待审批中...</p>
              </div>
            </template>

            <template v-else-if="step.step === '车辆消杀'">
              <div v-if="step.result !== '待消杀'">
                <p><strong>消杀结果：</strong>{{ step.result }}</p>
                <p><strong>消杀人员：</strong>{{ step.officer || '-' }}</p>
                <p><strong>消杀时间：</strong>{{ formatDateTime(step.time) || '-' }}</p>
              </div>
              <div v-else>
                <p>等待消杀中...</p>
              </div>
            </template>

            <template v-else-if="step.step === '进场核验'">
              <div v-if="step.result !== '待核验'">
                <p><strong>核验结果：</strong>{{ step.result }}</p>
                <p v-if="step.remark"><strong>核验备注：</strong>{{ step.remark }}</p>
                <p><strong>核验人员：</strong>{{ step.officer || '-' }}</p>
                <p><strong>核验时间：</strong>{{ formatDateTime(step.time) || '-' }}</p>
              </div>
              <div v-else>
                <p>等待核验中...</p>
              </div>
            </template>

            <template v-else-if="step.step === '车辆入场'">
              <div v-if="step.result !== '待入场'">
                <p><strong>入场情况：</strong>{{ step.result }}</p>
                <p><strong>对接人员：</strong>{{ step.officer || '-' }}</p>
                <p><strong>入场时间：</strong>{{ formatDateTime(step.time) || '-' }}</p>
              </div>
              <div v-else>
                <p>等待入场中...</p>
              </div>
            </template>

            <template v-else-if="step.step === '车辆出场'">
              <div v-if="step.result !== '待出场'">
                <p><strong>出场情况：</strong>{{ step.result }}</p>
                <p><strong>对接人员：</strong>{{ step.officer || '-' }}</p>
                <p><strong>出场时间：</strong>{{ formatDateTime(step.time) || '-' }}</p>
              </div>
              <div v-else>
                <p>等待出场中...</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog" size="default">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

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
  intended_stall: string;
  report_time: string;
  update_time: string;
  assigned_stall: string;
  is_imported: string;
  cargo_type: string;
  cargo_name: string;
  cargo_weight: string;
  has_attendant: string;
  approval_steps: Array<{
    step: string;
    result: string;
    officer: string;
    remark: string;
    risk_level?: string;
    time: string;
  }>;
}

export default defineComponent({
  name: 'ProgressDetail',
  setup() {
    const state = reactive({
      isShowDialog: false,
      activeStep: 0,
      detailData: {
        id: '',
        license_plate: '',
        vehicle_type: '',
        unloading_type: '',
        driver_name: '',
        driver_phone: '',
        cargo_departure: '',
        estimated_arrival: '',
        intended_stall: '',
        report_time: '',
        update_time: '',
        assigned_stall: '',
        is_imported: '',
        cargo_type: '',
        cargo_name: '',
        cargo_weight: '',
        has_attendant: '',
        approval_steps: []
      } as DetailData
    });

    // 格式化日期时间
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 获取步骤状态
    const getStepStatus = (result: string) => {
      if (result === '未开始') return 'wait';

      if (result.includes('通过') && !result.includes('不通过') ||
        result === '已消杀' ||
        result === '已入场' ||
        result === '已出场') return 'success';

      if (result.includes('不通过') ||
        result === '驳回' ||
        result === '未入场') return 'error';

      if (result.startsWith('待')) return 'wait';

      return 'wait';
    };

    // 获取状态标签类型
    const getStatusTagType = (result: string) => {
      if (result.startsWith('待')) return 'warning';
      if (result === '通过' || result === '已入场' || result === '已出场') return 'success';
      if (result === '驳回' || result === '不通过') return 'danger';
      return 'info';
    };

    // 渲染步骤描述
    const renderStepDescription = (step: any) => {
      if (step.result === '未开始') return '未开始';
      if (step.result.startsWith('待')) return '等待处理';
      return `${step.result} | ${step.officer || '未记录'}`;
    };

    // 打开弹窗
    const open = (rowData: DetailData) => {
      state.detailData = { ...rowData };
      const steps = state.detailData.approval_steps;

      const incompleteStatus = ['', '未开始', '驳回', '不通过', '未入场'];

      let activeIndex = -1;
      for (let i = 0; i < steps.length; i++) {
        const result = steps[i].result;

        // 未完成状态或以"待"开头
        if (incompleteStatus.includes(result) || result.startsWith('待')) {
          activeIndex = i;
          break;
        }
      }

      state.activeStep = activeIndex === -1 ? steps.length - 1 : activeIndex;
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
      formatDateTime,
      getStepStatus,
      getStatusTagType,
      renderStepDescription
    };
  },
});
</script>

<style scoped>
.progress-container {
  display: flex;
  height: 500px;
  overflow: hidden;
}

.steps-container {
  width: 150px;
  padding-right: 20px;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}

.cards-container {
  flex: 1;
  padding-left: 20px;
  overflow-y: auto;
}

.step-card {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.step-card:hover {
  border-color: #409eff;
}

.active-card {
  border: 2px solid #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.step-title {
  font-weight: bold;
  font-size: 16px;
}

.card-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.basic-info {
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f8f8f8;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}
</style>