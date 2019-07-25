import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"

cc.Class({
	extends: cc.Component,

	properties: {},
	onLoad: function() {
		this.initialFrame()
		this.initialEvent()
	},
	// 初始化界面
	initialFrame() {
		this.root = cc.find("Canvas")
		this.pageRoot = this.node.parent
		this.videoNode = this.node.getChildByName("video")

		// this.videoPlayer = this.videoNode.getComponent(cc.VideoPlayer)
	},
	// 事件初始化
	initialEvent() {
		// 监听页面进入执行初始化
		this.root.on("pagination_enter", this.handlePageEnter, this)
		this.root.on("pagination_leave", this.handlePageLeave, this)
		// 视频点击监听
		this.videoNode.on("clicked", this.handleVideoClicked, this)
	},
	// 页面进入
	handlePageEnter(e) {
		const { curPage } = e.getUserData()
		if (curPage === this.pageRoot.pageNum) {
			// 进入自动开始播放
			console.log("再次播放")
			this.videoPlayer && this.videoPlayer.play()
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
		if (prevPage === this.pageRoot.pageNum) {
			this.videoPlayer.stop()
			// this.videoNode.active = false
			// this.interval && clearInterval(this.interval)
			// postMessage注销
			// observer.off("videoProgress", this.currentVideoProgress, this)
		}
	},
	// 视频状态监测
	videoStatusChanged(videoplayer, status) {
		switch (status) {
			case cc.VideoPlayer.EventType.COMPLETED:
				// 播放完成自动跳转下一页
				this.skipPage(1)
				break
			case cc.VideoPlayer.EventType.READY_TO_PLAY:
				console.log("初次加载播放")
				this.videoPlayer = videoplayer
				if (this.pageRoot.active) {
					this.videoPlayer.play()
				}
				break
			default:
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
	// 视频点击事件处理
	handleVideoClicked(e) {
		if (this._timestamp && Date.now() - this._timestamp < 200) {
			// 双击事件
			console.log("double click")
			this._timestamp = 0
			this._timeout && clearTimeout(this._timeout)
			// 跳转上一页
			this.skipPage(-1)
		} else {
			this._timestamp = Date.now()
			this._timeout = setTimeout(() => {
				// 单击事件
				console.log("singer click")
				// 跳转下一页
				this.skipPage(1)
			}, 200)
		}
	},
	skipPage(offset) {
		trigger(this.pageRoot, "pagination_skip_req", {
			type: "skip",
			toPage: this.pageRoot.pageNum + offset
		})
	},
	update: function(dt) {}
})
