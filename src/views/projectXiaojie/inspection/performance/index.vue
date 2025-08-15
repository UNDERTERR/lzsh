<template>
  <div class="performance">
    <div class="date-search">
      <span class="label">巡视日期：</span>
      <el-date-picker v-model="currentDate" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small"
        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="margin-right: 15px;width: 200px;" />

      <span class="label">巡检人员：</span>
      <el-input style="width: 250px;" v-model="inspector" placeholder="请输入巡检人员" size="small" />

      <el-button type="primary" @click="loadList" size="small" style="margin-left: 15px;">
        <el-icon style="margin-right: 4px">
          <Search />
        </el-icon>
        搜索
      </el-button>
    </div>
    <el-table :data="performanceList" border class="table">
      <el-table-column align="center" prop="inspectionDate" label="评定月份" width="205" />
      <el-table-column align="center" prop="inspector" label="巡检人员" width="208" />
      <el-table-column align="center" prop="inspectionDays" label="巡检天数" width="205" />
      <el-table-column align="center" prop="totalInspections" label="总巡检次数" width="205" />
      <el-table-column align="center" prop="abnormalIssues" label="异常问题数" width="205" />
      <el-table-column align="center" prop="performanceScore" label="得分" width="210" />

    </el-table>

    <div class="page">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="total,prev, pager, next"
        :total="total" @current-change="handlePageChange" />
    </div>


  </div>
</template>
<script lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';
export default {
  name: 'Performance',
  components: {
    Search
  },
  setup() {
    const currentDate = ref([])
    const inspector = ref('')
    const performanceList = ref<any[]>([])

    /**
     * 分页
     */
    const page = ref(1);
    const total = ref<number>(0);
    const loading = ref(false);
    const size = ref<number>(10);
    const getSearchParams = () => ({
      inspector: inspector.value,
      startDate: currentDate.value[0] || undefined,
      endDate: currentDate.value[1] || undefined
    });
    const loadList = async () => {
      loading.value = true;
      try {
        const query = getSearchParams();
        const res = await useInspectionApi().getPerformanceList(query);
        performanceList.value = res?.data?.records;

        total.value = res?.data?.total ?? 0;
      } catch (error) {
        console.error('加载列表失败', error);
      } finally {
        loading.value = false;
      }
    };
    const handlePageChange = (val: number) => {
      page.value = val;
      loadList();
    };
    onMounted(loadList);
    return {
      performanceList,
      currentDate,
      inspector,
      page,
      total,
      loading,
      size,
      loadList,
      handlePageChange,
    }
  }
}
</script>

<style scoped lang="scss">
.performance {
  padding: 20px;
  background: #fff;
  overflow-x: auto;

  .date-search {
    display: flex;
    margin-bottom: 10px;
    width: 700px;

    .label {
      width: 75px;
    }
  }

  .page {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

}
</style>