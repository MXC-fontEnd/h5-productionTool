cc.Class({
    extends: cc.Component,

    properties: {
        triggerPoint: {
            default: [],
            type: [cc.Node],
            displayName: "触发点"
        },

        triggerContent: {
            default: [],
            type: [cc.Node],
            displayName: "触发内容"
        },

        fadeInTime: {
            default: 1,
            type: cc.Integer,
            displayName: "渐显时间"
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        for (let index = 0; index < this.triggerContent.length; index++) {
            this.triggerContent[index].runAction(cc.fadeOut());
        }

        for (let index = 0; index < this.triggerPoint.length; index++) {
            // 下标赋值对象
            this.triggerPoint[index].curSub = index;
            this.triggerPoint[index].on(cc.Node.EventType.TOUCH_END, this.pointClicked, this);
        }

        this._messageBind();
    },

    onDestroy() {
        window.removeEventListener('message', this.triggerShowBind);
    },

    // message 绑定
    _messageBind() {
        this.triggerShowBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'triggerShow') {
                            let method = data.handleData.method;
                            let sub = data.handleData.CustomEventData;
                            this[method]('', sub);
                        }
                        break;
                }
            }
        }.bind(this);

        window.addEventListener("message", this.triggerShowBind, false);
    },

    // 触发点被点击
    pointClicked(event, message) {
        let sub;
        // 0 布尔值为假
        if (message || message === 0) {
            sub = message;
        } else {
            sub = event.currentTarget.curSub;
        }

        this.triggerContent[sub].runAction(cc.fadeIn(this.fadeInTime));
        if (!message && message !== 0) this._sentMessage('triggerShow', 'pointClicked', sub);
    },

    _sentMessage(type, method, CustomEventData) {
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method,
                    CustomEventData: CustomEventData
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    // update (dt) {},
});
