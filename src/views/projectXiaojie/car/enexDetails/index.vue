<template>
  <div class="car-enex-details">
    <!-- 表格 -->
    <el-table :data="tableData" size="small" border scrollbar-always-on="true" class="table">
      <el-table-column align="center" prop="billNo" label="单据" />
      <el-table-column align="center" prop="plateNumber" label="车牌号" width="120" />
      <el-table-column align="center" prop="vehicleType" label="车辆类型" width="80" />
      <el-table-column align="center" prop="ownerName" label="车主" />
      <el-table-column align="center" prop="phoneNumber" label="联系方式" width="150">
        <template #default="{row}">
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


    <CarDetailsDialog v-model:show="showDetailsDialogVisible" :detail="detailsRow" />
    <DeleteForm v-model:show="showDeleteDialogVisible" :row="deleteRow" @deleted="loadList" />
    <EditForm v-model:show="showEditDialogVisible" :row="editRow" @edited="update" />


    <!-- 分页 -->
    <div style="display: flex; justify-content: center; margin: 10px 0;">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="prev, pager, next,sizes"
        :page-sizes="[10, 20, 50]" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useCarApi } from '/@/api/projectXiaojie/car';
import  {maskPhone}  from '/@/utils/maskPhone';
import SearchForm from './component/searchForm.vue';
import DeleteForm from './component/deleteForm.vue';
import EditForm from './component/editForm.vue';
import CarDetailsDialog from './component/carDetailsDialog.vue';
defineComponent({
  name: 'enexDetails',
});
const tableData = ref<any[]>([])
const loadList = async () => {
  try {
    const res = await useCarApi().getCarDetailsList(page.value, size.value)

    // ？？是||简化版
    const dataList = res?.data?.records ?? []
    const dataTotal = res?.data?.total ?? 0

    tableData.value = dataList
    total.value = dataTotal
  } catch (error) {
    console.error('加载列表失败', error)
  }
}
onMounted(loadList)

/**
 * 列表分页查询
 */
const page = ref(1)
const total = ref<number>(0)
const size = ref<number>(10)
const handleSizeChange = (newSize: number) => {
  size.value = newSize
  page.value = 1
  loadList()
}

const handlePageChange = (val: number) => {
  page.value = val
  loadList()
}

/**
 * 
 * @param row 详情行数据
 */
const showDetailsDialogVisible = ref(false);
const detailsRow = ref<any>({});
const handleDetail = (row: any) => {
  detailsRow.value = row;
  showDetailsDialogVisible.value = true;
};


/**
 * 
 * @param row 删除行数据
 */
const showDeleteDialogVisible = ref(false)
const deleteRow = ref<any>()
const handleDelete = (row: any) => {
  deleteRow.value = row
  showDeleteDialogVisible.value = true;
};

/**
 * 
 * @param row 修改行数据
 */
const showEditDialogVisible = ref(false)
const editRow = ref<any>()
const handleEdit = (row: any) => {
  editRow.value = row
  showEditDialogVisible.value = true;
};
const update = (updateData: any) => {
  const idx = tableData.value.findIndex(item => item.id === updateData.id)
  if (idx !== -1) {
    tableData.value[idx] = updateData
  }
}


</script>

<style scoped lang="scss">
.car-enex-details {
  padding: 20px;
  background: #fff;
  overflow-x: auto;
  /* 允许横向滚动 */
}

.table .el-table__cell {
  white-space: nowrap;
}
</style>
