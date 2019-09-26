/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-09-26 12:21:08
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        triggers: {
            default: [],
            type: [cc.Node]
        },
        shows: {
            default: [],
            type: [cc.Node]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_TABCONTENT":
                    this[data.handleData.method](null, data.handleData.customEventData)
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        })

        for (let n = 0; n < this.triggers.length; n++) {
            this.triggers[n].on(cc.Node.EventType.TOUCH_START, this.triggerClicked, this);
        }
    },

    triggerClicked(e, customEventData) {
        let seq = e ? parseFloat(e.currentTarget.name.slice(-2)) : customEventData;
        for (let i = 0; i < this.shows.length; i++) {
            this.shows[i].active = i == seq - 1 ? true : false;
        }

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_TABCONTENT", { method: "triggerClicked", customEventData: seq });
    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },
});
