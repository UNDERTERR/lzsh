<template>
  <div class="record">
    <div class="search">
      商品名称：
      <el-input v-model="productName" size="small" placeholder="请输入商品名称" style="width: 200px;" />
      <el-button type="primary" @click="loadList" size="small" style="margin-left: 10px;">
        <el-icon style="margin-right: 5px;">
          <Search />
        </el-icon>查询
      </el-button>
    </div>

    <el-table :data="summaryList" border class="table" size="small">
      <el-table-column align="center" prop="date" label="日期" width="160" />
      <el-table-column align="center" prop="productName" label="商品名称" width="140" />
      <el-table-column align="center" prop="productType" label="商品类型" width="140" />
      <el-table-column align="center" prop="productPrice" label="价格" width="140" />
      <el-table-column align="center" prop="productSize" label="规格" width="155" />
      <el-table-column align="center" prop="productLocation" label="产地" width="155" />
      <el-table-column align="center" prop="remark" label="备注" width="180" />

      <el-table-column align="center" label="操作" width="168">
        <template #default="{ row }">
          <el-button type="danger" text size="small" @click="handleDelete(row)" class="details-button">
            <el-icon>
              <DeleteFilled />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="page">
      <el-pagination v-model:current-page="page" v-model:page-size="size" layout="total,prev, pager, next"
        :total="total" @current-change="handlePageChange" />
    </div>

  </div>
</template>
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useProductApi } from '/@/api/projectXiaojie/product';
import { Search, DeleteFilled } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
export default {
  name: 'ProductDetails',
  components: {
    Search, DeleteFilled
  },
  setup() {
    const productName = ref('');
    const summaryList = ref<any[]>([]);
    const isShowingDetail = ref(false);

    // 分页
    const page = ref(1);
    const total = ref<number>(0);
    const loading = ref(false);
    const size = ref<number>(10);

    const loadList = async () => {
      loading.value = true;
      try {
        const query = { page: page.value, size: size.value, productName: productName.value }
        const res = await useProductApi().getProductList(query);
        summaryList.value = res?.data?.records;
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
    const handleDelete = (row: any) => {
      ElMessageBox.confirm(
        `确定要删除商品「${row.productName}」吗？`,
        '提示',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).then(async () => {
        try {
          await useProductApi().deleteProduct(row.id); // 调接口
          ElMessage.success('删除成功');
          loadList(); // 重新加载列表
        } catch (error) {
          ElMessage.error('删除失败');
        }
      }).catch(() => {
        // 点击取消，不做处理
      });
    };


    return {
      summaryList,
      isShowingDetail,
      page,
      total,
      loading,
      size,
      loadList,
      handlePageChange,
      handleDelete,
      productName
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

  .search {
    width: 500px;
    display: flex;
    margin-bottom: 20px;
  }

}
</style>