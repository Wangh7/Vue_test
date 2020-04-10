<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="createTime"
        label="发布日期"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="审核日期"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="itemType.typeName"
        label="卡片种类"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="360px">
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
  name: 'CheckedItem',
  data () {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    loadItems () {
      let _this = this
      this.$axios.get('/check/own').then(resp => {
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
