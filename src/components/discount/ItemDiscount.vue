<template>
  <div>
    <el-table
      :data="types.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">

      <el-table-column
        prop="typeId"
        label="ID"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="名称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="typeDiscountBuy"
        label="收购折扣"
        width="160px">
      </el-table-column>
      <el-table-column
        prop="typeDiscountSell"
        label="售卖折扣"
        width="160px">
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
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="success" size="mini" @click="handleNew">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="types.length">
    </el-pagination>

    <el-dialog title="修改折扣信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="商品名称">
          <el-input prefix-icon="el-icon-document" v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品代码">
          <el-input prefix-icon="el-icon-document" v-model="form.code" placeholder="请输入商品代码"></el-input>
        </el-form-item>
        <el-form-item label="收购折扣">
          <el-input-number v-model="form.discountBuy" :precision="2" :step="0.01" :max="0.99" :min="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="售卖折扣">
          <el-input-number v-model="form.discountSell" :precision="2" :step="0.01" :max="0.99" :min="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="checkdiscount">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加商品/折扣信息" :visible.sync="dialogItemVisible">
      <el-form
        :model="form"
        ref="form2"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="商品名称">
          <el-input prefix-icon="el-icon-document" v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品代码">
          <el-input prefix-icon="el-icon-document" v-model="form.code" placeholder="请输入商品代码"></el-input>
        </el-form-item>
        <el-form-item label="收购折扣">
          <el-input-number v-model="form.discountBuy" :precision="2" :step="0.01" :max="0.99" :min="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="售卖折扣">
          <el-input-number v-model="form.discountSell" :precision="2" :step="0.01" :max="0.99" :min="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogItemVisible = false">取消</el-button>
        <el-button type="success" @click="submit()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ItemDiscount',
  data () {
    return {
      types: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      dialogItemVisible: false,
      form: {
        id: '',
        name: '',
        code: '',
        discountBuy: '',
        discountSell: ''
      }
    }
  },
  mounted () {
    this.loadTypes()
  },
  methods: {
    loadTypes () {
      let _this = this
      this.$axios.get('/discount').then(resp => {
        if (resp && resp.status === 200) {
          _this.types = resp.data
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
      this.$axios.post('/discount/type', {
        typeId: this.form.id,
        typeName: this.form.name,
        typeCode: this.form.code,
        typeDiscountBuy: this.form.discountBuy,
        typeDiscountSell: this.form.discountSell
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.dialogFormVisible = false
          this.dialogItemVisible = false
          this.loadTypes()
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
    handleNew () {
      this.dialogItemVisible = true
      this.form = {
        id: '',
        name: '',
        code: '',
        discountBuy: 0.9,
        discountSell: 0.9
      }
    },
    handleEdit (index, row, scope) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.typeId,
          name: row.typeName,
          code: row.typeCode,
          discountBuy: row.typeDiscountBuy,
          discountSell: row.typeDiscountSell
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/discount/type/delete', {
        typeId: row.typeId
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.loadTypes()
          this.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            message: resp.data.message,
            type: 'danger',
            center: true
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
