<template>

  <el-dialog v-model="props.show" title="查看" :before-close="handleClose">
    <el-descriptions :column="2">
      <el-descriptions-item label="巡检编号:" :width="300">{{ row.inspectionId }}</el-descriptions-item>
      <el-descriptions-item label="巡检时间:">{{ row.inspectionTime }}</el-descriptions-item>
      <el-descriptions-item label="位置类型:">{{ row.locationType }}</el-descriptions-item>
      <el-descriptions-item label="位置名称:">{{ row.locationName }}</el-descriptions-item>
      <el-descriptions-item label="巡检结果:">{{ row.inspectionResult }}</el-descriptions-item>
      <el-descriptions-item label="巡检人员:">{{ row.inspector }}</el-descriptions-item>
      <el-descriptions-item label="审核状态:" :span="2">{{ row.reviewStatus }}</el-descriptions-item>
      <el-descriptions-item label="巡检备注:" :span="2">{{ row.inspectionRemark }}</el-descriptions-item>
      <el-descriptions-item label="巡检图片:" :span="2">
        <img v-if="row?.inspectionImage" :src="row.inspectionImage" alt="巡检图片"
          style="max-width: 100%; height: auto;vertical-align: top; " />
        <span v-else>暂无图片</span>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

</template>

<script lang="ts">
export default {
  name: 'RecordDetailDialog',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    row: {
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



<style lang="scss" scoped></style>