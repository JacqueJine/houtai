<template>
  <div class="member">
    <div class="deal_num">用户管理</div>
    <div class="member_middle">
      <div class="screen">
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
            <el-col :span="18">
              <el-input v-model="value1" placeholder="账号/用户名/手机号搜索" class="orderNum"></el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="5">
              <el-button type="primary" size="small" round @click="getData()">搜索</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="from">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="500"
          :header-cell-style="{background:'#f5f5f5'}"
        >
          <el-table-column fixed prop="id" label="id" width="60"></el-table-column>
          <el-table-column prop="user_number" label="唯一账号" width="120" sortable></el-table-column>
          <el-table-column label="用户名" min-width="150">
            <template slot-scope="{row}">
              <p>{{row.user_name?row.user_name:'无'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="手机号" width="150"></el-table-column>
          <el-table-column prop="shop" label="店铺">
            <template slot-scope="{row}">
              <p>{{row.merch_title?row.merch_title:'无'}}</p>
              <!-- <p style="color:#999999">等级：{{row.shop.level}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="信誉分/等级" min-width="113">
            <template slot-scope="{row}">
              <p
                v-if="!row.is_merch"
                class="colorGreen"
                @click="getcreditlog(row.id,0)"
              >信誉分：{{row.credit}}</p>
              <p
                v-if="row.is_merch"
                class="colorGreen"
                @click="getcreditlog(row.id,0)"
              >等级：{{row.merch_level==1?"星星":row.merch_level==2?"月亮":row.merch_level==3?"太阳":row.merch_level==4?"皇冠":row.merch_level==5?"宝鼎":""}}</p>
            </template>
          </el-table-column>
          <el-table-column label="资产" width="160">
            <template slot-scope="{row}">
              <p style="color:#037AF0">
                <span style="color:#999999">余额:</span>
                {{row.lines}}
              </p>
              <p style="color:#037AF0">
                <span style="color:#999999">糖果:</span>
                {{row.candies?row.candies:0}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="270" sortable>
            <template slot-scope="{row}">
              <p>注册时间：{{row.create_time}}</p>
              <p style="color:#999">最后修改：{{row.update_time?row.update_time:'无'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="身份证图片" width="270">
            <template slot-scope="{row}">
              <p style="color:#999">
                <img
                  width="155px"
                  style="cursor:pointer"
                  :src="imgUrl+row.goods_phot"
                  alt
                  v-if="row.goods_phot!=null"
                  @click="showpopup(row.goods_phot)"
                />
                {{row.goods_phot==null?"无":""}}
              </p>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="300">
            <template slot-scope="{row}">
              <div class="operation">
                <!-- <span class="colorBlue">编辑</span> -->
                <span @click="showDeductionBox(row.id)" class="colorRed">扣分</span>
                <span
                  :class="row.is_black==1?'colorGreen':'colorRed'"
                  @click="seal(row.id,row.is_black)"
                >{{row.is_black==1?'解封':'封号'}}</span>
                <br />
                <span class="colorBlue" @click="addLines(row.id,1)">添加余额</span>
                <span class="colorRed" @click="addLines(row.id,2)">扣除余额</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <el-dialog title="扣信誉分" :visible.sync="deductionShow" width="25%" center>
      <el-form :model="deduction" ref="ruleForm" size="small" :rules="rules1">
        <el-form-item label="扣除分值" prop="grade">
          <el-input v-model="deduction.grade" size="small" placeholder="请输入要扣除的分值"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="deduction.note" size="small" placeholder="请输入扣分原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deductionShow = false">取 消</el-button>
        <el-button type="primary" @click="deductionBox('ruleForm')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 信誉积分弹出框 -->
    <el-dialog title="信誉分记录" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" height="500">
        <el-table-column property="type" label="类型" width="100"></el-table-column>
        <el-table-column property="message" label="原因" width="200"></el-table-column>
        <el-table-column property="add_time" label="时间"></el-table-column>
        <el-table-column property="number" width="100" label="分值"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="身份证预览" :visible.sync="showImg" width="50%">
      <img :src="popurl" alt="" width="90%">
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    let validateScore = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入大于0的正整数"));
      } else {
        callback();
      }
    };
    return {
      formInline: {
        region: ""
      },
      deductionShow: false,
      deduction: {
        id: "",
        grade: "",
        note: ""
      },
      dialogTableVisible: false,
      gridData: [],
      grade: "",
      referrer: "",
      tableData: [],
      //   时间选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      rules1: {
        grade: [
          { required: true, message: "请输入要扣除的分值", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        note: [{ required: true, message: "请输入扣分原因", trigger: "blur" }]
      },
      total: 0,
      page: 1,
      black: 0, //1封号 0解封
      type: 0, //0信誉积分 1质保金,
      imgUrl: this.$global.imgUrl,
      //图片预览
      showImg:false,
      popurl:"",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // ^99$|^(\d|[1-9]\d)$
    // 获取数据列表
    getData() {
      this.$axios({
        url: this.$global.url + "root/member/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            field: this.value1,
            page: this.page,
            limit: 10
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.tableData = res.data.data;
            this.total = res.data.count;
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
    // 扣信誉分弹框
    showDeductionBox(id) {
      this.deduction.id = id;
      this.deductionShow = !this.deductionShow;
    },
    //图片预览
    showpopup(goods_phot){
      this.showImg=!this.showImg;
      this.popurl=this.imgUrl+goods_phot;
    },
    //添加余额
    addLines(id, type) {
      this.$prompt("请输入金额", "金额", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
        inputErrorMessage: "金额大于0，最多保留两位小数"
      })
        .then(({ value }) => {
          let url = "";
          if (type == 1) {
            url = "root/member/linesAdd" + ".html";
          } else {
            url = "root/member/linesDec" + ".html";
          }
          this.$axios({
            url: this.$global.url + url,
            method: "POST",
            data: this.$qs.stringify({
              mid: id,
              lines: value
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                this.getData();
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
        })
        .catch(() => {});
    },
    //封号
    seal(id, black) {
      if (black == 1) {
        this.black = 0;
      } else {
        this.black = 1;
      }
      this.$confirm("您确定要进行此操作吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/member/seal" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              mid: id,
              is_black: this.black
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.getData();
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
        })
        .catch(() => {});
    },
    //信誉度增减记录
    getcreditlog(id, type) {
      this.gridData = [];
      this.$axios({
        url: this.$global.url + "root/member/creditLog" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          mid: id,
          type: type
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.dialogTableVisible = !this.dialogTableVisible;
            this.gridData = res.data.data;
            this.$message({
              type: "success",
              message: res.data.msg
            });
          } else {
            this.$message.info({
              message: "暂无记录"
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
    //扣除信誉分
    deductionBox(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/member/subPoints" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: {
                mid: this.deduction.id,
                number: this.deduction.grade,
                message: this.deduction.note
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.deductionShow = !this.deductionShow;
                this.deduction.grade = "";
                this.deduction.note = "";
                this.$message({
                  type: "success",
                  message: "扣分成功!"
                });
                this.getData();
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
<style scope>
* {
  padding: 0;
  margin: 0;
}
.member {
  background: #ffffff;
  margin: 20px 20px;
  min-height: 700px;
  position: relative;
  border-radius: 8px;
}
.cell {
  color: #333333;
  font-size: 14px;
}
.screen {
  padding: 20px 0px 0;
}
.deal_num {
  padding-top: 26px;
  padding-left: 20px;
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.deal_nums {
  /* padding-top: 16px; */
  /* padding-left: 10px; */
  color: #333333;
  font-size: 14px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.deal_numss {
  padding-left: 28px;
  color: #333333;
  font-size: 14px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.member_middle {
  margin: 20px;
}
.member_add {
  width: 76px;
  height: 42px;
  background: #037af0;
  display: inline-block;
  border-radius: 30px;
  text-align: center;
  line-height: 42px;
}
.member_add img {
  width: 18px;
  height: 18px;
  vertical-align: sub;
}
.member_add span {
  font-size: 14px;
  color: #ffffff;
  margin-left: 4px;
}
.orderNum .el-input__inner {
  border-radius: 14px;
}
tbody .el-table_1_column_3 {
  color: red;
}
.paging {
  position: absolute;
  bottom: 3%;
}
.deal_input {
  display: flex;
  margin-top: 20px;
}
.input_grade {
  width: 25%;
  padding-left: 79px;
  color: #333333;
  font-size: 14px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.input_referrer {
  width: 34%;
  padding-left: 22px;
  color: #333333;
  font-size: 14px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.input_left {
  display: flex;
}
.input_right {
  display: flex;
}
.inquire {
  border: none;
  background: #037af0;
  color: #ffffff;
  width: 100px;
  height: 30px;
  margin-left: 10%;
  margin-top: 16px;
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
