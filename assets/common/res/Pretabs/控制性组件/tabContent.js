/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-08-27 14:02:23
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,

    properties: {
        seq:1,
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
                        if (data.handleData && data.handleData.type == ('tabContent' + this.seq)) {
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
        console.log(pars)
        for (let i = 0; i < this.contents.length; i++) {
            this.contents[i].active = pars == i ? true : false;
        }
        if (e) this.sendMessage('tabContent' + this.seq, 'trigger', pars);
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

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.tabContent, false);
    },
    // update (dt) {},
});
