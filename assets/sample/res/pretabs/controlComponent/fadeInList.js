/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-10-11 12:04:28
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    properties: {
        fadeoutTime: {
            default: 1,
            displayName: "渐显时间"
        },
        contentNodes: {
            default: [],
            type: [cc.Node],
            displayName: "内容节点"
        },
    },

    onLoad() {
        this.curUuid = this.node.uuid;

        window.messageProxy.on(this.curUuid, (data) => {
            if (data.method && data.method == "onFileMessage") {
                data = data.handleData;
            }
            switch (data.type) {
                case "CW_FADEINLIST_FADEIN":
                    this[data.handleData.method](null, data.handleData.customEventData);
                    break;
                default:
                    break;
            }
        });

        for (let i = 0; i < this.contentNodes.length; i++) {
            this.contentNodes[i].opacity = 0;
        }
    },

    fadeIn(e, customEventData) {
        this.contentNodes[customEventData].runAction(cc.fadeIn(this.fadeoutTime));

        if (e) {
            sendMessage("CW_FADEINLIST_FADEIN", { method: "fadeIn", customEventData });
        }
    },

    onDestroy() {
        window.messageProxy.off(this.curUuid);
    },
});

