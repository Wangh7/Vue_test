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
        prop="itemType.typeName"
        label="卡片种类"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="price"
        label="剩余金额"
        width="360px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row, scope)">审查
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

    <el-dialog title="审查商品信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="礼品卡种类">
          <div>{{form.type}}</div>
        </el-form-item>
        <el-form-item label="礼品卡卡号">
          <div>{{form.cardNum}}</div>
        </el-form-item>
        <el-form-item label="礼品卡密码">
          <div>{{form.cardPass}}</div>
        </el-form-item>
        <el-form-item label="礼品卡余额">
          <div>{{form.price}}</div>
        </el-form-item>
        <el-form-item label="礼品卡到期日期">
          <div>{{form.date}}</div>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="form.newPass" placeholder="请输入新卡密"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="warning" @click="resetForm('form')">重置</el-button>
        <el-button type="danger" @click="checkFail()">打回</el-button>
        <el-button type="success" @click="checkSuccess('form')">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let cTime = function () {
  let myDate = new Date()
  let hour = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours()
  let min = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes()
  let sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds()
  let year = myDate.getFullYear()
  let mon = myDate.getMonth() > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1)
  let day = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()
  let str = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec
  return str
}
export default {
  name: 'CheckItem',
  data () {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        id: '',
        type: '',
        price: '',
        date: '',
        cardNum: '',
        cardPass: '',
        dueTime: '',
        createTime: ''
      },
      rules: {
        newPass: [
          {required: true, message: '请输入新卡密', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.loadItems()
  },
  methods: {
    loadItems () {
      let _this = this
      this.$axios.get('/check', {
        params: {
          status: 'N'
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
        }
      })
    },
    checkSuccess (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$axios
            .post('/check/success', {
            itemId: this.form.id,
            managerId: this.$store.state.user.userId,
            newPassword: this.form.newPass,
            checkTime: cTime()
          }).then(resp => {
            if (resp && resp.data.code === 200) {
              alert(resp.data.message)
              this.loadItems()
            } else {
              alert(resp.data.message)
              return false
            }
          })
        }
      })
    },
    checkFail () {
      this.dialogFormVisible = false
      this.$axios
        .post('/check/fail', {
          itemId: this.form.id,
          managerId: this.$store.state.user.userId,
          checkTime: cTime()
        }).then(resp => {
        if (resp && resp.data.code === 200) {
          alert(resp.data.message)
          this.loadItems()
        } else {
          alert(resp.data.message)
          return false
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleEdit (index, row, scope) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.itemId,
          createTime: row.createTime,
          status: row.status,
          type: row.itemType.typeName,
          price: row.price,
          date: row.dueTime.split(' ')[0],
          cardNum: row.cardNum,
          cardPass: row.cardPass
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
