<!-- eslint-disable no-console -->
<template>
  <div class="reporting-registrtion-container">
    <el-card shadow="hover">
      
		<el-row :gutter="20" class="mb20">
      
        <span style="margin-top: 5px; margin-left: 10px;">登记编号:</span>
        <el-col :span="4">
          <el-input 
            v-model="searchId" 
            placeholder="请输入登记编号" 
            clearable 
            size="default"
            style="width: 100%; height: 30px;"
          >
          </el-input>
        </el-col>

        <span style="margin-top: 5px; margin-left: 10px;">车牌号:</span>
        <el-col :span="4">
          <el-input 
            v-model="searchKeyword" 
            placeholder="请输入车牌号" 
            clearable 
            size="default"
            style="width: 100%; height: 30px;"
          >
          </el-input>
        </el-col>

        <span style="margin-top: 5px; margin-left: 10px;">驾驶员:</span>
        <el-col :span="4">
          <el-input 
            v-model="searchDriverName" 
            placeholder="请输入驾驶员姓名" 
            clearable 
            size="default"
            style="width: 100%; height: 30px;"
          >
          </el-input>
        </el-col>


        <el-col :span="6" class="text-right">
          <el-button 
            type="primary" 
            size="default" 
            @click="handleSearch"
          >查询
          </el-button>
          <el-button 
            size="default" 
            @click="handleReset"
            style="background-color: #ffc693; color: white;"
          >清空
          </el-button>
          <el-button 
            type="success" 
            size="default" 
            @click="onOpenAdd"
          >添加
          </el-button>
        </el-col>
      </el-row>

      <el-table 
        :data="tableData.data" 
        style="width: 100%"
        :loading="tableData.loading"
      >
        <el-table-column type="index" label="登记编号" width="60" />
        <el-table-column prop="license_plate" label="车牌号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="vehicle_type" label="车辆类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unloading_type" label="卸货类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="driver_name" label="驾驶员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="driver_phone" label="驾驶员联系方式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cargo_departure" label="货物出发地" show-overflow-tooltip></el-table-column>
        <el-table-column prop="estimated_arrival" label="预计入场时间" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDateTime(scope.row.estimated_arrival) }}
          </template>
        </el-table-column>
        <el-table-column prop="intended_stall" label="意向档口" show-overflow-tooltip></el-table-column>
        <el-table-column prop="assigned_stall" label="档口" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button 
              size="small" 
              text 
              type="primary" 
              @click="onOpenView(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              text 
              type="primary" 
              @click="onOpenEditUser(scope.row)"
            >
              修改
            </el-button>
            <el-button 
              size="small" 
              text 
              type="danger" 
              @click="onRowDel(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        class="mt15"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        v-model:current-page="tableData.param.pageNum"
        background
        v-model:page-size="tableData.param.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </el-card>
    
    <Add ref="addRef" @success="handleAddSuccess" />
    <EditUser ref="editUserRef" @success="handleUpdateSuccess" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import Add from './component/Add.vue';
import EditUser from './component/edit.vue';
import { mockVehicleData } from './component/mockData';


export default defineComponent({
  name: 'vehicleregistration',
  components: { Add, EditUser },
  setup() {
    const addRef = ref();
    const editUserRef = ref();
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
      searchKeyword: '',      // 车牌号搜索
      searchDriverName: '',   // 驾驶员姓名搜索
      searchId: '',           // 登记编号搜索
      vehicleList: [] as any[] // 存储所有车辆数据
    });
    
    // 初始化数据
    const initData = () => {
      state.vehicleList = [...mockVehicleData];
      fetchTableData();
    };
    
    // 获取表格数据
    const fetchTableData = () => {
      state.tableData.loading = true;
      
      // 过滤数据（多条件联合过滤）
      let filteredData = state.vehicleList;
      if (state.searchKeyword) {
        filteredData = filteredData.filter(item => 
          item.license_plate.includes(state.searchKeyword)
        );
      }
      if (state.searchDriverName) {
        filteredData = filteredData.filter(item => 
          item.driver_name.includes(state.searchDriverName)
        );
      }
      if (state.searchId) {
        filteredData = filteredData.filter(item => 
          item.id.includes(state.searchId)
        );
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
    const handleSearch = () => {
      state.tableData.param.pageNum = 1;
      fetchTableData();
    };
    
    // 重置处理
    const handleReset = () => {
      // 清空所有搜索条件
      state.searchKeyword = '';
      state.searchDriverName = '';
      state.searchId = '';
      // 重置页码
      state.tableData.param.pageNum = 1;
      // 重新加载数据
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
    
    // 删除数据
    const onRowDel = (row: any) => {
      ElMessageBox.confirm(
        `此操作将永久删除车牌号为："${row.license_plate}"的车辆信息，是否继续?`, 
        '提示', 
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 从数据中删除
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
    
    // 页面加载时初始化
    onMounted(() => {
      initData();
    });
    
    return {
      addRef,
      editUserRef,
      onOpenAdd,
      onOpenView,
      onOpenEditUser,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
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
