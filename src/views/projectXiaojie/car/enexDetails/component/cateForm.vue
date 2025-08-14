<template>
  <el-form :model="localFormData" inline label-width="100px" class="category-filter-form">
    <el-form-item label="车辆类型">
      <el-select size="small" v-model="localFormData.vehicleType" placeholder="请选择车辆类型" clearable>
        <el-option label="私家车" value="car" />
        <el-option label="载货车" value="truck" />
        <el-option label="未载货车" value="unLoadTruck" />
      </el-select>
    </el-form-item>

    <el-form-item label="收费状态">
      <el-select size="small" v-model="localFormData.feeStatus" placeholder="请选择收费状态" clearable>
        <el-option label="已缴费" value="paid" />
        <el-option label="未缴费" value="unpaid" />
        <el-option label="免费" value="free" />
      </el-select>
    </el-form-item>

    <el-form-item label="进口厅">
      <el-select size="small" v-model="localFormData.enPlace" placeholder="进口" clearable>
        <el-option v-for="item in enPlaceOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="出口厅">
      <el-select size="small" v-model="localFormData.exPlace" placeholder="出口" clearable>
        <el-option v-for="item in exPlaceOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="异常标记">
      <el-select size="small" v-model="localFormData.exceptionFlag" placeholder="是否异常" clearable>
        <el-option label="正常" value="normal" />
        <el-option label="超时" value="exception" />
      </el-select>
    </el-form-item>

    <el-form-item class="form-button">
      
      <el-button plain size="small" type="primary" @click="onSearch" style="margin-left: 1px;">分类查询</el-button>
      <el-button size="small" @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive, watch } from 'vue';

interface Option {
  label: string;
  value: string;
}

interface FormData {
  vehicleType?: string;
  feeStatus?: string;
  enPlace?: string;
  exPlace?: string;
  exceptionFlag?: string;
}

export default {
  name: 'CateForm',
  props: {
    modelValue: {
      type: Object as () => FormData,
      required: true
    },
    enPlaceOptions: {
      type: Array as () => Option[],
      required: true
    },
    exPlaceOptions: {
      type: Array as () => Option[],
      required: true
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, { emit }) {
    // 局部表单数据，初始化为传入的 modelValue
    const localFormData = reactive<FormData>({ ...props.modelValue });

    const onSearch = () => {
      emit('search', { ...localFormData });
    };

    const onReset = () => {
      Object.keys(localFormData).forEach((key) => {
        localFormData[key as keyof FormData] = undefined;
      });
      emit('search', { ...localFormData }); // 重置后触发搜索
    };

    // 监听外部 modelValue 变化，同步到局部数据
    watch(
      () => props.modelValue,
      (newVal) => {
        Object.assign(localFormData, newVal);
      }
    );

    // 当局部数据变化时，向外触发更新事件，实现 v-model 双向绑定
    watch(localFormData, (val) => {
      emit('update:modelValue', { ...val });
    });

    return {
      props,
      localFormData,
      onSearch,
      onReset
    };
  }
};
</script>


<style lang="scss" scoped>
.category-filter-form {
  .el-form-item { 
    margin-right: 0px;
  }
  .form-button {
    margin-left: 30px;
  }
}
</style>
