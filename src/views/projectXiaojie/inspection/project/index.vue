<template>
  <div class="project">

    <el-button type="primary" plain style="margin-bottom: 20px;" @click="showPerformanceForm=true">设置绩效规则</el-button>
    <el-table :data="projectList" border class="table">
      <el-table-column align="center" prop="cate" label="所属类别" width="488" />
      <el-table-column align="center" prop="quantity" label="设置项目数" width="500" />
      <el-table-column align="center" prop="operation" label="操作" width="250">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="showProjectForm = true" class="details-button">
            <el-icon>
              <EditPen />
            </el-icon>
            设置项目
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <SetProjectForm v-model:show="showProjectForm" @saved="handleSet" />
    <PerformanceForm v-model:show="showPerformanceForm" @saved="handlePerformance" />
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';
import { EditPen } from '@element-plus/icons-vue';
import SetProjectForm from './component/setProjectForm.vue';
import PerformanceForm from './component/performanceForm.vue';
export default {
  name: 'Project',
  components: { EditPen, SetProjectForm,PerformanceForm },
  setup() {
    const loading = ref(false);
    const projectList = ref<any[]>([])
    const loadList = async () => {
      loading.value = true
      try {
        const res = await useInspectionApi().getProjectSummary()
        projectList.value = res?.data?.records ?? []
      } catch (error) {
        console.error('加载列表失败', error)
      } finally {
        loading.value = false
      }
    }
    onMounted(loadList)
    /** 
     * 设置项目
     */
    const showProjectForm = ref(false)
    const handleSet=async()=>{ 
      showProjectForm.value = false
      loadList()
    }
    /**
     * 设置绩效
     */
    const showPerformanceForm = ref(false)
    const handlePerformance=async()=>{ 
      showPerformanceForm.value = false
      loadList()
    }



    
    return {
      projectList,
      showProjectForm,
      handleSet,
      showPerformanceForm,
      handlePerformance
    }
  }
}

</script>


<style lang="scss" scoped>
.project {
  padding: 20px;
  background: #fff;
  overflow-x: auto;
}
</style>