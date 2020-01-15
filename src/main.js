// 兼容ie
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import Echarts from 'echarts'
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'
import { CountDown } from 'vant';
import global from './utils/auth'

Vue.use(CountDown);
Vue.prototype.$global = global;
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.use(ElementUI)
Vue.prototype.echarts = Echarts
Vue.use(Echarts)
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})