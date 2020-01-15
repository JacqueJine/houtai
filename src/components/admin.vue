<template>
  <div class="member">
    <div class="deal_num">管理员管理</div>
    <div class="member_middle">
      <!-- <div class="screen">
        <span class="deal_nums">筛选</span>
        <span class="deal_numss">
          注册时间:   
          <el-date-picker v-model="value1" type="date" placeholder="请选择" size="mini"></el-date-picker>
        </span>
        <div class="deal_input">
          <div class="input_left">
            <span class="input_grade">等级：</span>
            <el-input v-model="grade" placeholder="请输入等级" size="mini"></el-input>
          </div>
          <div class="input_right">
            <span class="input_referrer">推荐人:</span>
            <el-input v-model="referrer" placeholder="请输入推荐人" size="mini"></el-input>
          </div>
        </div>
        <button class="inquire">查询</button>
      </div>-->
      <div class="screen">
        <el-form :model="formInline" label-width="70px">
          <el-form :inline="true" label-width="70px" size="mini">
            <!-- <el-form-item label="注册时间">
              <el-col>
                <el-date-picker
                  el-icon-circle-close
                  type="datetime"
                  placeholder="选择日期"
                  v-model="value1"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>-->
            <el-form-item>
              <!-- <el-button type="primary" size="small">查询</el-button> -->
              <el-button type="primary" size="small" @click="update(0)">添加管理员</el-button>
              <el-button type="primary" size="small" @click="toAuth">权限管理</el-button>
            </el-form-item>
            <!-- <el-form-item style="float:right">
              <el-col :span="18">
                <el-input v-model="value1" placeholder="请输入用户ID" class="orderNum"></el-input>
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="5">
                <el-button type="primary" size="mini" round>搜索</el-button>
              </el-col>
            </el-form-item> -->
          </el-form>
          <!-- <el-form :inline="true" label-width="70px" size="mini">
            <el-form-item label="等级">
              <el-input v-model="grade" placeholder="请输入等级" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="推荐人">
              <el-input v-model="referrer" placeholder="请输入推荐人" size="mini"></el-input>
            </el-form-item>
          </el-form>-->
        </el-form>
      </div>
      <!-- <div class="member_add">
        <img src="./../assets/img/add.png" alt />
        <span>添加</span>
      </div>-->
      <div>
        <el-table :data="tableData" :header-cell-style="{background:'#f5f5f5'}">
          <el-table-column fixed prop="id" label="id" sortable width="100"></el-table-column>
          <el-table-column prop="username" min-width="140" label="用户名"></el-table-column>
          <el-table-column prop="level" label="等级" sortable></el-table-column>
          <el-table-column prop="addtime" label="添加时间" min-width="160"  sortable></el-table-column>
          <el-table-column label="修改时间" sortable min-width="160" >
            <template slot-scope="{row}">
              <p>{{row.savetime?row.savetime:'无'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="登录时间" sortable min-width="160" >
            <template slot-scope="{row}">
              <p>{{row.login_time?row.login_time:'无'}}</p>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="update(1,row)">编辑</el-button>
              <el-button
                type="text"
                size="small"
                style="color:#F15818;"
                @click="delAdmin(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加弹窗个 -->
    <el-dialog :title="type==0?'添加管理员':'编辑管理员'" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-form label-width="130px" :rules="rules" ref="ruleForm" :model="form">
          <el-form-item label="管理员用户名：" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码：" prop="pwd">
            <el-input v-model="form.pwd"></el-input>
          </el-form-item>
          <el-form-item label="管理员等级：" prop="level">
            <el-select v-model="form.level" placeholder="请选择管理员等级">
              <el-option label value>
                <el-button type="text" class="game_btn" @click="addAuth">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in authList" :key="index">
                <el-option :label="item.auth_name" :value="item.id" class="option"></el-option>
                <!-- <i class="el-icon-circle-close" @click="del(1,item.id)"></i> -->
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="7"
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
      formInline: {},
      grade: "",
      referrer: "",
      dialogVisible: false,
      form: {
        id: "",
        username: "",
        pwd: "",
        level: ""
      },
      rules: {
        username: [
          { required: true, message: "管理员用户名不能为空", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "管理员密码不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "管理员等级不能为空", trigger: "change" }
        ]
      },
      authList: [],
      tableData: [],
      total: 0,
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
      value2: "",
      page: 1,
      type: 0 //0添加 1编辑
    };
  },
  mounted() {
    this.getAdmin();
    this.getAuth();
  },
  methods: {
    // 获取列表
    getAdmin() {
      this.$axios({
        url: this.$global.url + "root/user/getList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            page: this.page,
            limit: 6
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.tableData = res.data.data;
            this.total = res.data.count;
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
    //to管理员权限
    toAuth() {
      this.$router.push("/authority");
    },
    update(type, item) {
      this.form.id = "";
      this.form.username = "";
      this.form.pwd = "";
      this.form.level = "";
      this.dialogVisible = true;
      this.type = type;
      if (item != undefined) {
        this.form.username = item.username;
        this.form.id = item.id;
        if (item.level == "超级管理员") {
          this.form.level = 1;
        } else if (item.level == "管理员") {
          this.form.level = 2;
        } else if (item.level == "财务") {
          this.form.level = 3;
        }
      }
    },
    //添加管理员或编辑
    addAdmin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //添加
          if (this.type == 0) {
            this.$axios({
              url: this.$global.url + "root/user/addAdmin" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: {
                  username: this.form.username,
                  pwd: this.form.pwd,
                  level: this.form.level
                }
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.dialogVisible = false;
                  this.$message.success({
                    message: "添加成功"
                  });
                  this.getAdmin();
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
          }
          //编辑
          else if (this.type == 1) {
            this.$axios({
              url: this.$global.url + "root/user/updateAdmin" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: {
                  id: this.form.id,
                  username: this.form.username,
                  pwd: this.form.pwd,
                  level: this.form.level
                }
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.dialogVisible = false;
                  this.$message.success({
                    message: "编辑成功"
                  });
                  this.getAdmin();
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
          }
        } else {
          return false;
        }
      });
    },
    //添加权限名称
    addAuth() {
      this.$prompt("请输入名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        inputErrorMessage: "不能为空！！"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/user/addAuth" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              name: value
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success({
                  message: "添加成功！"
                });
                this.getAuth();
              }
            })
            .catch(e => {
              this.$message.error({
                message: "网络较差，请稍后重试！"
              });
            });
        })
        .catch(() => {});
    },
    //获取权限名称
    getAuth() {
      this.$axios({
        url: this.$global.url + "root/user/listAuth" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.authList = res.data.data;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //删除管理员
    delAdmin(id) {
      this.$confirm("此操作将永久删除管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/user/delAdmin" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              id: id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success({
                  message: "删除成功"
                });
                this.getAdmin();
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
        .catch(() => {});
    },
    // 分页
    handleSizeChange(val) {
      this.page = val;
      this.getAdmin();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAdmin();
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
  height: 700px;
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
.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
</style>
