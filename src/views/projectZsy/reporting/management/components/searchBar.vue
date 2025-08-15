<template>
  <div class="search-container">
    <!-- 第一行：基础信息 -->
    <el-row :gutter="8" class="mb8" style="flex-wrap: wrap;">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">登记编号：</span>
        <el-input v-model="searchId" placeholder="请输入登记编号" clearable size="small"
          style="flex: 1; min-width: 120px;" />
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">车牌号：</span>
        <el-input v-model="searchKeyword" placeholder="请输入车牌号" clearable size="small"
          style="flex: 1; min-width: 120px;" />
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">驾驶员：</span>
        <el-input v-model="searchDriverName" placeholder="请输入驾驶员姓名" clearable size="small"
          style="flex: 1; min-width: 120px;" />
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">驾驶员电话：</span>
        <el-input v-model="searchDriverPhone" placeholder="请输入联系方式" clearable size="small"
          style="flex: 1; min-width: 120px;" />
      </el-col>
    </el-row>

    <!-- 第二行：时间选择 -->
    <el-row :gutter="8" class="mb8" style="flex-wrap: wrap;">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">报备时间：</span>
        <el-date-picker v-model="searchReportingTimeRange" type="datetimerange" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" style="flex: 1; min-width: 280px;"
          size="small" />
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">预计入场时间：</span>
        <el-date-picker v-model="searchEstimatedArrivalRange" type="datetimerange" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" style="flex: 1; min-width: 280px;"
          size="small" />
      </el-col>
    </el-row>

    <!-- 第三行：选择器 -->
    <el-row :gutter="8" class="mb8" style="flex-wrap: wrap;">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">车辆类型：</span>
        <el-tree-select v-model="ruleForm.vehicle_type" :data="vehicleTypeOptions" :props="treeProps"
          placeholder="请选择车辆类型" check-strictly size="small" style="flex: 1; min-width: 120px;" />
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">卸货类型：</span>
        <el-select v-model="ruleForm.unload_type" placeholder="请选择" size="small" style="flex: 1; min-width: 120px;">
          <el-option label="人工卸货" value="人工卸货" />
          <el-option label="机械卸货" value="机械卸货" />
          <el-option label="混合卸货" value="混合卸货" />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">进口状态：</span>
        <el-select v-model="ruleForm.import_status" placeholder="请选择" size="small" style="flex: 1; min-width: 120px;">
          <el-option label="已进口" value="已进口" />
          <el-option label="未进口" value="未进口" />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" style="display: flex; align-items: center; margin: 5px 0;">
        <span style="margin-right: 10px; flex-shrink: 0;">出发地：</span>
        <el-input v-model="searchDeparture" placeholder="请输入出发地" clearable size="small"
          style="flex: 1; min-width: 120px;" />
      </el-col>
    </el-row>

    <!-- 按钮行 -->
    <el-row :gutter="20" class="mt10">
      <el-col :span="24" class="text-right btn-container">
        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="handleReset" style="background-color: #f5f5f5; color: #333;">清空</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  emits: ['search', 'reset'],
  setup(props, { emit }) {
    const defaultTime = [
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 1, 1, 23, 59, 59)
    ];

    const treeProps = {
      children: 'children',
      label: 'label',
      value: 'value'
    };

    const state = reactive({
      searchId: '',
      searchKeyword: '',
      searchDriverName: '',
      searchDriverPhone: '',
      searchDeparture: '',
      searchReportingTimeRange: [] as string[],
      searchEstimatedArrivalRange: [] as string[],
      ruleForm: {
        vehicle_type: '',
        unload_type: '',
        import_status: ''
      },
      vehicleTypeOptions: [
        {
          value: '私家车',
          label: '私家车',
        },
        {
          value: '采购',
          label: '采购',
          children: [
            { value: '三轮车', label: '三轮车' },
            { value: '微型货车', label: '微型货车' },
            { value: '中型货车', label: '中型货车' }
          ]
        },
        {
          value: '卖货车',
          label: '卖货车',
          children: [
            { value: '大型货车', label: '大型货车' }
          ]
        }
      ]
    });

    // 搜索处理
    const handleSearch = () => {
      emit('search', {
        searchId: state.searchId,
        searchKeyword: state.searchKeyword,
        searchDriverName: state.searchDriverName,
        searchDriverPhone: state.searchDriverPhone,
        searchDeparture: state.searchDeparture,
        searchReportingTimeRange: state.searchReportingTimeRange,
        searchEstimatedArrivalRange: state.searchEstimatedArrivalRange,
        vehicle_type: state.ruleForm.vehicle_type,
        unload_type: state.ruleForm.unload_type,
        import_status: state.ruleForm.import_status
      });
    };

    // 清空查询条件
    const handleReset = () => {
      state.searchId = '';
      state.searchKeyword = '';
      state.searchDriverName = '';
      state.searchDriverPhone = '';
      state.searchDeparture = '';
      state.searchReportingTimeRange = [];
      state.searchEstimatedArrivalRange = [];
      state.ruleForm.vehicle_type = '';
      state.ruleForm.unload_type = '';
      state.ruleForm.import_status = '';
      
      emit('reset');
    };

    return {
      ...toRefs(state),
      defaultTime,
      treeProps,
      handleSearch,
      handleReset
    };
  }
});
</script>

<style scoped>
.search-container .el-col {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.btn-container {
  justify-content: flex-end;
}

.mb8 {
  margin-bottom: 8px !important;
}

.mt10 {
  margin-top: 10px !important;
}
</style>