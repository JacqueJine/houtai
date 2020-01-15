<template>
  <div class="login">
    <div class="login_data">
      <div class="title">后台登陆系统</div>
      <el-form label-width="40px" ref="form" :model="loginForm" :rules="rules">
        <p class="name">账号</p>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <p class="name">密码</p>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <p class="name">验证码</p>
        <el-form-item prop="code" class="code">
          <el-input v-model="loginForm.code" placeholder="请输入右侧验证码" class="regInput"></el-input>
          <!-- <el-button type="primary" @click="sendCode()">{{loginForm.buttonText}}</el-button> -->
          <div class="codes" @click="refreshCode">
            <s_identify :identifyCode="identifyCode"></s_identify>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
            style="width:90%;margin-bottom: 33px;"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import s_identify from "./identify";
export default {
  data() {
    return {
      identifyCodes: "1234567890",
      identifyCode: "",
      loginForm: {
        username: "admin",
        password: "",
        code: ""
        // buttonText: "发送验证码"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  components: {
    s_identify
  },
  methods: {
    //   登录
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loginForm.code != this.identifyCode) {
            this.$message.error({
              message: "验证码不正确",
              center: true
            });
            return false;
          }
          console.log(this.identifyCode);
          this.$axios({
            url: this.$global.url + "root/login/register" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: {
                username: this.loginForm.username,
                pwd: this.loginForm.password
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$global.setToken("username", this.loginForm.username);
                this.$global.setToken("user", JSON.stringify(res.data.data));
                this.$global.setToken("path", JSON.stringify(res.data.path));
                this.$router.push({ path: "/" });
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
          return false;
        }
      });
    },
    // 验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
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
.login {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/img/shou.jpg);
  background-size: cover;
}
.login_data {
  position: relative;
  width: 400px;
  background: #ffffff;
  left: 60%;
  top: 30%;
}
.title {
  color: #333333;
  padding-top: 27px;
  padding-left: 47px;
  font-size: 22px;
  font-weight: 600;
  padding-bottom: 15px;
}
.el-input__inner {
  width: 90%;
}
.name {
  font-size: 16px;
  color: #666666;
  margin-left: 49px;
  font-weight: 600;
}

.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 110px;
  text-align: center;
}
.login .regInput {
  width: 193px;
}
.code .el-form-item__content {
  display: flex;
}
.codes {
  display: inline-block;
  width: 114px;
  height: 40px;
}
</style>