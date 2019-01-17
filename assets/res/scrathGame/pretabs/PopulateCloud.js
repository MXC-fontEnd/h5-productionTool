cc.Class({
    extends: cc.Component,

    properties: {
        root: {
            default: null,
            type: cc.Node
        },

        prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this.monster = null;

        // 监听发射事件
        this.node.on('gameFail', function (event) {
            event.stopPropagation();

            this.monster.pauseAllActions();
        }.bind(this));

        this.addSpawn();
    },

    addSpawn: function () {
        var monster = cc.instantiate(this.prefab);
        monster.parent = this.root;
        monster.position = cc.v2(130, 110);

        var repeat = cc.sequence(cc.repeat(cc.moveBy(1, cc.v2(-30, 0)), 7), cc.callFunc(() => {
            this.root.getChildByName("cloud").destroy();
            this.addSpawn();
        }));

        monster.runAction(repeat);

        this.monster = monster;
    }



});
