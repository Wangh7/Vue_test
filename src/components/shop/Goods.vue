<template>
  <div>
    <el-row style="height: 1000px">
      <el-card
        v-for="item in items"
        :key="item.id"
        style="width: 200px;height: 250px;margin-bottom: 20px;margin-right: 15px;float: left"
        body-style="padding: 0px"
        shadow="hover">
        <img :src="'/static/'+item.itemType.typeCode+'.png'" class="image" alt="封面">
        <div style="padding: 14px;">
          <span>{{item.itemName}}</span>
          <br>
          <span>面额：{{item.oldPrice}}</span>
          <br>
          <span>价格：{{item.newPrice}}</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button">查看详情</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-pagination
        :current-page="1"
        :page-size="3"
        :total="5">
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
      currentPage: 1,
      pagessize: 5
    }
  },
  // 钩子函数
  mounted: function () {
    this.loadItems()
  },
  methods: {
    // 利用axios发送get请求，接收到成功200代码后，把data数据替换为后端返回的数据
    // 利用data和template里相应元素双向绑定，实现页面动态渲染
    loadItems () {
      var _this = this
      this.$axios.get('/items').then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
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
