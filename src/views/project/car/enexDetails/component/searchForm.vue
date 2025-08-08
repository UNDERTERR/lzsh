<template>
  <el-form :model="formData" :inline="true" label-width="100px" class="query-form">
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

    <el-form-item label="车辆类型">
      <el-select v-model="formData.vehicleType" placeholder="请选择车辆类型" clearable>
        <el-option label="私家车" value="car" />
        <el-option label="载货车" value="truck" />
        <el-option label="未载货车" value="unLoadTruck" />
      </el-select>
    </el-form-item>

    <el-form-item label="收费状态">
      <el-select v-model="formData.feeStatus" placeholder="请选择收费状态" clearable>
        <el-option label="已缴费" value="paid" />
        <el-option label="未缴费" value="unpaid" />
        <el-option label="免费" value="free" />
      </el-select>
    </el-form-item>

    <el-form-item label="收费员">
      <el-input v-model="formData.plateNumber" placeholder="请输入名称" clearable />
    </el-form-item>

    <el-form-item label="收费金额">
      <el-input v-model="formData.cash" placeholder="请输入金额" clearable />
    </el-form-item>

    <el-form-item label="进口厅">
      <el-select v-model="formData.enPlace" placeholder="进口" clearable>
        <el-option v-for="item in props.enPlaceOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="出口厅">
      <el-select v-model="formData.exPlace" placeholder="出口" clearable>
        <el-option v-for="item in props.exPlaceOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="异常标记">
      <el-select v-model="formData.exceptionFlag" placeholder="是否异常" clearable>
        <el-option label="正常" value="normal" />
        <el-option label="超时停车" value="exception" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="emit('search', formData)">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from 'vue'
defineComponent({
  name: 'searchForm'
})
interface FormData {
  billNo: string //单据
  plateNumber: string //车牌号
  vehicleType: string //车辆类型
  ownerName: string //车主
  phoneNumber: string //手机号
  timeRange: (Date | null)[]  //时间范围
  feeStatus: string //收费状态
  exceptionFlag: string //异常标记
  cashier: string //收费员
  enPlace: string //进站
  exPlace: string //出站
  cash: string //收费金额
}

const emit = defineEmits<{
  (event: 'search', formData: FormData): void
  (event: 'reset'): void
}>()
const props = defineProps<{
  enPlaceOptions: { label: string; value: string }[],
  exPlaceOptions: { label: string; value: string }[]
}>()
const formData = reactive<FormData>({
  billNo: '',//单据
  plateNumber: '',//车牌号
  vehicleType: '',//车辆类型
  ownerName: '', //车主
  phoneNumber: '',//手机号
  timeRange: [], //时间范围
  feeStatus: '',//收费状态
  exceptionFlag: '',//异常标记
  cashier: '',//收费员
  enPlace: '',//进站
  exPlace: '',//出站
  cash: '' //收费金额
})
const onSearch = () => {
}
const onReset = () => {
  Object.assign(formData, {
    billNo: '',//单据
    plateNumber: '',//车牌号
    vehicleType: '',//车辆类型
    ownerName: '', //车主
    phoneNumber: '',//手机号
    timeRange: [], //时间范围
    feeStatus: '',//收费状态
    exceptionFlag: '',//异常标记
    cashier: '',//收费员
    enPlace: '',//进站
    exPlace: '',//出站
    cash: '' //收费金额
  })
  emit('reset')
}
</script>

<style scoped lang="scss">
.query-form {
  margin-bottom: 20px;
}
</style>
