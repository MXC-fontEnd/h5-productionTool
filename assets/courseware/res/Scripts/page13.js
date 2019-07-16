import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"

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
		this.postBoxChange()
		// trigger(this.node, "pagination_skip_req", { type: "skip", toPage: 13 })
	},
	// 初始化界面
	initialFrame() {
		this.questionNode.node.active = false
	},
	// 初始化事件
	initialEvent() {
		// 全局关闭弹窗
		this.node.on("mousedown", this.postCloseDialog, this)

		// postMessage接收处理
		observer.on("p13BoxChange", this.handleBoxChange, this)
		observer.on("p13OpenDialog", this.handleOpenDialog, this)
		observer.on("p13CloseDialog", this.handleCloseDialog, this)
	},
	// postMessage事件分发
	postBoxChange(e, data) {
		postMessage.customEvent("p13BoxChange", data)
	},
	postOpenDialog() {
		postMessage.customEvent("p13OpenDialog")
	},
	postCloseDialog() {
		postMessage.customEvent("p13CloseDialog")
	},
	// box切换
	handleBoxChange(i = 1) {
		this.boxNodes.forEach((box, idx) => {
			box.node.active = +i - 1 === idx
		})
	},
	// 打开问题弹窗
	handleOpenDialog(e) {
		console.log("open")
		this.questionNode.node.active = true
	},
	// 关闭问题弹窗
	handleCloseDialog() {
		console.log("close")
		this.questionNode.node.active = false
	},
	update: function(dt) {}
})
