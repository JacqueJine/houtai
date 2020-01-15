<template>
  <div class="mall">
    <div class="deal_num">
      <p>用户提现</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <el-tab-pane label="待审核" name="1"></el-tab-pane>
        <el-tab-pane label="审核拒绝" name="2"></el-tab-pane>
        <el-tab-pane label="审核通过" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="screen" v-if="activeName=='1'">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <!-- <el-form-item label="身份">
            <el-select v-model="formInline.region" placeholder="是否开店">
              <el-option label="已开店" value="shanghai"></el-option>
              <el-option label="未开店" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">查询</el-button>
        </el-form-item>-->
        <el-form-item style="float:right">
          <el-button type="primary" size="small" @click="pass('id')" round>批量通过</el-button>
          <!-- <el-button type="primary" size="small" round>批量拒绝</el-button> -->
          <el-button type="primary" size="small" round @click="toggleSelection()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        ref="multipleTable"
        @selection-change="SelectionChange"
        style="width: 100%"
        height="450"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column type="selection" width="55" v-if="activeName=='1'"></el-table-column>
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="class" label="提现用户" sortable min-width="120">
          <template slot-scope="{row}">{{row.user_name?row.user_name:row.mid}}</template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="账户余额" min-width="150">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.lines}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="提现金额" min-width="150">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <!-- <p class="payWay">{{row.payment.way==1?'支付宝':'余额'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="goods" label="到账账户" min-width="200">
          <template slot-scope="{row}">
            <p>{{'支付宝：'+row.alipay}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="申请时间" sortable min-width="260">
          <template slot-scope="{row}">
            <p>{{row.add_time}}</p>
            <!-- <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p>-->
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="240">
          <template slot-scope="{row}">
            <div class="operation">
              <span v-if="row.audit==1" class="colorBlue" @click="pass(row.id,row.mid,row.price)">通过</span>
              <span
                v-if="row.audit==1"
                class="colorRed"
                @click="refuse(row.id,row.mid,row.price)"
              >拒绝</span>
              <span class="colorBlue" @click="moneydetial(row.mid)">详情</span>
              <span v-if="row.audit==3" class="colorBlue">已通过</span>
              <span v-if="row.audit==2" class="colorRed">已拒绝</span>
              <!-- <span class="colorBlue">通过</span>
              <span class="colorRed">拒绝</span>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 余额记录 -->
    <el-dialog :title="'余额记录 ，总收入：'+income+'，总支出：'+expend" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" height="500">
        <el-table-column property="type" label="类型" width="200"></el-table-column>
        <el-table-column property="remark" label="余额类型" width="200"></el-table-column>
        <el-table-column property="add_time" label="时间" min-width="200"></el-table-column>
        <el-table-column property="price" width="100" label="价格"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 拒绝弹窗 -->
    <el-dialog title="用户提现拒绝" :visible.sync="deductionShow" width="25%" center>
      <el-form :model="deduction" ref="ruleForm1" size="small" :rules="rules1">
        <el-form-item label="原因" prop="note">
          <el-input
            v-model="deduction.note"
            size="small"
            type="textarea"
            :rows="3"
            placeholder="请输入拒绝原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deductionShow = false">取 消</el-button>
        <el-button type="primary" @click="deductionBox('ruleForm1')">保 存</el-button>
      </div>
    </el-dialog>
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      formInline: {
        user: "",
        region: ""
      },
      value1: "",
      tableData: [],
      page: 1,
      total: 0,
      dialogTableVisible: false,
      gridData: [],
      income: "",
      expend: "",
      Selection: [],
      deductionShow: false,
      deduction: {
        note: "",
        id: [],
        mid: "",
        price: ""
      },
      rules1: {
        note: [{ required: true, message: "请输入拒绝原因", trigger: "blur" }]
      },
      allid: []
    };
  },
  mounted() {
    this.shippingStatus();
    this.getData();
  },
  methods: {
    // 拒绝
    refuse(id, mid, price) {
      this.deduction.id = id;
      this.deduction.mid = mid;
      this.deduction.price = price;
      this.deductionShow = !this.deductionShow;
    },
    deductionBox(formName) {
      this.allid = [];
      this.allid.push({
        id: this.deduction.id,
        mid: this.deduction.mid,
        price: this.deduction.price
      });
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/user/depositAudit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: this.allid,
              audit: 2,
              title: this.deduction.note
            })
          })
            .then(res => {
              this.deductionShow = !this.deductionShow;
              if (res.data.code == 1) {
                this.getData();
                this.$message({
                  type: "success",
                  message: "已拒绝!"
                });
              } else {
                this.$message.error({
                  message: res.data.msg
                });
              }
            })
            .catch(e => {
              this.$message.error({
                message: "网络较差，请稍后重试！"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //通过
    pass(id, mid, price) {
      //判断是否批量通过
      this.allid = [];
      if (id == "id") {
        if (this.Selection.length <= 0) {
          this.$message.info({
            message: "请选择要通过的用户",
            center: true
          });
          return false;
        } else {
          for (let i = 0; i < this.Selection.length; i++) {
            this.allid.push({
              id: this.Selection[i].id,
              mid: this.Selection[i].mid,
              price: this.Selection[i].price
            });
          }
        }
      } else {
        this.allid.push({
          id: id,
          mid: mid,
          price: price
        });
      }
      this.$confirm("此操作为敏感操作，请确认后继续, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/user/depositAudit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: this.allid,
              audit: 3,
              title: ""
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getData();
                this.$message({
                  type: "success",
                  message: "已通过!"
                });
              } else {
                this.$message.error({
                  message: res.data.msg
                });
              }
            })
            .catch(e => {
              this.$message.error({
                message: "网络较差，请稍后重试！"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    //用户提现金额信息
    moneydetial(id) {
      this.$axios({
        url: this.$global.url + "api/user/bill" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: id,
          status: 0,
          time: "",
          page: 1,
          limit: 99999999999999999
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.dialogTableVisible = !this.dialogTableVisible;
            this.gridData = res.data.data;
            this.expend = Math.abs(res.data.expend);
            this.income = res.data.income;
            this.$message({
              type: "success",
              message: res.data.msg
            });
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //获取数据
    getData() {
      this.$axios({
        url: this.$global.url + "root/user/deposit" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          audit: this.activeName,
          limit: 10,
          page: this.page
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.total = res.data.count;
            if (!res.data.data) {
              this.tableData = [];
            } else {
              this.tableData = res.data.data;
            }
          } else if (res.data.code == 0) {
            this.tableData = [];
            this.$message({
              message: "暂无数据",
              type: "info"
            });
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    getTab(tab, event) {
      this.activeName = tab.name;
      this.page = 1;
      this.tableData = [];
      this.getData();
    },
    //取消选择
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    //选择
    SelectionChange(val) {
      this.Selection = val;
      console.log(this.Selection);
    },
    // 判断发货状态改变样式
    shippingStatus() {
      var state = this.tableData.map(item => {
        return item.state;
      });
      switch (state) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
      }
    },
    // 分页
    handleSizeChange(val) {
      this.page = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.cell {
  color: #333333;
  font-size: 14px;
}
.priceColor {
  color: red;
}
.mall {
  background: #ffffff;
  margin: 20px 20px;
  height: 700px;
  position: relative;
  border-radius: 8px;
}
.deal_num {
  padding-top: 26px;
  padding-left: 20px;
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.screen {
  padding: 20px 20px 0;
}
.table {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.el-table {
  /* color: #f54848; */
  font-size: 14px;
}
.orderNum .el-input__inner {
  border-radius: 14px;
}
.el-input--prefix .el-input__inner {
  padding-left: 15px;
}
tbody .el-table_1_column_6 {
  color: red;
}
.el-table_2_column_24 p:nth-child(even) {
  color: #2bb960;
}
.el-table_2_column_24 p:nth-child(odd) {
  color: #999999;
}
.paging {
  position: absolute;
  bottom: 3%;
}
.el-tabs__nav-wrap::after {
  background-color: #ffffff;
}
.el-input__prefix {
  display: none;
}
.goods {
  display: flex;
}
.goodsImg {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}
.goodsInfo {
  flex: 1;
  padding-left: 10px;
}
.goodsInfo p {
  font-size: 14px;
  color: #333;
  line-height: 20px;
  /* min-height: 20px; */
}
.goodsTag span {
  font-size: 12px;
  padding: 0 5px;
  color: rgba(51, 51, 51, 0.6);
}
.paySum {
  color: rgba(245, 72, 72, 1);
  font-weight: bold;
}
.hours span {
  padding: 0 5px;
  font-size: 10px;
  color: rgba(51, 51, 51, 0.6);
}
.payWay {
  font-size: 12px;
  color: rgba(51, 51, 51, 0.6);
}
.countDown {
  text-align: center;
  padding: 3px 0;
  border-radius: 14px;
  color: #fff;
}
.bgBlue {
  background: rgba(45, 48, 255, 0.8);
}
.bgRed {
  background: rgba(255, 38, 38, 0.8);
}
.operation span {
  margin-right: 15px;
}
.colorGreen {
  color: #1ec067;
  cursor: pointer;
}
.colorBlue {
  color: #037af0;
  cursor: pointer;
}
.colorRed {
  color: #f54848;
  cursor: pointer;
}
.colorOrange {
  color: #e68d31;
  cursor: pointer;
}
</style>
