cc.Class({
    extends: cc.Component,

    properties: {
        spriteScaleList: {
            default: [],
            type: [cc.Node]
        },

        scaleRatio: 1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.normalRatio = null;
        
        this.spriteScaleBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'spriteScale') {
                            this.spriteScaleList[data.handleData.listSeq].scale = data.handleData.ratio;
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.spriteScaleBind, false);


        var flag = true;
        this.spriteScaleList.forEach(function (x, y) {
            x.on('touchstart', function (event) {
                var listSeq = y;
                if (flag) {
                    flag = false;

                    if (event.currentTarget.scale !== this.scaleRatio) {
                        this.normalRatio = event.currentTarget.scale;
                        event.currentTarget.scale = this.scaleRatio;
                    } else {
                        event.currentTarget.scale = this.normalRatio;
                    }

                    if (window !== window.parent) {
                        console.log('post');
                        let data = JSON.stringify({
                            method: 'onFileMessage',
                            handleData: {
                                type: 'spriteScale',
                                ratio: event.currentTarget.scale,
                                listSeq: listSeq
                            },
                        });
                        window.parent.postMessage(data, '*');   
                    }

                    flag = true;
                }
            }.bind(this));
        }.bind(this));
    },

    onDisable() {
        console.log('onDisable');
        window.removeEventListener('message', this.spriteScaleBind, false);
    },

    onDestroy() {
        console.log('onDestroy');
    },

    // update (dt) {},
});
