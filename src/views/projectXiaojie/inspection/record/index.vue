<template>
  <div class="record">
    <!-- 汇总 -->
    <template v-if="!isShowingDetail">
      <div class="date-search">
        巡视日期：
        <el-date-picker v-model="currentDate" type="daterange" format="YYYY-MM-DD" value-format="yyyy-MM-dd"
          size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        <el-button type="primary" @click="loadList" size="small" style="margin-left: 10px;" :loading="loading">
          <el-icon style="margin-right: 5px;">
            <Search />
          </el-icon>搜索
        </el-button>
      </div>
      <el-table :data="summaryList" border class="table">
        <el-table-column align="center" prop="inspectionDate" label="巡检日期" width="250" />
        <el-table-column align="center" prop="inspectionCount" label="巡检次数" width="235" />
        <el-table-column align="center" prop="abnormalIssueCount" label="异常问题数" width="235" />
        <el-table-column align="center" prop="unreviewedAbnormalCount" label="未审核异常" width="237" />

        <el-table-column align="center" label="操作" width="280">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="showDetails(row.inspectionDate)" class="details-button">
              <el-icon>
                <View />
              </el-icon>
              详细记录
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <!-- 详情 -->
    <template v-else>
      <div class="goBack">
        <div class="date">
          <span style="font-size: 18px; margin-right: 15px; ">详细记录 </span>
          <span>巡检日期: {{ currentDate }}</span>
        </div>
        <el-button type="primary" size="small" @click="goBack">
          返回
        </el-button>
      </div>

      <el-divider class="divider" />

      <el-form size="small" :inline="true" class="search-panel">
        <el-form-item label="巡检人员:">
          <el-input v-model="searchParams.inspector" placeholder="请输入巡检人员" />
        </el-form-item>

        <el-form-item label="巡检结果">
          <el-select size="small" v-model="searchParams.inspectionResult">
            <el-option label="全部" value="" />
            <el-option label="正常" value="car" />
            <el-option label="异常" value="truck" />
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select size="small" v-model="searchParams.reviewStatus">
            <el-option label="全部" value="" />
            <el-option label="已审核" value="ischecked" />
            <el-option label="未审核" value="unchecked" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadList" :loading="loading">
            <el-icon style="margin-right: 5px;">
              <Search />
            </el-icon>搜索
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="detailList" border class="table">
        <el-table-column align="center" prop="inspectionId" label="巡检编号" width="120" />
        <el-table-column align="center" prop="inspectionTime" label="巡检时间" width="180" />
        <el-table-column align="center" prop="locationType" label="位置类型" width="160" />
        <el-table-column align="center" prop="locationName" label="位置名称" width="160" />
        <el-table-column align="center" prop="inspectionResult" label="巡检结果" width="160" />
        <el-table-column align="center" prop="inspector" label="巡检人员" width="120" />
        <el-table-column align="center" prop="reviewStatus" label="审核状态" width="150" />
        <el-table-column align="center" prop="operation" label="操作" width="188">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleDetail(row)" class="details-button">
              <el-icon>
                <View />
              </el-icon>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <div class="page">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="total,prev, pager, next"
        :total="total" @current-change="handlePageChange" />
    </div>

    <RecordDetailDialog v-model:show="showDetailsDialogVisible" :row="detailsRow" />
  </div>
</template>
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useInspectionApi } from '/@/api/projectXiaojie/inspection';
import { View, Search } from '@element-plus/icons-vue';
import RecordDetailDialog from './component/recordDetailDialog.vue';

// interface SummaryList {
//   inspectionDate: string;
//   inspectionCount: number;
//   abnormalIssueCount: number;
//   unreviewedAbnormalCount: number;
//   id: string;
// }

// interface DetailList {
//   inspectionId: string;
//   inspectionTime: string;
//   locationType: string;
//   locationName: string;
//   inspectionResult?: string;
//   inspector?: string;
//   reviewStatus?: string;
//   inspectionImage?: string;     // 图片链接，字符串类型
//   inspectionRemark?: string;    // 备注，字符串类型
// }

export default {
  name: 'InspectionRecord',
  components: { RecordDetailDialog, View, Search },
  setup() {
    const searchParams = ref({
      inspector: '',
      inspectionResult: '',
      reviewStatus: ''
    });

    const summaryList = ref<any[]>([]);
    const detailList = ref<any[]>([]);
    const isShowingDetail = ref(false);
    const currentDate = ref('');

    const goBack = () => {
      isShowingDetail.value = false;
      detailList.value = [];
      currentDate.value = '';
    };

    // 分页
    const page = ref(1);
    const total = ref<number>(0);
    const loading = ref(false);
    const size = ref<number>(10);

    const getSearchParams = () => ({
      ...searchParams.value,
      startDate: currentDate.value[0] || undefined,
      endDate: currentDate.value[1] || undefined
    });

    const loadList = async (params?: Record<string, any>) => {
      loading.value = true;
      try {
        let res: any;
        const query = params || getSearchParams();
        if (!isShowingDetail.value) {
          res = await useInspectionApi().getRecordList(page.value, size.value, query);
          summaryList.value = res?.data?.records;
        } else {
          res = await useInspectionApi().getDetailRecordList(page.value, size.value, query);
          detailList.value = res?.data?.records;
        }
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

    // 显示详情
    const showDetailsDialogVisible = ref(false);
    const detailsRow = ref<any>({});

    const showDetails = (date: string) => {
      currentDate.value = date;
      isShowingDetail.value = true;
      loadList({ inspectionDate: date });
    };

    const handleDetail = (row: any) => {
      detailsRow.value = row;
      showDetailsDialogVisible.value = true;
    };

    return {
      searchParams,
      summaryList,
      detailList,
      isShowingDetail,
      currentDate,
      goBack,
      page,
      total,
      loading,
      size,
      getSearchParams,
      loadList,
      handlePageChange,
      showDetailsDialogVisible,
      detailsRow,
      showDetails,
      handleDetail
    };
  }
};
</script>


<style lang="scss" scoped>
.record {
  padding: 20px;
  background: #fff;
  overflow-x: auto;

  /* 允许横向滚动 */
  .page {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .table {
    .details-button {
      font-size: 14px;
      font-weight: 350;
    }
  }

  .goBack {
    display: flex;
    justify-content: space-between;
  }

  .divider {
    margin: 15px 0;
  }

  .search-panel {
    display: flex;

    span {
      font-size: 16px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }

  .date-search {
    width: 500px;
    display: flex;
    margin-bottom: 10px;
  }

}
</style>