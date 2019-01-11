cc.Class({
    extends: cc.Component,
    properties: {
        editBoxList: {
            default: [],
            type: [cc.Node]
        }

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.textChangeBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'textChange') {
                            this.editBoxList[data.handleData.listSeq].getComponent(cc.EditBox).string = data.handleData.text;
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.textChangeBind, false);
    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.textChangeBind, false);
    },

    // update (dt) {},
    textChangeCallback(pars, target) {
        if (pars == '') return;

        this.editBoxList.forEach(function (x, y) {
            
            if (x.getComponent(cc.EditBox).string === pars) {

                if (window !== window.parent) {
                    let data = JSON.stringify({
                        method: 'onFileMessage',
                        handleData: {
                            type: 'textChange',
                            text: pars,
                            listSeq: y
                        },
                    });
                    window.parent.postMessage(data, '*');
                }
            }
        });
    }
});
