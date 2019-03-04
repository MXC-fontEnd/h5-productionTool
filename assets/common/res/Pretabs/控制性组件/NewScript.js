cc.Class({
    extends: cc.Component,

    properties: {
        label:{
            default:null,
            type:cc.Label
        }

    },

    onLoad () {
        // var flipYAction = cc.flipY(true);
        // this.node.runAction(flipYAction);

        //let an = this.node.getComponent(sp.Skeleton);
        //console.log(an);
        let action1_1 = cc.rotateTo(6,0, 90);
        let action1_2 = cc.skewTo(6, 0, 0);
        let action1 = cc.spawn(action1_1,action1_2);
        let action2 = cc.callFunc(this.removeSprite, this);
        let action3_1 = cc.rotateTo(6, 0, 180);
        let action3_2 = cc.skewTo(6, 0, 0);
        let action3 = cc.spawn(action3_1,action3_2);

        let action = cc.sequence(action1,action2);
        this.node.runAction(action);

        
        // this.node.rotationX = 0;
        // this.node.rotationY = 60;
        // this.node.skewY = 35;
        
    },
    removeSprite(){
        console.log(this.node);
        // this.node.removeComponent(cc.Sprite);
        // this.node.addComponent(this.label);
    },
    // start () {

    // },

    update (dt) {
    },
});
