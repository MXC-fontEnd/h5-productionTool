import { trigger } from "../../common/utils"

cc.Class({
	extends: cc.Component,

	properties: {
		root: {
			default: null,
			type: cc.Node
		},
		boxNodes: {
			default: [],
			type: [cc.Sprite]
		},
		questionNode: {
			default: null,
			type: cc.Sprite
		}
	},
	onLoad: function() {
		this.initialFrame()
		this.initialEvent()
	},
	start() {
		// trigger(this.node, "pagination_skip_req", { type: "skip", toPage: 13 })
	},
	// 初始化界面
	initialFrame() {
		this.questionNode.node.active = false
		this.handleBoxChange()
	},
	// 初始化事件
	initialEvent() {
		this.node.on("mousedown", this.closeQuestionDialog, this)
	},
	// box切换
	handleBoxChange(e, i = 1) {
		this.boxNodes.forEach((box, idx) => {
			box.node.active = +i - 1 === idx
		})
	},
	// 关闭问题弹窗
	closeQuestionDialog() {
		console.log("close")
		this.questionNode.node.active = false
	},
	// 打开问题弹窗
	openQuestionDialog(e) {
		console.log("open")
		this.questionNode.node.active = true
	},
	update: function(dt) {}
})
