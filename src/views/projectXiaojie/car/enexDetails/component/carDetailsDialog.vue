<template>
  <el-dialog v-model="props.show" title="车辆详情" width="500px" :before-close="handleClose
">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="单据">{{ row.billNo }}</el-descriptions-item>
      <el-descriptions-item label="车牌号">{{ row.plateNumber }}</el-descriptions-item>
      <el-descriptions-item label="车辆类型">{{ row.vehicleType }}</el-descriptions-item>
      <el-descriptions-item label="车主">{{ row.ownerName }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{ row.phoneNumber }}</el-descriptions-item>
      <el-descriptions-item label="入场时间">{{ row.entryTime }}</el-descriptions-item>
      <el-descriptions-item label="出场时间">{{ row.exitTime }}</el-descriptions-item>
      <el-descriptions-item label="进口岗亭">{{ row.enPlace }}</el-descriptions-item>
      <el-descriptions-item label="出口岗亭">{{ row.exPlace }}</el-descriptions-item>
      <el-descriptions-item label="收费状态">{{ row.feeStatus }}</el-descriptions-item>
      <el-descriptions-item label="收费员">{{ row.cashier }}</el-descriptions-item>
      <el-descriptions-item label="收费金额">{{ row.cash }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts">
// interface CarDetail {
//   billNo?: string;
//   plateNumber?: string;
//   vehicleType?: string;
//   ownerName?: string;
//   phoneNumber?: string;
//   entryTime?: string;
//   exitTime?: string;
//   enPlace?: string;
//   exPlace?: string;
//   feeStatus?: string;
//   cashier?: string;
//   cash?: string | number;
// }

export default {
  name: 'CarDetailsDialog',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    row: {
      // type: Object as () => CarDetail,
      type: Object,
      required: true
    }
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('update:show', false);
    };

    return {
      props,
      handleClose
    };
  }
};
</script>
