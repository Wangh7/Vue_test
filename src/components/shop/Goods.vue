<template>
  <div>
    <el-row>
      <el-col :span="4" v-for="item in items" :key="item.id">
        <el-card style="width: 200px;height: 300px" body-style="{ padding: '0px' }" shadow="hover">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
               class="image">
          <div style="padding: 14px;">
            <span>{{item.name}}</span>
            <br>
            <span>面额：{{item.old_price}}</span>
            <br>
            <span>价格：{{item.new_price}}</span>
            <div class="bottom clearfix">
              <el-button type="text" class="button">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
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
      items: [
        {
          name: '京东E卡',
          old_price: '100',
          new_price: '80'
        }
      ]
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
