<template>
  <div>
    <el-carousel :interval="5000" height="350px">
      <el-carousel-item v-for="(img,i) in imgList" :key="i">
        <el-image :src="img.url"></el-image>
      </el-carousel-item>
    </el-carousel>
    <br>
    <el-col :span="4">
      <div class="hot-list">
        <strong class="maintitle">HOT热销榜</strong>
        <p class="subtitle">由历史销量得出</p>
      </div>
      <br>
      <el-card
        v-for="(hotSell,i) in hotSellList.slice(0,3)"
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
    <el-col :span="18" :offset="2">
      <el-row>
        <div style="font-size: 38px;float: left;">最新上架</div>
      </el-row>
      <br>
      <el-row style="height: 100px;">
        <el-card
          v-for="(item,i) in recentItemList.slice(0,4)"
          :key="i"
          shadow="never"
          style="height:120px;width: 22%;margin-right: 22px;float: left;background: #d3dce6"
        >
          <img style="width: 30%;float: left" :src="'/static/hot/new.png'">
          <div style="font-size: 30px;text-align: center;margin-top: 5px;">{{item.typeName}}</div>
          <div style="text-align: right;margin-top: 20px">
            <el-link :underline="false" style="font-size: 16px" @click="shop">立即购买</el-link>
          </div>

        </el-card>
      </el-row>
      <br><br>
      <el-row>
        <div style="font-size: 38px;float: left;">促销信息</div>
      </el-row>
      <br>
      <el-row>
        <el-col>
          <el-carousel :interval="7000" direction="vertical" height="120px" indicator-position="none">
            <el-carousel-item v-for="(dis,i) in discountList" :key="i"
                              style="background: #d3dce6;">
              <el-col :span="8">
                <img style="width: 25%;float: right;margin-top: 20px;margin-right:20px"
                     :src="'/static/discount/promotion.png'">
              </el-col>
              <el-col :span="16">
                <span style="float: left;margin-top: 40px;font-size: 32px">礼品卡到期时间{{dis.timeName}}</span>
                <span
                  style="float: left;margin-top: 40px;font-size: 32px;color:#a4d007;background:#4c6b22;display:inline-block;padding:0 6px">
                      -{{100 - dis.discountSell * 100}}%
                    </span>
              </el-col>

            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-col>
  </div>

</template>

<script>
export default {
  name: 'Appindex',
  data () {
    return {
      imgList: [],
      recentItemList: [],
      hotSellList: [],
      discountList: [],
      itemTypes: []
    }
  },
  mounted () {
    this.loadImgList()
    this.loadHotSellList()
    this.loadRecentItemList()
    this.loadDiscountList()
  },
  methods: {
    shop () {
      this.$router.replace('/shop')
    },
    loadDiscountList () {
      this.$axios.get('/items/discount/ads').then(resp => {
        if (resp && resp.status === 200) {
          this.discountList = resp.data
        }
      })
    },
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
    },
    loadRecentItemList () {
      this.$axios.get('/items/recent').then(resp => {
        if (resp && resp.status === 200) {
          this.recentItemList = resp.data
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
