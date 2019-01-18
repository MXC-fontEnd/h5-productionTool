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
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
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

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.contentShowBind, false);
    },

    // update (dt) {},


});
