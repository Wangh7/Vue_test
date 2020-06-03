<template>
  <div>
    <el-table
      :data="items"
      style="width: 100%"
      :default-sort="{prop:'createTime',order:'descending'}"
      @selection-change="handleSelectionChange"
      ref="table">
      <el-table-column
        type="selection"
        :selectable="checkSelectable"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="收藏日期"
        sortable
        width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.createTime | formatDate}}</div>
          <div v-else style="text-decoration:line-through">{{scope.row.createTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.itemType.typeName"
        label="卡片种类"
        sortable
        width="200px">
        <template slot-scope="scope">
          <el-col :span="12">
            <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.itemType.typeName}}</div>
            <div v-else style="text-decoration:line-through">{{scope.row.itemStock.itemType.typeName}}</div>
          </el-col>
          <el-col :span="12">
            <span style="color:#a4d007;background:#4c6b22;display:inline-block;padding:0 3px">-{{100-scope.row.itemStock.itemType.typeDiscountSell*100}}%</span>
            <span v-if="scope.row.itemStock.entity === true"
                  style="color:#d0b556;background:#6b5f22;display:inline-block;padding:0 3px">实体卡</span>
            <span v-if="scope.row.itemStock.entity === false"
                  style="color:#6bb0ee;background:#2c4882;display:inline-block;padding:0 3px">电子卡</span>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.dueTime"
        label="有效期"
        sortable
        width="180px">
        <template slot-scope="scope">
          <el-col :span="12">
            <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.dueTime | formatDateNoTime}}</div>
            <div v-else style="text-decoration:line-through">{{scope.row.itemStock.dueTime | formatDateNoTime}}</div>
          </el-col>
          <el-col :span="12">
            <div style="color:#a4d007;background:#4c6b22;display:inline-block;padding:0 3px">
              -{{100-diffDate(scope.row.itemStock.dueTime)*100}}%
            </div>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.price.amount"
        label="面额"
        width="140px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.price.amount}}
            *{{scope.row.itemStock.itemType.typeDiscountSell}}*{{diffDate(scope.row.itemStock.dueTime)}}=
          </div>
          <div v-else style="text-decoration:line-through">{{scope.row.itemStock.price.amount}}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="售价"
        width="140px">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <div v-if="scope.row.itemStock.status !== 'Y'">
                {{(scope.row.itemStock.price.amount*scope.row.itemStock.itemType.typeDiscountSell*diffDate(scope.row.itemStock.dueTime)).toFixed(2)}}
              </div>
              <div v-else style="text-decoration:line-through">
                {{(scope.row.itemStock.price.amount*scope.row.itemStock.itemType.typeDiscountSell*diffDate(scope.row.itemStock.dueTime)).toFixed(2)}}
              </div>
            </el-col>
            <el-col :span="12">
              <div v-if="scope.row.itemStock.status === 'Y'" style="color: red;">(已失效)</div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
    <br>
    <el-row style="width: 100%">
      <el-col :span="18">
        <div style="float: right;">共选择{{multipleSelection.length}}件，总计{{totalPrice}}元</div>
      </el-col>
      <el-col :span="6">
        <el-button :disabled="multipleSelection.length === 0" type="success" @click="purchaseCheck">结算</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'Buying',
  data () {
    return {
      items: [],
      discounts: [],
      multipleSelection: [],
      totalPrice: 0,
      item_ids: []
    }
  },
  mounted () {
    this.loadItems()
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
    },
    formatDateNoTime: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + MM + '-' + d
    }
  },
  methods: {
    checkSelectable (row) {
      if (row.itemStock.status === 'Y') {
        return false
      } else {
        return true
      }
    },
    loadItems () {
      let _this = this
      this.$axios.get('/items/buy').then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
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
        return 0
      }
      for (let i = 0; i < this.discounts.length; i++) {
        if (day < this.discounts[i].timeLeftday) {
          return this.discounts[i].discountSell
        }
      }
      return 1
    },
    priceSum () {
      this.totalPrice = 0
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.totalPrice += Number((this.multipleSelection[i].itemStock.price.amount * this.multipleSelection[i].itemStock.itemType.typeDiscountSell * this.diffDate(this.multipleSelection[i].itemStock.dueTime)).toFixed(2))
      }
      this.totalPrice = this.totalPrice.toFixed(2)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.priceSum()
    },
    purchase () {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        console.log(i)
        this.item_ids.push(this.multipleSelection[i].itemStock.itemId)
      }
      this.$axios.post('/items/buy', {
        item_ids: this.item_ids
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$message({
            message: '购买成功',
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
        this.loadItems()
      })
      this.item_ids = []
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/items/buy/delete', {
        id: row.id
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.loadItems()
          this.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            message: '删除失败',
            type: 'danger',
            center: true
          })
          return false
        }
      })
    },
    purchaseCheck () {
      this.$confirm('您一共选择了' + this.multipleSelection.length + '件商品，共需支付' + this.totalPrice + '元。若购买实体卡，系统将按照个人信息中填写的地址和电话进行发货', '再次确认！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.purchase()
      })
    }
  }
}
</script>

<style scoped>

</style>
