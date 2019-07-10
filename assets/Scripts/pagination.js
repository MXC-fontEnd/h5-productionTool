cc.Class({
	extends: cc.Component,

	properties: {
		pageRoot: {
			default: null,
			type: cc.Node
		},
		prevBtn: {
			default: null,
			type: cc.Button
		},
		nextBtn: {
			default: null,
			type: cc.Button
		},
		curIpt: {
			default: null,
			type: cc.EditBox
		},
		curPage: 1,
		totalPage: 1
	},
	onLoad: function() {
		this.initialData()
		this.initialEvent()
		this.updatePage()
	},
	// 数据初始化
	initialData() {
		this.totalPage = this.pageRoot.children.length
	},
	// 事件初始化
	initialEvent() {
		this.prevBtn.node.on("click", this.handlePrevPage, this)
		this.nextBtn.node.on("click", this.handleNextPage, this)
		this.curIpt.node.on("editing-return", this.handleSkipPage, this)
	},
	// 卸载事件
	unmountEvent() {
		this.prevBtn.node.off("click", this.handlePrevPage, this)
		this.nextBtn.node.off("click", this.handleNextPage, this)
		this.curIpt.node.off("editing-return", this.handleSkipPage, this)
	},
	// 上一页事件
	handlePrevPage() {
		if (this.curPage <= 1) return
		this.curPage -= 1
		this.updatePage()
		this.trigger(this.prevBtn.node, "pagination_change", {
			type: "prev",
			curPage: this.curPage
		})
	},
	// 下一页事件
	handleNextPage() {
		if (this.curPage >= this.totalPage) return
		this.curPage += 1
		this.updatePage()
		this.trigger(this.nextBtn.node, "pagination_change", {
			type: "next",
			curPage: this.curPage
		})
	},
	// 跳页事件
	handleSkipPage(e) {
		const num = e.string >> 0
		if (num === this.curPage) return
		if (num < 1) {
			this.curPage = 1
		} else if (num > this.totalPage) {
			this.curPage = this.totalPage
		} else {
			this.curPage = num
		}
		this.updatePage()
		this.trigger(this.curIpt.node, "pagination_change", {
			type: "skip",
			curPage: this.curPage
		})
	},
	// 更新页码
	updatePage() {
		this.curIpt.string = this.curPage
	},
	// 派送自定义事件
	trigger(node, name, data, bubbles = true) {
		if (node) {
			let event = new cc.Event.EventCustom(name, bubbles)
			event.setUserData(data)
			node.dispatchEvent(event)
		}
	},
	update: function(dt) {}
})
