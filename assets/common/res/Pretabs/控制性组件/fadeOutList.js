// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeList:{
            default:[],
            type:[cc.Node]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for (let index = 0; index < this.nodeList.length; index++) {
            this.nodeList[index].on(cc.Node.EventType.TOUCH_START, this._Clicked, this);
        }
    },

    _Clicked (event) {
        let curNode = event.currentTarget;
        curNode.runAction(cc.fadeOut(1));
    },

    // update (dt) {},
});
