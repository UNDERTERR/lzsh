<template>
  <div class="car-enex-details">
    <!-- 表格 -->
    <el-table :data="tableData" size="small" border scrollbar-always-on="true" class="table">
      <el-table-column align="center" prop="billNo" label="单据" />
      <el-table-column align="center" prop="plateNumber" label="车牌号" width="120" />
      <el-table-column align="center" prop="vehicleType" label="车辆类型" width="120" />
      <el-table-column align="center" prop="ownerName" label="车主" />
      <el-table-column align="center" prop="phoneNumber" label="联系方式" width="150" />
      <el-table-column align="center" prop="entryTime" label="进场时间" width="180" />
      <el-table-column align="center" prop="exitTime" label="出场时间" width="180" />
      <el-table-column align="center" prop="duration" label="停留时长" />
      <el-table-column align="center" prop="enPlace" label="进口岗亭" />
      <el-table-column align="center" prop="exPlace" label="出口岗亭" />
      <el-table-column align="center" prop="feeStatus" label="收费状态" />
      <el-table-column align="center" prop="cashier" label="收费员" />
      <el-table-column align="center" prop="cash" label="收费金额" />
      <el-table-column align="center" prop="exceptionFlag" label="异常标记" />
      <el-table-column fixed="right" align="center" prop="operation" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" text @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="warning" text @click="editDetail(scope.row)">编辑</el-button>
          <el-button type="danger" text @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="detailDialogVisible" title="车辆详情" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="单据">{{ detailData.billNo }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ detailData.plateNumber }}</el-descriptions-item>
        <el-descriptions-item label="车辆类型">{{ detailData.vehicleType }}</el-descriptions-item>
        <el-descriptions-item label="车主">{{ detailData.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ detailData.phoneNumber }}</el-descriptions-item>
        <el-descriptions-item label="入场时间">{{ detailData.entryTime }}</el-descriptions-item>
        <el-descriptions-item label="出场时间">{{ detailData.exitTime }}</el-descriptions-item>
        <el-descriptions-item label="进口岗亭">{{ detailData.enPlace }}</el-descriptions-item>
        <el-descriptions-item label="出口岗亭">{{ detailData.exPlace }}</el-descriptions-item>
        <el-descriptions-item label="收费状态">{{ detailData.feeStatus }}</el-descriptions-item>
        <el-descriptions-item label="收费员">{{ detailData.cashier }}</el-descriptions-item>
        <el-descriptions-item label="收费金额">{{ detailData.cash }}</el-descriptions-item>
        <!-- 你可以继续加更多字段 -->
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <DeleteForm v-model="showDeleteDialogVisible" :row="deleteRow"/>
    <EditForm v-model="showEditDialogVisible" :row="editRow"/>

  </div>

</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import SearchForm from './component/searchForm.vue';
import DeleteForm from './component/deleteForm.vue';
import EditForm from './component/editForm.vue';
defineComponent({
  name: 'enexDetails',
});


const tableData = ref<any[]>([])
//请在 增删改逻辑中添加 刷新列表逻辑
/**
 * 
 * @param row 详情行数据
 */
const detailDialogVisible = ref(false);
const detailData = ref<any>({});
const handleDetail = (row: any) => {
  detailData.value = row;
  detailDialogVisible.value = true;
};


/**
 * 
 * @param row 删除行数据
 */
const showDeleteDialogVisible=ref(false)
const deleteRow=ref<any>()
const handleDelete = (row: any) => {
  deleteRow.value=row
  showDeleteDialogVisible.value = true;
};

/**
 * 
 * @param row 修改行数据
 */
const showEditDialogVisible=ref(false)
const editRow=ref<any>()

const handleEdit = (row: any) => {
  editRow.value=row
  showEditDialogVisible.value = true;
};







//模拟
tableData.value = [
  {
    billNo: 'a1564',
    plateNumber: '浙A12345',
    vehicleType: '小型汽车',
    ownerName: '张三',
    phoneNumber: '1380000',
    entryTime: '2025-08-08-08:08:08',
    exitTime: '2025-08-08-08:08:15',
    feeStatus: '已缴费',
    exceptionFlag: '正常',
  },
  {
    plateNumber: '京B54321',
    vehicleType: '货车',
    ownerName: '李四',
    phoneNumber: '1390000',
    entryTime: '2025-08-08',
    exitTime: '2025-08-08',
    feeStatus: '未缴费',
    exceptionFlag: '超时',
  }
]
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
