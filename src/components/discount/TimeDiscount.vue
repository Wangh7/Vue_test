<template>
  <div>
    <el-table
      :data="discounts.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="id"
        label="ID"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="timeName"
        label="名称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="discountBuy"
        label="收购折扣"
        width="160px">
      </el-table-column>
      <el-table-column
        prop="discountSell"
        label="售卖折扣"
        width="160px">
      </el-table-column>
      <el-table-column
        label="促销信息"
        width="80px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="(value) => commitStatusChange(value, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row, scope)">修改
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
      :total="discounts.length">
    </el-pagination>

    <el-dialog title="修改折扣信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="名称">
          <div>{{form.name}}</div>
        </el-form-item>
        <el-form-item label="收购折扣">
          <el-input-number v-model="form.discountBuy" :precision="2" :step="0.01" :max="0.99"
                           :min="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="售卖折扣">
          <el-input-number v-model="form.discountSell" :precision="2" :step="0.01" :max="0.99"
                           :min="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="checkdiscount">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TimeDiscount',
  data () {
    return {
      discounts: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        id: '',
        name: '',
        discountBuy: '',
        discountSell: ''
      }
    }
  },
  mounted () {
    this.loadDiscounts()
  },
  methods: {
    loadDiscounts () {
      let _this = this
      this.$axios.get('/discount/time').then(resp => {
        if (resp && resp.status === 200) {
          _this.discounts = resp.data
        }
      })
    },
    checkdiscount () {
      if (this.form.discountSell < this.form.discountBuy) {
        this.$confirm('售卖折扣小于收购折扣，宁认真的吗？Σ( ° △ °|||)︴', '血亏！', {
          confirmButtonText: '奥利给',
          cancelButtonText: '手残了',
          type: 'warning'
        }).then(() => {
          this.submit()
        })
      } else {
        this.submit()
      }
    },
    submit () {
      this.$axios.post('/discount/time', {
        id: this.form.id,
        discountBuy: this.form.discountBuy,
        discountSell: this.form.discountSell
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.dialogFormVisible = false
          this.loadDiscounts()
          this.$message({
            message: resp.data.message,
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            message: resp.data.message,
            type: 'danger',
            center: true
          })
        }
      })
    },
    handleEdit (index, row, scope) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.id,
          name: row.timeName,
          discountBuy: row.discountBuy,
          discountSell: row.discountSell
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    commitStatusChange (value, row) {
      this.$axios.put('/discount/time/status', {
        enabled: value,
        id: row.id
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          if (value) {
            this.$message({
              message: '促销 ' + row.timeName + ' 已展示',
              type: 'success',
              center: true
            })
          } else {
            this.$message({
              message: '促销 ' + row.timeName + ' 已屏蔽',
              type: 'info',
              center: true
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
