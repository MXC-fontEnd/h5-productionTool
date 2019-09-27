/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:45:43
 * @LastEditTime: 2019-09-27 20:18:37
 * @LastEditors: Please set LastEditors
 */
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
		window.observer.on("ua-guide-" + this.node._seq, this.gamestart, this)
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
