<template>
  <div class="entry-record">
    <!-- 搜索条件 -->
    <div class="search-bar">
      入场时间：
      <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
        range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" size="small" style="margin-right: 10px;" />
      单据号：
      <el-input v-model="billNo" size="small" placeholder="请输入单据号" style="width: 150px;margin-right: 10px;" />
      <el-button type="primary" size="small" @click="handleSearch">
        <el-icon>
          <Search />
        </el-icon>查询</el-button>

      <el-button size="small" type="primary" :disabled="selectedRows.length === 0" @click="closeOrder(selectedRows)">
        批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange" border size="small" style="width: 100%"
      :loading="loading">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="billNo" label="单据号" align="center" />
      <el-table-column prop="plateNumber" label="车牌号" align="center" />
      <el-table-column prop="vehicleType" label="车辆类型" align="center" />
      <el-table-column prop="entryMessage" label="入场信息" align="center">
        <el-table-column prop="entryTime" label="入场时间" align="center" />
        <el-table-column prop="grossWeight" label="入场毛重(kg)" align="center" />
        <el-table-column prop="entryFee" label="入场收费(元)" align="center" />
        <el-table-column prop="paymentMethod" label="支付方式" align="center" />
        <el-table-column prop="cashier" label="收费员" align="center" />
      </el-table-column>
      <el-table-column prop="exitStatus" label="出场状态" align="center" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button type="primary" text @click="forceExit(row)">强制出场</el-button>
          <el-button type="danger" text @click="closeOrder(row)">关闭订单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="page" v-model:page-size="size" :total="total"
        layout="total, prev, pager, next" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { useCarApi } from '/@/api/projectXiaojie/car';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'Operation',
  components: { Search },
  setup() {
    const dateRange = ref<[string, string] | null>(null);
    const billNo = ref('');
    const loading = ref(false);
    const searchParams = ref<Record<string, any>>({});
    // 分页
    const page = ref(1);
    const size = ref(10);
    const total = ref(0);

    // 表格数据
    const tableData = ref<any[]>([]);

    // 模拟加载数据
    const loadList = async (params?: Record<string, any>) => {
      loading.value = true;
      try {
        const res = await useCarApi().getOnlineCarList(
          page.value,
          size.value,
          params || searchParams.value
        );
        tableData.value = res?.data?.records ?? [];
        total.value = res?.data?.total ?? 0;
      } catch (error) {
        console.error('加载列表失败', error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(loadList);

    const handlePageChange = (val: number) => {
      page.value = val;
      loadList();
    };
    const forceExit = async (row: any) => {
      loading.value = true;
      try {
        await useCarApi().forceExit(row.id);
        const target = tableData.value.find((item: any) => item.id === row.id);
        if (target) target.exitStatus = '已退库';
        ElMessage.success('强制退库成功');
      } catch (error) {
        console.error('强制退库失败', error);
        ElMessage.error('强制退库失败，请重试');
      } finally {
        loading.value = false;
        loadList();
      }
    };
    /**
     * 
     * @param row 删除
     */
    const closeOrder = (rows: any | any[]) => {
      const targetRows = Array.isArray(rows) ? rows : [rows];

      const content = targetRows.length === 1
        ? `你确定要关闭单据号 <b>${targetRows[0].billNo}</b> 吗？`
        : `你确定要关闭这 <b>${targetRows.length}</b> 个订单吗？`;

      ElMessageBox.confirm(content, '关闭确认', {
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }).then(async () => {
        try {
          for (const row of targetRows) {
            await useCarApi().closeOrder(row.billNo);
          }
          tableData.value = tableData.value.filter(item =>
            !targetRows.some(r => r.billNo === item.billNo)
          );
          total.value -= targetRows.length;
          ElMessage.success('订单已关闭');
        } catch (error) {
          ElMessage.error('关闭订单失败，请稍后重试');
        }
      }).catch(() => {
        ElMessage.info('已取消操作');
      });
    };


    /**
     * 搜索
     */
    const handleSearch = (params: Record<string, any>) => {
      page.value = 1;
      searchParams.value = params;
      loadList(params);
    };
    /**
     * 批量删除
     */
    const selectedRows = ref<any[]>([]);

    // 表格勾选变化时触发
    const handleSelectionChange = (rows: any[]) => {
      selectedRows.value = rows;
    };

    return {
      tableData,
      total,
      page,
      handlePageChange,
      dateRange,
      billNo,
      loadList,
      forceExit,
      closeOrder,
      size,
      loading,
      handleSearch,
      handleSelectionChange,
      selectedRows
    };
  }
}

</script>

<style scoped lang="scss">
.entry-record {
  padding: 20px;
  background: #fff;

  .search-bar {
    display: flex;
    align-items: center;
    width: 880px;
    margin-bottom: 15px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
