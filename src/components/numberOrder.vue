<template>
  <div class="mall">
    <div class="deal_num">
      <p>订单管理</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <!-- <el-tab-pane label="待付款" name="0"></el-tab-pane> -->
        <el-tab-pane label="出租中" name="2"></el-tab-pane>
        <el-tab-pane label="已出售" name="3"></el-tab-pane>
        <el-tab-pane label="租用完成" name="4"></el-tab-pane>
        <el-tab-pane label="售后" name="5"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="screen">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="下单时间">
          <el-col>
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getTime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select v-model="payType" placeholder="付款方式">
            <el-option label="余额" value="0"></el-option>
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="select">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-col :span="18">
            <el-input v-model="search" placeholder="请输入购买人唯一账号" class="orderNum"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-button type="primary" size="small" round @click="search_">搜索</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="class" label="商家分类" width="160" sortable>
          <template slot-scope="{row}">
            <el-tag
              :color="row.sell_mid=='平台'?'#5759FF':row.sell_mid==null?'#EF6226':'#1EC067'"
              class="tagRight"
              effect="dark"
            >{{row.sell_mid=='平台'?'平台':row.sell_mid==null?"个人":"商家"}}</el-tag>
            <p>{{row.sell_mid=='平台'?'平台自营':row.sell_mid==null?row.sell_mid:row.sell_mid.title}}</p>
            <div
              v-if="typeof(row.sell_mid)=='object' &&row.sell_mid!=null"
            >等级：{{row.sell_mid.level_id==1?'星星':row.sell_mid.level_id==2?'月亮':row.sell_mid.level_id==3?'太阳':row.sell_mid.level_id==4?'皇冠':'宝鼎'}}</div>
            <p>电话：{{row.sell_tel==null?'无':row.sell_tel}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="goods" label="商品信息" width="300">
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
        <el-table-column label="购买人信息" min-width="160">
          <template slot-scope="{row}">
            <p>昵称：{{row.buy_info.user_name==null?'无':row.buy_info.user_name}}</p>
            <p>唯一账号：{{row.buy_info.user_number==null?'无':row.buy_info.user_number}}</p>
            <p>电话：{{row.buy_info.tel==null?'无':row.buy_info.tel}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" min-width="100">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="实付款" width="160">
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
        <!-- <el-table-column prop="buyer" label="买家信息" width="200">
          <template slot-scope="{row}">
            <p>{{row.buyer.name}}</p>
            <p>{{row.buyer.phone}}</p>
          </template>
        </el-table-column>-->
        <el-table-column prop="order" label="订单信息" sortable width="240">
          <template slot-scope="{row}">
            <p>付款时间:{{row.pay_time==null?'无':row.pay_time}}</p>
            <p>下单时间:{{row.add_time==null?'无':row.add_time}}</p>
            <p v-if="row.count_down&&activeName=='2'" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.count_down" />
            </p>
            <p v-if="!row.count_down&&activeName=='2'" class="countDown bgRed">已到期</p>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="联系方式" v-if="activeName=='5'" width="240">
          <template slot-scope="{row}">
            <p>买家电话：{{row.buy_tel==null?"无":row.buy_tel}}</p>
            <p>卖家电话：{{row.sell_tel==null?"无":row.sell_tel}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="activeName=='4'" label="操作" fixed="right" width="140">
          <template slot-scope="{row}">
            <div class="operation">
              <span class="colorBlue" @click="edit(row)">改密</span>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
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
    <el-dialog title="修改密码" :visible.sync="addSchoolBox" width="25%" center>
      <el-form :model="form">
        <el-form-item label="账号" label-width="70px" size="small">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" size="small">
          <el-input v-model="form.pwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSchoolBox = false">取 消</el-button>
        <el-button type="primary" @click="editPwd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: this.$global.imgUrl,
      // 必须为字符串
      activeName: "2",
      payType: "",
      value1: "",
      time: [],
      tableData: [],
      page: 1,
      total: 0,
      search: "",
      addSchoolBox: false,
      form: {
        id: "",
        name: "",
        pwd: ""
      }
    };
  },
  created() {
    this.shippingStatus();
    if (this.$route.query.active) {
      this.activeName = this.$route.query.active;
    }
    this.getData();
  },
  methods: {
    editPwd() {
      this.$axios({
        url: this.$global.url + "root/numberOrder/password" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            id: this.form.id,
            account_number: this.form.name,
            pwd: this.form.pwd
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
            this.addSchoolBox=false
            this.getData()
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
    getData() {
      this.$axios({
        url: this.$global.url + "api/giftOrder/orderList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: "",
          goods: "number",
          status: this.activeName,
          page: this.page,
          limit: 10,
          is_seller: "",
          search: {
            add_time: this.time,
            pay_type: this.payType,
            member_number: this.search
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else if (res.data.code == 0) {
            this.$message({
              type: "info",
              message: "暂无数据"
            });
            this.tableData = [];
            this.total = 0;
          } else {
            this.$message.error({
              message: res.data.msg
            });
            this.tableData = [];
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //切换
    getTab() {
      this.time = [];
      this.payType = "";
      this.value1 = "";
      this.search = "";
      this.tableData = [];
      this.getData();
    },
    //筛选
    select() {
      this.tableData = [];
      this.getData();
    },
    //搜索
    search_() {
      this.time = [];
      this.payType = "";
      this.value1 = "";
      this.gameList = [];
      this.getData();
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
    //修改密码账号
    edit(row) {
      this.form.id = row.number_id;
      this.addSchoolBox = true;
      // this.$router.push({
      //   path: "/editAdd",
      //   query: {
      //     game: {
      //       id: row.number_id,
      //       sell_mid: row.number_mid
      //     }
      //   }
      // });
      // this.$router.push({ path: "/auditDetail", query: { game: row } });
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
