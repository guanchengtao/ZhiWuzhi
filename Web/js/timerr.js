$(function () {
    var dt = new Date();
    var h = dt.getHours();
    var msg = $("#SHIJIAN");
    if (h < 6) {
        msg.text("凌晨好!");
    } else if (h < 12) {
        msg.text("上午好!");
    } else if (h < 15) {
        msg.text("中午好!");
    } else if (h < 18) {
        msg.text("下午好!");
    } else if (h < 21) {
        msg.text("傍晚好!");
    } else {
        msg.text("深夜好!");
    }
}) //显示当前登陆时间