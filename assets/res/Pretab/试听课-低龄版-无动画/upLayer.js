cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node
        },

        reportList: {
            default: [],
            type: cc.Node
        },

        defaultListSeq: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.defaultListSeq < this.reportList.length - 1) {
            this.reportList[this.defaultListSeq].active = true;
        }

        this.upLayerBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);

            console.log('upLayerBind');
            console.log(data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'upLayer') {
                            var seq = parseInt(data.handleData.seq);
                            this.reportList[this.defaultListSeq].active = false;
                            this.reportList[seq].active = true;
                            this.defaultListSeq = seq;
                        }

                        if (data.handleData && data.handleData.type == 'upLayerClose') {
                            this.content.active = false;
                        }
                }
            }
        }.bind(this);

        window.addEventListener("message", this.upLayerBind, false);
    },

    onDisable() {
        console.log('onDisable'); 
    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.upLayerBind, false);
    },

    // update (dt) {},

    prev() {
        console.log('prev');
        if (this.defaultListSeq > 0) {
            this.reportList[this.defaultListSeq].active = false;
            this.defaultListSeq--;
            this.reportList[this.defaultListSeq].active = true;

            this.postMessage(this.defaultListSeq);
        }
    },

    next() {
        console.log('next');
        if (this.defaultListSeq < this.reportList.length - 1) {
            this.reportList[this.defaultListSeq].active = false;
            this.defaultListSeq++;
            this.reportList[this.defaultListSeq].active = true;

            this.postMessage(this.defaultListSeq);
        }
    },

    close() {
        this.content.active = false;
        this.postMessage('close');
    },

    postMessage(seq) {
        var handleData = {};
        if (seq == 'close') {
            handleData = {
                type: 'upLayerClose'
            }
        } else {
            handleData = {
                type: 'upLayer',
                seq: seq
            }

        }

        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData:handleData,
            });
            window.parent.postMessage(data, '*');
        }

    }

});
