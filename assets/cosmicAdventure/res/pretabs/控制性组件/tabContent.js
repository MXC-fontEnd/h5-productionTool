/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-09-27 20:14:21
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,

    properties: {
        eventTag:"",
        seq: 1,
        contentNodes: {
            default: [],
            type: [cc.Node]
        },
    },

    onLoad() {
        this.isMessageAction = false;
        window.messageProxy.on(this.eventTag, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_TABCONTENT_ACTIVED":
                    if(this.seq == data.handleData.seq){
                        this[data.handleData.method](null, data.handleData.customEventData);
                    }
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        })
    },

    actived(e, customEventData) {
        if(!this.contentNodes) return;
        for (let i = 0; i < this.contentNodes.length; i++) {
            this.contentNodes[i].active = customEventData == i ? true : false;
        }

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_TABCONTENT_ACTIVED", { method: "actived", customEventData,seq:this.seq });
    },

    onDestroy() {
        window.messageProxy.off(this.eventTag);
    },
});

