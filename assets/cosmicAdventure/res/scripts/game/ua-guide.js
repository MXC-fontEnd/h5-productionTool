const { trigger } = require("ua-index")

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		this.initialEvent()
	},

	start() {},
	// 事件初始化
	initialEvent() {
		this.node.getChildByName("guide-btn").on("touchstart", this.gamestart, this)
	},
	// 开始游戏
	gamestart() {
		trigger(this.node, "gamestart")
	}

	// update (dt) {},
})
