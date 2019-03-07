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
    onLoad() {
        this.messageFlag = true;
        this.init();

        this.magicBlockBind = function (e) {
            console.log('magicBlockBind');
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'magicBlock') {
                            this.messageFlag = false;
                            let method = data.handleData.method;
                            let CustomEventData = parseInt(data.handleData.CustomEventData);
                            this[method]('context', CustomEventData);
                        }

                        if (data.handleData && data.handleData.type == 'magicBlockRestart') {
                            this.messageFlag = false;
                            let method = data.handleData.method;
                            let CustomEventData = data.handleData.CustomEventData;
                            this[method]('context', CustomEventData);
                        }
                        break;
                }
            }
        }.bind(this);

        window.addEventListener("message", this.magicBlockBind, false);
    },

    onDestroy() {
        window.removeEventListener('message', this.magicBlockBind);
    },

    init(event, CustomEventData) {
        if (CustomEventData) {
            if (this.messageFlag) this.sentMessage('magicBlockRestart', 'init', CustomEventData);
            this.scaleButton(this.reStart);
        }
        this.curNode = null;
        this.messageFlag = true;
        this.controlledBoy.stopAllActions();
        this.talkText.node.stopAllActions();
        this.controlledBoy.rotation = 0;
        this.talkText.string = '';
    },

    // 
    //  button 缩放效果
    //
    scaleButton(curNode) {
        let action1 = cc.scaleTo(0.05, 1.2);
        let action2 = cc.scaleTo(0.05, 1);
        let action = cc.sequence(action1, action2);
        curNode.runAction(action);
    },

    // 被点击
    // 说你好持续2秒
    // 说omo持续2秒
    talks(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'talks', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        this.talksWork();
    },

    // 被点击
    // 重复执行
    // 说你好持续2秒
    // 说omo持续2秒
    talksRepeatForever(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'talksRepeatForever', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);

        this.init();

        this.talksWork('repeatForever');
    },

    talksWork(tag) {
        let action;
        let action1 = cc.callFunc(function (event) {
            this.talkText.string = this.talkList[0];
        }, this);
        let action2 = cc.delayTime(2);
        let action3 = cc.callFunc(function (event) {
            this.talkText.string = this.talkList[1];
        }, this);
        let action4 = cc.delayTime(2);
        let action5 = cc.callFunc(function (event) {
            this.talkText.string = '';
        }, this);

        if (tag == 'repeatForever') {
            action = cc.repeatForever(cc.sequence(action1, action2, action3, action4, action5));
        } else {
            action = cc.sequence(action1, action2, action3, action4, action5);
        }
        this.talkText.node.runAction(action);
    },

    // 被点击
    // 右转15度
    rotate(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotate', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action = cc.rotateBy(0.3, 15);
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 右转15度
    rotateRepeatForever(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotateRepeatForever', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action = cc.repeatForever(cc.rotateBy(0.3, 15));
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 秒针旋转一格（6度）
    rotateNeedleRepeatForeve(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotateNeedleRepeatForeve', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action = cc.repeatForever(cc.rotateBy(0.05, 6));
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 等待一秒
    // 秒针旋转一格（6度）
    rotateNeedle1(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotateNeedle1', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(0.1, 6);
        let action = cc.sequence(action1, action2);
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行12次
    // 等待一秒
    // 秒针旋转一格（30度）
    rotateNeedleRepeat12(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotateNeedleRepeat12', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(0.1, 6);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeat(action3, 60);

        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 等待一秒
    // 秒针旋转一格（6度）
    rotateNeedleRepeatForeve1(event, CustomEventData) {
        if (this.messageFlag) this.sentMessage('magicBlock', 'rotateNeedleRepeatForeve1', CustomEventData);
        this.curNode = this.blockList[CustomEventData - 1];
        this.scaleButton(this.curNode);
        this.init();

        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(0.1, 6);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeatForever(action3);

        this.controlledBoy.runAction(action);
    },

    sentMessage(type, method, CustomEventData) {
        console.log('sentMessage');
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method,
                    CustomEventData: CustomEventData
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    // update (dt) {},
});