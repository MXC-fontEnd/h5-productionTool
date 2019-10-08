/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-10-08 10:12:00
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {
        this.curUuid = this.node.uuid;
        window.messageProxy.on(this.curUuid, (data) => {
            if(data.method && data.method == "onFileMessage"){
                data = data.handleData;
            }
            switch (data.type) {
                case "SCRATH_BLOCK_MOVE":
                    sendMessage("SCRATH_BLOCK_MOVE_BOX", data);
                    break;
                case "SCRATH_BLOCK_MOVE_BOX":
                    if (this.target) {
                        this.target._impl._iframe.contentWindow.postMessage(
                            JSON.stringify(data.handleData),
                            '*'
                        )
                        break;
                    }
                default:
                    break;
            }
        })
    },

    onDestroy() {
        window.messageProxy.off(this.curUuid);
    },

    onWebFinishLoad: function (target, eventType) {
        switch (eventType) {
            case cc.WebView.EventType.ERROR:
                console.log('webview block error');

                break;
            case cc.WebView.EventType.LOADING:
                console.log('webview block loading');

                break;
            case cc.WebView.EventType.LOADED:
                console.log('webview block loaded');
                this.target = target;
                // 设置block盒子大小
                this.target._impl._iframe.contentWindow.postMessage(
                    JSON.stringify({
                        type: "SCRATH_BLOCK_BOXSIZE",
                        handleData: {
                            width: this.node.width,
                            height: this.node.height
                        }
                    }),
                    '*'
                )

                break;
            default:
                break;
        }
    }
});