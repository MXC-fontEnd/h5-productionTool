import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {},
	onLoad: function() {
		this.initialData()
		this.initialFrame()
		this.initialEvent()
	},
	start() {
		// trigger(this.node, "pagination_skip_req", { type: "skip", toPage: 12 })
	},
	// 初始化数据
	initialData() {
		this.root = cc.find("Canvas")
		this.pageRoot = this.node.parent
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
			step.before.on(cc.Node.EventType.TOUCH_START, this.postPreview, this)
			step.after.on(cc.Node.EventType.TOUCH_START, this.postPreview, this)
			step.preview.on(
				cc.Node.EventType.TOUCH_START,
				this.postPreviewClose,
				this
			)
			step.category.on(
				cc.Node.EventType.TOUCH_START,
				this.postCategoryCheck,
				this
			)
		})
		this.pageRoot.on(cc.Node.EventType.TOUCH_START, this.postPreviewClose, this)

		// postMessage接收处理
		observer.on("p12Preview", this.handlePreview, this)
		observer.on("p12PreviewClose", this.handlePreviewClose, this)
		observer.on("p12CategoryCheck", this.handleCategoryCheck, this)
	},
	// postMessage事件分发
	postPreview(e) {
		if (this.actionLock) return
		// 打开预览
		postMessage.customEvent("p12Preview", e.target.name)
	},
	postPreviewClose() {
		if (this.actionLock) return
		// 关闭预览
		postMessage.customEvent("p12PreviewClose")
	},
	postCategoryCheck(e) {
		e.stopPropagation()
		if (this.actionLock) return
		// 查看类别
		postMessage.customEvent("p12CategoryCheck")
	},
	// 预览
	handlePreview(name) {
		console.log("preview")

		const numMatch = name.match(/step(\d+)/),
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
	handleCategoryCheck() {
		console.log("category")

		this.curStep.category.active = false
	},
	// 关闭预览
	handlePreviewClose() {
		console.log("close")

		if (this.curStep && this.curStep.preview.active) {
			// 收起效果
			this.closeAction()
		}
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
