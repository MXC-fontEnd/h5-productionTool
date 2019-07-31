cc.Class({
    extends: cc.Component,

    properties: {
        contents: {
            default: [],
            type: [cc.Node]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tabContent = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'tabContent') {
                            let method = data.handleData.method;
                            let pars = parseInt(data.handleData.pars);
                            this[method](null, pars);
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.tabContent, false);
    },

    trigger(e, pars) {
        console.log(e);
        console.log(pars);

        for (let i = 0; i < this.contents.length; i++) {
            this.contents[i].active = pars == i ? true : false;
        }
        if (e) this.sendMessage('tabContent', 'trigger', pars);
    },

    sendMessage(type, method, pars) {
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method,
                    pars: pars,
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    onDisable() {
        console.log('onDisable');
        window.removeEventListener('message', this.tabContent, false);
    },

    onDestroy() {
        console.log('onDestroy');
    },
    // update (dt) {},
});
