/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-09-25 18:20:12
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,

    properties: {
        seq: 1,
        contents: {
            default: [],
            type: [cc.Node]
        },
    },

    onLoad() {
        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_TABCONTENT_ACTIVED":
                    this[data.handleData.method](null, data.handleData.customEventData);
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        })
    },

    actived(e, customEventData) {
        for (let i = 0; i < this.contents.length; i++) {
            this.contents[i].active = customEventData == i ? true : false;
        }

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_TABCONTENT_ACTIVED", { method: "actived", customEventData });
    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },
});

