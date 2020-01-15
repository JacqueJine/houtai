<template>
  <div class="add">
    <div class="deal_num">添加账号</div>
    <el-form ref="form" :model="form" :rules="rules" style="width:80%;" label-width="120px">
      <p class="title">游戏详情</p>
      <div class="form">
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="选择游戏" required prop="app_id">
            <el-select v-model="form.app_id" @change="clear" placeholder="请选择游戏">
              <el-option label value>
                <el-button type="text" class="game_btn" @click="addGame">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in gameList" :key="index">
                <el-option :label="item.app_name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="del(1,item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="选择区服" prop="phone_id" required style="margin-right:0;">
            <el-select v-model="form.phone_id" @change="clear" placeholder="请选择">
              <el-option label value>
                <el-button type="text" class="game_btn" @click="addPhone">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in phoneList" :key="index">
                <el-option :label="item.name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="del(2,item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="服务器" prop="service_id" required style="margin-right:0;">
            <el-select
              v-model="form.service_id"
              placeholder="请选择"
              :disabled="form.app_id == '' || form.phone_id == ''"
              @focus="getServiceList"
            >
              <el-option label value>
                <el-button type="text" class="game_btn" @click="addService">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in service" :key="index">
                <el-option :label="item.name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="del(3,item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="游戏截图" required>
          <el-upload
            :action="url+'root/common/uploadImg.html'"
            list-type="picture-card"
            :on-preview="imgPreview"
            :on-success="uploadSuccess"
            :on-remove="imgRemove"
            :limit="8"
            :on-exceed="chaochu"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="tishi">游戏截图不超过8张</p>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品标题" required prop="title">
          <el-input v-model="form.title" placeholder="请输入商品标题（不得超过26个字符）"></el-input>
        </el-form-item>
        <el-form-item label required prop="sell_type">
          <el-radio-group v-model="form.sell_type" @change="showSell()">
            <el-radio :label="0">出租商品</el-radio>
            <el-radio :label="1">出售商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- </el-form> -->
      </div>

      <p class="title">账号信息</p>
      <div class="form zhanghao">
        <el-form-item label="登录方式" required>
          <el-select v-model="form.login_method" placeholder="请选择">
            <el-option label value>
              <el-button type="text" class="game_btn" @click="addLogin()">添加</el-button>
            </el-option>
            <div class="option" v-for="(item,index) in loginList" :key="index">
              <el-option :label="item.name" :value="item.id" class="option"></el-option>
              <i class="el-icon-circle-close" @click="del(6,item.id)"></i>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏账号" required prop="account_number">
          <el-input placeholder="请输入账号" v-model="form.account_number"></el-input>
        </el-form-item>
        <el-form-item label="游戏密码" required prop="pwd">
          <el-input placeholder="请输入密码" v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="段位等级" prop="dan" required style="margin-right:0;">
          <el-select
            v-model="form.dan"
            placeholder="请选择"
            :disabled="form.app_id==''"
            @focus="getLevelList(0)"
          >
            <el-option label value>
              <el-button type="text" class="game_btn" @click="addLevel(0)">添加</el-button>
            </el-option>
            <el-option label="无" :value="'0'" class="option"></el-option>
            <div class="option" v-for="(item,index) in duanList" :key="index">
              <el-option :label="item.level_name" :value="item.id" class="option"></el-option>
              <i class="el-icon-circle-close" @click="del(5,item.id,1)"></i>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="爵位等级" prop="level_name" required style="margin-right:0;">
          <el-select
            v-model="form.level_name"
            placeholder="请选择"
            :disabled="form.app_id==''"
            @focus="getLevelList(1)"
          >
            <el-option label value>
              <el-button type="text" class="game_btn" @click="addLevel(1)">添加</el-button>
            </el-option>
            <el-option label="无" :value="'0'" class="option"></el-option>
            <div class="option" v-for="(item,index) in levelList" :key="index">
              <el-option :label="item.level_name" :value="item.id" class="option"></el-option>
              <i class="el-icon-circle-close" @click="del(5,item.id)"></i>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏性别" prop="sex" required style="margin-right:0;">
          <el-select v-model="form.sex" placeholder="请选择">
            <!-- <el-button type="text" class="game_btn">添加</el-button>
            <div class="option">-->
            <el-option label="男" value="1" class="option"></el-option>
            <el-option label="女" value="2" class="option"></el-option>
            <el-option label="无" value="0" class="option"></el-option>
            <!-- <i class="el-icon-circle-close"></i>
            </div>-->
          </el-select>
        </el-form-item>
      </div>
      <p class="title">交易信息</p>
      <div class="form">
        <el-form-item v-if="isShowSell" label="是否可买断" prop="is_buyout" required>
          <el-radio-group v-model="form.is_buyout" @change="showPrice()">
            <el-radio :label="0">不可买断</el-radio>
            <el-radio :label="1">可买断</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isShowPrice" label="出售价格" prop="buyout_price" required>
          <el-input placeholder="请输入金额" style="width:200px" v-model="form.buyout_price"></el-input>
        </el-form-item>
        <el-form-item v-if="isShowSell" label="租金设置" required>
          <el-form-item prop="hour" label="小时" label-width="90px" style="margin-bottom:22px;">
            <el-input placeholder="请输入金额" style="width:200px" v-model="form.hour"></el-input>
          </el-form-item>
          <el-form-item prop="night" label="包夜" label-width="90px" style="margin-bottom:22px;">
            <el-input placeholder="请输入金额" style="width:200px" v-model="form.night"></el-input>
          </el-form-item>
          <el-form-item prop="night" label="可否时租" label-width="90px">
            <el-radio-group v-model="form.night_rend">
              <el-radio :label="0">不可时租</el-radio>
              <el-radio :label="1">可时租</el-radio>
            </el-radio-group>
            <p class="tishi">包夜时间段内是否可时租</p>
          </el-form-item>
          <el-form-item
            prop="nightTime"
            label="包夜时间"
            label-width="90px"
            style="margin-bottom:22px;"
          >
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :disabled="true"
              :picker-options="{
                start: '18:00',
                step: '00:15',
                end: '23:45'
              }"
            ></el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :disabled="true"
              :picker-options="{
                start: '06:00',
                step: '00:15',
                end: '09:45'
              }"
            ></el-time-select>
          </el-form-item>
          <el-form-item prop="day" label="天租" label-width="90px" style="margin-bottom:22px;">
            <el-input placeholder="请输入金额" style="width:200px" v-model="form.day"></el-input>
          </el-form-item>
          <el-form-item prop="week" label="周租" label-width="90px" style="margin-bottom:22px;">
            <el-input placeholder="请输入金额" style="width:200px" v-model="form.week"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
          v-if="isShowSell"
          label="最短租用时间"
          prop="mintime"
          required
          style="margin-right:0;"
        >
          <el-select v-model="form.mintime" placeholder="请选择">
            <el-option label="1小时起" value="1" class="option"></el-option>
            <el-option label="2小时起" value="2" class="option"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowSell" label="是否全天可租" label-width="100px">
          <el-radio-group v-model="allDay" @change="setTime">
            <el-radio :label="0">不可全天租</el-radio>
            <el-radio :label="1">可全天租</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isShowSell" label="可租用时间段" prop="time" required>
          <el-time-picker
            v-model="form.time"
            format="HH:mm"
            is-range
            :disabled="allDay==1"
            arrow-control
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="getTime"
          ></el-time-picker>
        </el-form-item>
      </div>
      <p v-if="isShowSell" class="title">购买要求</p>
      <div class="form zhanghao">
        <el-form-item
          v-if="isShowSell"
          label="购买门槛"
          prop="buy_require"
          required
          style="margin-right:0;"
        >
          <el-select v-model="form.buy_require" placeholder="请选择">
            <!-- <el-button type="text" class="game_btn">添加</el-button>
            <div class="option">-->
            <el-option label="无" :value="0" class="option"></el-option>
            <el-option label="信誉分>=60" :value="60" class="option"></el-option>
            <el-option label="信誉分>=80" :value="80" class="option"></el-option>
            <el-option label="信誉分>=90" :value="90" class="option"></el-option>
            <!-- <i class="el-icon-circle-close"></i>
            </div>-->
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowSell" label="购买押金" required prop="cash_price">
          <el-input placeholder="请输入（单位：元）" v-model="form.cash_price"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:60%" @click="submit('form')">确定发布</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog title="添加" :visible.sync="addGameShow" width="25%" center>
      <el-form
        inline
        label-width="100px"
        :model="game"
        ref="ruleForm1"
        size="small"
        :rules="rules1"
      >
        <el-form-item label="游戏名称" prop="note">
          <el-input
            style="width:199px"
            v-model="game.note"
            size="small"
            :placeholder="game.placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="type" placeholder="请选择">
            <el-option label="手游" :value="1" class="option"></el-option>
            <el-option label="端游" :value="2" class="option"></el-option>
            <el-option label="直播" :value="3" class="option"></el-option>
            <el-option label="语音" :value="4" class="option"></el-option>
            <el-option label="影视" :value="5" class="option"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏logo">
          <el-upload
            class="avatar-uploader"
            :action="url+'root/common/uploadImg.html'"
            :show-file-list="false"
            :on-success="handSuccess"
          >
            <img v-if="logoUrl" :src="imgUrl+logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGameShow = false">取 消</el-button>
        <el-button type="primary" @click="gameBox('ruleForm1',game.axios)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 爵位、段位
    <el-dialog title="添加" :visible.sync="addLevelShow" width="35%" center>
      <el-form
        inline
        label-width="100px"
        :model="Level"
        ref="ruleForm2"
        size="small"
        :rules="rules2"
      >
        <el-form-item label="名称" prop="note">
          <el-input style="width:199px" v-model="Level.note" size="small" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input style="width:199px" v-model="Level.price" size="small" placeholder="请输入价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLevelShow = false">取 消</el-button>
        <el-button type="primary" @click="levelBox('ruleForm2')">保 存</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>
<script>
export default {
  data() {
    let validateScore = (rule, value, callback) => {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("金额大于0，最多保留两位小数"));
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
      startTime: "",
      endTime: "",
      url: this.$global.url,
      imgUrl: this.$global.imgUrl,
      type: 1,
      allDay: 0,
      form: {
        mid: "0",
        app_id: "",
        buyout_price: 0,
        phone_id: "",
        service_id: "",
        title: "",
        sell_type: 0,
        login_method: "",
        account_number: "",
        pwd: "",
        dan: "",
        night_rend: 0,
        level_name: "",
        sex: "",
        is_buyout: "",
        mintime: "",
        hour: "",
        night: "",
        day: "",
        week: "",
        start_time: "",
        over_time: "",
        buy_require: 0,
        cash_price: 0,
        tel: "",
        img: [],
        time: "",
        goods_cash: 0
      },
      rules: {
        app_id: [{ required: true, message: "请选择游戏", trigger: "change" }],
        phone_id: [
          { required: true, message: "请选择区服", trigger: "change" }
        ],
        service_id: [
          { required: true, message: "请选择服务器", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入商品标题", trigger: "blur" },
          { max: 26, message: "不能超过26个字符", trigger: "blur" }
        ],
        sell_type: [
          { required: true, message: "请选择出租/出售商品", trigger: "change" }
        ],
        account_number: [
          { required: true, message: "请输入游戏账号", trigger: "blur" }
        ],
        pwd: [{ required: true, message: "请输入游戏密码", trigger: "blur" }],
        dan: [{ required: true, message: "请选择段位等级", trigger: "change" }],
        level_name: [
          { required: true, message: "请选择爵位等级", trigger: "change" }
        ],
        sex: [{ required: true, message: "请选择游戏性别", trigger: "change" }],
        buyout_price: [
          { required: true, message: "请输入金额", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        is_buyout: [
          { required: true, message: "请选择是否可买断", trigger: "change" }
        ],
        mintime: [
          { required: true, message: "请选择最短租用时间", trigger: "change" }
        ],
        time: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        buy_require: [
          { required: true, message: "请选择购买门槛", trigger: "change" }
        ],
        cash_price: [
          { required: true, message: "请输入购买押金", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        hour: [
          { required: true, message: "请输入租金（元/小时）", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        night: [
          { required: true, message: "请输入租金（元/包夜）", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        day: [
          { required: true, message: "请输入租金（元/天租）", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        week: [
          { required: true, message: "请输入租金（元/周租）", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        nightTime: [{ validator: timeCheck, trigger: "blur" }]
      },
      addGameShow: false,
      game: {
        id: "",
        note: "",
        placeholder: "",
        name: "",
        axios: ""
      },
      rules1: {
        note: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      content: null,
      gameList: "",
      phoneList: "",
      service: "",
      duanList: "",
      loginList: "",
      levelList: "",
      isShowSell: true,
      isShowPrice: true,
      logoUrl: "",
      Level: {
        note: "",
        price: "",
        type: ""
      },
      addLevelShow: false,
      rules2: {
        note: [{ required: true, message: "不能为空", trigger: "blur" }],
        price: [
          { required: true, message: "请输入金额", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getAppList();
    this.getPhoneList();
    this.getLoginList();
    this.getNightTime();
  },
  methods: {
    clear() {
      this.form.service_id = "";
    },
    handSuccess(res, file) {
      this.logoUrl = res.src;
    },
    //是否显示价格
    showPrice() {
      if (this.form.is_buyout) {
        this.isShowPrice = true;
      } else {
        this.isShowPrice = false;
      }
    },
    //是否显示租号信息
    showSell() {
      this.form.is_buyout = "";
      this.isShowPrice = true;
      if (this.form.sell_type) {
        this.isShowSell = false;
      } else {
        this.isShowSell = true;
      }
    },
    //添加段位,爵位
    addLevel(type) {
      // this.Level.type = type;
      // this.Level.note = "";
      // this.Level.price = "";
      // this.addLevelShow = true;
      this.$prompt("请输入名称", "添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "名称不能为空"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/number/levelAdd" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: {
                app_id: this.form.app_id,
                level_type: type,
                level_name: value
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success({
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
    //添加段位,爵位弹窗
    // levelBox(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       console.log(this.Level);
    //       this.$axios({
    //         url: this.$global.url + "root/number/levelAdd" + ".html",
    //         method: "POST",
    //         data: this.$qs.stringify({
    //           data: {
    //             app_id: this.form.app_id,
    //             level_type: this.Level.type,
    //             level_name: this.Level.note,
    //             level_price: this.Level.price
    //           }
    //         })
    //       })
    //         .then(res => {
    //           if (res.data.code == 1) {
    //             this.addLevelShow = false;
    //             this.$message({
    //               type: "success",
    //               message: res.data.msg,
    //               center: true
    //             });
    //           } else {
    //             this.$message.error({
    //               message: res.data.msg,
    //               center: true
    //             });
    //           }
    //         })
    //         .catch(e => {
    //           this.$message.error({
    //             message: "网络较差，请稍后重试！",
    //             center: true
    //           });
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    //设置是否全天租
    setTime(value) {
      if (value == 1) {
        this.form.time = ["00:00", "23:59"];
      } else if (value == 0) {
        this.form.time = [];
      }
    },
    //获取包夜时间
    getNightTime() {
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
    //获取段位,爵位列表
    getLevelList(type) {
      if (!this.form.app_id) {
        this.$message({
          message: "请先选择游戏！！！",
          type: "error"
        });
        return false;
      }
      this.$axios({
        url: this.$global.url + "root/number/levelList" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          app_id: this.form.app_id,
          level_type: type
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            if (type) {
              this.levelList = res.data.data;
            } else {
              this.duanList = res.data.data;
            }
          }
        })
        .catch(e => {
          this.$message.error({
            message: "网络较差，请稍后重试！"
          });
        });
    },
    //获取登录方式列表
    getLoginList() {
      this.$axios({
        url: this.$global.url + "root/number/loginList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.loginList = res.data.data;
          } else if (res.data.code == 0) {
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
    //添加登陆方式
    addLogin() {
      this.$prompt("请输入登录方式", "添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "登录方式不能为空"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/number/addLogin" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              name: value
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success({
                  message: res.data.msg
                });
              }
              this.getLoginList();
            })
            .catch(e => {
              this.$message.error({
                message: "网络较差，请稍后重试！"
              });
            });
        })
        .catch(() => {});
    },
    //提交添加账号
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.img) {
            this.$message.error({
              message: "请上传图片！"
            });
            return false;
          }
          let obj = {};
          for (let i in this.form) {
            if (
              i != "hour" &&
              i != "night" &&
              i != "day" &&
              i != "week" &&
              i != "time"
            ) {
              obj[i] = this.form[i];
            }
          }
          if (this.form.sell_type) {
            obj.rent_id = "";
            obj.price = this.form.buyout_price;
            this.$axios({
              url: this.$global.url + "root/number/addGoods" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: obj
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  this.$router.push({ path: "/accountAudit" });
                }
              })
              .catch(e => {
                this.$message.error({
                  message: "网络较差，请稍后重试！"
                });
              });
          } else {
            obj.start_time = this.form.time[0];
            obj.over_time = this.form.time[1];
            obj.price = this.form.buyout_price;
            this.$axios({
              url: this.$global.url + "root/number/addGoods" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: obj
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  let rend = [
                    {
                      time_type: 1,
                      price: this.form.hour,
                      start_time: "",
                      end_time: "",
                      number_id: res.data.number_ID
                    },
                    {
                      time_type: 2,
                      price: this.form.night,
                      start_time: this.startTime,
                      end_time: this.endTime,
                      number_id: res.data.number_ID
                    },
                    {
                      time_type: 3,
                      price: this.form.day,
                      start_time: "",
                      end_time: "",
                      number_id: res.data.number_ID
                    },
                    {
                      time_type: 4,
                      price: this.form.week,
                      start_time: "",
                      end_time: "",
                      number_id: res.data.number_ID
                    }
                  ];
                  this.$axios({
                    url: this.$global.url + "root/number/addRent" + ".html",
                    method: "POST",
                    data: this.$qs.stringify({
                      data: rend
                    })
                  })
                    .then(res => {
                      if (res.data.code == 1) {
                        this.$message({
                          type: "success",
                          message: res.data.msg
                        });
                        this.$router.push({ path: "/accountAudit" });
                      }
                    })
                    .catch(e => {
                      this.$message.error({
                        message: "网络较差，请稍后重试！"
                      });
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
    //删除
    del(type, id, level) {
      this.$confirm("此操作将删除该内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/common/delClass" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              type: type,
              id: id
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                if (type == 1) {
                  this.getAppList();
                } else if (type == 2) {
                  this.getPhoneList();
                } else if (type == 3) {
                  this.getServiceList();
                } else if (type == 5) {
                  if (level) {
                    this.getLevelList(1);
                  } else {
                    this.getLevelList(0);
                  }
                }
                this.$message({
                  type: "success",
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
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        })
        .catch(() => {});
    },
    //添加服务器
    addService() {
      this.$prompt("请输入服务器", "添加服务器", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "名称不能为空"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/number/addService" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              data: {
                app_id: this.form.app_id,
                phone_id: this.form.phone_id,
                name: value
              }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getServiceList();
                this.$message({
                  type: "success",
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
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        })
        .catch(() => {});
    },
    //添加区服
    addPhone() {
      this.$prompt("请输入游戏区服", "添加区服", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "名称不能为空"
      })
        .then(({ value }) => {
          this.$axios({
            url: this.$global.url + "root/number/addPhone" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              name: value
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getPhoneList();
                this.$message({
                  type: "success",
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
              this.$message.error({
                message: "网络较差，请稍后重试！",
                center: true
              });
            });
        })
        .catch(() => {});
    },
    //分割两个时间
    getTime() {
      if (this.form.time) {
        this.form.start_time = this.form.time[0];
        this.form.over_time = this.form.time[1];
      } else {
        this.form.start_time = "";
        this.form.over_time = "";
      }
    },
    //上传成功
    uploadSuccess(res, file, fileList) {
      this.form.img = [];
      for (let i = 0; i < fileList.length; i++) {
        this.form.img.push(fileList[i].response.src);
      }
    },
    //删除图片回调
    imgRemove(file, fileList) {
      this.form.img = [];
      for (let i = 0; i < fileList.length; i++) {
        this.form.img.push(fileList[i].response.src);
      }
    },
    //图片预览
    imgPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //超出上传
    chaochu(files, fileList) {
      this.$message({
        message: "游戏截图不能超过8张",
        type: "warning"
      });
    },
    // 获取选择游戏数据列表
    getAppList() {
      this.$axios({
        url: this.$global.url + "root/number/appList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.gameList = res.data.data;
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
    //获取区服列表
    getPhoneList() {
      this.$axios({
        url: this.$global.url + "root/number/phoneList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.phoneList = res.data.data;
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
    //获取服务器列表
    getServiceList() {
      if (this.form.app_id == "" || this.form.phone_id == "") {
        this.$message({
          message: "请选择游戏和区服！！！",
          type: "error"
        });
      } else {
        this.$axios({
          url: this.$global.url + "root/number/serviceList" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            app_id: this.form.app_id,
            phone_id: this.form.phone_id
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.service = res.data.data;
            }
          })
          .catch(e => {
            this.$message.error({
              message: "网络较差，请稍后重试！"
            });
          });
      }
    },
    //添加游戏
    addGame() {
      this.game.placeholder = "请输入游戏名称";
      this.game.name = "游戏名称:";
      this.game.axios = "root/number/addApp";
      this.addGameShow = !this.addGameShow;
    },
    //添加游戏接口
    gameBox(formName, axios) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            url: this.$global.url + axios + ".html",
            method: "POST",
            data: this.$qs.stringify({
              // data: {
              app_name: this.game.note,
              type: this.type,
              app_logo: this.logoUrl
              // }
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getAppList();
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.addGameShow = !this.addGameShow;
              }
            })
            .catch(e => {
              this.$message.error({
                message: "网络较差，请稍后重试！"
              });
            });
        } else {
          return false;
        }
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
}
.zhanghao input {
  width: 217px;
}
table {
  text-align: center;
  border-color: #dddddd;
}
.tableInput input {
  border: none;
  outline: none;
  text-align: center;
}
</style>