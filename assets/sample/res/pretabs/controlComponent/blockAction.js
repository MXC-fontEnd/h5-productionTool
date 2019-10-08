/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 09:05:56
 * @LastEditTime: 2019-10-08 09:12:53
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,

    properties: {
        controlledBoy: {
            default: null,
            type: cc.Node,
            displayName: "被控制对象"
        },

        talkText: {
            default: null,
            type: cc.Label,
            displayName: "话语文本"
        },

        talkList: {
            default: [],
            type: [cc.String],
            displayName: "话语列表"
        },

        blockList: {
            default: [],
            type: [cc.Node],
            displayName: "积木列表"
        },

        reStart: {
            default: null,
            type: cc.Node,
            displayName: "重新开始"
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() { }
    // update (dt) {},
});