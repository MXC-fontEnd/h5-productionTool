import { trigger } from "../../utils"

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
		},
		_useCamera: true,
		useCamera: {
			get() {
				return this._useCamera
			},
			set(v) {
				if (this._useCamera === v) return
				this._useCamera = v
				this.movingNode = v ? this.pageCamera : this.node
			}
		},
		isSimple: true
	},
	onLoad: function() {
		this.initialFrame()
		this.initialEvent()
	},
	// 初始化界面
	initialFrame() {
		const size = this.root.getContentSize()
		this.rootSize = size
		// 页面初始化
		const childs = this.node.children
			.filter(node => {
				// 高低龄页面过滤
				return !(this.isSimple ? /complex/ : /simple/).test(node.name)
			})
			.map((node, idx) => {
				// 位置初始化
				node.active = idx === 0
				node.x = size.width * idx
				node.y = 0
				node.pageNum = idx + 1
				// 过滤高低龄内容
				let simpleNode = node.getChildByName("simple"),
					complexNode = node.getChildByName("complex")
				if (this.isSimple) {
					complexNode && (complexNode.active = false)
				} else {
					simpleNode && (simpleNode.active = false)
				}
				return node
			})

		this._childs = childs

		this.node._childNum = childs.length
		// 初始化切换方式
		this.movingNode = this.useCamera ? this.pageCamera : this.node
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
			{ curPage, prevPage } = data
		// 离开页面事件分发
		trigger(this.node, "pagination_leave", data)
		this._childs[prevPage - 1].active = false
		// 无动画版
		this.node.position = cc.v2(
			this.rootSize.width * (curPage - 1) * (this.useCamera ? 1 : -1),
			0
		)
		// 进入页面事件分发
		this._childs[curPage - 1].active = true
		trigger(this.node, "pagination_enter", data)
	},
	// toggle切换
	useCameraChanged(toggle) {
		this.useCamera = toggle.isChecked
	},
	update: function(dt) {}
})
