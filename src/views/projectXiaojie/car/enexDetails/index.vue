<template>
  <div class="car-enex-details">

    <CateForm v-model="cateForm" :enPlaceOptions="enPlaceOptions" :exPlaceOptions="exPlaceOptions"
      @search="handleSearch" />

    <!-- 表格 -->
    <el-table :data="tableData" size="small" border scrollbar-always-on="true" class="table">
      <el-table-column align="center" prop="billNo" label="单据" />
      <el-table-column align="center" prop="plateNumber" label="车牌号" width="120" />
      <el-table-column align="center" prop="vehicleType" label="车辆类型" width="80" />
      <el-table-column align="center" prop="ownerName" label="车主" />
      <el-table-column align="center" prop="phoneNumber" label="联系方式" width="150">
        <template #default="{ row }">
          {{ maskPhone(row.phoneNumber) }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="entryTime" label="进场时间" width="180" />
      <el-table-column align="center" prop="exitTime" label="出场时间" width="180" />
      <el-table-column align="center" prop="duration" label="停留时长" />
      <el-table-column align="center" prop="enPlace" label="进口岗亭" width="120" />
      <el-table-column align="center" prop="exPlace" label="出口岗亭" width="120" />
      <el-table-column align="center" prop="feeStatus" label="收费状态" />
      <el-table-column align="center" prop="cashier" label="收费员" />
      <el-table-column align="center" prop="cash" label="收费金额" />
      <el-table-column align="center" prop="exceptionFlag" label="异常标记" />

      <el-table-column fixed="right" align="center" prop="operation" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" text @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="warning" text @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" text @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <CarDetailsDialog v-model:show="showDetailsDialogVisible" :row="detailsRow" />
    <DeleteForm v-model:show="showDeleteDialogVisible" :row="deleteRow" @deleted="loadList" />
    <EditForm v-model:show="showEditDialogVisible" :row="editRow" @edited="update" />
    <SearchForm v-model:show="showSearchDialog"  :loading="loading" @search="handleSearch" />
    <AddForm v-model:show="showAddDialog" @saved="handleAddSaved" />

    <!-- 分页 -->
    <div class="page">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="prev, pager, next,sizes"
        :page-sizes="[15, 20, 30, 50]" :total="total" @size-change="handleSizeChange"
        @current-change="handlePageChange" />
      <div class="function-button">
        <el-button size="small" type="primary" @click="showAddDialog = true"> 手动新增</el-button>
        <el-button size="small" type="primary" @click="showSearchDialog = true"> 详细查询</el-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useCarApi } from '/@/api/projectXiaojie/car';
import { maskPhone } from '../../../../utils/tools';
import SearchForm from './component/searchForm.vue';
import DeleteForm from './component/deleteForm.vue';
import EditForm from './component/editForm.vue';
import CarDetailsDialog from './component/carDetailsDialog.vue';
import CateForm from './component/cateForm.vue';
import AddForm from './component/addForm.vue';

// interface CarRecord {
//   billNo: string;          // 单据
//   plateNumber?: string;     // 车牌号
//   vehicleType?: string;     // 车辆类型
//   ownerName?: string;       // 车主
//   phoneNumber?: string;     // 联系方式
//   entryTime?: string;       // 进场时间
//   exitTime?: string;        // 出场时间
//   duration?: string | number; // 停留时长
//   enPlace?: string;         // 进口岗亭
//   exPlace?: string;         // 出口岗亭
//   feeStatus?: string;       // 收费状态
//   cashier?: string;         // 收费员
//   cash?: number | string;   // 收费金额
//   exceptionFlag?: string;   // 异常标记
// }

export default {
  name: 'CarManage',
  components: {
    SearchForm,
    DeleteForm,
    EditForm,
    CarDetailsDialog,
    CateForm,
    AddForm
  },
  setup() {
    const tableData = ref<Array<any>>([]);
    const searchParams = ref<Record<string, any>>({});

    const page = ref(1);
    const total = ref<number>(0);
    const loading = ref(false);
    const size = ref<number>(15);

    const loadList = async (params?: Record<string, any>) => {
      loading.value = true;
      try {
        const res = await useCarApi().getCarDetailsList(
          page.value,
          size.value,
          params || searchParams.value
        );
        tableData.value = res?.data?.records ?? [];
        total.value = res?.data?.total ?? 0;
      } catch (error) {
        console.error('加载列表失败', error);
      } finally {
        loading.value = false;
      }
    };

    const handleSizeChange = (newSize: number) => {
      size.value = newSize;
      page.value = 1;
      loadList();
    };

    const handlePageChange = (val: number) => {
      page.value = val;
      loadList();
    };

    onMounted(loadList);

    // 详情
    const showDetailsDialogVisible = ref(false);
    const detailsRow = ref<any>({});
    const handleDetail = (row: any) => {
      detailsRow.value = row;
      showDetailsDialogVisible.value = true;
    };

    // 删除
    const showDeleteDialogVisible = ref(false);
    const deleteRow = ref<any>();
    const handleDelete = (row: any) => {
      deleteRow.value = row;
      showDeleteDialogVisible.value = true;
    };

    // 编辑
    const showEditDialogVisible = ref(false);
    const editRow = ref<any>();
    const handleEdit = (row: any) => {
      editRow.value = row;
      showEditDialogVisible.value = true;
    };
    const update = (updateData: any) => {
      const idx = tableData.value.findIndex(
        (item) => item.billNo === updateData.billNo
      );
      if (idx !== -1) {
        tableData.value[idx] = updateData;
      }
    };

    // 分类过滤
    const cateForm = reactive({
      vehicleType: '',
      feeStatus: '',
      enPlace: '',
      exPlace: '',
      exceptionFlag: ''
    });

    const enPlaceOptions = ref([
      { label: '进口1号岗亭', value: '进口1号岗亭' },
      { label: '进口2号岗亭', value: '进口2号岗亭' },
      { label: '进口3号岗亭', value: '进口3号岗亭' }
    ]);

    const exPlaceOptions = ref([
      { label: '出口1号岗亭', value: '出口1号岗亭' },
      { label: '出口2号岗亭', value: '出口2号岗亭' },
      { label: '出口3号岗亭', value: '出口3号岗亭' }
    ]);

    // 搜索
    const showSearchDialog = ref(false);
    const handleSearch = (params: Record<string, any>) => {
      page.value = 1;
      searchParams.value = params;
      loadList(params);
    };
    watch(showSearchDialog, (newVal) => {
      console.log('showSearchDialog 改变了:', newVal);
    });

    // 新增
    const showAddDialog = ref(false);
    const handleAddSaved = ()=>{
      showAddDialog.value = false;
      loadList();
    };

    return {
      tableData,
      searchParams,
      page,
      total,
      loading,
      size,
      loadList,
      handleSizeChange,
      handlePageChange,
      showDetailsDialogVisible,
      detailsRow,
      handleDetail,
      showDeleteDialogVisible,
      deleteRow,
      handleDelete,
      showEditDialogVisible,
      editRow,
      handleEdit,
      update,
      cateForm,
      enPlaceOptions,
      exPlaceOptions,
      showSearchDialog,
      handleSearch,
      showAddDialog,
      handleAddSaved,
      maskPhone
    };
  }
};
</script>









<style scoped lang="scss">
.car-enex-details {
  padding: 20px;
  background: #fff;
  overflow-x: auto;
  /* 允许横向滚动 */
}

.table {
  .el-table__cell {
    white-space: nowrap;
  }
}

.function-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
</style>