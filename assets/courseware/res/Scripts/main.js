cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad: function() {
		if (window.top === window.self) {
			const node = new cc.Node()
			node.name = "frame"
			node.width = 480
			node.height = 270
			node.x = -240
			node.y = 135
			const webview = node.addComponent(cc.WebView)
			webview.url = window.location.href
			this.node.addChild(node)
		}
	},

	update: function(dt) {}
})
