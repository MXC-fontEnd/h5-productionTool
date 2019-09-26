/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 16:58:22
 * @LastEditTime: 2019-09-26 11:52:09
 * @LastEditors: Please set LastEditors
 */

window.messageProxy = {
    // 回调列表
    list: {},

    // 订阅
    on(name, fn) {
        this.list[name] = fn;
    },

    // 发布
    emit() {
        Object.values(this.list).forEach(fn => {
           if(fn) fn.apply(this, arguments);
        });
    },

    // 取消订阅
    off(name) {
        if (this.list[name]) this.list[name] = null;
    },
};
