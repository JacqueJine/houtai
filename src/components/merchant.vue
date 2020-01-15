<template>
  <div class="mall">
    <div class="deal_num">
      <p>商家列表</p>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="600"
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
      >
        <el-table-column prop="id" label="ID" sortable min-width="80"></el-table-column>
        <el-table-column prop="class" label="身份信息" min-width="300">
          <template slot-scope="{row}">
            <!-- <el-tag v-if="activeName=='0'" color="#5759FF" effect="dark">平台自营</el-tag> -->
            <!-- <el-tag v-if="activeName=='1'" color="#1EC067" effect="dark">商家</el-tag> -->
            <div>
              <p>姓名：{{row.name}}</p>
              身份证号码：{{row.identity_number}}
            </div>
            <!-- <el-tag v-if="activeName=='2'" color="#EF6226" effect="dark">个人</el-tag>
            <div v-if="activeName=='2'">
              <p>个人名字</p>信誉分：100
            </div>-->
          </template>
        </el-table-column>
        <el-table-column prop="goods" label="店铺信息" min-width="280">
          <template slot-scope="{row}">
            <div class="goods">
              <el-image :src="imgUrl+row.logo" class="goodsImg" lazy></el-image>
              <div class="goodsInfo">
                <p>{{row.title}}</p>
                <div class="goodsTag">
                  <!-- <span v-for="(item,index) in row.goods.tag" :key="index">{{item}}</span> -->
                  <span>手机号：{{row.tel}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payment" align="center" label="保证金" min-width="160">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.quality}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="审核时间" sortable min-width="240">
          <template slot-scope="{row}">
            <p>{{row.audit_time}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="{row}">
            <div v-if="row.status==0" class="operation">
              <span class="colorBlue">待审核</span>
            </div>
            <div v-if="row.status==1" class="operation">
              <span class="colorBlue">已通过</span>
            </div>
            <div v-if="row.status==2" class="operation">
              <span class="colorRed">已拒绝</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="{row}">
            <div>
              <span class="colorBlue" @click="godetail(row.mid)">查看</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="商户审核拒绝" :visible.sync="deductionShow" width="25%" center>
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
      imgUrl: this.$global.imgUrl,
      deductionShow: false,
      deduction: {
        note: "",
        id: ""
      },
      rules1: {
        note: [{ required: true, message: "请输入拒绝原因", trigger: "blur" }]
      },
      formInline: {
        user: "",
        region: ""
      },
      value1: "",
      tableData: [],
      page: 1,
      total: 0
    };
  },
  mounted() {
    this.shippingStatus();
    this.getMerchlist(this.page);
  },
  methods: {
    getTab(tab, event) {
      this.activeName = tab.name;
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
      this.getMerchlist();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getMerchlist();
    },
    // 获取商户列表
    getMerchlist() {
      this.$axios({
        url: this.$global.url + "root/merch/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 10,
          status: 1
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else if (res.data.data == 0) {
            this.tableData = [];
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    // 审核商户
    //通过
    pass(id) {
      this.$confirm("此操作为敏感操作，请确认后继续, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/merch/audit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              //这个需要包裹
              data: {
                merchId: id,
                status: 1
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                // this.giftSelect = res.data.data;
                this.getMerchlist(this.page);
                this.$message({
                  type: "success",
                  message: "已通过!"
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
    //详情
    godetail(id) {
      this.$router.push({ path: "/merchdetail", query: { mid: id } });
    },
    // 拒绝
    refuse(id) {
      this.deduction.id = id;
      this.deductionShow = !this.deductionShow;
    },
    deductionBox(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/merch/audit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              //这个需要包裹
              data: {
                merchId: this.deduction.id,
                status: 2
              }
            })
          })
            .then(res => {
              this.deductionShow = !this.deductionShow;
              if (res.data.code == 1) {
                // this.giftSelect = res.data.data;
                this.$message({
                  type: "success",
                  message: "已拒绝!"
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
                message: "网络较差，请稍后重试！"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
   cursor: pointer;
}
.colorRed {
  color: #f54848;
}
.colorOrange {
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
</style>
