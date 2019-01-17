cc.Class({
    extends: cc.Component,

    properties: {
        prefabStart: {
            default: null,
            type: cc.Prefab
        },

        prefabGame: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(this.scrathFace);

        // var start = cc.instantiate(this.prefabStart);
        // game.parent = this.node;

    },

    game(){
        var scrathStart = this.node.getChildByName("scrathStart");
        scrathStart.active = false;

        var game = cc.instantiate(this.prefabGame);
        game.parent = this.node;
    }

    // update (dt) {},
});
