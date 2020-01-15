<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    //商家数据
    if (!localStorage.getItem("merchtotal")) {
      localStorage.setItem("merchtotal", 0);
    }
    //用户提现
    if (!localStorage.getItem("usertotal")) {
      localStorage.setItem("usertotal", 0);
    }
    //账号审核
    if (!localStorage.getItem("numbertotal")) {
      localStorage.setItem("numbertotal", 0);
    }
    //礼物审核
    if (!localStorage.getItem("gifttotals")) {
      localStorage.setItem("gifttotal", 0);
    }
     //账号订单租用完
    if (!localStorage.getItem("numberOrder")) {
      localStorage.setItem("numberOrder", 0);
    }
  }
};
</script>
<style scoped>
#app {
  font-size: 14px;
}
</style>
