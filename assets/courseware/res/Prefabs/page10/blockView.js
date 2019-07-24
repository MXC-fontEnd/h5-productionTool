cc.Class({
    extends: cc.Component,
    properties: {
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.target = null;

		this.blockViewMessage = function (e) {
			if (typeof e.data !== 'string') return;
			var data = JSON.parse(e.data);
			if (data) {
				switch (data.method) {
					case 'onFileMessage':
                        if (data.handleData && data.handleData.method === 'onBlockEvent') {
                            this.target._impl._iframe.contentWindow.postMessage(
                                JSON.stringify(data),
                                '*'
                            )
                        }
                        break
                        
                    // 发消息
                    case 'onBlockEvent':
                        window.parent.postMessage(
                            JSON.stringify({
                                method: 'onFileMessage',
                                handleData: data,
                            }),
                            '*'
                        );
                        break;
				}
			}
		}.bind(this);
        window.addEventListener("message", this.blockViewMessage, false);
        
    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.blockViewMessage);
        
    },

    // update (dt) {},
    // webview 監聽事件
    onWebFinishLoad: function (target, event, customEventData) {
        switch (event) {
            case cc.WebView.EventType.ERROR:
                console.log('ERROR');
                break;
            case cc.WebView.EventType.LOADING:
                console.log('LOADING');
                break;
            case cc.WebView.EventType.LOADED:
                console.log('LOADED');
                this.target = target;
                break;
            default:
                break;
        }
    }
});
