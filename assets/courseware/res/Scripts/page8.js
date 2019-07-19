
cc.Class({
	extends: cc.Component,

	properties: {

	},
	onLoad: function () {
		this.target = null;
		this.sortGarbageMessage = function (e) {
			console.log('father-sortGarbageMessage');
			console.log(e);
			if (typeof e.data !== 'string') return;
			var data = JSON.parse(e.data);
			if (data) {
				switch (data.method) {
					case 'onFileMessage':
						if (data.handleData && data.handleData.method === 'sortGarbage') {
							if (this.target) {
								this.target._impl._iframe.contentWindow.postMessage(
									JSON.stringify(data),
									'*'
								)
							}
						}
						break
					case 'sortGarbage':
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
		window.addEventListener("message", this.sortGarbageMessage, false);
	},

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
	},

	onDestroy() {
		window.removeEventListener('message', this.sortGarbageMessage);
	},

	update: function (dt) { },
})
