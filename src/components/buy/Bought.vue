<template>
  <div>
    <el-table
      :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort="{prop:'finishTime',order:'descending'}"
      ref="table">
      <el-table-column
        prop="finishTime"
        label="购买日期"
        sortable
        width="160px">
        <template slot-scope="scope">
          <div>{{scope.row.finishTime | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.itemType.typeName"
        label="卡片种类"
        sortable
        width="140px">
        <template slot-scope="scope">
          <el-col :span="12">
            <span>{{scope.row.itemStock.itemType.typeName}}</span>
          </el-col>
          <el-col :span="12">
            <div v-if="scope.row.itemStock.entity === true">
              <span style="color:#d0b556;background:#6b5f22;display:inline-block;padding:0 3px">实体卡</span>
            </div>
            <div v-if="scope.row.itemStock.entity === false">
              <span style="color:#6bb0ee;background:#2c4882;display:inline-block;padding:0 3px">电子卡</span>
            </div>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemStock.price.amount"
        label="面额"
        width="140px">
      </el-table-column>
      <el-table-column
        prop="itemStock.dueTime"
        label="有效期"
        sortable
        width="160px">
        <template slot-scope="scope">
          <div>{{scope.row.itemStock.dueTime | formatDateNoTime}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="实付款"
        width="140px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="toggleExpand(scope.row)">查看进度</el-button>
          <el-button
            :disabled="scope.row.status === 'F'"
            size="mini"
            @click="handleEdit(scope.row)">详情
          </el-button>
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
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <el-timeline v-loading="loading">
            <el-timeline-item
              v-for="(timeline,i) in timelines"
              :key="i"
              :icon="timeline.icon"
              :type="timeline.type"
              size="large"
              :timestamp="timeline.timestamp | formatDate">
              {{timeline.content}}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      style="width: 100%"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length">
    </el-pagination>

    <el-dialog title="查看商品信息" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        label-width="150px"
        class="demo-ruleForm"
        style="text-align: left">
        <el-form-item label="礼品卡种类">
          <div>{{form.typeName}}</div>
        </el-form-item>
        <el-form-item v-if="form.entity" label="快递单号">
          <div v-if="form.cardNum !== '' && form.cardNum !== null">{{form.cardNum}}</div>
          <div v-else>暂未发货</div>
        </el-form-item>
        <el-form-item v-else label="礼品卡卡号">
          <div>{{form.cardNum}}</div>
        </el-form-item>
        <el-form-item v-if="!form.entity" label="礼品卡密码">
          <el-button type="primary" @click="showPass(form.cardPass,form.itemId)">显示</el-button>
        </el-form-item>
        <el-form-item label="礼品卡余额">
          <div>{{form.price}}</div>
        </el-form-item>
        <el-form-item label="礼品卡到期日期">
          <div>{{form.date | formatDateNoTime}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.entity && form.cardNum !== '' && form.cardNum !== null && form.status !== 'Y'"
                   type="success" @click="confirm()">
          确认收货
        </el-button>
        <el-button v-else type="primary" @click="dialogFormVisible = false">完成</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Bought',
  data () {
    return {
      items: [],
      timelines: [],
      currentPage: 1,
      pageSize: 10,
      popVisible: false,
      loading: true,
      dialogFormVisible: false,
      form: {
        itemId: '',
        typeName: '',
        price: '',
        cardNum: '',
        cardPass: '',
        date: '',
        entity: '',
        status: ''
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
    loadItems () {
      let _this = this
      this.$axios.get('/items/bought').then(resp => {
        if (resp && resp.status === 200) {
          _this.items = resp.data
        }
      })
    },
    loadTimeLine (row) {
      let _this = this
      this.$axios.get('/items/timeline', {
        params: {
          item_id: row,
          status: 'B'
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          _this.timelines = resp.data
          this.loading = false
        }
      })
    },
    toggleExpand (row) {
      this.timelines = []
      this.loading = true
      this.loadTimeLine(row.itemStock.itemId)
      let $table = this.$refs.table
      this.items.map((item) => {
        if (row.itemStock.itemId !== item.itemStock.itemId) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
    },
    handleEdit (row) {
      this.dialogFormVisible = true
      this.$nextTick(function () {
        this.form = {
          itemId: row.itemStock.itemId,
          typeName: row.itemStock.itemType.typeName,
          price: row.itemStock.price.amount,
          date: row.itemStock.dueTime,
          cardNum: row.itemStock.cardNum,
          cardPass: row.itemStock.cardPass,
          entity: row.itemStock.entity,
          status: row.status
        }
      })
    },
    handleDelete (index, row, scope) {
      scope._self.$refs[`popover-${index}`].doClose()
      this.$axios.post('/items/sell/delete', {
        itemId: row.itemId
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
    showPass (pass, itemId) {
      this.$axios.get('/items/pass', {
        params: {
          pass: pass,
          item_id: itemId
        }
      }).then(resp => {
        this.$alert(resp.data, '商品卡密', {
          confirmButtonText: '完成'
        })
      })
    },
    confirm () {
      this.$confirm('确认收货？', '再次确认！', {
        confirmButtonText: '奥利给',
        cancelButtonText: '手残了',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false
        this.$axios
          .post('/items/buy/entity', {
            itemId: this.form.itemId
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
  }
}
</script>

<style scoped>

</style>
