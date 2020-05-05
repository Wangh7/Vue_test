<template>
  <div>
    <el-col style="width: 600px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="礼品卡形式" prop="radio">
          <el-radio v-model="form.entity" label="false" border @change="resetForm('form')">电子卡</el-radio>
          <el-radio v-model="form.entity" label="true" border @change="resetForm('form')">实体卡</el-radio>
        </el-form-item>
        <el-form-item label="礼品卡种类" prop="type">
          <el-select v-model="form.type" value-key="typeId" placeholder="请选择种类">
            <el-option v-for="(type,i) in types" :key="i"
                       :label="type.typeName+'---'+type.typeDiscountBuy*100+'折'"
                       :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.entity === 'false'" label="礼品卡卡号" prop="cardNum">
          <el-input prefix-icon="el-icon-bank-card" v-model="form.cardNum" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item v-if="form.entity === 'false'" label="礼品卡密码" prop="cardPass">
          <el-input prefix-icon="el-icon-key" v-model="form.cardPass" placeholder="请输入卡密"></el-input>
        </el-form-item>
        <el-form-item label="礼品卡余额" prop="price">
          <el-row>
            <el-col :span="10">
              <el-input prefix-icon="el-icon-coin" v-model="form.price" placeholder="请输入余额"></el-input>
            </el-col>
            <el-col :span="14">
              <div v-if="form.type && form.price">(预计收入：{{form.price}}*{{form.type.typeDiscountBuy}}*{{timeDiscount.discount}}={{(form.price*form.type.typeDiscountBuy*timeDiscount.discount).toFixed(2)}}元)</div>
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
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即发布</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>

// 数据验证器
import {isPriceVlidator, isDate, isCardNum} from '../../utils/validator'

export default {
  name: 'Selling',
  data () {
    return {
      types: [],
      discounts: [],
      form: {
        name: '',
        type: '',
        price: '',
        date: '',
        cardNum: '',
        cardPass: '',
        discountItem: '',
        discountTime: '',
        entity: 'false'
      },
      timeDiscount: {
        name: '',
        discount: 1
      },
      rules: {
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
    this.loadItemsType()
    this.loadDiscounts()
  },
  methods: {
    loadItemsType () {
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/items/sell', {
              userId: this.$store.state.user.userId,
              managerId: '0',
              price: parseFloat(this.form.price),
              cardNum: this.form.cardNum,
              cardPass: this.form.cardPass,
              dueTime: this.form.date,
              itemType: this.form.type,
              status: 'N',
              discountItem: this.form.type.typeDiscountBuy,
              discountTime: this.timeDiscount.discount,
              entity: this.form.entity
            }).then(resp => {
            if (resp && resp.data.code === 200) {
              this.$message({
                message: resp.data.message,
                type: 'success',
                center: true
              })
              this.resetForm(formName)
            } else {
              this.$message({
                message: resp.data.message,
                type: 'danger',
                center: true
              })
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.timeDiscount.discount = 0
    }
  }
}
</script>

<style scoped>

</style>
