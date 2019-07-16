import { trigger } from "../../utils"
import { customEvent } from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {
		root: {
			default: null,
			type: cc.Node
		}
	},
	onLoad: function() {
		this.initialData()
		this.initialFrame()
		this.initialEvent()
	},
	start() {
		trigger(this.node, "pagination_skip_req", { type: "skip", toPage: 12 })
	},
	// 初始化数据
	initialData() {
		this.stepNodes = []
		for (let i = 1; i < 5; i++) {
			this.stepNodes.push({
				before: this.node.getChildByName(`p12-step${i}`),
				after: this.node.getChildByName(`p12-step${i}-a`),
				preview: this.node.getChildByName(`p12-step${i}-b`),
				category: this.node
					.getChildByName(`p12-step${i}-b`)
					.getChildByName(`p12-step${i}-bt`),
				checked: false
			})
		}
	},
	// 初始化界面
	initialFrame() {
		this.stepNodes.forEach(step => {
			step.after.active = false
			step.preview.active = false
		})
	},
	// 事件初始化
	initialEvent() {
		this.stepNodes.forEach(step => {
			step.before.on("mousedown", this.handlePreview, this)
			step.after.on("mousedown", this.handlePreview, this)
			step.preview.on("mousedown", this.handlePreviewClose, this)
			step.category.on("mousedown", this.handleCategoryCheck, this)
		})
		this.node.on("mousedown", this.handlePreviewClose, this)
	},
	// 卸载事件
	unmountEvent() {},
	// 预览
	handlePreview(e) {
		console.log("preview")
		if (this.actionLock) return

		const numMatch = e.target.name.match(/step(\d+)/),
			num = numMatch ? numMatch[1] : 0,
			step = this.stepNodes[num - 1]
		if (!step) return
		this.curStep = step
		step.preview.active = true
		if (step.checked && step.category.active) {
			step.category.active = false
		} else {
			step.checked = true
		}
		// 展开效果
		this.openAction()
	},
	// 查看类别
	handleCategoryCheck(e) {
		console.log("category")
		e.stopPropagation()
		if (this.actionLock) return

		this.curStep.category.active = false
	},
	// 关闭预览
	handlePreviewClose(e) {
		console.log("close")
		if (this.actionLock) return

		// 收起效果
		this.closeAction()
	},
	openAction() {
		if (!this.curStep) return
		const node = this.curStep.preview,
			scale = cc.scaleTo(0.5, 1).easing(cc.easeBackOut()),
			cb = cc.callFunc(() => {
				this.actionLock = false
				this.curStep.before.active = false
				this.curStep.after.active = true
			}),
			actionSequence = cc.sequence([scale, cb])

		this.actionLock = true
		node.scale = 0
		node.runAction(actionSequence)
	},
	closeAction() {
		if (!this.curStep) return
		const node = this.curStep.preview,
			scale = cc.scaleTo(0.5, 0).easing(cc.easeBackIn()),
			cb = cc.callFunc(() => {
				this.actionLock = false
				this.curStep.preview.active = false
			}),
			actionSequence = cc.sequence([scale, cb])

		this.actionLock = true
		node.scale = 1
		node.runAction(actionSequence)
	},
	update: function(dt) {}
})
