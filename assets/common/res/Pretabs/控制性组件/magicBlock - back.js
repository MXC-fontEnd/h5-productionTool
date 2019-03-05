cc.Class({
    extends: cc.Component,

    properties: {
        controlledBoy: {
            default: null,
            type: cc.Node,
            displayName: "被控制对象"
        },

        repeatState: {
            default: false,
            displayName: "重复执行"
        },

        rotateRight: {
            default: true,
            displayName: "右转"
        },

        rotateNum: {
            default: 0,
            displayName: "转角"
        },
        // blockList:{
        //     default:[],
        //     type:[cc.Node],
        //     displayName: "积木列表"
        // }
        talks: {
            default: [],
            type: [cc.Label]
        },

        talksTime: {
            default: [],
            type: [cc.Integer]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // for (let index = 0; index < this.blockList.length; index++) {
        //     this.blockList[index].on(cc.Node.EventType.TOUCH_START, this._blockClicked, this);
        // }
        this.node.on(cc.Node.EventType.TOUCH_START, this._blockClicked, this);
    },

    _blockClicked(event) {
        let action = cc.rotateBy(1, 60);
        this.controlledBoy.runAction(action);
    }

    // update (dt) {},
});
