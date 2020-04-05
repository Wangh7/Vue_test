<template>
  <div>
    <el-table
      :data="users.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="id"
        label="ID"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="username"
        label="登录名"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机"
        width="180px">
      </el-table-column>
      <el-table-column
        label="启用状态"
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
            @click="handleEdit(scope.$index, scope.row, scope)">编辑
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
      :total="users.length">
    </el-pagination>

    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="登录名">
          <div>{{form.username}}</div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetForm('form')">重置</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {isPhone} from '../../utils/validator'

export default {
  name: 'UserManager',
  data () {
    return {
      users: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        username: '',
        nickname: '',
        phone: ''
      },
      rules: {
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: isPhone}
        ]
      }
    }
  },
  mounted: function () {
    this.loadUsers()
  },
  methods: {
    // 利用axios发送get请求，接收到成功200代码后，把data数据替换为后端返回的数据
    // 利用data和template里相应元素双向绑定，实现页面动态渲染
    loadUsers () {
      let _this = this
      this.$axios.get('/user').then(resp => {
        if (resp && resp.status === 200) {
          _this.users = resp.data
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$axios
            .post('/user', {
              username: this.form.username,
              nickname: this.form.nickname,
              phone: this.form.phone
            })
            .then(resp => {
              if (resp && resp.status === 200) {
                alert('修改成功')
                this.loadUsers()
              } else {
                alert('修改失败')
                return false
              }
            })
        } else {
          console.log('error submit!!')
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
          id: row.id,
          username: row.username,
          nickname: row.nickname,
          phone: row.phone
        }
      })
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/user/delete', {
        id: row.id
      }).then(resp => {
        if (resp && resp.status === 200) {
          alert('删除成功')
        } else {
          alert('删除失败')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    commitStatusChange (value, user) {
      if (user.username !== 'admin') {
        this.$axios.put('/user/status', {
          enabled: value,
          username: user.username
        }).then(resp => {
          if (resp && resp.data.code === 200) {
            if (value) {
              this.$message('用户 ' + user.username + ' 已启用')
            } else {
              this.$message('用户 ' + user.username + ' 已禁用')
            }
          }
        })
      } else {
        user.enabled = true
        this.$alert('不能禁用管理员用户')
      }
    }
  }
}
</script>

<style scoped>

</style>
