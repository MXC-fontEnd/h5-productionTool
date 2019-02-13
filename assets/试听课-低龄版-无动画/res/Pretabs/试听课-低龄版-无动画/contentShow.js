cc.Class({
    extends: cc.Component,

    properties: {
        triggerFlagList: {
            default: [],
            type: [cc.Node]
        },
        contentList: {
            default: [],
            type: [cc.Node]
        },

        animationList:{
            default: [],
            type: cc.Animation
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.anlist = ['a','d','b','e','c','f'];

        this.contentShowBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'contentShow') {
                            var seq = parseInt(data.handleData.seq);
                            var action = cc.fadeIn(1.0);
                            this.contentList[seq].runAction(action);
                        }

                        if (data.handleData && data.handleData.type == 'contentPlay') {
                            var seq = parseInt(data.handleData.seq);
                            var anim = this.animationList[seq];
                            anim.play(this.anlist[seq]);
                        }
                }
            }
        }.bind(this)

        window.addEventListener("message", this.contentShowBind, false);

        this.triggerFlagList.forEach(function (x, y) {
            x.on('touchstart', function (event) {
                var action = cc.fadeIn(1.0);
                this.contentList[y].runAction(action);

                if (window !== window.parent) {
                    let data = JSON.stringify({
                        method: 'onFileMessage',
                        handleData: {
                            type: 'contentShow',
                            seq: y
                        },
                    });
                    window.parent.postMessage(data, '*');
                }
            }.bind(this));
        }.bind(this));
    },

    play(event,pars){
        var anim = this.animationList[pars];
        anim.play(this.anlist[pars]);

        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: 'contentPlay',
                    seq: pars
                },
            });
            window.parent.postMessage(data, '*');
        }

    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.contentShowBind, false);
    },

    // update (dt) {},


});
