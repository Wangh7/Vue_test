<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col style="width: 1200px">
        <el-carousel :interval="5000" height="350px">
          <el-carousel-item v-for="(img,i) in imgList" :key="i">
            <el-image :src="img.url"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" justify="center">
      <el-col style="width: 1200px">
        <el-col :span="4">
          <div class="hot-list">
            <strong class="maintitle">HOT热销榜</strong>
            <p class="subtitle">由历史销量得出</p>
          </div>
          <br>
          <el-card
            v-for="(hotSell,i) in hotSellList"
            :key="i"
            style="width: 100%;height: 100%;margin-bottom: 20px;margin-right: 15px;float: left"
            body-style="padding: 0px"
            shadow="hover">
            <div style="position: relative;">
              <div style="position: absolute; left: 155px;">
                <img v-if="i === 0" :src="'/static/hot/hot1.png'">
                <img v-else-if="i === 1" :src="'/static/hot/hot2.png'">
                <img v-else-if="i === 2" :src="'/static/hot/hot3.png'">
              </div>
              <div style="position: absolute; top: 90px; left: 16px;">
                <span style="color: #000;">总销量:{{hotSell.sellCount}}</span>
              </div>
              <img :src="'/static/'+hotSell.typeCode+'.png'" class="image" alt="封面">
            </div>

          </el-card>
        </el-col>
        <el-col :span="20">
          折扣信息
        </el-col>
      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  name: 'Appindex',
  data () {
    return {
      imgList: [],
      hotSellList: []
    }
  },
  mounted () {
    this.loadImgList()
    this.loadHotSellList()
  },
  methods: {
    loadImgList () {
      this.imgList = [
        {url: '../../static/index/welcome.png'},
        {url: '../../static/index/discount.png'}
      ]
    },
    loadHotSellList () {
      this.$axios.get('/items/hot').then(resp => {
        if (resp && resp.status === 200) {
          this.hotSellList = resp.data
        }
      })
    }
  }
}
</script>

<style scoped>
  .hot-list {
    height: 84px;
    margin: 0 25px;
    padding: 8px 10px 0;
    color: #fff;
    background: linear-gradient(135deg, #BE9F79 0%, #987655 100%);
  }

  .maintitle {
    display: inline-block;
    vertical-align: top;
    width: 90px;
    font-weight: 100;
    font-size: 30px;
    line-height: 30px;

  }

  .subtitle {
    margin-top: 4px;
    font-size: 12px;
  }

  .image {
    width: 100%;
    display: block;
  }
</style>
