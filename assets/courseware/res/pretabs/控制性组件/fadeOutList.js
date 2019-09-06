/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-05 16:28:44
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        fadeTime: {
            default: 1,
            displayName: "渐隐时间"
        },
        fadeList: {
            default: [],
            type: [cc.Node],
            displayName: "渐隐列表"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isMessageAction = false;
        // 监听课件message
        window.messageCallback = (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_FADEOUTLIST":
                    this[data.handleData.method](null, data.handleData.customEventData)
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        }

        for (let i = 0; i < this.fadeList.length; i++) {
            this.fadeList[i].on(cc.Node.EventType.TOUCH_START, this.triggerClicked, this);
        }
    },

    onDestroy() {
        console.log("onDestroy");
    },

    triggerClicked(e, customEventData) {
        let seq = e ? parseFloat(e.currentTarget.name.slice(-2)) : customEventData;
        this.fadeList[seq - 1].runAction(cc.fadeOut(this.fadeTime));

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_FADEOUTLIST", { method: "triggerClicked", customEventData: seq });
    },

});
