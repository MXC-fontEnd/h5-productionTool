const { trigger, customEvent } = require("ua-utils")

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		this.initialEvent()
	},

	start() {},
	// 事件初始化
	initialEvent() {
		this.node.getChildByName("guide-btn").on("touchstart", this.postEvent, this)
		observer.on("ua-guide-" + this.node._seq, this.gamestart, this)
	},
	// 事件发送
	postEvent() {
		customEvent("ua-guide-" + this.node._seq)
	},
	// 开始游戏
	gamestart() {
		trigger(this.node, "gamestart")
	}

	// update (dt) {},
})
