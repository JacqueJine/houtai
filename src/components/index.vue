<template>
  <el-row class="bg_main">
    <el-col :span="3" class="bg_left">
      <div class="grid-content bg-purple">
        <div class="logo">
          <img src="../assets/img/guan.png" alt />
        </div>
      </div>
      <div class="tab">
        <el-row>
          <el-col :span="12" style="width: 100%;">
            <el-menu
              :default-active="this.$route.path.substr(1)"
              style="width: 100%;"
              class="tabInfo"
              background-color="#1b1d1e"
              text-color="#fff"
              active-text-color="#ffd04b"
              router
            >
              <!-- <el-menu-item index="/console" style="width: 100%;">
                <i class="el-icon-s-home"></i>
                <span slot="title">控制台</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span>订单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/numberOrder">账号订单</el-menu-item>
                  <el-menu-item index="/giftOrder">礼物订单</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-s-goods"></i>
                  <span>商城管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/shelves">已上架</el-menu-item>
                  <el-menu-item index="/unshelves">已下架</el-menu-item>
                  <el-menu-item index="/add">添加账号</el-menu-item>
                  <el-menu-item index="/addGift">添加礼物</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="/shop" style="width: 100%;">
                <i class="el-icon-s-shop"></i>
                <span slot="title">店铺装修</span>
              </el-menu-item>
              <el-menu-item index="/merchant" style="width: 100%;">
                <i class="el-icon-user-solid"></i>
                <span slot="title">商家管理</span>
              </el-menu-item>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-s-tools"></i>
                  <span>系统管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/user">用户管理</el-menu-item>
                  <el-menu-item index="/admin" v-if="this.user.level==1">管理员管理</el-menu-item>
                  <el-menu-item index="/withdraw">用户提现</el-menu-item>
                  <el-menu-item index="/accountAudit">账号审核</el-menu-item>
                  <el-menu-item index="/merchantAudit">商家审核</el-menu-item>
                  <el-menu-item index="/giftAudit">礼物审核</el-menu-item>
                </el-menu-item-group>
              </el-submenu>-->
              <template v-for="item in items">
                <template v-if="item.subs">
                  <el-submenu :index="item.index" :key="item.index">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span slot="title">{{ item.title }}</span>
                    </template>
                    <template v-for="subItem in item.subs">
                      <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                        <template slot="title">
                          <p>{{ subItem.title }}</p>
                        </template>

                        <!-- <el-menu-item
                          v-for="(threeItem,i) in subItem.subs"
                          :key="i"
                          :index="threeItem.index"
                        >{{ threeItem.title }}</el-menu-item>-->
                      </el-submenu>
                      <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                        <!-- 小标签  -->
                        <el-badge value="new">
                          <p>{{ subItem.title }}</p>
                        </el-badge>
                      </el-menu-item>
                    </template>
                  </el-submenu>
                </template>
                <template v-else>
                  <el-menu-item :index="item.index" :key="item.index">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-menu>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="21" :offset="3" class="bg_right">
      <div class="grid-content bg-purple-light">
        <div class="right_top">
          <div class="flush">
            <img src="../assets/img/shuaxin.png" title="刷新" ref="shua" alt @click="shau" />
          </div>
          <!-- <el-input v-model="input" placeholder="请输入搜索内容"></el-input> -->
          <div class="userInfo">
            <!-- <div class="wechat" style="margin-right:25px;">
              <router-link to="/add">
                <i class="el-icon-circle-plus" style="color: #fff;font-size: 22px;"></i>
              </router-link>
            </div>-->
            <!-- <div class="wechat">
              <el-badge :value="1" :max="99" class="item">
                <img src="../assets/img/wei.png" alt />
              </el-badge>
            </div>-->
            <el-dropdown trigger="click" class="user_name">
              <span class="el-dropdown-link">
                <img class="tou" src="../assets/img/head.png" alt />
                {{user.username}}
                <img
                  class="jiantou"
                  src="../assets/img/xia.png"
                  alt
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>
                  <img class="u_icon only" src="../assets/img/user1.png" alt />
                  <span @click="dialogFormVisible = true">基本资料</span>
                </el-dropdown-item>-->
                <el-dropdown-item>
                  <img class="u_icon" src="../assets/img/user2.png" alt />
                  <span @click="getEncrypted">修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item class="col">
                  <img class="u_icon" src="../assets/img/user3.png" alt />
                  <span @click="logout">退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <audio :src="mus" class="media-audio" autoplay ref="MusicPlay"></audio>
        <!-- 弹窗 -->
        <el-dialog title="基本资料" :visible.sync="dialogFormVisible" center>
          <el-form :model="form">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p>修改头像</p>
            <el-form-item label="修改昵称" style="width:200px;margin: 0 auto;">
              <el-input v-model="form.name" auto-complete="off" class="infoname" size="small"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
          </div>
        </el-dialog>
        <!-- 设置密码弹窗 -->
        <el-dialog title="设置密保" :visible.sync="dialogFormVisible1" center>
          <el-form :model="form1">
            <el-form-item label="密保只能设置一次且不可找回，请记住您的密保" required></el-form-item>
            <el-form-item label="问题一" style="width:240px;margin: 0 auto;">
              <el-input
                v-model="form1.question1"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入密保问题"
              ></el-input>
              <el-input
                v-model="form1.answer1"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
            <el-form-item label="问题二" style="width:240px;margin: 0 auto;">
              <el-input
                v-model="form1.question2"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入密保问题"
              ></el-input>
              <el-input
                v-model="form1.answer2"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
            <el-form-item label="问题三" style="width:240px;margin: 0 auto;">
              <el-input
                v-model="form1.question3"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入密保问题"
              ></el-input>
              <el-input
                v-model="form1.answer3"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="setEncrypted">保 存</el-button>
          </div>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog title="验证密保" :visible.sync="dialogFormVisible2" center>
          <el-form :model="form2">
            <el-form-item :label="'密保问题：'+form2.question" style="width:300px;margin: 0 auto;">
              <el-input
                v-model="form2.answer"
                auto-complete="off"
                class="infoname"
                size="small"
                placeholder="请输入答案"
              >
                <el-button slot="append" @click="next">下一个</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="nextstep">下一步</el-button>
          </div>
        </el-dialog>
        <el-dialog title="设置密码" :visible.sync="dialogFormVisible3" center>
          <el-form :model="form3">
            <el-form-item label="密码" style="width:300px;margin: 0 auto;">
              <el-input
                v-model="form3.pass"
                auto-complete="off"
                class="infoname"
                size="small"
                type="password"
                placeholder="请输入登录密码"
              ></el-input>
              <el-input
                v-model="form3.pass1"
                auto-complete="off"
                class="infoname"
                size="small"
                type="password"
                placeholder="请再次输入登录密码"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="setPass">确定</el-button>
          </div>
        </el-dialog>
        <div class="right_nav">
          <!-- <div class="home_img">
            <img src="../assets/img/fangzi.png" />
          </div>-->
          <el-button type="primary" icon="el-icon-s-home" size="small" @click="goHome()"></el-button>
          <ul>
            <li class="tag" v-for="(item,index) in route" :key="index">
              <!-- <img src="../assets/img/weixuanzhong.png" /> -->
              <el-tag
                :effect="path==item.path?'dark':'plain'"
                icon="el-icon-s-home"
                closable
                @click="back(item)"
                @close="tagClose(index)"
              >{{item.title}}</el-tag>
            </li>
            <!-- <li>
              <img src="../assets/img/weixuanzhong.png" />
              <el-tag effect="plain" icon="el-icon-s-home" closable>会员商城</el-tag>
            </li>-->
          </ul>
        </div>
        <div class="routerview">
          <router-view></router-view>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      input: "",
      route: [],
      path: "",
      deg: 0,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      form: {
        name: "",
        delivery: false,
        type: [],
        imageUrl: require("./../assets/img/info.png")
      },
      form1: {
        answer1: "",
        answer2: "",
        answer3: "",
        question1: "",
        question2: "",
        question3: ""
      },
      form2: {
        answer: "",
        question: ""
      },
      form3: {
        pass: "",
        pass1: ""
      },
      items: [
        {
          icon: "el-icon-s-home",
          index: "console",
          title: "控制台"
        },
        {
          icon: "el-icon-s-order",
          index: "2",
          title: "订单管理",
          subs: [
            {
              index: "numberOrder",
              title: "账号订单"
            },
            {
              index: "giftOrder",
              title: "礼物订单"
            }
          ]
        },
        {
          icon: "el-icon-s-goods",
          index: "3",
          title: "商城管理",
          subs: [
            {
              index: "shelves",
              title: "已上架"
            },
            {
              index: "unshelves",
              title: "已下架"
            },
            {
              index: "add",
              title: "添加账号"
            },
            {
              index: "addGift",
              title: "添加礼物"
            },
            {
              index: "editPwd",
              title: "账号改密"
            }
          ]
        },
        {
          icon: "el-icon-s-shop",
          index: "shop",
          title: "店铺装修"
        },
        {
          icon: "el-icon-user-solid",
          index: "merchant",
          title: "商家管理"
        },
        {
          icon: "el-icon-s-tools",
          index: "4",
          title: "系统管理",
          subs: [
            {
              index: "user",
              title: "用户管理"
            },
            {
              index: "admin",
              title: "管理员管理"
            },
            {
              index: "setting",
              title: "平台设置"
            },
            {
              index: "withdraw",
              title: "用户提现"
            },
            {
              index: "accountAudit",
              title: "账号审核"
            },
            {
              index: "merchantAudit",
              title: "商家审核"
            },
            {
              index: "giftAudit",
              title: "礼物审核"
            }
          ]
        }
      ],
      formLabelWidth: "70px",
      user: "",
      encrypted: [],
      index: 0,
      page: 1,
      // 新消息
      merchtotal: 0,
      usertotal: 0,
      numbertotal: 0,
      gifttotal: 0,
      numberOrder: 0,
      townum: [],
      mus: "",
      giftI:0,
      number_outI:0,
      numberI:0,
    };
  },
  created() {
    //设置数据一致
    this.merchtotal = Number(localStorage.getItem("merchtotal"));
    this.usertotal = Number(localStorage.getItem("usertotal"));
    this.numbertotal = Number(localStorage.getItem("numbertotal"));
    this.gifttotal = Number(localStorage.getItem("gifttotal"));
    this.numberOrder = Number(localStorage.getItem("numberOrder"));

    //各种审核监听
    setInterval(() => {
      this.getMerchlist();
      this.getUser();
      this.getNumberlist();
      this.getGiftlist();
      this.getNumberOrder();
      this.getNewsOrder();
    }, 5000);
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.items = JSON.parse(localStorage.getItem("path"));

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].subs) {
        for (let j = 0; j < this.items[i].subs.length; j++) {
          this.townum.push(this.items[i].subs[j]);
        }
      }
    }
    let badeg = document.getElementsByClassName("el-badge__content");
    for (let i = 0; i < badeg.length; i++) {
      badeg[i].style.display = "none";
    }

    let obj = {
      path: this.$route.path,
      title: this.$route.meta.title
    };
    this.path = this.$route.path;
    if (
      JSON.stringify(this.route).indexOf(JSON.stringify(obj)) == -1 &&
      obj.path != "/console"
    ) {
      this.route.push(obj); // 进行动态的操作
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        let obj = {
          path: this.$route.path,
          title: this.$route.meta.title
        };
        this.path = this.$route.path;
        if (
          JSON.stringify(this.route).indexOf(JSON.stringify(obj)) == -1 &&
          obj.path != "/console"
        ) {
          this.route.push(obj); // 进行动态的操作
        }
        //删除标记
        if (val.path == "/merchantAudit") {
          for (let i = 0; i < this.townum.length; i++) {
            if (this.townum[i].title == "商家审核") {
              document.getElementsByClassName("el-badge__content")[
                i
              ].style.display = "none";
            }
          }
        }
        if (val.path == "/withdraw") {
          for (let i = 0; i < this.townum.length; i++) {
            if (this.townum[i].title == "用户提现") {
              document.getElementsByClassName("el-badge__content")[
                i
              ].style.display = "none";
            }
          }
        }
        if (val.path == "/accountAudit") {
          for (let i = 0; i < this.townum.length; i++) {
            if (this.townum[i].title == "账号审核") {
              document.getElementsByClassName("el-badge__content")[
                i
              ].style.display = "none";
            }
          }
        }
        if (val.path == "/giftAudit") {
          for (let i = 0; i < this.townum.length; i++) {
            if (this.townum[i].title == "礼物审核") {
              document.getElementsByClassName("el-badge__content")[
                i
              ].style.display = "none";
            }
          }
        }
        if (val.path == "/editPwd") {
          for (let i = 0; i < this.townum.length; i++) {
            if (this.townum[i].title == "账号改密") {
              document.getElementsByClassName("el-badge__content")[
                i
              ].style.display = "none";
            }
          }
        }
      },
      // 深度观察监听
      deep: true
    },
    // 监听商家审核
    merchtotal: {
      handler: function(val, oldVal) {
        for (let i = 0; i < this.townum.length; i++) {
          if (this.townum[i].title == "商家审核") {
            document.getElementsByClassName("el-badge__content")[
              i
            ].style.display = "block";
          }
        }
        this.mus = require("./../assets/img/tishi.mp3");
        setTimeout(() => {
          this.mus = "";
        }, 4000);
        localStorage.setItem("merchtotal", val);
      },
      immediate: false,
      deep: true
    },
    //用户提现
    usertotal: {
      handler: function(val, oldVal) {
        for (let i = 0; i < this.townum.length; i++) {
          if (this.townum[i].title == "用户提现") {
            document.getElementsByClassName("el-badge__content")[
              i
            ].style.display = "block";
          }
        }

        this.mus = require("./../assets/img/tishi.mp3");
        setTimeout(() => {
          this.mus = "";
        }, 4000);
        localStorage.setItem("usertotal", val);
      },
      immediate: false,
      deep: true
    },
    //账号审核
    numbertotal: {
      handler: function(val, oldVal) {
        for (let i = 0; i < this.townum.length; i++) {
          if (this.townum[i].title == "账号审核") {
            document.getElementsByClassName("el-badge__content")[
              i
            ].style.display = "block";
          }
        }
        this.mus = require("./../assets/img/tishi.mp3");
        setTimeout(() => {
          this.mus = "";
        }, 4000);
        localStorage.setItem("numbertotal", val);
      },
      immediate: false,
      deep: true
    },
    // 礼物审核
    gifttotal: {
      handler: function(val, oldVal) {
        for (let i = 0; i < this.townum.length; i++) {
          if (this.townum[i].title == "礼物审核") {
            document.getElementsByClassName("el-badge__content")[
              i
            ].style.display = "block";
          }
        }
        // 提示音
        this.mus = require("./../assets/img/tishi.mp3");
        setTimeout(() => {
          this.mus = "";
        }, 4000);
        localStorage.setItem("gifttotal", val);
      },
      immediate: false,
      deep: true
    },
    // 账号订单
    numberOrder: {
      handler: function(val, oldVal) {
        for (let i = 0; i < this.townum.length; i++) {
          if (this.townum[i].title == "账号改密") {
            document.getElementsByClassName("el-badge__content")[
              i
            ].style.display = "block";
          }
        }
        this.mus = require("./../assets/img/tishi.mp3");
        setTimeout(() => {
          this.mus = "";
        }, 4000);
        localStorage.setItem("numberOrder", val);
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    tagClose(tag) {
      if (this.$route.path == this.route[tag].path) {
        if (tag == 0) {
          this.$router.push({ path: "/console" });
        } else {
          this.$router.push({ path: this.route[tag - 1].path });
        }
      }
      this.route.splice(tag, 1);
    },
    back(item) {
      this.$router.push({ path: item.path });
    },
    goHome() {
      this.$router.push({ path: "/console" });
    },
    shau() {
      this.deg += 360;
      this.$refs.shua.style.transform = "rotate(" + this.deg + "deg)";
      this.$refs.shua.style.transition = "all 2s";
      this.$router.go(0);
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // isJPG &&
      return isLt2M;
    },
    // 下一步设置密保
    nextstep() {
      if (this.encrypted[this.index].encrypted_pwd != this.form2.answer) {
        this.$message.error({
          message: "答案不正确，您可以尝试下一个！！！",
          center: true
        });
      } else {
        this.dialogFormVisible2 = false;
        this.dialogFormVisible3 = true;
      }
    },
    //下一个密保问题
    next() {
      this.index++;
      if (this.index > 2) {
        this.index = 0;
      }
      this.form2.question = this.encrypted[this.index].encrypted;
    },
    logout() {
      this.$router.push({ path: "/login" });
    },
    //设置密保问题，只能设置一次
    setEncrypted() {
      this.$axios({
        url: this.$global.url + "root/login/encrypted" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            encrypted_one: this.form1.question1,
            encrypted_onepwd: this.form1.answer1,
            encrypted_two: this.form1.question2,
            encrypted_twopwd: this.form1.answer2,
            encrypted_three: this.form1.question3,
            encrypted_threepwd: this.form1.answer3,
            id: this.user.id
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success({
              message: res.data.msg,
              center: true
            });
            this.dialogFormVisible1 = false;
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
    //获取密保信息
    getEncrypted() {
      this.$axios({
        url: this.$global.url + "root/login/encryptedList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.user.id
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.encrypted.push({
              encrypted: res.data.data.encrypted_one,
              encrypted_pwd: res.data.data.encrypted_onepwd
            });
            this.encrypted.push({
              encrypted: res.data.data.encrypted_two,
              encrypted_pwd: res.data.data.encrypted_twopwd
            });
            this.encrypted.push({
              encrypted: res.data.data.encrypted_three,
              encrypted_pwd: res.data.data.encrypted_threepwd
            });
            this.form2.question = this.encrypted[this.index].encrypted;
            this.dialogFormVisible2 = true;
          } else if (res.data.code == 0) {
            this.dialogFormVisible1 = true;
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
    //修改密码
    setPass() {
      if (this.form3.pass != this.form3.pass1) {
        this.$message.error({
          message: "两次输入密码不一致请重新输入！！！",
          center: true
        });
      } else {
        this.$axios({
          url: this.$global.url + "root/login/updatePwd" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            id: this.user.id,
            pwd: this.form3.pass
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.dialogFormVisible3 = false;
              this.$message.success({
                message: "修改成功,请重新登录！",
                center: true
              });
              this.$global.removeToken("username");
              this.$router.go(0);
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
      }
    },
    //获取新消息弹窗提示
    getNewsOrder() {
      // 礼物订单
      this.$axios({
        url: this.$global.url + "root/numberOrder/orderNews" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: "gift"
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            //新订单消息
            if (this.giftI == 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                // 避免重叠问题
                setTimeout(() => {
                  this.$notify({
                    title: "礼物订单",
                    message:
                      "礼物名称：" +
                      res.data.data[i].gift_name +
                      ",购买数量：" +
                      res.data.data[i].count +
                      ",购买时间：" +
                      res.data.data[i].pay_time,
                    duration: 0,
                    onClose: () => {
                      // 关闭消息
                      this.$axios({
                        url:
                          this.$global.url +
                          "root/numberOrder/updateNews" +
                          ".html",
                        method: "POST",
                        data: this.$qs.stringify({
                          data: {
                            goods: "gift",
                            id: res.data.data[i].id
                          }
                        })
                      })
                        .then(res => {
                          if (res.data.code == 1) {
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
                  });
                }, 0);
              }
              this.giftI =1;
            }
          } else if (res.data.code == 0) {
            this.giftI =0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
      // 账号出售订单
      this.$axios({
        url: this.$global.url + "root/numberOrder/orderNews" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: "number_out"
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            //新订单消息
            if (this.number_outI == 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                // 避免重叠问题
                setTimeout(() => {
                  this.$notify({
                    title: "账号出售订单",
                    message:
                      "账号名称：" +
                      res.data.data[i].title +
                      ",购买时间：" +
                      res.data.data[i].pay_time,
                    duration: 0,
                    onClose: () => {
                      // 关闭消息
                      this.$axios({
                        url:
                          this.$global.url +
                          "root/numberOrder/updateNews" +
                          ".html",
                        method: "POST",
                        data: this.$qs.stringify({
                          data: {
                            goods: "number",
                            id: res.data.data[i].id
                          }
                        })
                      })
                        .then(res => {
                          if (res.data.code == 1) {
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
                  });
                }, 0);
              }
              this.number_outI=1;
            }
          } else if (res.data.code == 0) {
            this.number_outI=0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
      // 账号出租订单
      this.$axios({
        url: this.$global.url + "root/numberOrder/orderNews" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: "number"
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            //新订单消息
            if (this.numberI==0) {
              for (let i = 0; i < res.data.data.length; i++) {
                // 避免重叠问题
                setTimeout(() => {
                  this.$notify({
                    title: "账号出租订单",
                    message:
                      "账号名称：" +
                      res.data.data[i].title +
                      ",购买时间：" +
                      res.data.data[i].pay_time,
                    duration: 0,
                    onClose: () => {
                      // 关闭消息
                      this.$axios({
                        url:
                          this.$global.url +
                          "root/numberOrder/updateNews" +
                          ".html",
                        method: "POST",
                        data: this.$qs.stringify({
                          data: {
                            goods: "number",
                            id: res.data.data[i].id
                          }
                        })
                      })
                        .then(res => {
                          if (res.data.code == 1) {
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
                  });
                }, 0);
              }
              this.numberI=1;
            }
          } else if (res.data.code == 0) {
            this.numberI=0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    // 获取商户列表
    getMerchlist() {
      this.$axios({
        url: this.$global.url + "root/merch/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          page: this.page,
          limit: 5,
          status: 0
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.merchtotal = res.data.count;
          } else if (res.data.code == 0) {
            this.merchtotal = 0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //获取用户提现
    getUser() {
      this.$axios({
        url: this.$global.url + "root/user/deposit" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          audit: 1,
          limit: 10,
          page: this.page
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.usertotal = res.data.count;
          } else if (res.data.code == 0) {
            this.usertotal = 0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    // 获取账号列表
    getNumberlist() {
      this.$axios({
        url: this.$global.url + "root/number/numberList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          is_putaway: 2,
          page: this.page,
          limit: 6
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.numbertotal = res.data.count;
          } else if (res.data.code == 0) {
            this.numbertotal = 0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    // 获取礼物列表
    getGiftlist() {
      this.$axios({
        url: this.$global.url + "root/gift/list" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: {
            page: this.page,
            limit: 5,
            is_putaway: 2
          }
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.gifttotal = res.data.count;
          } else if (res.data.code == 0) {
            this.gifttotal = 0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //获取账号订单租用完列表
    getNumberOrder() {
      this.$axios({
        url: this.$global.url + "root/numberOrder/pwdList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
           where:"",
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.numberOrder = res.data.count;
          } else if (res.data.code == 0) {
            this.numberOrder = 0;
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    }
  }
};
</script>
<style>
body,
html,
#app {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
.flush {
  margin-right: 28px;
  margin-left: 29px;
}
.flush img {
  width: 23px;
  height: 23px;
  vertical-align: middle;
}
.logo img {
  width: 100%;
  height: 100%;
}
.logo {
  padding: 37px 27px;
}
.bg_main {
  height: 100%;
}
.bg_left {
  height: 100%;
  background: #1b1d1e;
  position: fixed;
}
.bg_left .el-submenu .el-menu-item {
  min-width: auto;
  width: 48%;
  display: inline-block;
  padding: 0px !important;
  text-align: center;
  font-size: 0.75rem;
}
.bg_left .el-menu-item-group__title {
  padding: 0;
}
.tabInfo span {
  font-size: 14px;
}
.right_top {
  height: 3.875rem;
  background: #1b1d1e;
  display: flex;
  line-height: 3.875rem;
  position: relative;
  /* align-items: center; */
  /* justify-content: space-between; */
}
.right_top .el-input {
  width: 20%;
  border-radius: 10px;
}
.right_top .el-input__inner {
  border-radius: 30px;
}
.wechat,
.jiantou {
  padding-top: 3px;
  /* width: 20px; */
  width: 15px;
  height: 9px;
}
.wechat img {
  width: 19px;
  height: 19px;
}

.user_name {
  color: #ffffff;
  margin-left: 40px;
  margin-right: 20px;
  cursor: pointer;
}
.userInfo {
  position: absolute;
  right: 2%;
  display: flex;
}
.right_nav {
  margin-top: 15px;
  margin-left: 24px;
  display: flex;
}
.home_img img {
  width: 20px;
  height: 20px;
}
.home_img {
  background: #ffffff;
  width: 34px;
  height: 34px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
}
.right_nav ul {
  display: flex;
  margin-left: 10px;
  /* margin-top: -6px; */
}
.right_nav ul li img {
  width: 96px;
  height: 34px;
}
.right_nav ul li {
  margin: 0 3px;
  list-style: none;
}
.tab .el-submenu__icon-arrow {
  display: none;
}
/* 添加产品 */
.add_product {
  text-align: center;
  background: #037af0;
  margin: 0px 20px;
  height: 38px;
  line-height: 38px;
  margin-top: 43px;
  border-radius: 4px;
}
.add_product span {
  font-size: 14px;
  color: #ffffff;
  margin-left: 13px;
}
.add_product img {
  width: 20px;
  height: 20px;
  vertical-align: sub;
}
.u_icon {
  width: 16px;
  vertical-align: sub;
}
.only {
  margin-right: 0;
}
.col {
  color: #f54848;
}
.el-badge__content.is-fixed {
  top: 7px !important;
  right: -25px !important;
  transform: scale(0.6) !important;
}
.tou {
  width: 18px;
  vertical-align: middle;
}
.tag {
  cursor: pointer;
}
.el-dialog--center .el-dialog__body {
  text-align: center;
}
.infoname .el-input__inner {
  background: rgba(51, 51, 51, 0.1);
  /* width:60%; */
}
.avatar {
  width: 78px;
}
</style>
