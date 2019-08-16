cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {},

	start() {},

	onEnable() {
		this.initialFrame()
	},

	initialFrame() {
		this.node.children.forEach(node =>
			node.getComponents(cc.Animation).forEach(ani => ani.play())
		)
	}

	// update (dt) {},
})
