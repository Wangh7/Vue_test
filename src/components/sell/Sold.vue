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
        label="审查日期"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="itemType.typeName"
        label="卡片种类"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态"
        width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'N'">等待审核</div>
          <div v-if="scope.row.status === 'F'">审核未通过</div>
          <div v-if="scope.row.status === 'T'">审核通过</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="scope.row.status !== 'N'"
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
            <el-button :disabled="scope.row.status !== 'N'" size="mini" type="danger" slot="reference">删除</el-button>
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

    <el-dialog title="修改商品信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="礼品卡种类" prop="type">
          <el-select v-model="form.type" value-key="typeId" placeholder="请选择种类">
            <el-option v-for="(type,i) in types" :key="i"
                       :label="type.typeName+'---'+type.typeDiscountBuy*100+'折'"
                       :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="礼品卡卡号" prop="cardNum">
          <el-input v-model="form.cardNum" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡密码" prop="cardPass">
          <el-input v-model="form.cardPass" placeholder="请输入卡密"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡余额" prop="price">
          <el-row>
            <el-col :span="14">
              <el-input v-model="form.price" placeholder="请输入余额"></el-input>
            </el-col>
            <el-col :span="10">
              <div v-if="form.type && form.price">(预计收入：{{(form.price*form.type.typeDiscountBuy).toFixed(2)}}元)</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="礼品卡到期日期" required>
          <el-form-item prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date"
                            style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>

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
        id: '',
        type: '',
        price: '',
        date: '',
        cardNum: '',
        cardPass: '',
        createTime: ''
      },
      rules: {
        cardNum: [
          {required: true, message: '请输入礼品卡卡号', trigger: 'blur'}
        ],
        cardPass: [
          {required: true, message: '请输入礼品卡卡密', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择礼品卡种类', trigger: 'change'}
        ],
        price: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: isPriceVlidator}
        ],
        date: [
          {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
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
      this.$axios.get('/items/sell').then(resp => {
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
            .post('/items/sell', {
              userId: this.$store.state.user.userId,
              itemId: this.form.id,
              managerId: '0',
              price: parseFloat(this.form.price),
              cardNum: this.form.cardNum,
              cardPass: this.form.cardPass,
              createTime: this.form.createTime,
              dueTime: this.form.date + ' 00:00:00',
              itemType: this.form.type,
              status: 'N'
            }).then(resp => {
            if (resp && resp.data.code === 200) {
              alert(resp.data.message)
              this.loadItems()
            } else {
              alert(resp.data.message)
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
          createTime: row.createTime,
          status: row.status,
          type: row.itemType,
          price: row.price,
          date: row.dueTime.split(' ')[0],
          cardNum: row.cardNum,
          cardPass: ''
        }
      })
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/items/sell/delete', {
        itemId: row.itemId
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.loadItems()
          alert('删除成功')
        } else {
          alert('删除失败')
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
