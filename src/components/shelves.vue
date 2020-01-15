<template>
  <div class="mall">
    <div class="deal_num">
      <p>商品管理</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <el-tab-pane label="账号出售" name="chushou"></el-tab-pane>
        <el-tab-pane label="账号出租" name="number"></el-tab-pane>
        <el-tab-pane label="出售礼物" name="gift"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="screen">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="上架时间">
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
        <el-form-item label="商家分类">
          <el-select v-model="type" placeholder="请选择">
            <el-option label="平台" value="0"></el-option>
            <el-option label="个人" value="1"></el-option>
            <el-option label="店铺" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
    </div>
    <div class="screen">
      <el-form label-width="70px" :inline="true" size="mini" class="demo-form-inline">
        <el-form-item style="float:right">
          <el-button type="primary" size="small" round @click="unshelves('id')">批量下架</el-button>
          <el-button type="primary" size="small" round @click="toggleSelection()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="gameList"
        style="width: 100%"
        height="450"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
        ref="multipleTable"
        @selection-change="SelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="100" sortable></el-table-column>
        <el-table-column label="置顶编辑" min-width="100">
          <template slot-scope="{row}">
            <el-input style="width: 40px;" v-model="row.order_id" @blur="ToTop(row.order_id,row.id)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="class" label="商家分类" min-width="140" sortable>
          <template slot-scope="{row}">
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
        <el-table-column prop="goods" label="商品信息" width="240">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="row.img?imgUrl+row.img[0]:''" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{activeName=='number' || activeName=='chushou'?row.title:activeName=='gift'?row.name_id:''}}</p>
                <div class="goodsTag">
                  <!-- <span v-for="(item,index) in tableData[0].goods.tag" :key="index">{{item}}</span> -->
                  <span v-if="row.cash_price==0">免押金</span>
                  <span v-if="row.sell_type==0">已租{{row.out_count}}次</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="价格" width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.price}}</p>
            <!-- <p class="hours">
              <span>{{row.payment.time}}小时</span>
              <span v-if="row.payment.deposit">押金:{{row.payment.deposit}}</span>
            </p>-->
            <!-- <p class="payWay">{{row.payment.way==1?'支付宝':'余额'}}</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="order" label="上架时间" sortable width="300">
          <template slot-scope="{row}">
            <p>{{row.add_time}}</p>
            <!-- <p v-if="row.order.time" class="countDown bgBlue">
              倒计时:
              <van-count-down style="display:inline;color:#fff" :time="row.order.countdown" />
            </p>
            <p v-else class="countDown bgRed">已到期</p>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200" align="center">
          <template slot-scope="{row}">
            <div class="operation">
              <span class="colorOrange" @click="unshelves(row.id)">下架</span>
              <span
                v-if="activeName=='number'"
                class="colorBlue"
                @click="editNumber(row.id)"
              >编辑次数</span>
            </div>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: this.$global.imgUrl,
      activeName: "chushou",
      type: "", //0平台，1个人，2店铺
      value1: "",
      gameList: [],
      tableData: [],
      time: [],
      search: "",
      page: 1,
      total: 0,
      Selection: [],
      id: []
    };
  },
  mounted() {
    this.shippingStatus();
    this.getGoodsIsutaway();
  },
  methods: {
    //切换tab
    getTab(tab, event) {
      this.tableData = [];
      this.time = [];
      this.type = "";
      this.value1 = "";
      this.search = "";
      this.activeName = tab.name;
      this.getGoodsIsutaway();
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
      this.getGoodsIsutaway();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGoodsIsutaway();
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
    //获取上架商品列表
    getGoodsIsutaway() {
      this.$axios({
        url: this.$global.url + "root/common/goodsIsutaway" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            is_putaway: 0,
            goods: this.activeName,
            page: this.page,
            limit: 10,
            add_time: this.time,
            merch: this.type,
            member_name: this.search
          }
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
    //筛选
    select() {
      this.gameList = [];
      this.getGoodsIsutaway();
    },
    //下架账号商品和礼物
    unshelves(id) {
      //判断是否批量下架
      this.id = [];
      if (id == "id") {
        if (this.Selection.length <= 0) {
          this.$message.info({
            message: "请选择要上架的商品",
            center: true
          });
          return false;
        } else {
          for (let i = 0; i < this.Selection.length; i++) {
            this.id.push(this.Selection[i].id);
          }
          console.log(this.id);
        }
      } else {
        this.id.push(id);
        console.log(this.id);
      }
      this.$confirm("此操作将下架该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let goods_ = "";
          if (this.activeName == "chushou" || this.activeName == "number") {
            goods_ = "number";
          } else if (this.activeName == "gift") {
            goods_ = "gift";
          }
          this.$axios({
            url: this.$global.url + "root/common/isPutaway" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              //虽然三个但不加data
              goods: goods_,
              id: this.id,
              is_putaway: 1
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getGoodsIsutaway();
                this.$message({
                  type: "success",
                  message: "下架成功!"
                });
              } else {
                this.$message.error({
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(e => {
              console.log(e);
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },
    //置顶操作
    ToTop(order_id, id) {
      let reg = /^([1-9]\d*|[0]{1,1})$/;
      if (!reg.test(order_id)) {
        this.$message.error({
          message: "请输入大于等于0的整数",
          center: true
        });
        return false;
      }
      let goods = "";
      if (this.activeName == "chushou" || this.activeName == "number") {
        goods = "number";
      } else {
        goods = "gift";
      }
      this.$axios({
        url: this.$global.url + "root/number/goodsId" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          //虽然三个但不加data
          goods: goods,
          id: id,
          order_id: order_id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.getGoodsIsutaway();
            this.$message.success({
              message: res.data.msg,
              center: true
            });
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    editNumber(id) {
      this.$prompt("请输入已租用次数", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^([1-9]\d*|[0]{1,1})$/,
        inputErrorMessage: "已租用次数大于等于0"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/number/outCount" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              out_count: value,
              id: id,
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getGoodsIsutaway();
                this.$message.success({
                  message: res.data.msg,
                  center: true
                });
              } else {
                this.$message.error({
                  message: res.data.msg,
                  center: true
                });
              }
            })
            .catch(e => {
              console.log(e);
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        })
        .catch(() => {});
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
