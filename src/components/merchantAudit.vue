<template>
  <div class="mall">
    <div class="deal_num">
      <p>商家审核</p>
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
        :header-cell-style="{background:'#f5f5f5'}"
        row-class-name="color"
        height="500"
        ref="multipleTable"
        @selection-change="SelectionChange"
      >
        <el-table-column type="selection" width="55" v-if="activeName=='1'"></el-table-column>
        <el-table-column prop="id" label="ID" width="60" sortable></el-table-column>
        <el-table-column prop="class" label="身份信息" width="340">
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
        <el-table-column prop="goods" label="店铺信息" width="260">
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
        <el-table-column prop="payment" align="center" min-width="120" label="保证金">
          <template slot-scope="{row}">
            <p class="paySum">￥{{row.quality}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="audit_time"
          :label="activeName==2?'审核时间':'申请时间'"
          sortable
          width="300"
        >
          <template slot-scope="{row}">
            <p>{{row.status==0?row.add_time:row.audit_time}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="{row}">
            <div v-if="row.status==0" class="operation">
              <span class="colorBlue" @click="pass(row.id)">通过</span>
              <span class="colorRed" @click="refuse(row.id)">拒绝</span>
            </div>
            <div v-if="row.status==1" class="operation">
              <span class="colorBlue">已通过</span>
            </div>
            <div v-if="row.status==2" class="operation">
              <span class="colorRed">已拒绝</span>
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
      total: 0,
      activeName: "1",
      Selection: [],
       id: [],
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
      this.page=1;
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
    //取消选择
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    //选择
    SelectionChange(val) {
      this.Selection = val;
      console.log(this.Selection);
    },
    // 获取商户列表
    getMerchlist() {
      this.$axios({
        url: this.$global.url + "root/merch/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 10,
          status: 0
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else if (res.data.code == 0) {
            this.tableData = [];
            this.$message.info({
              message: "暂无数据！"
            });
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //商家审核记录
    getputaway() {
      this.$axios({
        url: this.$global.url + "root/merch/putawayDate" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 10
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.total = res.data.count;
            this.tableData = res.data.data;
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
    // 审核商户
    //通过
    pass(id) {
      //判断是否批量通过
      this.id = [];
      if (id == "id") {
        if (this.Selection.length <= 0) {
          this.$message.info({
            message: "请选择要通过的商户",
            center: true
          });
          return false;
        } else {
          for (let i = 0; i < this.Selection.length; i++) {
            this.id.push(this.Selection[i].id);
          }
        }
      } else {
        this.id.push(id);
      }
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
                merchId: this.id,
                status: 1
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                // this.giftSelect = res.data.data;
                this.getMerchlist();
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
    // 拒绝
    refuse(id) {
      this.deduction.id = id;
      this.deductionShow = !this.deductionShow;
    },
    deductionBox(formName) {
      this.id=[];
      this.id.push(this.deduction.id);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/merch/audit" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              //这个需要包裹
              data: {
                merchId: this.id,
                status: 2,
                title: this.deduction.note
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
                this.getMerchlist();
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
