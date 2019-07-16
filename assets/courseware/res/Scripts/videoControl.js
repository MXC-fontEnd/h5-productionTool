import { trigger } from "../../utils"

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
		this.videoNode = this.node.getChildByName("video")
		this.videoPlayer = this.videoNode.getComponent(cc.VideoPlayer)

		this.videoNode.active = false
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
			this.videoNode.active = true
			// 进入自动开始播放
			this.videoPlayer.play()
		}
	},
	// 页面离开
	handlePageLeave(e) {
		const { prevPage } = e.getUserData()
		if (prevPage === this.node.pageNum) {
			this.videoNode.active = false
		}
	},
	// 视频状态监测
	videoStatusChanged(event, status) {
		if (status === cc.VideoPlayer.EventType.COMPLETED) {
			// 播放完成自动跳转下一页
			trigger(this.node, "pagination_skip_req", { type: "next" })
		}
	},
	update: function(dt) {}
})
