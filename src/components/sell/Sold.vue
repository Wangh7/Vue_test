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
      :total="items.length">
    </el-pagination>
    <el-button @click="deleteItem()">测试</el-button>

    <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="礼品卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡种类" prop="type">
          <el-select v-model="form.type" placeholder="请选择种类">
            <el-option v-for="(item,i) in types" :key="i"
                       :label="item.typeName"
                       :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="礼品卡面额" prop="oldPrice">
          <el-input v-model="form.oldPrice" placeholder="请输入面额"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡售价" prop="newPrice">
          <el-input v-model="form.newPrice" placeholder="请输入售价"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡到期时间" required>
          <el-col :span="10">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                              style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="12">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="form.date2"
                              style="width: 100%;" value-format="HH:mm:ss"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>

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

import SellEdit from './SellEdit'
import {isPriceVlidator} from '../../utils/validator'

export default {
  name: 'Sold',
  components: SellEdit,
  data () {
    return {
      items: [],
      types: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        type: '',
        oldPrice: '',
        newPrice: '',
        date1: '',
        date2: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入礼品卡名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择礼品卡种类', trigger: 'change'}
        ],
        oldPrice: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        newPrice: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        date1: [
          {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date2: [
          {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
        ]
      }
    }
  },
  // 钩子函数
  mounted: function () {
    this.loadItems()
    this.loadItemsType()
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
    loadItemsType () {
      let _this = this
      this.$axios.get('/items/types').then(resp => {
        if (resp && resp.status === 200) {
          _this.types = resp.data
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$axios
            .post('/items', {
              userId: '1',
              createDate: this.form.createDate,
              status: this.form.status,
              itemId: this.form.id,
              oldPrice: parseFloat(this.form.oldPrice),
              newPrice: parseFloat(this.form.newPrice),
              itemName: this.form.name,
              dueDate: this.form.date1 + ' ' + this.form.date2,
              itemType: {typeId: this.form.type}
            }).then(resp => {
            if (resp && resp.status === 200) {
              alert('修改成功')
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
          id: row.itemId,
          createDate: row.createDate,
          status: row.status,
          name: row.itemName,
          type: row.itemType.typeId,
          oldPrice: row.oldPrice,
          newPrice: row.newPrice,
          date1: row.dueDate,
          date2: row.dueDate
        }
      })
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
