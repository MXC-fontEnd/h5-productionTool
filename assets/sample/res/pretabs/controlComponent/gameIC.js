/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-10-11 14:31:25
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    onLoad() {
        this.node.on("gameIC", this.gameIC, this);
    },

    gameIC(event) {
        event.stopPropagation();
        let detail = event.detail;
        sendMessage(detail.type, detail.handleData);
    },
});