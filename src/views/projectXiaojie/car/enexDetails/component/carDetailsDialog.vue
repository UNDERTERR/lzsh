<template>
  <el-dialog v-model="show" title="车辆详情" width="500px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="单据">{{ detail.billNo }}</el-descriptions-item>
      <el-descriptions-item label="车牌号">{{ detail.plateNumber }}</el-descriptions-item>
      <el-descriptions-item label="车辆类型">{{ detail.vehicleType }}</el-descriptions-item>
      <el-descriptions-item label="车主">{{ detail.ownerName }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ maskPhone(detail.phoneNumber) }}</el-descriptions-item>
      <el-descriptions-item label="入场时间">{{ detail.entryTime }}</el-descriptions-item>
      <el-descriptions-item label="出场时间">{{ detail.exitTime }}</el-descriptions-item>
      <el-descriptions-item label="进口岗亭">{{ detail.enPlace }}</el-descriptions-item>
      <el-descriptions-item label="出口岗亭">{{ detail.exPlace }}</el-descriptions-item>
      <el-descriptions-item label="收费状态">{{ detail.feeStatus }}</el-descriptions-item>
      <el-descriptions-item label="收费员">{{ detail.cashier }}</el-descriptions-item>
      <el-descriptions-item label="收费金额">{{ detail.cash }}</el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { maskPhone } from '/@/utils/maskPhone'
interface CarDetail {
  billNo?: string
  plateNumber?: string
  vehicleType?: string
  ownerName?: string
  phoneNumber?: string
  entryTime?: string
  exitTime?: string
  enPlace?: string
  exPlace?: string
  feeStatus?: string
  cashier?: string
  cash?: string | number
}

const props = defineProps<{
  show: boolean
  detail: CarDetail
}>()
</script>
