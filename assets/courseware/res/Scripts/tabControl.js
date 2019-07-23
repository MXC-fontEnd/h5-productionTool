import postMessage from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {
		nodeArr: {
			type: [cc.Node],
			default: []
		},
		initIdx: 0
	},

	onLoad: function() {
		this.initialFrame()
		this.initialEvent()
	},
	// 初始化界面
	initialFrame() {
		this.tabSwitch({ uuid: this.node.name, idx: this.initIdx })
	},
	// 初始化事件
	initialEvent() {
		observer.on("tabSwitch", this.tabSwitch, this)
	},
	// 按钮点击事件
	tabClicked(e, idx) {
		this.tabChanged({ uuid: this.node.name, idx: +idx })
	},
	// tab切换事件广播
	tabChanged(data) {
		postMessage.customEvent("tabSwitch", data)
	},
	// tab切换
	tabSwitch(data) {
		const { uuid, idx } = data
		if (uuid === this.node.name) {
			this.nodeArr.forEach((item, i) => {
				if (item.active !== (i === idx)) {
					item.active = i === idx
				}
			})
		}
	},

	update: function(dt) {}
})
