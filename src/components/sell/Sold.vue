<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="createDate"
        label="发布日期"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="itemName"
        label="卡片名称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态"
        width="360px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Sold',
  data () {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  // 钩子函数
  mounted: function () {
    this.loadItems()
  },
  methods: {
    // 利用axios发送get请求，接收到成功200代码后，把data数据替换为后端返回的数据
    // 利用data和template里相应元素双向绑定，实现页面动态渲染
    loadItems () {
      let _this = this
      this.$axios.get('/items').then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
        }
      })
    },

    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>

<style scoped>

</style>
