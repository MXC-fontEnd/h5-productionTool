const { createObserver } = require("ua-utils")

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		createObserver()
		this.initialData()
		this.initialEvent()
		this.initialFrame()
	},

	start() {},
	// 数据初始化
	initialData() {
		this.guideNode = this.node.getChildByName("guide")
		this.gameNode = this.node.getChildByName("game")
		this.gameoverNode = this.node.getChildByName("gameover")
		this.successNode = this.node.getChildByName("success")
	},
	// 事件初始化
	initialEvent() {
		this.node.on("gamestart", this.gamestart, this)
		this.node.on("gameover", this.gameover, this)
		this.node.on("gamewin", this.gamewin, this)
		this.node.on("restart", this.restart, this)
	},
	// 界面初始化
	initialFrame() {
		this.guideNode.active = true
		this.gameNode.active = false
		this.gameoverNode.active = false
		this.successNode.active = false
	},
	// 游戏开始
	gamestart() {
		this.gameNode.active = true
		this.guideNode.active = false
	},
	// 游戏结束
	gameover() {
		this.gameoverNode.active = true
		this.gameNode.active = false
	},
	// 游戏胜利
	gamewin() {
		this.successNode.active = true
		this.gameNode.active = false
	},
	// 重新开始
	restart() {
		this.initialFrame()
	}
	// update (dt) {},
})
