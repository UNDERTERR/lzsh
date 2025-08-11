<template>
  <el-dialog v-model="show" title="查询条件" width="500px">
    <el-form :model="formData" label-width="100px" class="query-form">
      <el-form-item label="单据">
        <el-input v-model="formData.billNo" placeholder="请输入单据" clearable />
      </el-form-item>

      <el-form-item label="车主姓名">
        <el-input v-model="formData.ownerName" placeholder="请输入车主姓名" clearable />
      </el-form-item>

      <el-form-item label="联系方式">
        <el-input v-model="formData.phoneNumber" placeholder="请输入联系方式" clearable />
      </el-form-item>


      <el-form-item label="车牌号">
        <el-input v-model="formData.plateNumber" placeholder="请输入车牌号" clearable />
      </el-form-item>

      <el-form-item label="收费员">
        <el-input v-model="formData.cashier" placeholder="请输入名称" clearable />
      </el-form-item>

      <el-form-item label="收费金额">
        <el-input v-model="formData.cash" placeholder="请输入金额" clearable />
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" :loading="props.loading" @click="handleSearch">查询</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
const emit = defineEmits<{
  (event: 'search', formData: FormData): void
  (event: 'update:show', visible: boolean): void;
}>()
const props = defineProps<{
  show: boolean
  loading?: boolean
}>()


interface FormData {
  billNo: string //单据
  ownerName: string //车主
  phoneNumber: string //手机号
  plateNumber: string //车牌号
  cashier: string //收费员
  cash: string //收费金额
}

const formData = reactive<FormData>({
  billNo: '',//单据
  ownerName: '', //车主
  phoneNumber: '',//手机号
  plateNumber: '',//车牌号
  cashier: '',//收费员
  cash: '' //收费金额
})


const handleSearch = () => {
  // as:TypeScript 类型断言，告诉编译器这个对象的类型是 FormData 的部分字段（Partial 表示所有字段都可选）。
  const filtered = Object.fromEntries(
    Object.entries(formData).filter(([_, v]) => v !== '')
  ) as Partial<FormData>

  emit('search', filtered as FormData)
}



</script>

<style scoped lang="scss">
.query-form {
  margin-bottom: 20px;
}
</style>
