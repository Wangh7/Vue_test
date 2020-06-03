<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 1000px">
      <el-table-column
        prop="createTime"
        label="发布日期"
        width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="审核日期"
        width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.checkTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemType.typeName"
        label="卡片种类"
        width="180px">
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
        label="状态"
        width="280px">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'F'">审核未通过</div>
          <div v-if="scope.row.status === 'F1'">审核未通过，已退回</div>
          <div v-if="scope.row.status === 'F2'">卖家已收货</div>
          <div v-if="scope.row.status === 'T'">审核通过</div>
          <div v-if="scope.row.status === 'N1'">初审通过，等待购买</div>
          <div v-if="scope.row.status === 'N2'">初审通过，等待发货</div>
          <div v-if="scope.row.status === 'N3'">卖家已发货</div>
          <div v-if="scope.row.status === 'N4'">平台已收货</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status !== 'N3' && scope.row.status !== 'N4'"
            size="mini"
            @click="handleCheck(scope.$index, scope.row)">审查
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length">
    </el-pagination>

    <el-dialog title="审查商品" :visible.sync="dialogCheckVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="快递单号">
          <div>{{form.expressNum}}</div>
        </el-form-item>
        <el-form-item label="礼品卡种类">
          <div>{{form.itemType}}</div>
        </el-form-item>
        <el-form-item label="余额">
          <div>{{form.price}}</div>
        </el-form-item>
        <el-form-item label="到期时间">
          <div>{{form.dueTime | formatDate}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">取消</el-button>
        <el-button v-if="form.status === 'N3'" type="primary" @click="confirm()">确认收货</el-button>
        <el-button v-if="form.status === 'N4'" type="danger" @click="failNext()">退回</el-button>
        <el-button v-if="form.status === 'N4'" type="success" @click="confirmNext()">通过并发货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="向买家发货" :visible.sync="dialogBuyVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form2"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="收货人">
          <div>{{form.nickname}}</div>
        </el-form-item>
        <el-form-item label="电话">
          <div>{{form.phone}}</div>
        </el-form-item>
        <el-form-item label="地址">
          <div>{{form.address}}</div>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNumNew">
          <el-input v-model="form.expressNumNew"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetForm('form2')">重置</el-button>
        <el-button @click="dialogBuyVisible = false">取消</el-button>
        <el-button type="primary" @click="success('form2')">发货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="向卖家退货" :visible.sync="dialogBackVisible">
      <el-form
        :model="form2"
        :rules="rules"
        ref="form3"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <!-- prop和v-model的名称需要一致 -->
        <el-form-item label="收货人">
          <div>{{form2.nickname}}</div>
        </el-form-item>
        <el-form-item label="电话">
          <div>{{form2.phone}}</div>
        </el-form-item>
        <el-form-item label="地址">
          <div>{{form2.address}}</div>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNumNew">
          <el-input v-model="form2.expressNumNew"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="resetForm('form3')">重置</el-button>
        <el-button @click="dialogBackVisible = false">取消</el-button>
        <el-button type="danger" @click="fail('form3')">退回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'CheckedItem',
  data () {
    return {
      items: [],
      currentPage: 1,
      pageSize: 10,
      dialogCheckVisible: false,
      dialogBuyVisible: false,
      dialogBackVisible: false,
      form: {
        id: '',
        itemType: '',
        dueTime: '',
        price: '',
        expressNum: '',
        status: '',
        expressNumNew: '',
        address: '',
        phone: '',
        nickname: ''
      },
      form2: {
        expressNumNew: '',
        address: '',
        phone: '',
        nickname: ''
      },
      rules: {
        expressNumNew: [
          {required: true, message: '请输入快递单号', trigger: 'blur'}
        ]
      }
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
    }
  },
  methods: {
    loadItems () {
      let _this = this
      this.$axios.get('/check/own').then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    getUserInfo () {
      this.$axios
        .get('/check/buyer', {
          params: {
            item_id: this.form.id
          }
        }).then(resp => {
        if (resp && resp.status === 200) {
          this.form.nickname = resp.data.nickname
          this.form.phone = resp.data.phone
          this.form.address = resp.data.address
        }
      })
      this.$axios
        .get('/check/seller', {
          params: {
            item_id: this.form.id
          }
        }).then(resp => {
        if (resp && resp.status === 200) {
          this.form2.nickname = resp.data.nickname
          this.form2.phone = resp.data.phone
          this.form2.address = resp.data.address
        }
      })
    },
    handleCheck (index, row) {
      this.dialogCheckVisible = true
      this.$nextTick(function () {
        this.form = {
          id: row.itemId,
          itemType: row.itemType.typeName,
          price: row.price,
          dueTime: row.dueTime,
          expressNum: row.cardNum,
          status: row.status
        }
        this.getUserInfo()
      })
    },
    confirm () {
      this.dialogCheckVisible = false
      this.$axios
        .post('/check/entity', {
          itemId: this.form.id
        }).then(resp => {
        if (resp && resp.data.code === 200) {
          this.$message({
            message: resp.data.message,
            type: 'success',
            center: true
          })
          this.loadItems()
        } else {
          this.$message({
            message: resp.data.message,
            type: 'danger',
            center: true
          })
          return false
        }
      })
    },
    confirmNext () {
      this.dialogBuyVisible = true
    },
    failNext () {
      this.dialogBackVisible = true
    },
    success (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('您所填写的快递单号为 ' + this.form.expressNumNew + ' 一经确认不可修改！', '再次确认！', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogCheckVisible = false
            this.dialogBuyVisible = false
            this.$axios
              .post('/check/entity/success', {
                itemId: this.form.id,
                expressNumNew: this.form.expressNumNew
              }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.$message({
                  message: resp.data.message,
                  type: 'success',
                  center: true
                })
                this.loadItems()
              } else {
                this.$message({
                  message: resp.data.message,
                  type: 'danger',
                  center: true
                })
                return false
              }
            })
          })
        } else {
          return false
        }
      })
    },
    fail (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('您所填写的快递单号为 ' + this.form.expressNumNew + ' 一经确认不可修改！', '再次确认！', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogCheckVisible = false
            this.dialogBackVisible = false
            this.$axios
              .post('/check/entity/fail', {
                itemId: this.form.id,
                expressNumNew: this.form2.expressNumNew
              }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.$message({
                  message: resp.data.message,
                  type: 'success',
                  center: true
                })
                this.loadItems()
              } else {
                this.$message({
                  message: resp.data.message,
                  type: 'danger',
                  center: true
                })
                return false
              }
            })
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
