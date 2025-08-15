<template>
  <el-dialog v-model="props.show" title="修改位置" width="400px" :before-close="handleClose">
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
      <el-form-item label="位置名称" prop="locationName" required>
        <el-input v-model="formData.locationName" maxlength="15" />
      </el-form-item>

      <el-form-item label="位置类别" prop="locationCate">
        <el-radio-group v-model="formData.locationCate">
          <el-radio label="公共区域">公共区域</el-radio>
          <el-radio label="私人区域">私人区域</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:show',false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleAdd">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';

// interface Location {
//   id: string;
//   locationName?: string;
//   locationCate?: string;
// }

export default {
  name: 'AddLocationForm',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:show', 'added'],
  setup(props, { emit }) {
    // 初始化表单数据
    const formData = reactive<any>({
      id: '',
      locationCate: '',
      locationName: ''
    });

    const rules = reactive({
      locationName: [{ required: true, message: '请输入位置名称', trigger: 'blur' }],
      locationCate: [{ required: true, message: '请选择位置类别', trigger: 'change' }]
    });

    const loading = ref(false);
    const formRef = ref<FormInstance>();

    const handleClose = (done: () => void) => {
      if (!loading.value) done();
      emit('update:show', false);
    };

    const handleAdd = async () => {
      if (!formRef.value) return;
      formRef.value.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          await useInspectionApi().addLocation(formData);
          emit('added', { ...formData });
          ElMessage.success('添加成功');
          emit('update:show', false);
        } catch (error) {
          console.error(error);
        } finally {
          loading.value = false;
        }
      });
    };

    watch(
      () => props.show,
      (val) => {
        if (val) {
          Object.assign(formData, {
            id: '',
            locationCate: '',
            locationName: ''
          });
        }
      }
    );

    return {
      props,
      formData,
      rules,
      loading,
      formRef,
      handleClose,
      handleAdd
    };
  }
};
</script>


<style scoped></style>
