<template>
  <div class="mall">
    <div class="deal_num">
      <p>商家详情</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <el-tab-pane label="上架商品" name="1"></el-tab-pane>
        <el-tab-pane label="订单详情" name="2"></el-tab-pane>
        <!-- <el-tab-pane label="礼物订单" name="3"></el-tab-pane> -->
      </el-tabs>
    </div>
    <div class="screen">
      <el-form label-width="120px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="本周出售收益:">
          <p>{{money.tomorrow_is_sell_price}}</p>
        </el-form-item>
        <el-form-item label="本周出租收益:">
          <p>{{money.tomorrow_is_out_price}}</p>
        </el-form-item>
        <el-form-item label="账号上架总数">
          <p>{{money.number_putaway}}</p>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" size="small" @click="select">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-col :span="18">
            <el-input v-model="search" placeholder="请输入用户唯一账号" class="orderNum"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-button type="primary" size="small" round @click="search_">搜索</el-button>
          </el-col>
        </el-form-item>-->
      </el-form>
    </div>
    <!-- 上架商品 -->
    <div class="table" v-if="activeName=='1'">
      <el-table
        :data="gameList"
        style="width: 100%"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="goods" label="商品信息" min-width="200">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="row.img?imgUrl+row.img[0]:''" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{row.title}}</p>
                <div class="goodsTag">
                  <!-- <span v-for="(item,index) in tableData[0].goods.tag" :key="index">{{item}}</span> -->
                  <span v-if="row.cash_price==0">免押金</span>
                  <span v-if="row.sell_type==0">已租{{row.out_count}}次</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="账号类型" min-width="160">
          <template slot-scope="{row}">
            <p>{{row.sell_type==0?'出租':'出售'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="价格" min-width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <!-- <p class="payWay">{{row.payment.way==1?'支付宝':'余额'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="order" label="上架时间" sortable min-width="260">
          <template slot-scope="{row}">
            <p>{{row.add_time}}</p>
            <!-- <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="{row}">
            <div class="operation">
              <span class="colorOrange" @click="toDetail(row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 订单 -->
    <div class="table" v-else>
      <el-table
        :data="orderList"
        style="width: 100%"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="goods" label="商品信息" min-width="200">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="row.img?imgUrl+row.img[0]:''" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{activeName=='2'?row.title:activeName=='3'?row.gift_name:''}}</p>
                <div class="goodsTag">
                  <!-- <span v-for="(item,index) in tableData[0].goods.tag" :key="index">{{item}}</span> -->
                  <span v-if="row.cash_price==0">免押金</span>
                  <span v-if="row.sell_type==0">已租{{row.out_count}}次</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="payment" align="center" label="价格" min-width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <!-- <p class="payWay">{{row.payment.way==1?'支付宝':'余额'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="实付款" min-width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.pay_type==null?'0':row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <p
              class="payWay"
            >支付方式：{{row.pay_type==0?'余额':row.pay_type==2?'支付宝':row.pay_type==1?'微信':'无'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="200">
          <template slot-scope="{row}">
            <div v-if="activeName=='2'">
              <p>{{row.status==0?"待付款":row.status==2?"租用中":row.status==3?"已出售":row.status==4?"已出租":row.status==5?"售后":""}}</p>
            </div>
            <div v-if="activeName=='3'">
              <p>{{row.status==0?"待付款":row.status==1?"已发货":row.status==2?"未收到货":row.status==3?"用户已购买":row.status==4?"完成":""}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="订单信息" sortable width="240">
          <template slot-scope="{row}">
            <p>付款时间:{{row.pay_time==null?'无':row.pay_time}}</p>
            <p>下单时间:{{row.add_time==null?'无':row.add_time}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="6"
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
      imgUrl: this.$global.imgUrl,
      activeName: "1",
      type: "", //0平台，1个人，2店铺
      value1: "",
      gameList: [],
      orderList: [],
      time: [],
      money: "",
      search: "",
      page: 1,
      total: 0,
      mid: ""
    };
  },
  mounted() {
    this.mid = this.$route.query.mid;
    setTimeout(() => {
      this.getGoodsIsutaway();
      this.getmoney();
    }, 1500);
  },
  methods: {
    //切换tab
    getTab() {
      this.gameList = [];
      this.orderList = [];
      this.page=1;
      if (this.activeName == "1") {
        this.getGoodsIsutaway();
      } else if (this.activeName == "2") {
        this.getOrder("number");
      } else if (this.activeName == "3") {
        this.getOrder("gift");
      }
    },
    //搜索
    search_() {
      this.time = [];
      this.value1 = "";
      this.type = "";
      this.gameList = [];
      this.getGoodsIsutaway();
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
        this.getGoodsIsutaway();
      } else if (this.activeName == "2") {
        this.getOrder("number");
      } else if (this.activeName == "3") {
        this.getOrder("gift");
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.activeName == "1") {
        this.getGoodsIsutaway();
      } else if (this.activeName == "2") {
        this.getOrder("number");
      } else if (this.activeName == "3") {
        this.getOrder("gift");
      }
    },
    //获取店铺商品
    getGoodsIsutaway() {
      this.gameList = [];
      this.$axios({
        url: this.$global.url + "api/merch/merchGoods" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.mid,
          page: this.page,
          limit: 6
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.gameList = res.data.data;
            this.total = res.data.count;
          } else if (res.data.code == 0) {
            this.$message({
              type: "info",
              message: "暂无数据"
            });
            this.gameList = [];
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
            this.gameList = [];
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //获取时间
    getTime() {
      this.time = [];
      if (this.value1) {
        for (let i = 0; i < this.value1.length; i++) {
          this.time.push(this.$global.timeWeekFormat(this.value1[i]));
        }
      }
    },
    //订单列表
    getOrder(goods) {
      this.orderList = [];
      this.$axios({
        url: this.$global.url + "api/giftOrder/orderAll" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.mid,
          goods: goods,
          is_seller: 1,
          page: this.page,
          limit: 6
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.orderList = res.data.data;
            this.total = res.data.count;
          } else if (res.data.code == 0) {
            this.$message({
              type: "info",
              message: "暂无数据"
            });
            this.orderList = [];
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
            this.orderList = [];
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //本周销售金额
    getmoney() {
      this.$axios({
        url: this.$global.url + "root/merch/merchSales" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: this.mid
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.money = res.data.data;
          } else if (res.data.code == 0) {
            this.$message({
              type: "info",
              message: "暂无数据"
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

    //详情
    toDetail(row) {
      this.$router.push({ path: "/auditDetail", query: { game: row } });
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
  min-height: 700px;
  padding-bottom: 75px;
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
  padding-right: 15px;
  cursor: pointer;
}
.colorGreen {
  color: #1ec067;
}
.colorBlue {
  color: #037af0;
}
.colorRed {
  color: #f54848;
}
.colorOrange {
  color: #e68d31;
}
</style>
