<template>
  <div class="mall">
    <div class="deal_num">
      <p>订单管理</p>
    </div>
    <div class="screen">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="发布时间">
          <el-col>
            <el-date-picker
              el-icon-circle-close
              type="datetime"
              placeholder="选择日期"
              v-model="value1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="礼物筛选">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-col :span="18">
            <el-input v-model="value1" placeholder="请输入搜索内容" class="orderNum"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-button type="primary" size="small" round>搜索</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="goods" label="礼物名字" width="400">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="row.goods.img" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{row.goods.title}}</p>
                <!-- <div class="goodsTag">
                  <span v-for="(item,index) in row.goods.tag" :key="index">{{item}}</span>
                </div> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="价格" width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.payment.sum}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p> -->
            <!-- <p class="payWay">{{row.payment.way==1?'支付宝':'余额'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="toBuy" label="求购人" width="250">
          <template slot-scope="{row}">
            <p>{{row.toBuy.name}}</p>
            <p>{{row.toBuy.phone}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="发布时间" sortable width="300">
          <template slot-scope="{row}">
            <p>{{row.order.time}}</p>
            <!-- <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p> -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <div class="operation">
              <span class="colorBlue">供应</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '0',
      formInline: {
        user: "",
        region: ""
      },
      value1: "",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      tableData: [
        {
          id: 6666,
          goods: {
            img:
              "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
            title: "商品标题商品标题商品标题商品标题"
          },
          payment: {
            sum: 30,
            time: 3,
            deposit: 20,
            way: 1
          },
          toBuy:{
            name:'dsdsddsd',
            phone:'1515515551'
          },
          order: {
            time: "2019-9-9 20：08：00",
            countdown: 30 * 60 * 60 * 1000
          }
        }
      ]
    };
  },
  mounted() {
    this.shippingStatus();
  },
  methods: {
    getTab(tab, event) {
      this.activeName=tab.name
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
.operation span{
  padding-right: 15px;
}
.colorGreen{
  color: #1EC067;
}
.colorBlue{
  color: #037AF0;
}
.colorRed{
  color: #F54848;
}
.colorOrange{
  color: #E68D31;
}
</style>
