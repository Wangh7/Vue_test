<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px"
      :default-sort="{prop:'createTime',order:'descending'}"
      ref="table">
      <el-table-column
        prop="createTime"
        label="发布日期"
        sortable
        width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="审查日期"
        sortable
        width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.checkTime === 0">暂无</div>
          <div v-else>{{scope.row.checkTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemType.typeName"
        label="卡片种类"
        width="140px">
        <template slot-scope="scope">
          <el-col :span="12">
            <span>{{scope.row.itemType.typeName}}</span>
          </el-col>
          <el-col :span="12">
            <div v-if="scope.row.entity === true">
              <span style="color:#d0b556;background:#6b5f22;display:inline-block;padding:0 3px">实体卡</span>
            </div>
            <div v-if="scope.row.entity === false">
              <span style="color:#6bb0ee;background:#2c4882;display:inline-block;padding:0 3px">电子卡</span>
            </div>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态"
        sortable
        width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'N'">等待审核</div>
          <div v-if="scope.row.status === 'F'">审核未通过</div>
          <div v-if="scope.row.status === 'T'">审核通过</div>
          <div v-if="scope.row.status === 'N1'">等待购买</div>
          <div v-if="scope.row.status === 'N2'">等待发货</div>
          <div v-if="scope.row.status === 'N3'">已发货</div>
          <div v-if="scope.row.status === 'N4'">已收货，等待审核</div>
          <div v-if="scope.row.status === 'F1'">审核未通过，等待退回</div>
          <div v-if="scope.row.status === 'F2'">已退回</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toggleExpand(scope.row)">查看进度</el-button>
          <el-button
            v-if="scope.row.status !== 'N2' && scope.row.status !== 'F1'"
            size="mini"
            :disabled="scope.row.status !== 'N'"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            v-if="scope.row.status === 'N2'"
            size="mini"
            @click="handleSell(scope.$index, scope.row)">发货
          </el-button>
          <el-button
            v-if="scope.row.status === 'F1'"
            size="mini"
            @click="handleBack(scope.$index, scope.row)">收货
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
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-timeline v-loading="loading">
            <el-timeline-item
              v-for="(timeline,i) in timelines"
              :key="i"
              :icon="timeline.icon"
              :type="timeline.type"
              size="large"
              :timestamp="timeline.timestamp | formatDate">
              {{timeline.content}}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      style="width: 1000px"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length">
    </el-pagination>

    <el-dialog title="修改商品信息" :visible.sync="dialogEditVisible">
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
        <el-form-item v-if="form.entity === false" label="礼品卡卡号" prop="cardNum">
          <el-input v-model="form.cardNum" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item v-if="form.entity === false" label="礼品卡密码" prop="cardPass">
          <el-input v-model="form.cardPass" placeholder="请输入卡密"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡余额" prop="price">
          <el-row>
            <el-col :span="10">
              <el-input v-model="form.price" placeholder="请输入余额"></el-input>
            </el-col>
            <el-col :span="14">
              <div v-if="form.type && form.price">
                (预计收入：{{form.price}}*{{form.type.typeDiscountBuy}}*{{timeDiscount.discount}}={{(form.price*form.type.typeDiscountBuy*timeDiscount.discount).toFixed(2)}}元)
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="礼品卡到期日期" required>
          <el-form-item prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date"
                            style="width: 100%;" value-format="timestamp" @change="diffDate(form.date)">
            </el-date-picker>
            <div v-if="timeDiscount.discount !== 1 && timeDiscount.discount!== 0">
              所选到期时间在{{timeDiscount.name}}对应折扣为{{timeDiscount.discount}}
            </div>
          </el-form-item>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetForm('form')">重置</el-button>
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">修改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="向平台发货" :visible.sync="dialogSellVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form2"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="平台收货地址">
          <div>xx省xx市xx街道xx号</div>
        </el-form-item>
        <el-form-item label="平台收货电话">
          <div>10086</div>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNum">
          <el-input v-model="form.expressNum" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetForm('form2')">重置</el-button>
        <el-button @click="dialogSellVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm2('form2')">发货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看退回信息" :visible.sync="dialogBackVisible">
      <el-form
        :model="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="快递单号">
          <div>{{form.cardNum}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="confirm()">
          确认收货
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import SellEdit from './SellEdit'
import {isPriceVlidator, isDate, isCardNum} from '../../utils/validator'

export default {
  name: 'Sold',
  components: SellEdit,
  data () {
    return {
      items: [],
      types: [],
      timelines: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      loading: true,
      dialogEditVisible: false,
      dialogSellVisible: false,
      dialogBackVisible: false,
      form: {
        id: '',
        type: '',
        price: '',
        date: '',
        cardNum: '',
        cardPass: '',
        createTime: '',
        discountItem: '',
        discountTime: '',
        entity: '',
        expressNum: ''
      },
      timeDiscount: {
        name: '',
        discount: 1
      },
      rules: {
        expressNum: [
          {required: true, message: '请输入快递单号', trigger: 'blur'}
        ],
        cardNum: [
          {required: true, message: '请输入礼品卡卡号', trigger: 'blur'},
          {validator: isCardNum, trigger: 'blur'}
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
          {required: true, message: '请选择日期', trigger: 'blur'},
          {validator: isDate}
        ]
      }
    }
  },
  // 钩子函数
  mounted: function () {
    this.loadItems()
    this.loadItemsType()
    this.loadDiscounts()
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
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
    loadTimeLine (itemId) {
      let _this = this
      this.$axios.get('/items/timeline', {
        params: {
          item_id: itemId,
          status: 'S'
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          _this.timelines = resp.data
          this.loading = false
        }
      })
    },
    loadDiscounts () {
      let _this = this
      this.$axios.get('/items/discount/time').then(resp => {
        if (resp && resp.status === 200) {
          _this.discounts = resp.data
        }
      })
    },
    diffDate (date) {
      let day = Math.floor((date - new Date()) / 86400000)
      if (day <= 0) {
        this.timeDiscount.discount = 0
        return
      }
      for (let i = 0; i < this.discounts.length; i++) {
        if (day < this.discounts[i].timeLeftday) {
          this.timeDiscount.discount = this.discounts[i].discountBuy
          this.timeDiscount.name = this.discounts[i].timeName
          return
        }
      }
      this.timeDiscount.discount = 1
    },
    toggleExpand (row) {
      this.timelines = []
      this.loading = true
      this.loadTimeLine(row.itemId)
      let $table = this.$refs.table
      this.items.map((item) => {
        if (row.itemId !== item.itemId) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogEditVisible = false
          this.$axios
            .post('/items/sell', {
              userId: this.$store.state.user.userId,
              itemId: this.form.id,
              managerId: '0',
              price: parseFloat(this.form.price),
              cardNum: this.form.cardNum,
              cardPass: this.form.cardPass,
              createTime: this.form.createTime,
              dueTime: this.form.date,
              itemType: this.form.type,
              status: 'N',
              entity: this.form.entity,
              discountItem: this.form.type.typeDiscountBuy,
              discountTime: this.timeDiscount.discount
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
    submitForm2 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('您所填写的快递单号为 ' + this.form.expressNum + ' 一经确认不可修改！', '再次确认！', {
            confirmButtonText: '奥利给',
            cancelButtonText: '手残了',
            type: 'warning'
          }).then(() => {
            this.dialogSellVisible = false
            this.$axios
              .post('/items/sell/entity', {
                itemId: this.form.id,
                cardNum: this.form.expressNum
              }).then(resp => {
              if (resp && resp.data.code === 200) {
                alert(resp.data.message)
                this.loadItems()
              } else {
                alert(resp.data.message)
                return false
              }
            })
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
    handleEdit (index, row) {
      this.dialogEditVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.itemId,
          createTime: row.createTime,
          status: row.status,
          type: row.itemType,
          price: row.price,
          date: row.dueTime,
          cardNum: row.cardNum,
          cardPass: '',
          entity: row.entity
        }
        this.diffDate(this.form.date)
      })
    },
    handleSell (index, row) {
      this.dialogSellVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.itemId,
          cardNum: row.expressNum
        }
      })
    },
    handleBack (index, row) {
      this.dialogBackVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.itemId,
          cardNum: row.cardPass
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
      this.timeDiscount.discount = 0
    },
    confirm () {
      this.$confirm('确认收货？', '再次确认！', {
        confirmButtonText: '奥利给',
        cancelButtonText: '手残了',
        type: 'warning'
      }).then(() => {
        this.dialogBackVisible = false
        this.$axios
          .post('/items/sell/back', {
            itemId: this.form.id
          }).then(resp => {
          if (resp && resp.data.code === 200) {
            alert(resp.data.message)
            this.loadItems()
          } else {
            alert(resp.data.message)
            return false
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
