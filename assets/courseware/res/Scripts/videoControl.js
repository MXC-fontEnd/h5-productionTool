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
			// 每10s分发一次进度
			// this.interval = setInterval(() => {
			// 	postMessage.customEvent("videoProgress", this.videoPlayer.currentTime)
			// }, 10000)
			// postMessage监听
			// observer.on("videoProgress", this.currentVideoProgress, this)
		}
	},
	// 页面离开
	handlePageLeave(e) {
		const { prevPage } = e.getUserData()
		if (prevPage === this.node.pageNum) {
			this.videoNode.active = false
			// this.interval && clearInterval(this.interval)
			// postMessage注销
			// observer.off("videoProgress", this.currentVideoProgress, this)
		}
	},
	// 视频状态监测
	videoStatusChanged(event, status) {
		if (status === cc.VideoPlayer.EventType.COMPLETED) {
			// 播放完成自动跳转下一页
			trigger(this.node, "pagination_skip_req", { type: "next" })
		}
	},
	// 视频进度比对（10s一次，纠正范围±5s）
	currentVideoProgress(time) {
		const curTime = this.videoPlayer.currentTime
		if (Math.abs(time - curTime) >= 5) {
			this.videoPlayer.currentTime = time
			console.log(`视频进度纠正：${curTime}->${time}`)
		}
	},
	update: function(dt) {}
})
