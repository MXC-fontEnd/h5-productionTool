/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:45:43
 * @LastEditTime: 2019-09-27 20:17:59
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

	initialEvent() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.postEvent, this)

		window.observer.on("restart-" + this.node._seq, this.restart, this)
	},

	postEvent() {
		customEvent("restart-" + this.node._seq)
	},

	restart() {
		trigger(this.node, "restart")
	}

	// update (dt) {},
})
