/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-26 12:22:09
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        fadeInTime: {
            default: 1,
            type: cc.Integer,
            displayName: "渐显时间"
        },

        triggerPoint: {
            default: [],
            type: [cc.Node],
            displayName: "触发点"
        },

        triggerContent: {
            default: [],
            type: [cc.Node],
            displayName: "触发内容"
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_TRIGGERSHOW":
                    this[data.handleData.method](null, data.handleData.customEventData)
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        })

        for (let i = 0; i < this.triggerPoint.length; i++) {
            this.triggerPoint[i].on(cc.Node.EventType.TOUCH_START, this.triggerClicked, this);
        }

        for (let i = 0; i < this.triggerContent.length; i++) {
            this.triggerContent[i].runAction(cc.fadeOut());
        }
    },

    // 触发点被点击
    triggerClicked(e, customEventData) {
        let seq = e ? parseFloat(e.currentTarget.name.slice(-2)) : customEventData;
        this.triggerContent[seq - 1].runAction(cc.fadeIn(this.fadeInTime));

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_TRIGGERSHOW", { method: "triggerClicked", customEventData: seq });
    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },
});
