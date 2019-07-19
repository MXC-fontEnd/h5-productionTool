import { createObserver } from "../../utils"

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad: function() {
		// 创建观察者
		createObserver()
		console.log("1")
	},

	update: function(dt) {}
})
