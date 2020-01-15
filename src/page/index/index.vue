<template>
  <div class="index">
    <div class="top">
      <div class="top_img">
        <img src="../../assets/img/guan.png" alt />
      </div>
      <div class="top_input">
        <el-input v-model="input" placeholder="请输入搜索内容"></el-input>
      </div>
      <div class="top_chat">
        <img src="../../assets/img/wei.png" alt />
      </div>
      <div class="top_exit">
        <p>李田</p>
      </div>
    </div>
    <el-container class="middle">
      <el-aside class="left" width="230px">
        <el-col :span="12">
          <el-menu
            :default-active="this.$route.path"
            background-color="#1B1D1E"
            text-color="#FFFFFF"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router
          >
            <el-menu-item index="1" class="active">
              <i class="el-icon-document"></i>
              <span slot="title">控制</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">订单管理1</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商城管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">选项1</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>店铺管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="4-1">选项1</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main class="right">
        <el-scrollbar>
          <div class="nav">
            <el-row>
              <el-col :span="2">
                <div class="nav_img">
                  <img src="../../assets/img/fangzi.png" alt />
                </div>
                <!-- <el-tag effect="plain" icon='el-icon-s-home'></el-tag>
                <el-button type="primary" icon="el-icon-search"></el-button> -->
              </el-col>
              <el-col :span="2">
                <div class="wei">
                  <img src="../../assets/img/weixuanzhong.png" alt />
                </div>
              </el-col>
              <el-col :span="20"></el-col>
            </el-row>
          </div>
          <div class="home">
            <el-row>
              <el-col :span="10" class="home_deal">
                <div class="deal">
                  <div class="number">交易数据</div>
                  <div class="time">当天</div>
                </div>
                <div>
                  <ul>
                    <li>
                      <p>已付款</p>
                      <p>2</p>
                    </li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="14"></el-col>
            </el-row>
          </div>
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: "" /*搜索*/
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      window.console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      window.console.log(key, keyPath);
    }
    // 路由激活颜色
  }
};
</script>
<style>
html {
  background: #f5f5f5;
}
* {
  padding: 0;
  margin: 0;
}
/* 顶部 */
.top {
  height: 88px;
  width: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.top_img {
  margin-left: 27px;
}
.top_img img {
  width: 180px;
  height: 48px;
}
.top_input {
  width: 300px;
  height: 36px;
  position: absolute;
  left: 20%;
}
.top .el-input__inner {
  border-radius: 30px;
}
.top_chat {
  position: absolute;
  right: 15%;
}
.top_chat img {
  width: 27px;
  height: 24px;
}
.top_exit {
  margin-right: 7%;
}
.top_exit p {
  color: #ffffff;
}
.middle {
  position: relative;
  width: 100%;
  height: 1000px;
}

/* 左侧 */
.left {
  /* width: 20%; */
  /* height: 990px; */
  background: black;
  /* position: absolute;
  left: 0; */
}
.el-col-12 {
  width: 100%;
  background: black;
}

.left .active {
  background: #037af0 !important;
  opacity: 10 !important;
}

.index .el-icon-document::before {
  content: "";
  background: url(../../assets/img/shouye.png);
  width: 20px;
  height: 20px !important;
  display: block;
}
.left .el-icon-location::before {
  content: "";
  background: url(../../assets/img/dingdan.png);
  width: 20px;
  height: 20px !important;
  display: block;
}
/* 右侧 */
.right {
  /* border: 1px red solid; */
  /* position: relative; */
  /* width: 80%; */
  /* left: 20%; */
  /* height: 990px; */
}
/* 导航 */
.nav {
  height: 60px;
}
.nav_img {
  width: 42px;
  height: 42px;
  background: #ffffff;
  text-align: center;
  line-height: 42px;
}
.nav_img img {
  width: 18px;
  height: 18px;
}
.wei img {
  width: 96px;
  height: 42px;
}
/* 首页页面交易数据 */
.home_deal {
  background: #ffffff;
  height: 304px;
}
.deal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding: 24px;
}
.deal .number {
  font-size: 16px;
  color: #333333;
}
.deal .time {
  width: 41px;
  height: 21px;
  background: #38cd70;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 21px;
  border-radius: 5px;
}
</style>
