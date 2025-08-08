<template>
  <el-dialog v-model="visible" title="确认删除" width="30%" :before-close="handleClose">
    <div>你确定要删除 <b>{{ row?.billNo }}</b> 吗？</div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="danger" :loading="loading" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';

// props
const props = defineProps<{
  modelValue: boolean;
  row: any;
}>();

// emit
const emit = defineEmits(['update:modelValue', 'deleted']);

// 弹窗可见状态
const visible = ref(props.modelValue);
const loading = ref(false);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

// 关闭弹窗回调（阻止直接关闭时做处理）
const handleClose = (done: Function) => {
  if (!loading.value) done();
}

// 点击取消
const handleCancel = () => {
  emit('update:modelValue', false);
}

// 删除操作
const handleConfirm = async () => {
  loading.value = true;
  try {
    /**
     * 这里添加删除逻辑
     */

    ElMessage.success('删除成功');

    emit('deleted', props.row);        // 通知父组件删除成功
    emit('update:modelValue', false);  // 关闭弹窗
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

</script>
