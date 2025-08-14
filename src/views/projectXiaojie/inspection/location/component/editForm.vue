<template>
  <el-dialog v-model="props.show" title="修改位置" width="400px" :before-close="handleClose">
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
      <el-form-item label="位置名称" prop="locationName" required>
        <el-input v-model="formData.locationName" maxlength="15" />
      </el-form-item>

      <el-form-item label="位置类别" prop="locationType">
        <el-radio-group v-model="formData.locationCate">
          <el-radio label="公共区域">公共区域</el-radio>
          <el-radio label="私人区域">私人区域</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';
import {ElMessage} from 'element-plus';
interface Location {
  id: string;
  locationName?: string;
  locationCate?: string;
}

export default {
  name: 'EditLocationForm',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    row: {
      type: Object as () => Location,
      required: true
    }
  },
  emits: ['update:show', 'edited'],
  setup(props, { emit }) {
    // 初始化表单数据
    const formData = reactive<Location>({
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

    const handleSave = async () => {
      if (!formRef.value) return;
      formRef.value.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          await useInspectionApi().updateLocation(props.row.id, formData);
          emit('edited', { ...formData });
          ElMessage.success('新增成功');
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
          Object.assign(
            formData,
            props.row || {
              id: '',
              locationCate: '',
              locationName: ''
            }
          );
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
      handleSave
    };
  }
};
</script>


<style scoped></style>
