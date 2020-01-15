function getToken(TokenKey) {

    return localStorage.getItem(TokenKey)
}

function setToken(TokenKey, token) {

    return localStorage.setItem(TokenKey, token)
}

function removeToken(TokenKey) {
    return localStorage.setItem(TokenKey, '')
}
//时间转换函数
function timeWeekFormat(times) {
    //定义一个日期对象;
    var dateTime = new Date(times);
    //获得系统年份;
    var year = dateTime.getFullYear();
    //获得系统月份;
    var month = dateTime.getMonth() + 1;
    //获得系统当月分天数;
    var day = dateTime.getDate();
    //获得系统小时;
    var hours = dateTime.getHours();
    //获得系统分钟;
    var minutes = dateTime.getMinutes();
    //获得系统秒数;
    var second = dateTime.getSeconds();
    //获得系统星期几;
    var dayCycle = dateTime.getDay();
    //使用数组更改日期样式;
    var dayCycleArray = ["日", "一", "二", "三", "四", "五", "六"];
    for (var i = 0; i < 7; i++) {
        if (dayCycle == i) {
            //将dayCycleArray的数赋值到系统星期几里面中去;
            dayCycle = dayCycleArray[i];
        }
    }
    month < 10 ? (month = "0" + month) : month;
    day < 10 ? (day = "0" + day) : day;
    hours < 10 ? (hours = "0" + hours) : hours;
    minutes < 10 ? (minutes = "0" + minutes) : minutes;
    second < 10 ? (second = "0" + second) : second;
    //打印完整的系统日期;
    let dateStr =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        second;
    return dateStr;
}
const url = 'http://api.wanhaoba.mingshifan.com:80/';
const imgUrl = 'http://api.wanhaoba.mingshifan.com:80';
// const url = 'http://www.wanba.cn:80/';
// const imgUrl = 'http://www.wanba.cn:80';

export default {
    url, //URL接口地址
    imgUrl, //图片地址
    getToken,
    setToken,
    removeToken,
    timeWeekFormat
}