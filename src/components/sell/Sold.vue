<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
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
            @click="dialogFormVisible = true">编辑
          </el-button>
          <el-popover
            placement="top"
            width="160"
            :ref="`popover-${scope.$index}`">
            <p>确定删除吗？</p>
            <div style="text-align: right;margin:0">
              <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消
              </el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row, scope)">确定</el-button>
            </div>
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length">
    </el-pagination>
    <el-button @click="deleteItem()">测试</el-button>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import SellEdit from './SellEdit'

export default {
  name: 'Sold',
  components: SellEdit,
  data () {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        name: ''
      }
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
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/items/delete', {
        itemId: row.itemId
      }).then(resp => {
        if (resp && resp.status === 200) {
          alert('删除成功')
        } else {
          alert('删除失败')
          return false
        }
      })
    },
    deleteItem () {
      this.$axios.post('/items/delete', {
        itemId: 14
      }).then(resp => {
        if (resp && resp.status === 200) {
          alert('删除成功')
        } else {
          alert('删除失败')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
