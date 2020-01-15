<template>
  <div class="mall">
    <div class="deal_num">
      <p>账号审核</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <el-tab-pane label="待审核" name="1"></el-tab-pane>
        <el-tab-pane label="审核历史" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="screen" v-if="activeName=='1'">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item style="float:right">
          <el-button type="primary" size="small" round @click="pass('id')">批量通过</el-button>
          <!-- <el-button type="primary" size="small" round>批量拒绝</el-button> -->
          <el-button type="primary" size="small" round @click="toggleSelection()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="500"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
        ref="multipleTable"
        @selection-change="SelectionChange"
      >
        <el-table-column type="selection" min-width="55" v-if="activeName=='1'"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="100"></el-table-column>
        <el-table-column prop="class" label="商家分类" sortable min-width="150">
          <template slot-scope="{row}">
            <!-- <el-tag
              :color="row.sell_mid=='平台'?'#5759FF':'#EF6226'"
              class="tagRight"
              effect="dark"
            >{{row.sell_mid}}</el-tag>-->
            <el-tag
              :color="row.mid=='平台'?'#5759FF':typeof(row.mid)=='object'?'#1EC067':'#EF6226'"
              class="tagRight"
              effect="dark"
            >{{row.mid=='平台'?'平台':typeof(row.mid)=='object'?"商家":"个人"}}</el-tag>
            <p>{{row.mid=='平台'?'平台自营':typeof(row.mid)=='object'?row.mid.title:row.mid}}</p>
            <div
              v-if="typeof(row.mid)=='object'"
            >等级：{{row.mid.level_id==1?'星星':row.mid.level_id==2?'月亮':row.mid.level_id==3?'太阳':row.mid.level_id==4?'皇冠':'宝鼎'}}</div>
            <div v-if="row.mid!='平台'&&(typeof(row.mid)!='object')">信誉分：100</div>
          </template>
        </el-table-column>
        <el-table-column prop="goods" label="商品信息" min-width="180">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="row.img?imgUrl+row.img[0]:''" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{row.title}}</p>
                <div class="goodsTag">
                  <!-- <span v-for="(item,index) in tableData[0].goods.tag" :key="index">{{item}}</span> -->
                  <span v-if="row.sell_type==0&&row.cash_price==0">免押金</span>
                  <span v-if="row.sell_type==0">已租{{row.out_count}}次</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="class" label="出售类型" min-width="120">
          <template slot-scope="{row}">
            <p v-if="row.sell_type==0&&row.is_buyout==0">出租(不可买断)</p>
            <p v-if="row.sell_type==0&&row.is_buyout==1">出租(可买断)</p>
            <p v-if="row.sell_type==1">出售</p>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="价格" min-width="120">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <!-- <p class="payWay">支付方式：{{row.pay_type==0?'余额':row.pay_type==1?'支付宝':'微信'}}</p> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="order" label="申请时间" sortable width="300">
          <template slot-scope="{row}">
            <p>{{row.order.time}}</p>
            <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p>
          </template>
        </el-table-column>-->
        <el-table-column label="商家电话" min-width="200">
          <template slot-scope="{row}">
            <p>{{row.tel==""?"无":row.tel}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order" :label="activeName==1?'申请时间':'审核时间'" sortable min-width="200">
          <template slot-scope="{row}">
            <p>{{row.is_putaway==2?row.add_time:row.putaway_date}}</p>
            <!-- <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p>-->
          </template>
        </el-table-column>
        <el-table-column label="详情" width="160">
          <template slot-scope="{row}">
            <p class="detail" @click="edit(row)">
              查看详情
              <!-- <router-link :to="{path:'/auditDetail',query:{game:row}}">查看详情</router-link> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column label="平台收取" min-width="170" align="center">
          <template slot-scope="{row}">
            <p>租号收入：{{row.terrace_rent}}%</p>
            <p>买号收入：{{row.terrace_buy}}%</p>
            <!-- <p>礼物收入：{{row.terrace_gift}}%</p> -->
            <p class="colorOrange" @click="editTerrace(row)">编辑</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="150">
          <template slot-scope="{row}">
            <div class="operation">
              <span v-if="row.is_putaway==2" class="colorBlue" @click="pass(row.id)">通过</span>
              <span v-if="row.is_putaway==2" class="colorRed" @click="refuse(row.id)">拒绝</span>
              <span v-if="row.is_putaway==1 || row.is_putaway==0" class="colorBlue">已通过</span>
              <span v-if="row.is_putaway==3" class="colorRed">已拒绝</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 商家拒绝弹窗 -->
    <el-dialog title="账号审核拒绝" :visible.sync="deductionShow" width="25%" center>
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
    <!-- 平台收取弹窗 -->
    <el-dialog title="修改平台收取" :visible.sync="terraceShow" width="35%" center>
      <el-form
        :model="terrace"
        ref="ruleForm1"
        inline
        size="small"
        :rules="rules2"
        label-width="90px"
      >
        <el-form-item label="租号收入" prop="terrace_rent">
          <el-input v-model="terrace.terrace_rent" size="small" placeholder="请输入租号收入"></el-input>
        </el-form-item>
        <el-form-item label="买号收入" prop="terrace_buy">
          <el-input v-model="terrace.terrace_buy" size="small" placeholder="请输入买号收入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="礼物收入" prop="terrace_gift">
          <el-input v-model="terrace.terrace_gift" size="small" placeholder="请输入礼物收入"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="terraceShow = false">取 消</el-button>
        <el-button type="primary" @click="terraceBox('ruleForm1')">保 存</el-button>
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
    let validateSR = (rule, value, callback) => {
      let reg = /^99$|^(\d|[1-9]\d)$/;
      if (!reg.test(value)) {
        callback(new Error("收入大于等于0且小于100"));
      } else {
        callback();
      }
    };
    return {
      imgUrl: this.$global.imgUrl,
      activeName: "1",
      formInline: {
        user: "",
        region: ""
      },
      value1: "",
      tableData: [],
      page: 1,
      total: 0,
      Selection: [],
      deductionShow: false,
      deduction: {
        note: "",
        id: ""
      },
      rules1: {
        note: [{ required: true, message: "请输入拒绝原因", trigger: "blur" }]
      },
      allid: [],
      terraceShow: false,
      terrace: {
        terrace_rent: "",
        terrace_buy: "",
        // terrace_gift: ""
      },
      id: "",
      rules2: {
        terrace_rent: [
          { required: true, message: "请输入租号收入", trigger: "blur" },
          { validator: validateSR, trigger: "blur" }
        ],
        terrace_buy: [
          { required: true, message: "请输入买号收入", trigger: "blur" },
          { validator: validateSR, trigger: "blur" }
        ],
        // terrace_gift: [
        //   { required: true, message: "请输入礼物收入", trigger: "blur" },
        //   { validator: validateSR, trigger: "blur" }
        // ]
      }
    };
  },
  mounted() {
    this.shippingStatus();
    this.getMerchlist();
  },
  methods: {
    getTab(tab, event) {
      this.tableData = [];
      this.activeName = tab.name;
      this.page = 1;
      if (this.activeName == "1") {
        this.getMerchlist();
      } else {
        this.getputaway();
      }
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
      if (this.activeName == "1") {
        this.getMerchlist();
      } else {
        this.getputaway();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.activeName == "1") {
        this.getMerchlist();
      } else {
        this.getputaway();
      }
    },
    //平台收取
    editTerrace(row) {
      this.id = row.id;
      this.terrace.terrace_rent = row.terrace_rent;
      this.terrace.terrace_buy = row.terrace_buy;
      // this.terrace.terrace_gift = row.terrace_gift;

      this.terraceShow = !this.terraceShow;
    },
    terraceBox(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/member/terrace" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              goods:"number",
              id: this.id,
              data: this.terrace
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.terraceShow = !this.terraceShow;
                this.getMerchlist();
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
            .catch(err => {
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        } else {
          return false;
        }
      });
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
    // 获取商品列表
    getMerchlist() {
      this.$axios({
        url: this.$global.url + "root/number/numberList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          is_putaway: 2,
          page: this.page,
          limit: 10
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            // this.total=res.data.count;
            if (!res.data.data) {
              this.tableData = [];
            } else {
              this.tableData = res.data.data;
              this.total = res.data.count;
            }
          } else if (res.data.code == 0) {
            this.tableData = [];
            this.$message({
              message: "暂无数据！",
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
    //账号审核记录
    getputaway() {
      this.$axios({
        url: this.$global.url + "root/number/putawayDate" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 10
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            // this.total=res.data.count;
            if (!res.data.data) {
              this.tableData = [];
            } else {
              this.tableData = res.data.data;
              this.total = res.data.count;
            }
          } else if (res.data.code == 0) {
            this.tableData = [];
            this.$message({
              message: "暂无数据！",
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
    // 审核商品
    //通过
    pass(id) {
      //判断是否批量通过
      this.allid = [];
      if (id == "id") {
        if (this.Selection.length <= 0) {
          this.$message.info({
            message: "请选择要通过的商品",
            center: true
          });
          return false;
        } else {
          for (let i = 0; i < this.Selection.length; i++) {
            this.allid.push({
              goods_id: this.Selection[i].id,
              type: ""
            });
          }
        }
      } else {
        this.allid.push({
          goods_id: id,
          type: ""
        });
      }
      this.$axios({
        url: this.$global.url + "root/number/numberAudit" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: "number",
          data: this.allid,
          // goods_id: this.id,
          is_putaway: 0
          // type: "",
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.getMerchlist();
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
    },
    // 拒绝
    refuse(id) {
      this.deduction.id = id;
      this.deductionShow = !this.deductionShow;
    },
    deductionBox(formName) {
      this.allid = [];
      this.allid.push({
        goods_id: this.deduction.id,
        type: ""
      });
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/number/numberAudit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              goods: "number",
              // goods_id: this.id,
              is_putaway: 3,
              title: this.deduction.note,
              data: this.allid
              // type:"",
            })
          })
            .then(res => {
              this.deductionShow = !this.deductionShow;
              if (res.data.code == 1) {
                this.getMerchlist();
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
    //详情  编辑
    edit(row) {
      this.$router.push({
        path: "/editAdd",
        query: { game: row, type: "pass" }
      });
      // this.$router.push({ path: "/auditDetail", query: { game: row } });
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
  height: 722px;
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
.colorBlue {
  color: #037af0;
}
.colorRed {
  color: #f54848;
}
.colorOrange {
  cursor: pointer;
  color: #e68d31;
}
.detail {
  width: 81px;
  height: 28px;
  background: rgba(3, 122, 240, 0.2);
  color: #037af0;
  text-align: center;
  line-height: 28px;
}
.operation span {
  cursor: pointer;
}
.detail {
  cursor: pointer;
}
</style>
