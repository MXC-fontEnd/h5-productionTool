import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {
		root: {
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
		this.webnode = this.node.getChildByName("webview")
		this.webview = this.videoNode.getComponent(cc.WebView)

		this.webnode.active = false
	},
	// 事件初始化
	initialEvent() {
		// 监听页面进入执行初始化
		this.root.on("pagination_enter", this.handlePageEnter, this)
		this.root.on("pagination_leave", this.handlePageLeave, this)
	},
	// 卸载事件
	unmountEvent() {
		this.root.off("pagination_enter", this.handlePageEnter, this)
		this.root.off("pagination_leave", this.handlePageLeave, this)
	},
	// 页面进入
	handlePageEnter(e) {
		const { curPage } = e.getUserData()
		if (curPage === this.node.pageNum) {
			this.webnode.active = true
		}
	},
	// 页面离开
	handlePageLeave(e) {
		const { prevPage } = e.getUserData()
		if (prevPage === this.node.pageNum) {
			this.webnode.active = false
		}
	},
	update: function(dt) {}
})
