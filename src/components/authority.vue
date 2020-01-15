<template>
  <div class="mall">
    <div class="deal_num">
      <p>权限管理</p>
      <el-tabs v-model="activeName" @tab-click="getTab">
        <el-tab-pane
          v-for="(item,index) in authList"
          :label="item.auth_name"
          :name="String(item.id)"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="main">
      <!-- <div v-for="(item,index) in routers" :key="index" class="content">
        <div v-for="(val,key,index_) in item" :key="index_">
          <p>{{index+1}}、{{key}}:</p>
          <el-checkbox-group v-model="checked" @change="Change" class="ckeckbox">
            <el-checkbox
              v-for="(val_,key_,indexs_) in val"
              :label="val_"
              :key="indexs_"
            >{{val_.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>-->
      <div v-for="(item,index) in items" :key="index" class="content">
        <p>{{index+1}}、{{item.title}}:</p>

        <el-checkbox-group v-if="item.subs" v-model="checked" @change="Change" class="ckeckbox">
          <el-checkbox
            v-for="(subItem,index_) in item.subs"
            :key="index_"
            :label="JSON.stringify(subItem)"
          >{{subItem.title}}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-else v-model="checked" @change="Change" class="ckeckbox">
          <el-checkbox :label="JSON.stringify(item)">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <!-- <el-table :data="routers" style="width: 100%">
        <el-table-column prop="path_name" label="name" width="180"></el-table-column>
        <el-table-column v-for="(item,index) in authList" :key="index" :label="item.auth_name">
          <template slot-scope="{row}">
            <div class="operation">
              <el-checkbox v-model="row.auth[item.id]"></el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>-->
      <div style="text-align:center;padding:30px">
        <el-button type="primary" size="medium" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "1",
      checked: [], //类型string / number / boolean；所以label也是
      // routers: [
      //   { 控制台: [{ name: "控制台", path: "/console" }] },
      //   {
      //     订单管理: [
      //       { name: "账号订单", path: "/numberOrder" },
      //       { name: "礼物订单", path: "/giftOrder" }
      //     ]
      //   },
      //   {
      //     商城管理: [
      //       { name: "已上架", path: "/shelves" },
      //       { name: "已下架", path: "/unshelves" },
      //       { name: "添加账号", path: "/add" },
      //       { name: "添加礼物", path: "/addGift" }
      //     ]
      //   },
      //   {
      //     店铺装修: [{ name: "店铺装修", path: "/shop" }]
      //   },
      //   {
      //     商家管理: [{ name: "商家管理", path: "/merchant" }]
      //   },
      //   {
      //     系统管理: [
      //       { name: "用户管理", path: "/user" },
      //       { name: "管理员管理", path: "/admin" },
      //       { name: "用户提现", path: "/withdraw" },
      //       { name: "账号审核", path: "/accountAudit" },
      //       { name: "商家审核", path: "/merchantAudit" },
      //       { name: "礼物审核", path: "/giftAudit" }
      //     ]
      //   }
      // ],
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
              index:'editPwd',
              title:"账号改密"
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
      // routers: [
      //   {
      //     path_name: "控制台",
      //     path: "/console",
      //     auth: {}
      //   },
      //   {
      //     path_name: "账号订单",
      //     path: "/numberOrder",
      //     auth: {}
      //   },
      //   {
      //     path_name: "礼物订单",
      //     path: "/giftOrder",
      //     auth: {}
      //   },
      //   {
      //     path_name: "已上架",
      //     path: "/shelves",
      //     auth: {}
      //   },
      //   { path_name: "已下架", path: "/unshelves", auth: {} },
      //   { path_name: "添加账号", path: "/add", auth: {} },
      //   { path_name: "添加礼物", path: "/addGift", auth: {} },
      //   { path_name: "店铺装修", path: "/shop", auth: {} },
      //   { path_name: "商家管理", path: "/merchant", auth: {} },
      //   { path_name: "用户管理", path: "/user", auth: {} },
      //   { path_name: "管理员管理", path: "/admin", auth: {} },
      //   { path_name: "用户提现", path: "/withdraw", auth: {} },
      //   { path_name: "账号审核", path: "/accountAudit", auth: {} },
      //   { path_name: "商家审核", path: "/merchantAudit", auth: {} },
      //   { path_name: "礼物审核", path: "/giftAudit", auth: {} }
      // ],
      all: [
        {},
        {
          icon: "el-icon-s-order",
          index: "2",
          title: "订单管理",
          subs: []
        },
        {
          icon: "el-icon-s-goods",
          index: "3",
          title: "商城管理",
          subs: []
        },
        {},
        {},
        {
          icon: "el-icon-s-tools",
          index: "4",
          title: "系统管理",
          subs: []
        }
      ],
      allList: [],
      authList: []
    };
  },
  created() {
    this.getAuth();
    this.getListPath();
    // setTimeout(() => {
    //   for (let i = 0; i < this.routers.length; i++) {
    //     for (let j = 0; j < this.authList.length; j++) {
    //       this.routers[i].auth[this.authList[j].id] = false;
    //     }
    //   }
    // }, 2000);
  },
  methods: {
    getTab() {
      this.getListPath();
    },
    Change(val) {
      this.allList = [];
      for (let i = 0; i < val.length; i++) {
        this.allList.push(JSON.parse(val[i]));
      }
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
          } else {
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
    //管理员权限列表
    getListPath() {
      this.$axios({
        url: this.$global.url + "root/user/listPath" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          id: this.activeName
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.checked = [];
            for (let i in res.data.data) {
              if (
                res.data.data[i].index == 2 ||
                res.data.data[i].index == 3 ||
                res.data.data[i].index == 4
              ) {
                if (res.data.data[i].subs) {
                  for (let j = 0; j < res.data.data[i].subs.length; j++) {
                    this.checked.push(JSON.stringify(res.data.data[i].subs[j]));
                  }
                }
              } else {
                this.checked.push(JSON.stringify(res.data.data[i]));
              }
            }
          } else {
            this.checked = [];
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //保存权限
    save() {
      this.all = [
        {},
        {
          icon: "el-icon-s-order",
          index: "2",
          title: "订单管理",
          subs: []
        },
        {
          icon: "el-icon-s-goods",
          index: "3",
          title: "商城管理",
          subs: []
        },
        {},
        {},
        {
          icon: "el-icon-s-tools",
          index: "4",
          title: "系统管理",
          subs: []
        }
      ];
      for (let i = 0; i < this.allList.length; i++) {
        if (this.allList[i].title == "控制台") {
          this.all[0] = this.allList[i];
        }
        if (
          this.allList[i].title == "账号订单" ||
          this.allList[i].title == "礼物订单"
        ) {
          this.all[1].subs.push(this.allList[i]);
        }
        if (
          this.allList[i].title == "已上架" ||
          this.allList[i].title == "已下架" ||
          this.allList[i].title == "添加账号" ||
          this.allList[i].title == "添加礼物" ||
          this.allList[i].title == "账号改密"
        ) {
          this.all[2].subs.push(this.allList[i]);
        }
        if (this.allList[i].title == "店铺装修") {
          this.all[3] = this.allList[i];
        }
        if (this.allList[i].title == "商家管理") {
          this.all[4] = this.allList[i];
        }
        if (
          this.allList[i].title == "用户管理" ||
          this.allList[i].title == "管理员管理" ||
          this.allList[i].title == "用户提现" ||
          this.allList[i].title == "账号审核" ||
          this.allList[i].title == "商家审核" ||
          this.allList[i].title == "礼物审核" ||
          this.allList[i].title == "平台设置"
        ) {
          this.all[5].subs.push(this.allList[i]);
        }
      }

      // for (let i in this.routers) {
      //   for (let j in this.routers[i].auth) {
      //     if (this.routers[i].auth[j] == true) {
      //       this.all[i].auth.push(j);
      //     }
      //   }
      // }
      this.$axios({
        url: this.$global.url + "root/user/savePath" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          data: this.all,
          uid: this.activeName
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success({
              message: "修改成功,下次登录后重置！",
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
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
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
  /* padding:20px; */
  height: 700px;
  position: relative;
  border-radius: 8px;
}
.main {
  padding: 20px;
}
.content {
  margin-top: 20px;
}
.ckeckbox {
  text-indent: 10px;
  margin-top: 5px;
}
</style>
