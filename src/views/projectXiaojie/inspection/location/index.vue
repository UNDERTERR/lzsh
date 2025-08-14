<template>
  <div class="location">
    <div class="header">
      <span>位置名称： <el-input v-model="inputValue" size="small" placeholder="请输入位置名称" class="search-input"
          style="width:200px" /></span>
      <el-button style="margin-left: 20px;" type="primary" size="small" @click="handleSearch">
        <el-icon style="margin-right: 5px;">
          <Search />
        </el-icon>
        查询
      </el-button>

      <el-button style="margin-left: 10px;" type="warning" size="small" @click="handleAdd">
        <el-icon style="margin-right: 5px;">
          <Plus />
        </el-icon>
        添加
      </el-button>
      
    </div>
    <!-- 表格 -->
    <el-table  :data="tableData" border class="table">
      <el-table-column align="center" prop="locationName" label="位置名称" width="480" />
      <el-table-column align="center" prop="locationCate" label="位置类别" width="480" />
      <el-table-column align="center" prop="operation" label="操作" width="290">
        <template #default="scope">
          <el-button type="primary" text @click="handleEdit(scope.row)">
            <el-icon style="margin-right: 1px;">
              <Edit />
            </el-icon>
            修改
          </el-button>
          <el-button type="danger" text @click="handleDelete(scope.row)">
            <el-icon style="margin-right: 1px;">
              <Delete />
            </el-icon>
            删除
          </el-button>
          <!-- <el-button type="primary" text @click="handleQRCode(scope.row)">
            <el-icon style="margin-right: 1px;">
              <Edit />
            </el-icon>
            生成二维码
          </el-button> -->
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="total,prev, pager, next"
        :total="total" @current-change="handlePageChange" />
    </div>

    <!-- 添加对话框 -->
    <el-dialog>

    </el-dialog>
    <DeleteForm v-model:show="showDeleteDialogVisible" :row="deleteRow" @deleted="loadList" />
    <EditForm v-model:show="showEditDialogVisible" :row="editRow" @edited="update" />
    <AddForm v-model:show="showAddDialogVisible" @added="loadList" />
  </div>
</template>


<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';
import { Edit, Delete, Plus, Search } from '@element-plus/icons-vue'
import DeleteForm from './component/deleteForm.vue'
import EditForm from './component/editForm.vue'
import AddForm from './component/addForm.vue';
interface Location {
  id: string,
  locationName?: string,
  locationCate?: string
}
const searchParams = ref<Record<string, any>>({})
const tableData = ref<Location[]>([])
/**
 * 分页
 */
const page = ref(1)
const total = ref<number>(0)
const loading = ref(false)
const size = ref<number>(10)
const loadList = async (params?: Record<string, any>) => {
  loading.value = true
  try {
    const res = await useInspectionApi().getLocationList(page.value, size.value, params || searchParams.value)
    tableData.value = res?.data?.records ?? []
    total.value = res?.data?.total ?? 0
  } catch (error) {
    console.error('加载列表失败', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (val: number) => {
  page.value = val
  loadList()
}
onMounted(loadList)
/**
 * 搜索 
 */
const inputValue = ref('')
const handleSearch = () => {
  page.value = 1
  const params = {
    locationName: inputValue.value.trim()
  }
  searchParams.value = params
  loadList(params)
}
/**
 * 添加
 */
const addRow = ref<any>()
const showAddDialogVisible = ref(false)
const handleAdd = (row:any) => {
  addRow.value = row
  showAddDialogVisible.value = true
}
/**
 * 删除
 */
const showDeleteDialogVisible = ref(false)
const deleteRow = ref<any>()

const handleDelete = (row: any) => {
  deleteRow.value = row
  showDeleteDialogVisible.value = true;
}
/**
 * 编辑
 */
const editRow = ref<any>()
const showEditDialogVisible = ref(false)

const handleEdit = (row: any) => {
  editRow.value = row
  showEditDialogVisible.value = true;
}
const update = (updateData: any) => {
  const idx = tableData.value.findIndex(item => item.id === updateData.id)
  if (idx !== -1) {
    tableData.value[idx] = updateData
  }
}
</script>


<style lang="scss" scoped>
.el-button:focus {
  outline: none;
}

.location {
  padding: 20px;
  background: #fff;
  overflow-x: auto;
  /* 允许横向滚动 */
}

.header {
  display: flex;
  margin-bottom: 20px;
}

.page {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>