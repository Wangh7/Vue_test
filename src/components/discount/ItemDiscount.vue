<template>
  <div>
    <el-table
      :data="types.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="typeId"
        label="ID"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="名称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="typeDiscount"
        label="折扣"
        width="360px">
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
      :total="types.length">
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
        <el-form-item label="代码">
          <div>{{form.code}}</div>
        </el-form-item>
        <el-form-item label="折扣">
          <el-input-number v-model="form.discount" :precision="2" :step="0.01" :max="0.99"
                           :min="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="submit()">修改</el-button>
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
      form: {
        id: '',
        name: '',
        code: '',
        discount: ''
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
    submit () {
      this.$axios.post('/discount/type', {
        typeId: this.form.id,
        typeName: this.form.name,
        typeCode: this.form.code,
        typeDiscount: this.form.discount
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.dialogFormVisible = false
          this.loadTypes()
          alert(resp.data.message)
        } else {
          alert(resp.data.message)
        }
      })
    },
    handleEdit (index, row, scope) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.typeId,
          name: row.typeName,
          code: row.typeCode,
          discount: row.typeDiscount
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
