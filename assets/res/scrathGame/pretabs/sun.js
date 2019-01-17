cc.Class({
    extends: cc.Component,

    properties: {
        light: {
            default: null,
            type: cc.Node
        },

        backgroundAudio: {
            default: null,
            type: cc.AudioClip
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isRun = true;
        // var repeat = cc.repeatForever(cc.rotateBy(1, 45));
        // this.light.runAction(repeat);
        
        // this.currentBackgroundAudio = cc.audioEngine.play(this.backgroundAudio, true, .2);

        // 监听发射事件
        this.node.on('gameFail', function (event) {
            event.stopPropagation();
            this.isRun = false;
            cc.audioEngine.stop(this.currentBackgroundAudio);
        }.bind(this));
    },

    update (dt) {
        if(this.isRun){
            this.light.angle += 1;
        }
    },
});
