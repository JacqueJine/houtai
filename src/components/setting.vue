<template>
  <div class="add">
    <div class="deal_num">平台设置</div>
    <p class="title">联系方式</p>
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        size="small"
        :rules="rules"
        style="width:700px"
        label-width="120px"
      >
        <el-form-item label="平台微信" required prop="WeChat">
          <el-input v-model="form.WeChat" placeholder="平台微信"></el-input>
        </el-form-item>
        <el-form-item label="平台电话" required prop="phone">
          <el-input v-model="form.phone" placeholder="平台电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:60%" @click="giftAdd('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="title">修改包夜时间</p>
    <div class="form">
      <el-form size="small" style="width:700px" label-width="120px">
        <el-form-item label="包夜时间" label-width="90px" style="margin-bottom:22px;">
          <el-time-select
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
                start: '18:00',
                step: '00:15',
                end: '23:45'
              }"
          ></el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
                start: '06:00',
                step: '00:15',
                end: '09:45'
              }"
          ></el-time-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:60%" @click="editTime()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="title">修改账号押金</p>
    <div class="form">
      <el-form style="width:700px" label-width="120px">
        <el-form-item label="账号押金" required>
          <el-input v-model="price" placeholder="请输入账号押金"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:60%" @click="editPrice()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let validateScore = (rule, value, callback) => {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("价格大于0，最多保留两位小数"));
      } else {
        callback();
      }
    };
    // ^[1-9]\d*$
    let validateSum = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("数量大于0，且为整数"));
      } else {
        callback();
      }
    };
    let timeCheck = (rule, value, callback) => {
      let startTime = new Date("2018-1-1 " + this.startTime); // 开始时间
      let endTime = new Date("2018-1-2 " + this.endTime);
      let num = Math.floor((endTime - startTime) / 1000 / 60); // 分钟
      if (num < 600) {
        callback(new Error("包夜时间段不得小于10个小时"));
      } else {
        callback();
      }
    };
    return {
      url: this.$global.url,
      form: {
        WeChat: "",
        phone: ""
      },
      rules: {
        WeChat: [{ required: true, message: "不能为空", trigger: "blur" }],
        phone: [{ required: true, message: "不能为空", trigger: "change" }]
      },
      startTime: "",
      endTime: "",
      time: [],
      price: ""
    };
  },
  created() {
    this.getWeChat();
    this.getPhone();
    this.getTime();
    this.getPrice();
  },
  methods: {
    //获取微信
    getWeChat() {
      this.$axios({
        url: this.$global.url + "root/common/system" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          title: "WeChat"
        })
      })
        .then(res => {
          this.form.WeChat = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //获取手机号
    getPhone() {
      this.$axios({
        url: this.$global.url + "root/common/system" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          title: "phone"
        })
      })
        .then(res => {
          this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //提交
    giftAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + "root/common/updateSystem" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              title: "WeChat",
              value: this.form.WeChat
            })
          })
            .then(res => {})
            .catch(e => {
              console.log(e);
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
          this.$axios({
            url: this.$global.url + "root/common/updateSystem" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              title: "phone",
              value: this.form.phone
            })
          })
            .then(res => {})
            .catch(e => {
              console.log(e);
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
    //获取包夜时间
    getTime() {
      this.$axios({
        url: this.$global.url + "root/number/nightList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.startTime = res.data.data[0];
            this.endTime = res.data.data[1];
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
          // this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    editTime() {
      if (this.startTime == "" || this.endTime == "") {
        this.$message.error({
          message: "包夜开始时间或结束时间不能为空！",
          center: true
        });
        return false;
      }
      this.time = [];
      this.time.push(this.startTime);
      this.time.push(this.endTime);
      this.$axios({
        url: this.$global.url + "root/number/numberNight" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          night: this.time
        })
      })
        .then(res => {
          if (res.data.code == 1) {
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
    //获取押金
    getPrice() {
      this.$axios({
        url: this.$global.url + "root/number/listCash" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.price = res.data.data;
          } else {
            this.$message.error({
              message: res.data.msg,
              center: true
            });
          }
          // this.form.phone = res.data;
        })
        .catch(e => {
          console.log(e);
          this.$message.error({
            message: "网络较差，请稍后重试！",
            center: true
          });
        });
    },
    //修改押金
    editPrice() {
      let reg = /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      if (!reg.test(this.price)) {
        this.$message.error({
          message: "押金大于等于0，且最多保留两位小数！",
          center: true
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "root/number/numberCash" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          cash: this.price
        })
      })
        .then(res => {
          if (res.data.code == 1) {
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
    }
  }
};
</script>
<style>
.add {
  margin: 20px 20px;
  padding: 25px;
  border-radius: 8px;
  background: #fff;
  color: #333333;
}
.deal_num {
  padding: 0;
  padding-bottom: 35px;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.ql-editor {
  min-height: 200px;
}
.form {
  padding: 20px;
}
.title {
  background: rgba(3, 122, 240, 0.2);
  color: #037af0;
  padding: 11px 18px;
  font-size: 14px;
}
.game_btn {
  padding: 10px 20px;
}
.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
.tishi {
  color: #999999;
  font-size: 12px;
  padding: 10px 120px;
}
.zhanghao input {
  width: 217px;
}
table {
  text-align: center;
  border-color: #dddddd;
}
table input {
  border: none;
  outline: none;
  text-align: center;
}
.el-icon-circle-close:before {
  color: #ccc;
}
</style>