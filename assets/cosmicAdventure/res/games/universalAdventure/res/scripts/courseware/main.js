const postMsg = require("../utils/postMsg")

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {
		postMsg.init({ pageCount: 1 })
	},

	start() {}

	// update (dt) {},
})
