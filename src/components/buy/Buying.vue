<template>
  <div>
    <el-table
      :data="items"
      style="width: 1000px"
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
        width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.createTime | formatDate}}</div>
          <div v-else style="text-decoration:line-through">{{scope.row.createTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.itemType.typeName"
        label="卡片种类"
        sortable
        width="140px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.itemType.typeName}}</div>
          <div v-else style="text-decoration:line-through">{{scope.row.itemStock.itemType.typeName}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.price.amount"
        label="面额"
        width="140px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.price.amount}}</div>
          <div v-else style="text-decoration:line-through">{{scope.row.itemStock.price.amount}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.dueTime"
        label="有效期"
        sortable
        width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.itemStock.status !== 'Y'">{{scope.row.itemStock.dueTime | formatDateNoTime}}</div>
          <div v-else style="text-decoration:line-through">{{scope.row.itemStock.dueTime | formatDateNoTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="售价"
        width="180px">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <div v-if="scope.row.itemStock.status !== 'Y'">{{(scope.row.itemStock.price.amount*scope.row.itemStock.itemType.typeDiscountSell).toFixed(2)}}</div>
              <div v-else style="text-decoration:line-through">{{(scope.row.itemStock.price.amount*scope.row.itemStock.itemType.typeDiscountSell).toFixed(2)}}</div>
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
    <el-row>
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
      multipleSelection: [],
      totalPrice: 0,
      item_ids: []
    }
  },
  mounted () {
    this.loadItems()
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
    priceSum () {
      this.totalPrice = 0
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.totalPrice += Number((this.multipleSelection[i].itemStock.price.amount * this.multipleSelection[i].itemStock.itemType.typeDiscountSell).toFixed(2))
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
          alert('购买成功')
        } else {
          alert(resp.data.message)
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
          alert('删除成功')
        } else {
          alert('删除失败')
          return false
        }
      })
    },
    purchaseCheck () {
      this.$confirm('您一共选择了' + this.multipleSelection.length + '件商品，共需支付' + this.totalPrice + '元', '再次确认！', {
        confirmButtonText: '冲！',
        cancelButtonText: '告辞',
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
