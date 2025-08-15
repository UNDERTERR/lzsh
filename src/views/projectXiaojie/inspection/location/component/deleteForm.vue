<template>
  <el-dialog v-model="props.show" title="确认删除" width="30%" :before-close="handleClose">
    <div>你确定要删除该数据吗？（数据库id为<b>{{ row?.id }}</b>）</div>

    <template #footer>
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="danger" :loading="loading" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection/index';

export default {
  name: 'DeleteLocationForm',
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
  emits: ['update:show', 'deleted'],
  setup(props, { emit }) {
    const loading = ref(false);

    // 关闭弹窗回调（阻止直接关闭时做处理）
    const handleClose = (done: Function) => {
      if (!loading.value) done();
      emit('update:show', false);
    };

    // 删除操作
    const handleConfirm = async () => {
      loading.value = true;
      try {
        await useInspectionApi().deleteLocation(props.row.id);
        ElMessage.success('删除成功');

        emit('deleted', props.row);       // 通知父组件删除成功
        emit('update:show', false);       // 关闭弹窗
      } catch (error) {
        ElMessage.error('删除失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    return {
      props,
      loading,
      handleClose,
      handleConfirm
    };
  }
};
</script>
