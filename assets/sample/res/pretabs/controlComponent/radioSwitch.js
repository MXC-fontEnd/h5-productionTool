/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-09-29 18:54:57
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    properties: {
        contentNodes: {
            default: [],
            type: [cc.Node],
            displayName: "内容节点"
        },
    },

    onLoad() {
        this.curUuid = this.node.uuid;

        window.messageProxy.on(this.curUuid, (data) => {
            switch (data.type) {
                case "CW_RADIOSWITCH_ACTIVED":
                    this[data.handleData.method](null, data.handleData.CustomEventData);
                    break;
                default:
                    break;
            }
        })
    },

    actived(e, CustomEventData) {
        for (let i = 0; i < this.contentNodes.length; i++) {
            this.contentNodes[i].active = i == CustomEventData ? true : false;
        }

        if (e) {
            sendMessage("CW_RADIOSWITCH_ACTIVED", { method: "actived", CustomEventData });
        }
    },

    onDestroy() {
        window.messageProxy.off(this.eventTag);
    },
});

