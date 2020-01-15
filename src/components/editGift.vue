<template>
  <div class="add" contenteditable="false">
    <div class="deal_num">编辑礼物</div>
    <p class="title">礼物详情</p>
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        size="small"
        :rules="rules"
        style="width:700px"
        label-width="120px"
      >
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="礼物分类" required prop="class_id">
            <el-select v-model="form.class_id" placeholder="请选择分类">
              <el-option label value class="option">
                <el-button type="text" class="game_btn" @click="addApp">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in giftClassify" :key="index">
                <el-option :label="item.gift_name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="delGiftClassify(item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="选择礼物" required style="margin-right:0;" prop="name_id">
            <el-select
              v-model="form.name_id"
              placeholder="请选择"
              @focus="getGiftNameList"
              :disabled="form.class_id == ''"
            >
              <el-option label value class="option">
                <el-button type="text" class="game_btn" @click="giftNameAdd">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in giftSelect" :key="index">
                <el-option :label="item.name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="delGiftSelect(item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="礼物截图" required>
          <el-upload
            :action="url+'root/common/uploadImg.html'"
            list-type="picture-card"
            :on-preview="imgPreview"
            :on-success="uploadSuccess"
            :on-remove="imgRemove"
            :limit="8"
            :on-exceed="chaochu"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="tishi">礼物截图不超过8张</p>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="出售价格" required prop="price">
          <el-input v-model="form.price" placeholder="请输入出售价格"></el-input>
        </el-form-item>
        <el-form-item label="出售数量" required prop="gift_number">
          <el-input v-model="form.gift_number" placeholder="请输入出售数量"></el-input>
        </el-form-item>
        <el-form-item v-if="gift.sell_mid!=0" label="联系方式" required prop="gift_number">
          <el-input v-model="form.tel" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:30%" @click="giftAdd('form')">确认修改</el-button>
          <el-button type="primary" size="lager" style="width:30%" @click="pass">通过</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="添加" :visible.sync="deductionShow" width="25%" center>
      <el-form
        :model="deduction"
        ref="ruleForm1"
        inline
        size="small"
        :rules="rules1"
        label-width="90px"
      >
        <el-form-item :label="deduction.name" prop="note">
          <el-input v-model="deduction.note" size="small" placeholder="请输入礼物名称"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="show_down" label="礼物类型" prop="app_type" required>
          <el-select v-model="deduction.app_type" placeholder="请选择分类">
            <el-option label="手游" value="1" class="option"></el-option>
            <el-option label="端游" value="2" class="option"></el-option>
            <el-option label="直播" value="3" class="option"></el-option>
            <el-option label="语音" value="4" class="option"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deductionShow = false">取 消</el-button>
        <el-button type="primary" @click="deductionBox('ruleForm1')">保 存</el-button>
      </div>
    </el-dialog>
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
    return {
      fileList: [],
      url: this.$global.url,
      img: this.$global.imgUrl,
      show_down: false,
      form: {
        mid: "",
        price: "",
        class_id: "",
        name_id: "",
        img: "",
        gift_number: "",
        id: "",
        tel: "",
        goods_cash: 0
      },
      rules: {
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        class_id: [
          { required: true, message: "礼物分类不能为空", trigger: "change" }
        ],
        name_id: [
          { required: true, message: "选择礼物不能为空", trigger: "change" }
        ],
        gift_number: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { validator: validateSum, trigger: "blur" }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      giftClassify: [],
      giftSelect: [],
      deductionShow: false,
      deduction: {
        id: "",
        note: "",
        name: "",
        type: "", //判断是哪个添加
        app_type: ""
      },
      rules1: {
        note: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      allid: [],
      gift:"",
    };
  },
  mounted() {
    let gift = this.$route.query.gift;
    this.gift = this.$route.query.gift;
    this.getAppList();
    //确保全部渲染完
    setTimeout(() => {
      this.editClass_id();
      this.getGiftNameList();
    }, 1500);
    setTimeout(() => {
      this.editGiftname();
    }, 3000);
    console.log(gift);
    this.form.img = gift.img;
    this.form.price = gift.price;
    this.form.gift_number = gift.gift_number;
    this.form.id = gift.id;
    this.form.goods_cash = gift.goods_cash;
    this.form.mid = gift.sell_mid;
    this.form.tel = gift.tel;
    for (let i = 0; i < gift.img.length; i++) {
      this.fileList.push({
        url: this.img + gift.img[i]
      });
    }
    this.allid.push({
      goods_id: gift.id,
      type: gift.type
    });
  },
  methods: {
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
    //上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //超出上传
    chaochu(files, fileList) {
      this.$message({
        message: "游戏截图不能超过8张",
        type: "warning"
      });
    },
    //获取礼物分类
    getAppList() {
      this.$axios({
        url: this.$global.url + "root/gift/classList" + ".html",
        method: "POST"
      })
        .then(res => {
          if (res.data.code == 1) {
            this.giftClassify = res.data.data;
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
    //通过礼物
    pass() {
      this.giftAdd('form');
      this.$axios({
        url: this.$global.url + "root/number/numberAudit" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          goods: "gift",
          data: this.allid,
          // goods_id: this.allid,
          is_putaway: 0
          // type: type
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "已通过!"
            });
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

    //绑定礼物分类
    editClass_id() {
      let gift = this.$route.query.gift;
      for (let i = 0; i < this.giftClassify.length; i++) {
        if (this.giftClassify[i].gift_name == gift.class_id) {
          this.form.class_id = this.giftClassify[i].id;
        }
      }
    },
    //绑定礼物名称
    editGiftname() {
      let gift = this.$route.query.gift;
      for (let i = 0; i < this.giftSelect.length; i++) {
        if (this.giftSelect[i].name == gift.name_id) {
          this.form.name_id = this.giftSelect[i].id;
        }
      }
    },
    //添加礼物分类
    addApp() {
      this.deductionShow = !this.deductionShow;
      this.deduction.name = "礼物分类";
      this.deduction.type = 1;
      this.show_down = true;
      this.deduction.note = "";
    },
    //获取礼物名称
    getGiftNameList() {
      if (this.form.class_id == "") {
        this.$message({
          message: "礼物分类不能为空！！！",
          type: "error"
        });
        return false;
      } else {
        this.$axios({
          url: this.$global.url + "root/gift/giftNameList" + ".html",
          method: "POST",
          data: this.$qs.stringify({
            class_id: this.form.class_id
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.giftSelect = res.data.data;
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
    },
    //添加礼物名称
    giftNameAdd() {
      this.deductionShow = !this.deductionShow;
      this.deduction.name = "礼物名称";
      this.deduction.type = 0;
      this.show_down = false;
      this.deduction.note = "";
    },
    //添加弹窗
    deductionBox(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.deduction.type == 0 && this.form.class_id != "") {
            //添加礼物名称
            this.$axios({
              url: this.$global.url + "root/gift/giftNameAdd" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                class_id: this.form.class_id,
                name: this.deduction.note
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.deductionShow = !this.deductionShow;
                  this.getGiftNameList();
                  this.$message({
                    type: "success",
                    message: "添加成功!"
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
          } else if (this.deduction.type == 1) {
            //添加礼物分类
            this.$axios({
              url: this.$global.url + "root/gift/addClass" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                gift_name: this.deduction.note
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.deductionShow = !this.deductionShow;
                  this.getAppList();
                  this.$message({
                    type: "success",
                    message: "添加成功!"
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
          } else if (this.deduction.type == 0 && this.form.class_id == "") {
            this.deductionShow = !this.deductionShow;
            this.$message.error({
              message: "游戏分类为空无法添加！！！"
            });
            return false;
          }
        } else {
          return false;
        }
      });
    },
    //删除礼物分类
    delGiftClassify(itemid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/gift/delClass" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              id: itemid
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getAppList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除礼物名称
    delGiftSelect(itemid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            url: this.$global.url + "root/common/delClass" + ".html",
            method: "POST",
            data: this.$qs.stringify({
              type: 4,
              id: itemid
            })
          })
            .then(res => {
              if (res.data.code == 1) {
                this.getGiftNameList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //修改礼物最后提交
    giftAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.img == "") {
            this.$message.error({
              message: "图片不能为空！",
              center: true
            });
          } else {
            this.$axios({
              url: this.$global.url + "root/gift/updateGift" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: this.form
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "礼物修改成功!"
                  });
                  // this.$router.push({ path: "/unshelves" });
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