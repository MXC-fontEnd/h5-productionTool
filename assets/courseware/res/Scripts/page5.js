import { trigger } from "../../utils"
import postMessage from "../../utils/postMsg"
// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		// foo: {
		//     // ATTRIBUTES:
		//     default: null,        // The default value will be used only when the component attaching
		//                           // to a node for the first time
		//     type: cc.SpriteFrame, // optional, default is typeof default
		//     serializable: true,   // optional, default is true
		// },
		// bar: {
		//     get () {
		//         return this._bar;
		//     },
		//     set (value) {
		//         this._bar = value;
		//     }
		// },
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.initialFrame()
		this.initialEvent()
	},

	// 初始化界面
	initialFrame() {
		this.root = cc.find("Canvas")
		this.pageRoot = this.node.parent
		const node = this.node.getChildByName("pagefly")
		this.ske = node.getComponent(sp.Skeleton)
		this.btn = this.node.getChildByName("p5-button")
	},
	// 事件初始化
	initialEvent() {
		// 监听页面进入执行初始化
		this.root.on("pagination_enter", this.handlePageEnter, this)
		this.root.on("pagination_leave", this.handlePageLeave, this)
		this.ske.setCompleteListener(this.playComplete.bind(this))
		this.btn.on("mousedown", this.postEvent, this)
		observer.on("p5SendEmail", this.sendMail, this)
	},

	handlePageEnter() {},
	handlePageLeave() {
		this.btn.active = true
		this.ske.clearTracks()
		this.ske.setToSetupPose()
	},

	postEvent() {
		postMessage.customEvent("p5SendEmail")
	},

	sendMail() {
		this.btn.active = false
		this.ske.setAnimation(0, "animation", false)
	},

	playComplete() {
		trigger(this.pageRoot, "pagination_skip_req", {
			type: "skip",
			toPage: this.pageRoot.pageNum + 1
		})
	}

	// update (dt) {},
})
