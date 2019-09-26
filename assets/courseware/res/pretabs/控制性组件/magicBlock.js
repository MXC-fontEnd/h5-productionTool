/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-26 12:14:44
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

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

        reStart: {
            default: null,
            type: cc.Node,
            displayName: "重新开始"
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
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_MAGICBLOCK":
                    this[data.handleData.method](null, data.handleData.CustomEventData);
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        })

        this.init();
    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },

    init() {
        this.curNode = null;
        this.controlledBoy.stopAllActions();
        this.talkText.node.stopAllActions();
        this.controlledBoy.rotation = 0;
        this.talkText.string = '';
    },

    restart() {
        this.init();

        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "restart",
            CustomEventData: "restart"
        })
    },
    // 
    //  button 缩放效果
    //
    scaleButton(curNode) {
        curNode.runAction(cc.sequence(cc.scaleTo(0.05, 1.2), cc.scaleTo(0.05, 1)));
    },

    // 被点击
    // 说你好持续2秒
    // 说omo持续2秒
    talks(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "talks",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.talksWork("repeat");
    },

    // 被点击
    // 重复执行
    // 说你好持续2秒
    // 说omo持续2秒
    talksRepeatForever(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "talksRepeatForever",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.talksWork('repeatForever');
    },

    talksWork(tag) {
        const [action1, action2, action3, action4, action5] = [cc.callFunc((e) => {
            this.talkText.string = this.talkList[0];
        }), cc.delayTime(2), cc.callFunc((e) => {
            this.talkText.string = this.talkList[1];
        }), cc.delayTime(2), cc.callFunc((e) => {
            this.talkText.string = '';
        })];

        let action;
        switch (tag) {
            case "repeat":
                action = cc.sequence(action1, action2, action3, action4, action5);
                break;
            case "repeatForever":
                action = cc.repeatForever(cc.sequence(action1, action2, action3, action4, action5));
                break;
            default:
                break;
        }

        this.talkText.node.runAction(action);
    },

    // 被点击
    // 右转15度
    rotate(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotate",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.controlledBoy.runAction(cc.rotateBy(0.3, 15));
    },

    // 被点击
    // 重复执行
    // 右转15度
    rotateRepeatForever(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotateRepeatForever",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.controlledBoy.runAction(cc.repeatForever(cc.rotateBy(0.3, 15)));
    },

    // 被点击
    // 重复执行
    // 秒针旋转一格（6度）
    rotateNeedleRepeatForeve(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotateNeedleRepeatForeve",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.controlledBoy.runAction(cc.repeatForever(cc.rotateBy(0.05, 6)));
    },

    // 被点击
    // 等待一秒
    // 秒针旋转一格（6度）
    rotateNeedle1(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotateNeedle1",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.controlledBoy.runAction(cc.sequence(cc.delayTime(1), cc.rotateBy(0.1, 6)));
    },

    // 被点击
    // 重复执行10次
    // 等待一秒
    // 秒针旋转一格（30度）
    rotateNeedleRepeat12(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotateNeedleRepeat12",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(0.1, 6);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeat(action3, 10);
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 等待一秒
    // 秒针旋转一格（6度）
    rotateNeedleRepeatForeve1(event, CustomEventData) {
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_MAGICBLOCK", {
            method: "rotateNeedleRepeatForeve1",
            CustomEventData
        })

        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(0.1, 6);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeatForever(action3);
        this.controlledBoy.runAction(action);
    },

});