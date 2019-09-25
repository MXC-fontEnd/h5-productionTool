// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeList: {
            default: [],
            type: [cc.Node]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let index = 0; index < this.nodeList.length; index++) {
            this.nodeList[index].on(cc.Node.EventType.TOUCH_START, this._Clicked, this);
        }

        this.fadeOutBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'fadeOut') {
                            let sub = parseInt(data.handleData.sub);
                            this.nodeList[sub].runAction(cc.fadeOut(1));
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.fadeOutBind, false);
    },

    onDestroy() {
        window.removeEventListener('message', this.fadeOutBind, false);
    },

    _Clicked(event) {
        let curNode = event.currentTarget;
        curNode.runAction(cc.fadeOut(1));

        let sub;
        for (let index = 0; index < this.nodeList.length; index++) {
            if (curNode == this.nodeList[index]) {
                sub = index;
            }
        }
        this.sentMessage('fadeOut', sub);

    },

    sentMessage(type, sub) {
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    sub: sub
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    // update (dt) {},
});
