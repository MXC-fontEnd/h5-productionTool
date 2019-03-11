
cc.Class({
    extends: cc.Component,

    properties: {
        smallBox: {
            default: [],
            type: [cc.Node]
        },
        showBox: {
            default: [],
            type: [cc.Animation]
        },
        choose: {
            default: [],
            type: [cc.Node]
        },
        game: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start() {
        var that = this;
        
        window.addEventListener('message', function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'PAGE11') {
                            var seq = parseInt(data.handleData.seq);
                            that.showBox[seq].play();
                            that.smallBox[seq].getComponent(cc.Sprite).spriteFrame = that.choose[seq].getComponent(cc.Sprite).spriteFrame;
                            that.game.getComponent(cc.Animation).play(that.game.getComponent(cc.Animation)._clips[seq]._name);
                        }
                }
            }
        }, false);

        this.choose.forEach(function(x,y){
            x.on('touchstart', function (event) {
                var num = y;
                that.showBox[num].play();
                that.smallBox[num].getComponent(cc.Sprite).spriteFrame = that.choose[num].getComponent(cc.Sprite).spriteFrame;
                that.game.getComponent(cc.Animation).play(that.game.getComponent(cc.Animation)._clips[num]._name);

                if (window !== window.parent) {
                    let data = JSON.stringify({
                        method: 'onFileMessage',
                        handleData: {
                            type: 'PAGE11',
                            seq: num
                        },
                    });
                    window.parent.postMessage(data, '*');
                }
            }.bind(this));
        });



    },

    // update (dt) {},
});
