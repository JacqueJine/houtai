<template>
  <div class="console">
    <div class="head">
      <el-row>
        <el-col :md="24" :lg="14">
          <div class="grid-content bg-purple">
            <div class="deal">
              <div class="deal_jiaoyi">交易数据</div>
              <div class="deal_time">当天</div>
            </div>
            <div class="console_state">
              <ul>
                <li>
                  <p class="states">出租中</p>
                  <p class="num" style="color:#38CD70">{{data.is_out}}</p>
                  <p class="button">
                    <el-button round size="small" @click="toOrder('2')">查看</el-button>
                  </p>
                </li>
                <li>
                  <p class="states">已出售（账号）</p>
                  <p class="num" style="color:#50ACFF">{{data.is_sell}}</p>
                  <p class="button">
                    <el-button round size="small" @click="toOrder('3')">查看</el-button>
                  </p>
                </li>
                <li>
                  <p class="states">已出售（礼物）</p>
                  <p class="num" style="color:#FFAF50">{{data.gift_out}}</p>
                  <p class="button">
                    <el-button round size="small" @click="toOrder('4','gift')">查看</el-button>
                  </p>
                </li>
                <li>
                  <p class="states">售后</p>
                  <p class="num" style="color:#FF6150">{{data.is_sale}}</p>
                  <p class="button">
                    <el-button round size="small" @click="toOrder('5')">查看</el-button>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :md="24" :lg="10">
          <div class="grid-content bg-purple-light">
            <div class="deal_zichan">商品管理</div>
            <div class="shop_li">
              <ul>
                <li>
                  <router-link to="/shelves">
                    <p>
                      <img src="./../assets/img/shop_up.png" alt />
                    </p>
                    <p>已上架(礼物、账号)</p>
                    <p>共{{data.number_out_putaway+data.number_sell_putaway+data.gift_putaway}}个</p>
                  </router-link>
                </li>
                <li>
                  <router-link to="/unshelves">
                    <p>
                      <img src="./../assets/img/shop_down.png" alt />
                    </p>
                    <p>已下架(礼物、账号)</p>
                    <p>共{{data.number_out_sold+data.number_sell_sold+data.gift_sold}}个</p>
                  </router-link>
                </li>
                <li>
                  <router-link to="/add">
                    <p>
                      <img src="./../assets/img/shop_add.png" alt />
                    </p>
                    <p>添加</p>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="middle">
      <el-row>
        <el-col :md="24" :lg="14">
          <div class="grid-content bg-purple">
            <div class="deal_num">下单量统计</div>
            <div id="echarts" :style="{width: '100%', height: '350px'}"></div>
            <div class="num_details">
              <ul>
                <li>
                  <p class="people_today">今日下单量</p>
                  <p class="people_num">{{data.sum_order}}</p>
                </li>
                <li>
                  <p class="people_today">本周下单量</p>
                  <p class="people_num">{{data.week_sum_order}}</p>
                </li>
                <li>
                  <p class="people_today">本月下单量</p>
                  <p class="people_num">{{data.end_sum_order}}</p>
                </li>
                <li>
                  <p class="people_today amount">总下单量</p>
                  <p class="people_num nums">{{data.count_order}}</p>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :md="24" :lg="10">
          <div class="grid-content bg-purple-light">
            <div class="deal">
              <div class="deal_jiaoyi">资金统计</div>
              <div class="deal_time">当天</div>
            </div>
            <div class="asset">
              <div class="chunk">
                <ul>
                  <li style="background: linear-gradient(to right,#FF6F53 0%, #FF4949 100%)">
                    <p class="today_text">出租收益</p>
                    <p class="today_num">{{data.is_out_price}}</p>
                  </li>
                  <li style="background: linear-gradient(to right,#FFB153 0%, #FF9D49 100%)">
                    <p class="today_text">出售收益</p>
                    <p class="today_num">{{data.is_sell_price}}</p>
                  </li>
                  <li style="background: linear-gradient(to right,#4AB7F6 0%, #3F93F9 100%)">
                    <p class="today_text">礼物收益</p>
                    <p class="today_num">{{data.gift_out_price}}</p>
                  </li>
                </ul>
              </div>
              <div class="num_details">
                <ul>
                  <li>
                    <p class="people_today">今日总收益</p>
                    <p class="people_num">{{data.now_sum_price}}</p>
                  </li>
                  <li>
                    <p class="people_today">昨日总收益</p>
                    <p class="people_num">{{data.tomorrow_sum_price}}</p>
                  </li>
                </ul>
              </div>
              <!-- <div class="total">
                <div style="display:flex;align-items:center;">
                  <div class="total_money">总资产</div>
                  <div class="total_num">100000</div>
                </div>
                <button class="total_ti">提现</button>
              </div>-->
            </div>
            <div></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            data: [],
            type: "line",
            symbol: "circle",
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: "#037AF0",
                lineStyle: {
                  color: "#037AF0"
                }
              }
            }
          }
        ]
      },
      data: ""
    };
  },
  mounted() {
    this.getConsole();
    setTimeout(() => {
      this.echart();
    }, 4000);
  },
  methods: {
    echart() {
      var echart = document.getElementById("echarts");
      var myChart = this.echarts.init(echart);
      myChart.setOption(this.option);
      window.onresize = function() {
        myChart.resize();
      };
    },
    getConsole() {
      this.$axios({
        url: this.$global.url + "root/common/console" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.data = res.data.data;
            this.option.series[0].data = res.data.data.week;
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
    toOrder(active, type) {
      if (type == "gift") {
        this.$router.push({ path: "/giftOrder", query: { active: active } });
      } else {
        this.$router.push({ path: "/numberOrder", query: { active: active } });
      }
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "\5FAE\8F6F\96C5\9ED1";
}
.console {
  padding: 10px 20px;
}
.head .bg-purple {
  background: #ffffff;
  width: 100%;
  height: 304px;
  border-radius: 5px;
}
.deal {
  display: flex;
  padding: 26px 24px;
  position: relative;
}
.deal_jiaoyi {
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.deal_time {
  position: absolute;
  right: 24px;
  background: #38cd70;
  width: 41px;
  height: 21px;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 21px;
  border-radius: 5px;
}
ul li {
  list-style: none;
}
.console_state {
  padding: 30px;
}
.console_state .states {
  font-size: 13px;
}
.console_state ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.console_state ul li .num {
  text-align: center;
  margin-top: 32px;
  font-size: 40px;
  font-weight: 600;
}
.head .bg-purple-light {
  height: 304px;
  border-radius: 5px;
  margin-left: 20px;
}
.deal_zichan {
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  background: #fff;
  padding: 26px 24px 18px 24px;
  font-weight: 600;
}
a {
  color: #037af0;
}
.chunk {
  width: 100%;
  padding: 25px;
  box-sizing: border-box;
  display: inline-block;
}
.chunk ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chunk ul li {
  height: 120px;
  min-width: 120px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0 15px;
}
.chunk p {
  color: #ffffff;
}
.chunk .today_text {
  font-size: 13px;
  margin-top: 13px;
  margin-bottom: 23px;
}
.chunk .today_num {
  text-align: right;
  font-size: 25px;
}
.console_state li {
  text-align: center;
}
.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  vertical-align: text-top;
  text-align: center;
  margin-top: 10px;
  width: 90%;
  height: 69px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 0px;
}
.total .total_money {
  font-size: 13px;
  color: #333333;
  margin-right: 10px;
  margin-left: 20px;
}
.total .total_num {
  font-size: 30px;
  font-weight: 600;
  color: #333333;
}
.total .total_ti {
  background: #037af0;
  width: 80px;
  height: 36px;
  color: #ffffff;
  line-height: 36px;
  border-radius: 30px;
  border: none;
  margin-right: 25px;
}
/* 图形 */
.middle {
  margin-top: 20px;
}
.middle .bg-purple {
  background: #ffffff;
  width: 100%;
  height: 510px;
  border-radius: 5px;
}
.middle .bg-purple-light {
  background: #ffffff;
  height: 510px;
  border-radius: 5px;
  margin-left: 20px;
}
.deal_num {
  padding-top: 26px;
  padding-left: 20px;
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.num_details {
  margin: 0 20px;
}
.num_details ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.num_details .people_today {
  font-size: 14px;
  color: #333333;
}
.people_num {
  font-size: 40px;
  font-weight: 600;
  color: #666666;
  margin-top: 30px;
}
.total_visits {
  border: 1px #e7e7e7 solid;
  height: 90px;
  width: 91%;
  border-radius: 5px;
  margin: 0px 20px;
  position: relative;
  line-height: 90px;
}
.totals {
  position: absolute;
  right: 5%;
  display: flex;
}
.num_details .amount {
  font-size: 14px;
  color: #999999;
}
.nums {
  font-size: 40px;
  color: #999999;
}
.el-button {
  border: 1px solid #037af0;
}
.button {
  margin-top: 41px;
}
.button button {
  color: #037af0;
}
.asset .num_details ul li {
  flex: 1;
  margin-top: 40px;
}
.shop_li ul {
  display: flex;
  text-align: center;
  justify-content: space-between;
}
.shop_li ul li {
  width: 30%;
  background: #fff;
  margin-top: 20px;
  border-radius: 8px;
  height: 215px;
}
.shop_li ul li p {
  margin-top: 15px;
}
.shop_li ul img {
  width: 76px;
}
</style>
