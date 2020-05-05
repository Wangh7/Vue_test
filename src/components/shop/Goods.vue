<template>
  <div>
    <el-row style="width: 100%">
      <div v-if="items.length === 0" style="font-size: 24px">Sorry，暂无数据</div>
      <el-card
        v-for="item in items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :key="item.id"
        style="width: 200px;height: 250px;margin-bottom: 25px;margin-left: 30px;float: left"
        body-style="padding: 0px"
        shadow="hover">
        <div style="position: relative;">
          <div style="position: absolute; left: 155px;">
            <img v-if="item.entity === false" :src="'/static/electric.png'">
            <img v-if="item.entity === true" :src="'/static/entity.png'">
          </div>
          <img :src="'/static/'+item.itemType.typeCode+'.png'" onerror="this.src='/static/none.png'" class="image" alt="封面">
        </div>
        <div style="padding-top: 14px;padding-left: 8px;padding-right: 8px;">
          <div style="text-align: left;">
            <strong style="font-size: 24px;color: #f60">¥{{(item.price.amount*item.itemType.typeDiscountSell*diffDate(item.dueTime)).toFixed(2).split(".")[0]}}.</strong><strong style="font-size: 16px;color: #f60">{{(item.price.amount*item.itemType.typeDiscountSell*diffDate(item.dueTime)).toFixed(2).split(".")[1]}}</strong>
            <strong style="float: right;font-size: 24px;color:#a4d007;background:#4c6b22;display:inline-block;padding:0 3px">-{{100-(item.itemType.typeDiscountSell*diffDate(item.dueTime)).toFixed(2)*100}}%</strong>
          </div>
          <div style="text-align:left;padding-top: 3px;">
            <i class="el-icon-bank-card"></i>
            ¥{{item.price.amount}}
          </div>
          <div style="text-align:left;padding-top: 3px;">
            <i class="el-icon-time"></i>
            {{item.dueTime | formatDateNoTime}}
            <span v-if="(item.dueTime-(new Date()).valueOf())<2592000000" style="float: right;color:#d00;font-size: small">即将到期</span>
          </div>
          <div>
            <el-button style="float: right;padding: 0" type="text" icon="el-icon-shopping-cart-2" @click="shopCar(item.itemId)">加入购物车</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-row style="width: 100%">
      <el-pagination
        v-if="items.length !==0"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="items.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      items: [],
      types: [],
      discounts: [],
      currentPage: 1,
      pageSize: 16
    }
  },
  // 钩子函数
  mounted () {
    this.loadItems()
    this.loadTypes()
    this.loadDiscounts()
  },
  filters: {
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
    loadTypes () {
      let _this = this
      this.$axios.get('/items/types').then(resp => {
        if (resp && resp.status === 200) {
          _this.types = resp.data
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
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    shopCar (itemId) {
      console.log(itemId)
      this.$axios.get('/items/car', {
        params: {
          item_id: itemId
        }
      }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$message({
            message: '加入购物车成功',
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            message: resp.data.message,
            type: 'warning',
            center: true
          })
        }
      })
    }
  }

}
</script>

<style scoped>

  .image {
    width: 100%;
    display: block;
  }
</style>
