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
        },

        scoreLabel:{
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.monster = null;
        this.defaultCount = 5;
        this.defaultPostion = cc.v2(320, 22);

        // 监听发射事件
        this.node.on('gameFail', function (event) {
            event.stopPropagation();
            this.monster.pauseAllActions();
        }.bind(this));
        
        this.score = 0;
        this.addSpawn();
    },

    addSpawn: function () {
        this.score++;
        this.scoreLabel.string = this.score - 1;

        var monster = cc.instantiate(this.prefab);
        monster.parent = this.root;

        if (this.defaultPostion) {
            monster.position = this.defaultPostion;
            this.defaultPostion = null;
        } else {
            monster.position = cc.v2(220, 22);
        }

        var count;
        if (this.defaultCount) {
            count = this.defaultCount;
            this.defaultCount = null;
        } else {
            count = 3;
        }

        var repeat = cc.sequence(cc.repeat(cc.moveBy(1, cc.v2(-100, 0)), count), cc.callFunc(() => {
            this.root.getChildByName("tree").destroy();
            this.addSpawn();
        }));

        monster.runAction(repeat);

        this.monster = monster;
    }

});
