<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="150px"
      class="demo-ruleForm"
      style="text-align: left">
      <!-- prop和v-model的名称需要一致 -->
      <el-form-item label="用户ID">
        <div>{{form.id}}</div>
      </el-form-item>
      <el-form-item label="登录名">
        <div>{{form.username}}</div>
      </el-form-item>
      <el-form-item label="昵称">
        <div>{{form.nickname}}</div>
      </el-form-item>
      <el-form-item label="手机">
        <div>{{form.phone}}</div>
      </el-form-item>
      <el-form-item label="地址">
        <div>{{form.address}}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="handleEdit ()">修改</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="用户ID">
          <div>{{form.id}}</div>
        </el-form-item>
        <el-form-item label="登录名">
          <div>{{form.username}}</div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input prefix-icon="el-icon-user" v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input prefix-icon="el-icon-mobile-phone" v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input prefix-icon="el-icon-location-outline" v-model="form.address" placeholder="请输入收货地址"></el-input>
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
  name: 'Profile',
  data () {
    return {
      dialogFormVisible: false,
      form: {
        id: '',
        username: '',
        nickname: '',
        phone: '',
        address: ''
      },
      rules: {
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {validator: isPhone}
        ],
        address: [
          {required: true, message: '请输入收货地址', trigger: 'blur'}
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
      this.$axios.get('/user/single')
        .then(resp => {
        if (resp && resp.status === 200) {
          _this.form = resp.data
        }
      })
    },
    handleEdit () {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          id: this.form.id,
          username: this.form.username,
          nickname: this.form.nickname,
          phone: this.form.phone,
          address: this.form.address
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$axios
            .post('/user/single', {
              username: this.form.username,
              nickname: this.form.nickname,
              phone: this.form.phone,
              address: this.form.address
            })
            .then(resp => {
              if (resp && resp.status === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  center: true
                })
                this.loadUsers()
              } else {
                this.$message({
                  message: '修改失败',
                  type: 'danger',
                  center: true
                })
                return false
              }
            })
        } else {
          console.log('error submit!!')
          return false
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
