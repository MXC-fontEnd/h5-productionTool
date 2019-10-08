/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-10-08 17:40:36
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    properties: {
        triggers: {
            default: [],
            type: [cc.Button],
            displayName: "触发节点"
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
                case "CW_POPUPS_ACTIVED":
                    this[data.handleData.method](null, data.handleData.customEventData);
                    break;
                default:
                    break;
            }
        })
    },

    actived(e, customEventData) {
        let curState = this.contentNodes[customEventData].active;
        this.contentNodes[customEventData].active = curState ? false : true;
        if (e) {
            sendMessage("CW_POPUPS_ACTIVED", { method: "actived", customEventData });
        }
    },

    onDestroy() {
        window.messageProxy.off(this.curUuid);
    },
});

