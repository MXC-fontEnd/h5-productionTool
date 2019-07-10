cc.Class({
	extends: cc.Component,

	properties: {
		root: {
			default: null,
			type: cc.Node
		},
		pageCamera: {
			default: null,
			type: cc.Node
		}
	},
	onLoad: function() {
		this.initialFrame()
		this.initialEvent()
	},
	// 初始化界面
	initialFrame() {
		const size = this.root.getContentSize()
		this.rootSize = size
		// 每页位置初始化
		this.node.children.forEach((node, idx) => {
			node.x = size.width * idx
		})
	},
	// 事件初始化
	initialEvent() {
		// 分页事件
		this.root.on("pagination_change", this.handlePageChange, this)
	},
	// 卸载事件
	unmountEvent() {
		this.root.off("pagination_change", this.handlePageChange, this)
	},
	// 翻页
	handlePageChange(e) {
		let data = e.getUserData(),
			{ curPage } = data

		this.pageCamera.x = this.rootSize.width * (curPage - 1)
	},
	update: function(dt) {}
})
