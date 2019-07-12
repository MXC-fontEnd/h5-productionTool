import { trigger } from "../../common/utils"

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
		// editbox输入时居中
		this.curIpt._impl._edTxt.style["text-align"] = "center"
		// 界面淡化
		// this.handleMouseLeave()
	},
	// 事件初始化
	initialEvent() {
		this.root.on("pagination_skip_req", this.handleSkipReq, this)
		// this.node.on("mouseenter", this.handleMouseEnter, this)
		// this.node.on("mouseleave", this.handleMouseLeave, this)
		this.node.on("mousedown", this.handleNodeEvent, this)
		this.prevBtn.node.on("mousedown", this.handlePrevPage, this)
		this.nextBtn.node.on("mousedown", this.handleNextPage, this)
		this.curIpt.node.on("editing-return", this.handleSkipPage, this)
	},
	// 卸载事件
	unmountEvent() {
		this.root.off("pagination_skip_req", this.handleSkipReq, this)
		// this.node.off("mouseenter", this.handleMouseEnter, this)
		// this.node.off("mouseleave", this.handleMouseLeave, this)
		this.node.off("mousedown", this.handleNodeEvent, this)
		this.prevBtn.node.off("mousedown", this.handlePrevPage, this)
		this.nextBtn.node.off("mousedown", this.handleNextPage, this)
		this.curIpt.node.off("editing-return", this.handleSkipPage, this)
	},
	// 父节点事件
	handleNodeEvent(e) {
		e.stopPropagation()
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
		// 分发
		trigger(this.node, "pagination_change", data)
		// 更新
		this.curPage = data.curPage
		this.updatePage()
	},
	// 更新页码
	updatePage() {
		this.curIpt.string = this.curPage + "/" + this.totalPage
	},
	// 外部请求页面跳转事件
	handleSkipReq(e) {
		const { type, toPage } = e.getUserData()
		switch (type) {
			case "prev":
				this.handlePrevPage()
				break
			case "next":
				this.handleNextPage()
				break
			case "skip":
				this.handleSkipPage({ string: String(toPage) })
				break
			default:
		}
	},
	update: function(dt) {}
})
