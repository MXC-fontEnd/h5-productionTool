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
    onLoad() {
        this.isRun = true;
        this.currentBackgroundAudio = cc.audioEngine.play(this.backgroundAudio, true, .2);
        // 监听发射事件
        this.node.on('gameFail', function (event) {
            event.stopPropagation();
            this.isRun = false;
            cc.audioEngine.stop(this.currentBackgroundAudio);
        }.bind(this));
    },

    update(dt) {
        if (this.isRun) {
            this.light.angle += 1;
        }
    },
});
