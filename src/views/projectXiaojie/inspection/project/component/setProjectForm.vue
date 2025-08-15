<template>
  <el-dialog v-model="props.show" title="查看" :before-close="handleClose" width="500px">
    <el-form :model="projectData" ref="projectDataRef" label-width="100px" :rules="rules">
      <el-form-item label="巡检时间:" prop="inspectionTime">
        <el-date-picker v-model="projectData.inspectionTime" type="date" placeholder="请选择巡检时间" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" style="width: 100%;" /> </el-form-item>

      <el-form-item label="位置名称:" prop="inspectionName">
        <el-input v-model="projectData.inspectionName" placeholder="请输入位置名称" style="width: 100%;" />
      </el-form-item>

      <el-form-item label="巡检人员:" prop="inspector">
        <el-input v-model="projectData.inspector" placeholder="请输入巡检人员" style="width: 100%;" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; ">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script lang="ts">
import { ref } from 'vue'
import { useInspectionApi } from '/@/api/projectXiaojie/inspection'
import { ElMessage } from 'element-plus';

export default {
  name: 'SetProjectForm',
  props: {
    show: {
      type: Boolean,
      required: true
    },
  },
  emits: ['update:show', 'saved'],
  setup(props, { emit }) {
    const projectData = ref({
      inspector: '',
      inspectionName: '',
      inspectionTime: '',
      inspectionType: ''
    });

    const handleClose = () => {
      emit('update:show', false);
      resetForm()
    };
    const rules = ref({
      inspectionTime: [
        { required: true, message: '请选择巡检时间', trigger: 'change' } // 注意 trigger 用 change
      ],
      inspectionName: [{ required: true, message: '请输入位置名称', trigger: 'blur' }],
      inspector: [{ required: true, message: '请输入巡检人员', trigger: 'blur' }]
    })
    const projectDataRef = ref();
    const resetForm = () => {
      projectData.value = {
        inspector: '',
        inspectionName: '',
        inspectionTime: '',
        inspectionType: ''
      };
      if (projectDataRef.value) projectDataRef.value.clearValidate();
    };
    const loading=ref(false);
    const submitForm = async () => {
      try {
        const valid = await projectDataRef.value.validate();
        loading.value = true;
        await useInspectionApi().addProject(projectData.value);
        ElMessage.success('新增成功');
        emit('update:show', false);
        emit('saved');
        resetForm();
      } catch (error) {
        if (error instanceof Error) {
          ElMessage.error('新增失败，请稍后重试');
        }
      } finally {
        loading.value = false;
      }
    };


    return {
      props,
      handleClose,
      projectData,
      submitForm,
      rules,
      projectDataRef,
      loading
    };
  }
}
</script>

<style scoped lang="scss"></style>