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

		observer.on("restart", this.restart, this)
	},

	postEvent() {
		customEvent("restart")
	},

	restart() {
		trigger(this.node, "restart")
	}

	// update (dt) {},
})
