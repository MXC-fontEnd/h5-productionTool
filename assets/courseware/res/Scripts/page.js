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
			node.y = 0
			node.pageNum = idx + 1
		})
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
			{ curPage } = data,
			moveIn = cc
				.moveTo(
					0.6,
					cc.v2(
						this.rootSize.width * (curPage - 1) * (this.useCamera ? 1 : -1),
						0
					)
				)
				.easing(cc.easeCubicActionOut()),
			cb = cc.callFunc(() => {
				// 进入页面事件分发
				trigger(this.node, "pagination_enter", data)
			}),
			actionSequence = cc.sequence([moveIn, cb])
		// 离开页面事件分发
		trigger(this.node, "pagination_leave", data)
		// 结束上一个action序列
		if (this.actionSequence) {
			this.movingNode.stopAction(this.actionSequence)
		}
		// 缓存action序列
		this.actionSequence = actionSequence
		// 开始新的action序列
		this.movingNode.runAction(actionSequence)
	},
	// toggle切换
	useCameraChanged(toggle) {
		this.useCamera = toggle.isChecked
	},
	update: function(dt) {}
})
