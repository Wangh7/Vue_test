<template>
  <div>
    <el-table
      :data="roles.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="id"
        label="角色ID"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="nameZh"
        label="角色描述"
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
            @click="handleEdit(scope.row)">编辑
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
      :total="roles.length">
    </el-pagination>

    <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="nameZh">
          <el-input v-model="form.nameZh" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        <el-form-item label="权限分配" prop="perms">
          <el-checkbox-group v-model="selectedPermsIds">
            <el-checkbox v-for="(perm,i) in permissions" :key="i" :label="perm.id">{{perm.desc}}</el-checkbox>
          </el-checkbox-group>
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
export default {
  name: 'RoleManager',
  data () {
    return {
      roles: [],
      permissions: [],
      menus: [],
      selectedPermsIds: [],
      selectedMenusIds: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        id: '',
        name: '',
        nameZh: '',
        enabled: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        nameZh: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.loadRoles()
    this.loadPerms()
    this.loadMenus()
  },
  methods: {
    // 利用axios发送get请求，接收到成功200代码后，把data数据替换为后端返回的数据
    // 利用data和template里相应元素双向绑定，实现页面动态渲染
    loadPerms () {
      let _this = this
      this.$axios.get('/role/perm').then(resp => {
        if (resp && resp.status === 200) {
          _this.permissions = resp.data.result
        }
      })
    },
    loadRoles () {
      let _this = this
      this.$axios.get('/role').then(resp => {
        if (resp && resp.status === 200) {
          _this.roles = resp.data.result
        }
      })
    },
    loadMenus () {
      let _this = this
      this.$axios.get('/role/menu').then(resp => {
        if (resp && resp.status === 200) {
          _this.menus = resp.data.result
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          let perms = []
          for (let i = 0; i < _this.selectedPermsIds.length; i++) {
            for (let j = 0; j < _this.permissions.length; j++) {
              if (_this.selectedPermsIds[i] === _this.permissions[j].id) {
                perms.push(_this.permissions[j])
              }
            }
          }
          this.$axios
            .post('/role', {
              id: this.form.id,
              name: this.form.name,
              nameZh: this.form.nameZh,
              permissions: perms
            })
            .then(resp => {
              if (resp && resp.status === 200) {
                alert('修改成功')
                this.dialogFormVisible = false
                this.loadRoles()
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
    handleEdit (row) {
      this.dialogFormVisible = true
      let permIds = []
      for (let i = 0; i < row.permissions.length; i++) {
        permIds.push(row.permissions[i].id)
      }
      this.selectedPermsIds = permIds
      this.$nextTick(function () {
        this.form = {
          id: row.id,
          name: row.name,
          nameZh: row.nameZh
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
    commitStatusChange (value, role) {
      if (role.id !== 1) {
        this.$axios.put('/role/status', {
          enabled: value,
          id: role.id
        }).then(resp => {
          if (resp && resp.data.code === 200) {
            if (value) {
              this.$message('角色 ' + role.nameZh + ' 已启用')
            } else {
              this.$message('角色 ' + role.nameZh + ' 已禁用')
            }
          }
        })
      } else {
        role.enabled = true
        this.$alert('不能禁用系统管理员角色')
      }
    }
  }
}
</script>

<style scoped>

</style>
