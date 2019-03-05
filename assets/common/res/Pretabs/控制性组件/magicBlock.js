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
        }

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() { },

    init() {
        this.controlledBoy.stopAllActions();
        this.talkText.node.stopAllActions();
        this.controlledBoy.rotation = 0;
        this.talkText.string = '';
    },

    // 被点击
    // 说你好持续2秒
    // 说omo持续2秒
    talks() {
        this.talksWork();
    },

    // 被点击
    // 重复执行
    // 说你好持续2秒
    // 说omo持续2秒
    talksRepeatForever(event) {
        this.talksWork('repeatForever');
    },

    talksWork(tag){
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

        if(tag == 'repeatForever'){
            action = cc.repeatForever(cc.sequence(action1, action2, action3, action4, action5));
        } else {
            action = cc.sequence(action1, action2, action3, action4, action5);
        }
        this.talkText.node.runAction(action);
    },

    // 被点击
    // 右转15度
    rotate(event) {
        let action = cc.rotateBy(1, 15);
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 右转15度
    rotateRepeatForever(event) {
        let action = cc.repeatForever(cc.rotateBy(1, 15));
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 秒针旋转一格（30度）
    rotateNeedleRepeatForeve(event) {
        let action = cc.repeatForever(cc.rotateBy(1, 30));
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 等待一秒
    // 秒针旋转一格（30度）
    rotateNeedle1(event) {
        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(1, 30);
        let action = cc.sequence(action1, action2);
        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行12次
    // 等待一秒
    // 秒针旋转一格（30度）
    rotateNeedleRepeat12(event) {
        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(1, 30);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeat(action3, 12);

        this.controlledBoy.runAction(action);
    },

    // 被点击
    // 重复执行
    // 等待一秒
    // 秒针旋转一格（30度）
    rotateNeedleRepeatForeve1(event) {
        let action1 = cc.delayTime(1);
        let action2 = cc.rotateBy(1, 30);
        let action3 = cc.sequence(action1, action2);
        let action = cc.repeatForever(action3);
        
        this.controlledBoy.runAction(action);
    },
    // update (dt) {},
});
