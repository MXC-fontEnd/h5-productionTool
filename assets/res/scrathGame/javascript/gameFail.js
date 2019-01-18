cc.Class({
    extends: cc.Component,
    properties: {
        gameFail: {
            default: null,
            type: cc.Node
        },
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var player = this.node.parent.getChildByName("player");
        var tree = this.gameFail.getChildByName("tree");
        player.active= false;
        tree.active= false;
    },
    // update (dt) {},
});
