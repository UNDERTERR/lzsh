<template>
  <div class="reporting-registrtion-container">
    <el-card shadow="hover">
      <SearchBar @search="handleSearch" @reset="handleReset" />

      <div class="table-container">
        <el-table :data="tableData.data" style="width: 100%" :loading="tableData.loading">
          <el-table-column prop="id" label="登记编号" width="100" show-overflow-tooltip />
          <el-table-column prop="license_plate" label="车牌号" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unloading_type" label="卸货类型" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="driver_name" label="驾驶员" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="driver_phone" label="驾驶员联系方式" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cargo_departure" label="货物出发地" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="estimated_arrival" label="预计入场时间" width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ formatDateTime(scope.row.estimated_arrival) }}
            </template>
          </el-table-column>
          <el-table-column prop="intended_stall" label="意向档口" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assigned_stall" label="实际档口" width="120" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.assigned_stall || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="report_time" label="报备时间" width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ formatDateTime(scope.row.report_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ formatDateTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" show-overflow-tooltip>
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.approval_steps)">
                {{ getCurrentStatus(scope.row.approval_steps) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button size="small" text type="primary" @click="onOpenView(scope.row)">
                查看
              </el-button>
              <el-button size="small" text type="primary" @click="onOpenProgress(scope.row)">
                进度
              </el-button>
              <el-button size="small" text type="primary" @click="onOpenEditUser(scope.row)">
                修改
              </el-button>
              <el-button size="small" text type="danger" @click="onRowDel(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" class="mt15"
        :pager-count="5" :page-sizes="[10, 20, 30]" v-model:current-page="tableData.param.pageNum" background
        v-model:page-size="tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"></el-pagination>
    </el-card>

    <Add ref="addRef" @confirm="handleAddSuccess" />
    <EditUser ref="editUserRef" @confirm="handleUpdateSuccess" />
    <ViewDetail ref="viewDetailRef" />
    <ProgressDetail ref="progressDetailRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import Add from '../components/add.vue';
import EditUser from './components/edit.vue';
import { fetchRandomVehicles } from '../mock/randomVehicle';
import ViewDetail from './components/viewDetail.vue';
import ProgressDetail from './components/progressDetail.vue';
import SearchBar from './components/searchBar.vue'; 

export default defineComponent({
  name: 'vehicleregistration',
  components: {
    Add,
    EditUser,
    ViewDetail,
    ProgressDetail,
    SearchBar 
  },
  setup() {
    const addRef = ref();
    const editUserRef = ref();
    const viewDetailRef = ref();
    const progressDetailRef = ref();

    // 存储搜索参数
    const searchParams = ref({
      searchId: '',
      searchKeyword: '',
      searchDriverName: '',
      searchDriverPhone: '',
      searchDeparture: '',
      searchReportingTimeRange: [] as string[],
      searchEstimatedArrivalRange: [] as string[],
      vehicle_type: '',
      unload_type: '',
      import_status: ''
    });

    const state = reactive({
      vehicleList: [] as any[],
      tableData: {
        data: [] as any[],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      }
    });

    // 初始化数据
    const initData = async () => {
      state.tableData.loading = true;
      try {
        const data = await fetchRandomVehicles(50) as any[];
        state.vehicleList = data;
        fetchTableData();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch data:', error);
        state.tableData.loading = false;
      }
    };

    // 获取表格数据
    const fetchTableData = () => {
      state.tableData.loading = true;
      let filteredData = [...state.vehicleList];

      // 应用搜索条件
      if (searchParams.value.searchId) {
        filteredData = filteredData.filter(item =>
          item.id.includes(searchParams.value.searchId)
        );
      }

      if (searchParams.value.searchKeyword) {
        filteredData = filteredData.filter(item =>
          item.license_plate.includes(searchParams.value.searchKeyword)
        );
      }

      if (searchParams.value.searchDriverName) {
        filteredData = filteredData.filter(item =>
          item.driver_name.includes(searchParams.value.searchDriverName)
        );
      }

      if (searchParams.value.searchDriverPhone) {
        filteredData = filteredData.filter(item =>
          item.driver_phone.includes(searchParams.value.searchDriverPhone)
        );
      }

      if (searchParams.value.searchDeparture) {
        filteredData = filteredData.filter(item =>
          item.cargo_departure.includes(searchParams.value.searchDeparture)
        );
      }

      if (searchParams.value.vehicle_type) {
        filteredData = filteredData.filter(item =>
          item.vehicle_type === searchParams.value.vehicle_type
        );
      }

      if (searchParams.value.unload_type) {
        filteredData = filteredData.filter(item =>
          item.unloading_type === searchParams.value.unload_type
        );
      }

      if (searchParams.value.import_status) {
        filteredData = filteredData.filter(item =>
          item.is_imported === searchParams.value.import_status
        );
      }

      // 报备时间过滤
      if (searchParams.value.searchReportingTimeRange && searchParams.value.searchReportingTimeRange.length === 2) {
        const [start, end] = searchParams.value.searchReportingTimeRange;
        filteredData = filteredData.filter(item => {
          const reportTime = new Date(item.report_time).getTime();
          return reportTime >= new Date(start).getTime() &&
            reportTime <= new Date(end).getTime();
        });
      }

      // 预计入场时间过滤
      if (searchParams.value.searchEstimatedArrivalRange && searchParams.value.searchEstimatedArrivalRange.length === 2) {
        const [start, end] = searchParams.value.searchEstimatedArrivalRange;
        filteredData = filteredData.filter(item => {
          const arrivalTime = new Date(item.estimated_arrival).getTime();
          return arrivalTime >= new Date(start).getTime() &&
            arrivalTime <= new Date(end).getTime();
        });
      }

      // 分页处理
      const start = (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize;
      const end = start + state.tableData.param.pageSize;
      state.tableData.data = filteredData.slice(start, end);
      state.tableData.total = filteredData.length;

      state.tableData.loading = false;
    };

    // 格式化日期时间
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // 搜索处理
    const handleSearch = (params: any) => {
      searchParams.value = params;
      state.tableData.param.pageNum = 1;
      fetchTableData();
    };

    // 重置处理
    const handleReset = () => {
      searchParams.value = {
        searchId: '',
        searchKeyword: '',
        searchDriverName: '',
        searchDriverPhone: '',
        searchDeparture: '',
        searchReportingTimeRange: [],
        searchEstimatedArrivalRange: [],
        vehicle_type: '',
        unload_type: '',
        import_status: ''
      };
      state.tableData.param.pageNum = 1;
      fetchTableData();
    };

    // 打开添加弹窗
    const onOpenAdd = () => {
      addRef.value.open();
    };

    // 打开查看弹窗
    const onOpenView = (rowData: any) => {
      viewDetailRef.value.open(rowData);
    };

    // 打开编辑弹窗
    const onOpenEditUser = (rowData: any) => {
      editUserRef.value.open(rowData);
    };

    // 打开进度弹窗
    const onOpenProgress = (rowData: any) => {
      progressDetailRef.value.open(rowData);
    };

    // 删除行
    const onRowDel = (rowData: any) => {
      ElMessageBox.confirm('确定要删除这条记录吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = state.vehicleList.findIndex(item => item.id === rowData.id);
        if (index !== -1) {
          state.vehicleList.splice(index, 1);
          fetchTableData();
          ElMessage.success('删除成功');
        }
      }).catch(() => {
        // 取消删除
      });
    };

    // 处理添加成功
    const handleAddSuccess = (newVehicle: any) => {
      state.vehicleList.unshift(newVehicle);
      fetchTableData();
    };

    // 处理更新成功
    const handleUpdateSuccess = (updatedVehicle: any) => {
      const index = state.vehicleList.findIndex(item => item.id === updatedVehicle.id);
      if (index !== -1) {
        state.vehicleList[index] = updatedVehicle;
      }
      fetchTableData();
    };

    // 分页大小改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
      fetchTableData();
    };

    // 当前页码改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
      fetchTableData();
    };

    // 获取当前状态
    const getCurrentStatus = (steps: any[]) => {
      if (!steps || steps.length === 0) return '未开始';
      let lastCompletedStatus = '未开始';
      for (const step of steps) {
        if (step.result && step.result !== '未开始') {
          lastCompletedStatus = step.result;
        }
        if (['驳回', '不通过', '未入场'].includes(step.result)) {
          return step.result;
        }
        if (step.result?.startsWith('待')) {
          return step.result;
        }
      }

      return lastCompletedStatus;
    };

    // 获取状态标签类型
    const getStatusTagType = (steps: any[]) => {
      const status = getCurrentStatus(steps);
      if (status.includes('待')) return 'warning';
      if (status === '通过' || status === '已入场' || status === '已出场') return 'success';
      if (status === '驳回' || status === '不通过') return 'danger';
      return '';
    };

    // 页面加载时初始化
    onMounted(() => {
      initData();
    });

    return {
      addRef,
      editUserRef,
      viewDetailRef,
      progressDetailRef,
      ...toRefs(state),
      handleSearch,
      handleReset,
      onOpenAdd,
      onOpenView,
      onOpenEditUser,
      onRowDel,
      onOpenProgress,
      handleAddSuccess,
      handleUpdateSuccess,
      onHandleSizeChange,
      onHandleCurrentChange,
      formatDateTime,
      getCurrentStatus,
      getStatusTagType
    };
  }
});
</script>

<style scoped>
.reporting-registrtion-container .el-col {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.mb8 {
  margin-bottom: 8px !important;
}

.table-container {
  margin-top: 15px;
}

.mt15 {
  margin-top: 15px !important;
  text-align: right;
}
</style>