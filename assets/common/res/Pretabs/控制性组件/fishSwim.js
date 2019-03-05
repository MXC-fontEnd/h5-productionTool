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
        this.init();
    },

    init() {
        let action;
        if (this.swimLeft) {
            if (this.destination && this.destination.x !== 0 || this.destination && this.destination.y !== 0) {
                action = cc.moveTo(this.swimTime, cc.v2(this.destination.x, this.destination.y));
            } else {
                action = cc.moveTo(this.swimTime, cc.v2(-530, this.node.y));
            }
        } else if (this.swimRight) {
            if (this.destination && this.destination.x !== 0 || this.destination && this.destination.y !== 0) {
                action = cc.moveTo(this.swimTime, cc.v2(this.destination.x, this.destination.y));
            } else {
                action = cc.moveTo(this.swimTime, cc.v2(530, this.node.y));
            }
        }

        if (action) {
            this.node.runAction(action);
        }
    }
    // update (dt) {},
});
