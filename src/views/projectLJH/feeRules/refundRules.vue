<template>
<div class="refund-rules-container">
  <h2>退费规则设置</h2>
  
  <!-- 车辆类型选择 -->
  <div class="vehicle-type-section">
    <h3>车辆类型</h3>
    <el-radio-group v-model="activeVehicleType">
      <el-radio-button 
        v-for="type in vehicleTypes" 
        :key="type.value" 
        :label="type.value"
      >
        {{ type.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
  
  <!-- 退费场景设置 -->
  <div class="scenario-section">
    <h3>退费场景设置</h3>
    <el-table :data="scenarios" border style="width: 100%">
      <el-table-column prop="name" label="场景名称" width="180" />
      <el-table-column label="退费比例">
        <template #default="{ row }">
          <el-input-number 
            v-model="row.rate" 
            :min="0" 
            :max="100" 
            :step="5" 
            controls-position="right"
          /> %
        </template>
      </el-table-column>
      <el-table-column label="固定退费金额">
        <template #default="{ row }">
          <el-input-number 
            v-model="row.fixedAmount" 
            :min="0" 
            :precision="2" 
            controls-position="right"
          /> 元
        </template>
      </el-table-column>
      <el-table-column label="适用规则">
        <template #default="{ row }">
          <el-select v-model="row.applicableRule" placeholder="请选择">
            <el-option
              v-for="item in ruleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
  <!-- 最低退费标准 -->
  <div class="min-refund-section">
    <h3>最低退费标准</h3>
    <div class="min-refund-content">
      <el-form label-width="180px">
        <el-form-item label="最低退费比例">
          <el-input-number 
            v-model="minRefundStandard.rate" 
            :min="0" 
            :max="100" 
            :step="1" 
            controls-position="right"
          /> %
        </el-form-item>
        <el-form-item label="最低退费金额">
          <el-input-number 
            v-model="minRefundStandard.amount" 
            :min="0" 
            :precision="2" 
            controls-position="right"
          /> 元
        </el-form-item>
        <el-form-item label="适用时间范围">
          <el-date-picker
            v-model="minRefundStandard.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
  
  <!-- 操作按钮 -->
  <div class="action-buttons">
    <el-button type="primary" @click="saveRules">保存设置</el-button>
    <el-button @click="resetRules">重置</el-button>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'RefundRules',
  components: {},
  setup() {
    // 车辆类型数据
    const vehicleTypes = ref([
      { value: 'car', label: '小型汽车' },
      { value: 'suv', label: 'SUV/MPV' },
      { value: 'truck', label: '货车' },
      { value: 'bus', label: '客车' },
      { value: 'ev', label: '新能源车' }
    ])
    
    const activeVehicleType = ref('car')
    
    // 退费场景数据
    const scenarios = reactive([
      { name: '提前24小时取消', rate: 100, fixedAmount: 0, applicableRule: 'rate' },
      { name: '提前12小时取消', rate: 80, fixedAmount: 0, applicableRule: 'rate' },
      { name: '提前6小时取消', rate: 50, fixedAmount: 0, applicableRule: 'rate' },
      { name: '提前2小时取消', rate: 30, fixedAmount: 0, applicableRule: 'rate' },
      { name: '超时未入场', rate: 0, fixedAmount: 10, applicableRule: 'fixed' },
      { name: '系统故障', rate: 100, fixedAmount: 0, applicableRule: 'rate' }
    ])
    
    // 适用规则选项
    const ruleOptions = ref([
      { value: 'rate', label: '按比例退费' },
      { value: 'fixed', label: '固定金额退费' },
      { value: 'higher', label: '取比例和固定金额较高者' },
      { value: 'lower', label: '取比例和固定金额较低者' }
    ])
    
    // 最低退费标准
    const minRefundStandard = reactive({
      rate: 10,
      amount: 5,
      timeRange: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    })
    
    // 保存设置
    const saveRules = () => {
      const rules = {
        vehicleType: activeVehicleType.value,
        scenarios: [...scenarios],
        minRefundStandard: { ...minRefundStandard }
      }
      
      console.log('保存退费规则:', rules)
      ElMessage.success('退费规则保存成功')
      // 这里可以添加API调用，将规则保存到后端
    }
    
    // 重置设置
    const resetRules = () => {
      scenarios.forEach(scenario => {
        scenario.rate = 0
        scenario.fixedAmount = 0
        scenario.applicableRule = 'rate'
      })
      minRefundStandard.rate = 0
      minRefundStandard.amount = 0
      minRefundStandard.timeRange = [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
      
      ElMessage.info('已重置所有设置')
    }
    
    return {
      vehicleTypes,
      activeVehicleType,
      scenarios,
      ruleOptions,
      minRefundStandard,
      saveRules,
      resetRules
    }
  },
})
</script>

<style lang="scss">
.refund-rules-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }
  
  h3 {
    color: #666;
    margin: 20px 0 15px;
  }
  
  .vehicle-type-section {
    margin-bottom: 30px;
    
    .el-radio-group {
      margin-top: 10px;
    }
  }
  
  .scenario-section {
    margin-bottom: 30px;
    
    .el-table {
      margin-top: 15px;
    }
  }
  
  .min-refund-section {
    margin-bottom: 30px;
    
    .min-refund-content {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 4px;
      margin-top: 15px;
    }
  }
  
  .action-buttons {
    text-align: center;
    margin-top: 30px;
  }
}
</style>