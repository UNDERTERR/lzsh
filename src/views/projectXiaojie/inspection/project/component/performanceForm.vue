<template>
  <el-dialog v-model="props.show" :before-close="handleClose" width="500px">
    <el-form :model="performanceRule" label-width="150px">
      <el-form-item label="基础分">
        <el-input-number v-model="performanceRule.baseScore" :min="0" />
      </el-form-item>
      <el-form-item label="每少一天扣分">
        <el-input-number v-model="performanceRule.deductionPerMissedDay" :min="0" />
      </el-form-item>
      <el-form-item label="每次异常问题扣分">
        <el-input-number v-model="performanceRule.deductionPerAbnormalIssue" :min="0" />
      </el-form-item>
      <el-form-item label="每次超额巡检加分">
        <el-input-number v-model="performanceRule.bonusPerExtraInspection" :min="0" />
      </el-form-item>
    </el-form>
    <template #title>
      <span>设置</span>
      <el-tooltip effect="dark" content="得分 = 基础分-(每少一天扣分*缺勤天数)-(每异常问题扣分*异常问题数)+(每超额巡检加分*超额巡检次数)" placement="top">
        <el-icon style="cursor:pointer; margin-left:5px; opacity: 0.1;">
          <InfoFilled />
        </el-icon>
      </el-tooltip>
    </template>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; ">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection'
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

export default {
  name: 'PerformanceForm',
  components: {
    InfoFilled
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
  },
  emits: ['update:show', 'saved'],
  setup(props, { emit }) {
    const handleClose = () => {
      emit('update:show', false);
    };
    const performanceRule = ref({
      baseScore: 100,
      deductionPerMissedDay: 2,
      deductionPerAbnormalIssue: 5,
      bonusPerExtraInspection: 3
    });
    const loading = ref(false);
    const submitForm = async () => {
      loading.value = true; // 开始 loading
      try {
        await useInspectionApi().setPerformance(performanceRule.value);
        ElMessage.success('修改成功');
        emit('update:show', false); // 关闭弹窗
        emit('saved'); // 通知父组件刷新
      } catch (error) {
        ElMessage.error('修改失败，请稍后重试');
      } finally {
        loading.value = false; // 无论成功或失败，都关闭 loading
        handleClose(); // 如果你希望每次都关闭弹窗，可以放这里
      }
    };

    return {
      props,
      performanceRule,
      handleClose,
      submitForm,
      loading
    }
  }
}
</script>


<style scoped lang="scss"></style>