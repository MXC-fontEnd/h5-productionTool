cc.Class({
    extends: cc.Component,

    properties: {
        swimLeft: {
            default: true,
            displayName: "向左游"
        },

        swimRight: {
            default: false,
            displayName: "向右游"
        },

        swimRepeat: {
            default: false,
            displayName: "重复游"
        },

        swimTime: {
            default: 1,
            type: cc.Integer,
            displayName: "游泳时间"
        },

        destination: {
            default: null,
            type: cc.v2,
            displayName: "目的地"
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // 可视区尺寸
        this.canvasView = cc.find("Canvas");
        this.viewWidth = this.canvasView.x;
        this.viewHeight = this.canvasView.y;

        // 鱼的故乡
        this.fishOriginPos = cc.v2(this.node.x,this.node.y);

        this.init();
    },

    init() {
        let action;
        if (this.swimLeft) {
            action = this.swimToLeft();
        } else if (this.swimRight) {
            action = this.swimToRight();
        }

        if(this.swimRepeat){
            action = this.swimToRepeat(action);
        }
        this.node.runAction(action);
    },

    // 往左游
    swimToLeft() {
        return this.swimTo(cc.v2(-(this.viewWidth / 2 + 100), this.node.y));
    },

    // 往右游
    swimToRight() {
        return this.swimTo(cc.v2(this.viewWidth / 2 + 100, this.node.y));
    },

    // 游
    swimTo(pos){
        let swim = this.destination ? cc.v2(this.destination.x, this.destination.y) : pos;
        let action2 = cc.moveTo(this.swimTime, swim);
        let action1 = cc.callFunc(function(){
            this.node.setPosition(this.fishOriginPos);
        }, this);
        let action3 = cc.sequence(action1,action2);
        return action3;
    },

    // 重复游
    swimToRepeat(swim){
        return cc.repeatForever(swim);
    }


    // update (dt) {},
});
