import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {
		root: {
			default: null,
			type: cc.Node
		},
		pageRoot: {
			default: null,
			type: cc.Node
		},
		prevBtn: {
			default: null,
			type: cc.Sprite
		},
		nextBtn: {
			default: null,
			type: cc.Sprite
		},
		curIpt: {
			default: null,
			type: cc.EditBox
		},
		curPage: 1,
		totalPage: 1,
		opacity: 100
	},
	onLoad: function() {
		this.initialData()
		this.initialFrame()
		this.initialEvent()
	},
	// 数据初始化
	initialData() {
		this.totalPage = this.pageRoot.children.length
		this.updatePage()
	},
	// 界面初始化
	initialFrame() {
		// 初始化postMessage
		postMessage.init({
			pageCount: this.totalPage
		})
		// editbox输入时居中
		this.curIpt._impl._edTxt.style["text-align"] = "center"
		// 界面淡化
		this.handleMouseLeave()
	},
	// 事件初始化
	initialEvent() {
		this.root.on("pagination_skip_req", this.handleSkipReq, this)
		// 组件显隐控制
		this.node.on("mouseenter", this.handleMouseEnter, this)
		this.node.on("mouseleave", this.handleMouseLeave, this)
		// 前后页按钮绑定事件就会和父组件的事件冲突，所以给它们也绑定下
		this.prevBtn.node.on("mouseenter", this.handleMouseEnter, this)
		this.nextBtn.node.on("mouseenter", this.handleMouseEnter, this)
		// mouseleave事件偶尔失灵，补救措施全局绑定mousemove
		this.root.on("mousemove", this.handleMouseLeave, this)
		// 翻页事件
		this.prevBtn.node.on("mousedown", this.handlePrevPage, this)
		this.nextBtn.node.on("mousedown", this.handleNextPage, this)
		this.curIpt.node.on("editing-return", this.handleSkipPage, this)
		// 观察者监听跳页事件
		observer.on("jumpPage", this.postMsgSkip, this)
	},
	// 卸载事件
	unmountEvent() {
		this.root.off("pagination_skip_req", this.handleSkipReq, this)
		this.node.off("mouseenter", this.handleMouseEnter, this)
		this.node.off("mouseleave", this.handleMouseLeave, this)
		this.prevBtn.node.off("mousedown", this.handlePrevPage, this)
		this.nextBtn.node.off("mousedown", this.handleNextPage, this)
		this.curIpt.node.off("editing-return", this.handleSkipPage, this)
	},
	// 鼠标移入事件
	handleMouseEnter() {
		this.node.opacity = 255
	},
	// 鼠标移出事件
	handleMouseLeave() {
		this.node.opacity = this.opacity
	},
	// 上一页事件
	handlePrevPage() {
		if (this.curPage <= 1) return
		this.distributeEvent({
			type: "prev",
			prevPage: this.curPage,
			curPage: this.curPage - 1
		})
	},
	// 下一页事件
	handleNextPage() {
		if (this.curPage >= this.totalPage) return
		this.distributeEvent({
			type: "next",
			prevPage: this.curPage,
			curPage: this.curPage + 1
		})
	},
	// 跳页事件
	handleSkipPage(e) {
		let num = e.string >> 0
		if (num === this.curPage) return
		if (num < 1) {
			num = 1
		} else if (num > this.totalPage) {
			num = this.totalPage
		}
		this.distributeEvent({
			type: "skip",
			prevPage: this.curPage,
			curPage: num
		})
	},
	// 事件分发
	distributeEvent(data) {
		// postmessage广播
		postMessage.jumpPage(data.curPage)
	},
	// 更新页码
	updatePage() {
		this.curIpt.string = this.curPage + "/" + this.totalPage
	},
	// 外部请求页面跳转事件
	handleSkipReq(e) {
		const { toPage } = e.getUserData(),
			page = Math.min(Math.max(toPage, 1), this.totalPage)
		this.postMsgSkip(page)
	},
	// postMessage跳页包装
	postMsgSkip(page) {
		// 分发
		trigger(this.node, "pagination_change", {
			type: "skip",
			prevPage: this.curPage,
			curPage: page
		})
		// 更新
		this.curPage = page
		this.updatePage()
		// this.handleSkipPage({ string: String(page) })
	},
	update: function(dt) {}
})
