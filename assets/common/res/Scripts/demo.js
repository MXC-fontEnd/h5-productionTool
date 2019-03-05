
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this._Clicked, this);
    },

    _Clicked() {
        let action = cc.bezierTo(8, [cc.v2(this.node.x,this.node.y),cc.v2(0,0),cc.v2(200,200)]);

        this.node.runAction(action);
    },

    // update (dt) {},
});
