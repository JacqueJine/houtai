<template>
  <div class="shop">
    <div class="deal_num">店铺装修</div>
    <div class="shop_around">
      <!-- <div class="shop_left">
        <div class="shop_head"></div>
        <div class="shop_swiper">
          <div class="swiper_text">点击编辑轮播图</div>
        </div>
        <div class="shop_classify">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="shop_activity">
          <div class="left_text">点击编辑活动图</div>
        </div>
        <div class="activity_left">
          <div class="left_text">点击编辑活动图</div>
        </div>
        <div class="right_site">
          <div class="activity_right_top">
            <div class="left_text">点击编辑活动图</div>
          </div>
          <div class="activity_right_middle">
            <div class="left_text">点击编辑活动图</div>
          </div>
        </div>
      </div>-->
      <div class="shop_right">
        <div>
          <span class="right_title">编辑轮播图</span>
          <span class="right_titles">建议尺寸 495*288 图片大小不超过2M，url例：/index</span>
        </div>
        <div style="display:flex;margin-top:10px;flex-wrap:wrap">
          <div v-for="(item,index) in form.img" :key="index" class="content">
            <div class="cont">
              <img width="281px" height="148px" :src="img+form.img[index]" alt class="img" />
              <div class="del">
                <i class="el-icon-delete icon" @click="del(index)"></i>
              </div>
            </div>

            <br />
            <el-input
              placeholder="请输入跳转连接"
              style="width:280px;margin-right:10px;"
              v-model="urlList[index]"
            ></el-input>
          </div>
          <div>
            <el-upload
              :action="url+'root/common/uploadImg.html'"
              list-type="picture-card"
              :on-success="uploadSuccess"
              :show-file-list="false"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div class="shop_save">
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        img: []
      },
      url: this.$global.url,
      img: this.$global.imgUrl,
      urlList: [],
      allList: []
    };
  },
  mounted() {
    this.slideShow();
  },
  methods: {
    //上传成功
    uploadSuccess(res, file, fileList) {
      this.urlList.push("");
      this.form.img.push(fileList[0].response.src);
      // 清空已上传的文件列表
      this.$refs.upload.clearFiles();
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
    //删除
    del(index) {
      this.urlList.splice(index, 1);
      this.form.img.splice(index, 1);
    },
    //获取轮播图
    slideShow() {
      this.$axios({
        url: this.$global.url + "api/merch/slideshow" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          title: "slideshow"
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.urlList.push(res.data.data[i].url);
              this.form.img.push(res.data.data[i].img);
            }
          } else {
            this.$message.error({
              message: res.data.msg
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
    //修改轮播图
    save() {
      this.allList = [];
      for (let i = 0; i < this.urlList.length; i++) {
        if (this.urlList[i] == "") {
          this.$message.error({
            message: "请填写url!!!"
          });
          return false;
        }
        this.allList.push({
          img: this.form.img[i],
          url: this.urlList[i]
        });
      }
      this.$axios({
        url: this.$global.url + "root/merch/slideshow" + ".html",
        method: "POST",
        data: this.$qs.stringify({
          title: "slideshow",
          value: this.allList
        })
      })
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success({
              message: "轮播图编辑成功",
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
* {
  padding: 0;
  margin: 0;
}
.shop {
  background: #ffffff;
  margin: 20px 20px;
  height: 700px;
  position: relative;
  border-radius: 8px;
}
.shop_around {
  padding: 0 26px 26px;
}
.deal_num {
  padding-top: 26px;
  padding-left: 20px;
  color: #333333;
  font-size: 16px;
  /* opacity: 0.6; */
  font-weight: 600;
}
.shop_left {
  border: 9px #f5f5f5 solid;
  border-radius: 16px;
  width: 270px;
  height: 515px;
  display: inline-block;
  margin: 20px 40px;
  padding: 0 9px;
  position: relative;
}
.shop_head {
  width: 100%;
  background: #f5f5f5;
  height: 24px;
  border-radius: 8px;
  margin: 5px 0px;
}
.shop_swiper {
  height: 150px;
  background: #f54848;
  text-align: center;
  line-height: 150px;
  border-radius: 8px;
}
.shop_classify ul {
  display: flex;
}
.shop_classify ul li {
  list-style: none;
  background: #f5f5f5;
  width: 48px;
  height: 39px;
  margin: 20px 10px;
}
.shop_activity {
  height: 100px;
  background: #f5f5f5;
  text-align: center;
  line-height: 100px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.activity_left {
  background: #f5f5f5;
  height: 120px;
  width: 50%;
  display: inline-block;
  text-align: center;
  line-height: 120px;
  border-radius: 8px;
}
.activity_right_top {
  background: #f5f5f5;
  height: 55px;
  width: 124px;
  border-radius: 8px;
  line-height: 55px;
}
.activity_right_middle {
  background: #f5f5f5;
  height: 55px;
  width: 124px;
  border-radius: 8px;
  line-height: 55px;
  margin-top: 10px;
}
.swiper_text {
  font-size: 16px;
  color: #ffffff;
}
.left_text {
  font-size: 16px;
  color: #999999;
}
.right_site {
  position: absolute;
  display: inline-block;
  margin-left: 9px;
  text-align: center;
}
ul li {
  list-style: none;
}
.shop_right {
  vertical-align: top;
  margin-top: 22px;
}
.right_title {
  font-size: 18px;
  color: #333333;
  margin-right: 10px;
}
.right_titles {
  font-size: 12px;
  color: #999999;
}

.background {
  width: 275px;
  height: 136px;
  background: #f5f5f5;
  text-align: center;
  line-height: 160px;
  border: 1px #999999 dashed;
}
.background img {
  width: 50px;
  height: 50px;
}
.el-input .el-input__inner {
  background: #f5f5f5;
}
.swiper_input {
  margin-top: 15px;
}
.shop_save {
  width: 100%;
  text-align: center;
}
.shop_save button {
  background: #037af0;
  border: none;
  font-size: 18px;
  color: #ffffff;
  height: 40px;
  width: 40%;
}
.shop_right .el-upload--picture-card {
  width: 281px;
  height: 148px;
}
.shop_right .el-upload-list--picture-card .el-upload-list__item {
  width: 281px;
  height: 148px;
}
.content {
  position: relative;
}
.del {
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 281px;
  height: 148px;
  top: 0;
  left: 0;
  display: none;
  cursor: pointer;
}
.icon {
  margin-top: 25%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
}
.cont:hover .del {
  display: block;
}
</style>
