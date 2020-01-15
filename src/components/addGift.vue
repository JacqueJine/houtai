<template>
  <div class="add">
    <div class="deal_num">添加礼物</div>
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
          <el-form-item label="礼物分类" required prop="app_id">
            <el-select v-model="form.app_id" placeholder="请选择分类">
              <el-option label value class="option">
                <el-button type="text" class="game_btn" @click="addApp">添加</el-button>
              </el-option>
              <div class="option" v-for="(item,index) in giftClassify" :key="index">
                <el-option :label="item.gift_name" :value="item.id" class="option"></el-option>
                <i class="el-icon-circle-close" @click="delGiftClassify(item.id)"></i>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="选择礼物" required style="margin-right:0;" prop="gift_id">
            <el-select
              v-model="form.gift_id"
              placeholder="请选择"
              @focus="getGiftNameList"
              :disabled="form.app_id == ''"
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
        <el-form-item label="出售数量" required prop="sum">
          <el-input v-model="form.sum" placeholder="请输入出售数量"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="lager" style="width:60%" @click="giftAdd('form')">保存</el-button>
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
      url: this.$global.url,
      show_down: false,
      form: {
        price: "",
        app_id: "",
        gift_id: "",
        img: "",
        sum: "",
        goods_cash:0,
      },
      rules: {
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { validator: validateScore, trigger: "blur" }
        ],
        app_id: [
          { required: true, message: "礼物分类不能为空", trigger: "change" }
        ],
        gift_id: [
          { required: true, message: "选择礼物不能为空", trigger: "change" }
        ],
        sum: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { validator: validateSum, trigger: "blur" }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      giftClassify: "",
      giftSelect: "",
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
      }
    };
  },
  created() {
    this.getAppList();
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
      if (this.form.app_id == "") {
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
            class_id: this.form.app_id
          })
        })
          .then(res => {
            if (res.data.code == 1) {
              this.giftSelect = res.data.data;
            } else {
              (this.giftSelect = ""),
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
          if (this.deduction.type == 0 && this.form.app_id != "") {
            //添加礼物名称
            this.$axios({
              url: this.$global.url + "root/gift/giftNameAdd" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                class_id: this.form.app_id,
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
          } else if (this.deduction.type == 0 && this.form.app_id == "") {
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
    //添加礼物最后提交
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
              url: this.$global.url + "root/gift/giftAdd" + ".html",
              method: "POST",
              data: this.$qs.stringify({
                data: {
                  mid: 0,
                  class_id: this.form.app_id,
                  name_id: this.form.gift_id,
                  img: this.form.img,
                  price: this.form.price,
                  gift_number: this.form.sum,
                  tel:'',
                  goods_cash:this.form.goods_cash,
                }
              })
            })
              .then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "礼物添加成功!"
                  });
                  this.$router.push({path:'/giftAudit'})
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