<template>
  <div class="reporting-registrtion-container">
    <el-card shadow="hover">
      <!-- 搜索行 -->
      <el-row :gutter="8" class="mb8 wrap">
        <el-col 
          v-for="item in searchItems"
          :key="item.model"
          :xs="24" :sm="12" :md="4" :lg="4"
          class="search-col"
        >
          <span class="search-label">{{ item.label }}</span>
          <el-input 
            v-model="searchForm[item.model]" 
            :placeholder="item.placeholder" 
            clearable 
            size="small" 
            class="search-input" 
          />
        </el-col>
      </el-row>

      <!-- 按钮行 -->
      <el-row :gutter="20" class="mt10">
        <el-col :span="24" class="text-right">
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button size="small" @click="handleReset" class="reset-btn">清空</el-button>
          <el-button type="success" size="small" @click="onOpenAdd" class="ml8">添加</el-button>
        </el-col>
      </el-row>

      <div class="table-container">
        <el-table :data="tableData.data" style="width: 100%" :loading="tableData.loading">
          <el-table-column type="index" label="登记编号" width="60" />
          <el-table-column prop="license_plate" label="车牌号" show-overflow-tooltip />
          <el-table-column prop="vehicle_type" label="车辆类型" show-overflow-tooltip />
          <el-table-column prop="unloading_type" label="卸货类型" show-overflow-tooltip />
          <el-table-column prop="driver_name" label="驾驶员" show-overflow-tooltip />
          <el-table-column prop="driver_phone" label="驾驶员联系方式" show-overflow-tooltip />
          <el-table-column prop="cargo_departure" label="货物出发地" show-overflow-tooltip />
          <el-table-column prop="estimated_arrival" label="预计入场时间" show-overflow-tooltip>
            <template #default="scope">
              {{ formatDateTime(scope.row.estimated_arrival) }}
            </template>
          </el-table-column>
          <el-table-column prop="intended_stall" label="意向档口" show-overflow-tooltip />
          <el-table-column prop="assigned_stall" label="实际档口" width="120" show-overflow-tooltip>
            <template #default="scope">
              {{ scope.row.assigned_stall || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" text type="primary" @click="onOpenView(scope.row)">查看</el-button>
              <el-button size="small" text type="primary" @click="onOpenEditUser(scope.row)">修改</el-button>
              <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination 
        @size-change="handlePaginationChange"
        @current-change="handlePaginationChange"
        class="mt15"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        v-model:current-page="tableData.param.pageNum"
        background
        v-model:page-size="tableData.param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      />
    </el-card>

    <Add ref="addRef" @success="handleAddSuccess" />
    <EditUser ref="editUserRef" @success="handleUpdateSuccess" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import Add from '../components/add.vue';
import EditUser from './components/edit.vue';
import { fetchRandomVehicles } from '../mock/randomVehicle';

// 定义搜索表单类型
interface SearchForm {
  id: string;
  keyword: string;
  driverName: string;
}

// 定义搜索项类型
interface SearchItem {
  label: string;
  model: keyof SearchForm; 
  placeholder: string;
}

export default defineComponent({
  name: 'vehicleregistration',
  components: { Add, EditUser },
  setup() {
    const addRef = ref();
    const editUserRef = ref();
    
    const searchItems: SearchItem[] = [
      { label: '登记编号', model: 'id', placeholder: '请输入登记编号' },
      { label: '车牌号', model: 'keyword', placeholder: '请输入车牌号' },
      { label: '驾驶员', model: 'driverName', placeholder: '请输入驾驶员姓名' }
    ];

    const state = reactive({
      tableData: {
        data: [] as any[],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      searchForm: {
        id: '',
        keyword: '',
        driverName: ''
      } as SearchForm,
      vehicleList: [] as any[],
    });

    // 初始化数据
    const initData = async () => {
      state.tableData.loading = true;
      try {
        const vehicles = await fetchRandomVehicles(50);
        state.vehicleList = vehicles as any[];
        fetchTableData();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('获取车辆数据失败', error);
        ElMessage.error('数据加载失败');
      } finally {
        state.tableData.loading = false;
      }
    };

    // 获取表格数据
    const fetchTableData = () => {
      state.tableData.loading = true;

      const { id, keyword, driverName } = state.searchForm;
      const filteredData = state.vehicleList.filter(item => 
        (!id || item.id.includes(id)) &&
        (!keyword || item.license_plate.includes(keyword)) &&
        (!driverName || item.driver_name.includes(driverName))
      );

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
    const handleSearch = () => {
      state.tableData.param.pageNum = 1;
      fetchTableData();
    };

    // 重置处理
    const handleReset = () => {
      state.searchForm = { id: '', keyword: '', driverName: '' };
      state.tableData.param.pageNum = 1;
      fetchTableData();
    };

    // 打开查看弹窗
    const onOpenView = (row: any) => {
      editUserRef.value.openDialog(row, true);
    };

    // 打开新增弹窗
    const onOpenAdd = () => {
      addRef.value.openDialog();
    };

    // 打开修改弹窗
    const onOpenEditUser = (row: any) => {
      editUserRef.value.openDialog(row, false);
    };

    const getDeleteMessage = (row: any) => 
      `此操作将永久删除车牌号为："${row.license_plate}"的车辆信息，是否继续?`;

    // 删除数据
    const onRowDel = (row: any) => {
      ElMessageBox.confirm(
        getDeleteMessage(row),
        '提示',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        state.vehicleList = state.vehicleList.filter(item => item.id !== row.id);
        ElMessage.success('删除成功');
        fetchTableData();
      }).catch(() => {});
    };

    // 处理新增成功
    const handleAddSuccess = (newVehicle: any) => {
      state.vehicleList.unshift(newVehicle);
      fetchTableData();
    };

    // 处理更新成功
    const handleUpdateSuccess = (updatedVehicle: any) => {
      const index = state.vehicleList.findIndex(item => item.id === updatedVehicle.id);
      if (index !== -1) state.vehicleList[index] = updatedVehicle;
      fetchTableData();
    };

    // 统一分页处理
    const handlePaginationChange = () => fetchTableData();

    // 页面加载时初始化
    onMounted(initData);

    return {
      addRef,
      editUserRef,
      searchItems,
      onOpenAdd,
      onOpenView,
      onOpenEditUser,
      onRowDel,
      handlePaginationChange,
      handleSearch,
      handleReset,
      handleAddSuccess,
      handleUpdateSuccess,
      fetchTableData,
      formatDateTime,
      ...toRefs(state),
    };
  },
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

.mt10 {
  margin-top: 10px !important;
}

.mt15 {
  margin-top: 15px !important;
}

.text-right {
  justify-content: flex-end;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 15px;
}

.el-table {
  min-width: 1200px;
}

.wrap {
  flex-wrap: wrap;
}

.search-col {
  display: flex;
  align-items: center;
  margin: 5px 2px;
}

.search-input {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}

.search-label {
  margin-right: 10px;
  flex-shrink: 0;
}

.reset-btn {
  background-color: #ffc693; 
  color: white; 
}

.ml8 {
  margin-left: 8px;
}
</style>