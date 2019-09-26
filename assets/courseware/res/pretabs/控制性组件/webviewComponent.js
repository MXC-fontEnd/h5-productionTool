/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-26 12:30:27
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            if (!this.target) return;
            this.isMessageAction = true;
            switch (data.type) {
                case "SCRATH_BLOCK_MOVE":
                    sendMessage("SCRATH_BLOCK_MOVE_BOX", data);
                    break;

                case "SCRATH_BLOCK_MOVE_BOX":
                    this.target._impl._iframe.contentWindow.postMessage(
                        JSON.stringify(data.handleData),
                        '*'
                    )
                    break;

                default:
                    this.isMessageAction = false;
                    break;
            }
        })

        this.target = null;
    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },

    // webview 監聽事件
    onWebFinishLoad: function (target, eventType) {
        switch (eventType) {
            case cc.WebView.EventType.ERROR:
                console.log('ERROR');

                break;
            case cc.WebView.EventType.LOADING:
                console.log('LOADING');

                break;
            case cc.WebView.EventType.LOADED:
                console.log('LOADED');
                this.target = target;
                break;
            default:
                break;
        }
    }
});
