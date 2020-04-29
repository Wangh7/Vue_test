<template>
  <div>
    <el-row style="width: 880px">
      <div v-if="items.length === 0" style="font-size: 24px">Sorry，暂无数据</div>
      <el-card
        v-for="item in items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :key="item.id"
        style="width: 200px;height: 250px;margin-bottom: 20px;margin-right: 15px;float: left"
        body-style="padding: 0px"
        shadow="hover">
        <div style="position: relative;">
          <div style="position: absolute; left: 155px;">
            <img v-if="item.entity === false" :src="'/static/electric.png'">
            <img v-if="item.entity === true" :src="'/static/entity.png'">
          </div>
          <img :src="'/static/'+item.itemType.typeCode+'.png'" class="image" alt="封面">
        </div>
        <div style="padding: 14px;">
          <span>面额：{{item.price.amount}}</span>
          <br>
          <span>价格：{{(item.price.amount*item.itemType.typeDiscountSell).toFixed(2)}}</span>
          <br>
          <span>到期时间：{{item.dueTime | formatDateNoTime}}</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="shopCar(item.itemId)">加入购物车</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-row style="width: 880px">
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
      currentPage: 1,
      pageSize: 16
    }
  },
  // 钩子函数
  mounted () {
    this.loadItems()
    this.loadTypes()
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
          alert('加入购物车成功')
        } else {
          alert(resp.data.message)
        }
      })
    }
  }

}
</script>

<style scoped>

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
