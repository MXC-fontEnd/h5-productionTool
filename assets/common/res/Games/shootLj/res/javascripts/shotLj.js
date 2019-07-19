cc.Class({
    extends: cc.Component,

    properties: {
        xText: {
            default: null,
            type: cc.Label
        },
        yText: {
            default: null,
            type: cc.Label
        },

        fSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        tSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        xNodes: {
            default: [],
            type: [cc.Node]
        },

        yNodes: {
            default: [],
            type: [cc.Node]
        },

        ljList: {
            default: [],
            type: [cc.Node]
        },
    },

    onLoad() {
        this.flag = true;
    },

    start() {

    },

    setX(e, v) {
        this.xText.string = v;
        switch (parseInt(v)) {
            case 10:
                this.setXFn(0);
                break;

            case 20:
                this.setXFn(1);
                break;

            case 30:
                this.setXFn(2);
                break;
        }
    },

    setY(e, v) {
        this.yText.string = v;
        switch (parseInt(v)) {
            case 10:
                this.setYFn(0);
                break;

            case 20:
                this.setYFn(1);
                break;

            case 30:
                this.setYFn(2);
                break;
        }
    },

    setXFn(seq) {
        for (let index = 0; index < this.xNodes.length; index++) {
            let curSprite = this.xNodes[index].getComponent(cc.Sprite);
            if (index == seq) {
                curSprite.spriteFrame = this.tSpriteFrames[index];
            } else {
                curSprite.spriteFrame = this.fSpriteFrames[index];
            }
        }
    },

    setYFn(seq) {
        for (let index = 0; index < this.yNodes.length; index++) {
            let curSprite = this.yNodes[index].getComponent(cc.Sprite);
            if (index == seq) {
                curSprite.spriteFrame = this.tSpriteFrames[index];
            } else {
                curSprite.spriteFrame = this.fSpriteFrames[index];
            }
        }
    },

    ljConfig(n){
        let seq;
        [10*10,10*20,10*30,20*10,20*20,20*30,30*10,30*20,30*30].forEach((element,i) => {
           if(element == n)  seq = i;
        });
        return seq;
    },

    update(dt) {
        if (this.xText.string && this.yText.string && this.flag) {
            this.flag = false;
            let seq = this.ljConfig(parseInt(this.xText.string)*parseInt(this.yText.string));
            let act1 = cc.scaleTo(.4,.5);
            let act2 = cc.callFunc(()=>{
                this.ljList[seq].destroy();
            }, this)
            let action = cc.sequence(act1, act2);
            this.ljList[seq].runAction(action);

            this.scheduleOnce(function () {
                this.flag = true;
                this.xText.string = '';
                this.yText.string = '';

                this.setXFn();
                this.setYFn();
            }, .5);
        }
    },

});
