<template>
  <div class="charge-rule-container">
    <!-- 合并后的主卡片 -->
    <el-card class="main-card">
      <!-- 查询表单区域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="车辆类型">
            <el-select
              v-model="searchForm.vehicleType"
              placeholder="请选择车辆类型"
              filterable
              allow-create
            >
              <el-option label="全车型" value="" />
              <el-option
                v-for="type in vehicleTypeOptions"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="收费场景">
            <el-select
              v-model="searchForm.scene"
              placeholder="请选择场景"
              clearable
            >
              <el-option label="全时段" value="" />
              <el-option
                v-for="scene in sceneOptions"
                :key="scene.value"
                :label="scene.label"
                :value="scene.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="display: flex; align-items: center;">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="primary" @click="openDialog">新增收费规则</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 规则表格区域 -->
      <div class="table-section">
        <div class="table-header">
          <span class="table-title">收费规则列表</span>
          <div class="total-text">共 {{ filteredRules.length }} 条规则</div>
        </div>
        
        <el-table 
          :data="pagedRules" 
          border 
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="vehicleType" label="车辆类型" width="150" />
          <el-table-column prop="scenes" label="适用场景" width="200">
            <template #default="{ row }">
              <el-tag
                v-for="scene in row.scenes"
                :key="scene"
                class="scene-tag"
              >
                {{ getSceneLabel(scene) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="freeDuration" label="免费时长" width="120">
            <template #default="{ row }">
              {{ row.freeDuration || 0 }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="rate" label="费率" width="120">
            <template #default="{ row }">
              {{ `${row.timeRate}元/小时` }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注信息" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ $index }">
              <el-button size="small" @click="editRule($index)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteRule($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :small="false"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredRules.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑收费规则' : '新增收费规则'"
      width="50%"
    >
      <el-form 
        :model="ruleForm" 
        label-width="120px"
      >
        <el-form-item label="车辆类型">
          <el-input
            v-model="ruleForm.vehicleType"
            placeholder="如：小型车、电动车等"
            clearable
          />
        </el-form-item>

        <el-form-item label="收费场景">
          <el-checkbox-group v-model="ruleForm.scenes">
            <el-checkbox
              v-for="scene in sceneOptions"
              :key="scene.value"
              :label="scene.value"
            >{{ scene.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="免费时长">
          <el-input
            v-model.number="ruleForm.freeDuration"
            placeholder="请输入免费时长"
            style="width: 250px"
          >
            <template #append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item label="时间费率">
          <el-input
            v-model.number="ruleForm.timeRate"
            placeholder="请输入每小时费用"
            style="width: 250px"
          >
            <template #append>元/小时</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            :rows="2"
            placeholder="可选备注信息"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

type ChargeRule = {
  vehicleType: string
  scenes: string[]
  freeDuration: number
  timeRate: number
  remark: string
}

export default defineComponent({
  name: 'ChargeRule',
  setup() {
    // 分页相关状态
    const currentPage = ref(1)
    const pageSize = ref(10)
    const loading = ref(false)
    
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const currentEditIndex = ref(-1)

    // 查询表单
    const searchForm = reactive({
      vehicleType: '',
      scene: ''
    })

    // 表单数据
    const ruleForm = reactive<ChargeRule>({
      vehicleType: '',
      scenes: [],
      freeDuration: 0,
      timeRate: 0,
      remark: ''
    })

    // 规则列表
    const rules = ref<ChargeRule[]>([])

    // 场景选项
    const sceneOptions = [
      { value: 'peak', label: '高峰时段' },
      { value: 'offpeak', label: '平峰时段' },
      { value: 'night', label: '夜间时段' },
      { value: 'holiday', label: '节假日' },
      { value: 'weekend', label: '周末' }
    ]

    // 车辆类型选项
    const vehicleTypeOptions = computed(() => {
      const types = new Set<string>()
      rules.value.forEach(rule => {
        types.add(rule.vehicleType)
      })
      return Array.from(types)
    })

    // 过滤后的规则
    const filteredRules = computed(() => {
      return rules.value.filter(rule => {
        const vehicleMatch = searchForm.vehicleType
          ? rule.vehicleType.toLowerCase().includes(searchForm.vehicleType.toLowerCase())
          : true
        
        const sceneMatch = searchForm.scene
          ? rule.scenes.includes(searchForm.scene)
          : true
        
        return vehicleMatch && sceneMatch
      })
    })

    // 当前页显示的规则
    const pagedRules = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredRules.value.slice(start, end)
    })

    // 初始化数据
    onMounted(() => {
      loadRules()
    })

    // 加载规则数据
    const loadRules = () => {
      loading.value = true
      // 模拟API请求
      setTimeout(() => {
        rules.value = [
          {
            vehicleType: '小型车',
            scenes: ['peak', 'offpeak'],
            freeDuration: 30,
            timeRate: 5,
            remark: '工作日收费,高峰时段加收20%'
          },
          {
            vehicleType: '电动车',
            scenes: ['peak', 'offpeak', 'night'],
            freeDuration: 60,
            timeRate: 2,
            remark: '全天收费，夜间时段半价'
          },
          {
            vehicleType: '大型车',
            scenes: ['offpeak', 'weekend'],
            freeDuration: 15,
            timeRate: 8,
            remark: '周末收费，节假日按双倍计算'
          }
        ]
        loading.value = false
      }, 500)
    }

    // 获取场景标签
    const getSceneLabel = (value: string) => {
      const item = sceneOptions.find(item => item.value === value)
      return item ? item.label : value
    }

    // 处理分页大小变化
    const handleSizeChange = (val: number) => {
      pageSize.value = val
      if ((currentPage.value - 1) * pageSize.value >= filteredRules.value.length) {
        currentPage.value = 1
      }
    }

    // 处理当前页变化
    const handleCurrentChange = (val: number) => {
      currentPage.value = val
    }

    // 查询 - 执行过滤逻辑
    const handleSearch = () => {
      loading.value = true
      setTimeout(() => {
        currentPage.value = 1
        loading.value = false
        ElMessage.success('查询成功')
      }, 300)
    }

    // 打开新增弹窗
    const openDialog = () => {
      ruleForm.vehicleType = ''
      ruleForm.scenes = []
      ruleForm.freeDuration = 0
      ruleForm.timeRate = 0
      ruleForm.remark = ''
      isEdit.value = false
      dialogVisible.value = true
    }

    // 编辑规则
    const editRule = (index: number) => {
      const rule = pagedRules.value[index]
      Object.assign(ruleForm, { ...rule })
      currentEditIndex.value = rules.value.findIndex(
        item => item.vehicleType === rule.vehicleType
      )
      isEdit.value = true
      dialogVisible.value = true
    }

    // 提交表单
    const submitForm = async () => {
      const newRule = { ...ruleForm }

      if (isEdit.value) {
        rules.value[currentEditIndex.value] = newRule
        ElMessage.success('规则更新成功')
      } else {
        rules.value.push(newRule)
        ElMessage.success('规则添加成功')
      }

      dialogVisible.value = false
    }

    // 删除规则
    const deleteRule = (index: number) => {
      const rule = pagedRules.value[index]
      
      ElMessageBox.confirm(
        `确定要删除 "${rule.vehicleType}" 的收费规则吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const originalIndex = rules.value.findIndex(
          item => item.vehicleType === rule.vehicleType
        )
        if (originalIndex !== -1) {
          rules.value.splice(originalIndex, 1)
          ElMessage.success('删除成功')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    return {
      currentPage,
      pageSize,
      loading,
      pagedRules,
      filteredRules,
      handleSizeChange,
      handleCurrentChange,
      dialogVisible,
      isEdit,
      searchForm,
      ruleForm,
      rules,
      sceneOptions,
      vehicleTypeOptions,
      getSceneLabel,
      handleSearch,
      openDialog,
      editRule,
      submitForm,
      deleteRule
    }
  }
})
</script>

<style lang="scss" scoped>
.charge-rule-container {
  padding: 20px;
  
  .main-card {
    margin-bottom: 20px;
    
    .search-section {
      padding: 20px 20px 0;
      margin-bottom: 20px;
      
      .search-form {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    }
    
    .table-section {
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        margin-bottom: 15px;
        
        .table-title {
          font-size: 18px;
          font-weight: bold;
        }
        
        .total-text {
          font-size: 14px;
          color: #909399;
        }
      }
      
      .scene-tag {
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
  
  .el-form-item {
    margin-bottom: 22px;
  }
  
  .el-checkbox {
    margin-right: 15px;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 20px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .charge-rule-container {
    .main-card {
      .search-section {
        .search-form {
          flex-direction: column;
          align-items: flex-start;
          
          .el-form-item {
            width: 100%;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>