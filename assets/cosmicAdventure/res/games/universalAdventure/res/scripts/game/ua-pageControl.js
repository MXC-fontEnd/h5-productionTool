/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:45:43
 * @LastEditTime: 2019-09-27 20:17:06
 * @LastEditors: Please set LastEditors
 */
const { createObserver } = require("ua-utils")

cc.Class({
	extends: cc.Component,

	properties: {
		complete: false,
		_zindex: 0,
		eventTag:""
	},

	onLoad() {
		if(window.messageProxy){
			window.messageProxy.on( this.eventTag, (data) => {
				switch (data.type) {
					case "GAME_COSMIC_ADVENTURE":
						const res = data.handleData
						if (res && res.isCustom) {
							const { type, data } = res
							observer.emit(type, data)
						}
						break;
					default:
						break;
				}
			})
		}

		createObserver()
		this.initialData()
		this.initialEvent()
		this.initialFrame()
	},
	
    onDestroy() {
        window.messageProxy.off(this.eventTag);
	},
	
	start() {},
	// 数据初始化
	initialData() {
		this.guideNode = this.node.getChildByName("guide")
		this.gameNode = this.node.getChildByName("game")
		this.gameoverNode = this.node.getChildByName("gameover")
		this.successNode = this.node.getChildByName("success")
		this.node.children.forEach(node => {
			// node._seq = this.node.getSiblingIndex()
			node._seq = +this.complete
			node._complete = this.complete
		})
	},
	// 事件初始化
	initialEvent() {
		this.node.on("gamestart", this.gamestart, this)
		this.node.on("gameover", this.gameover, this)
		this.node.on("gamewin", this.gamewin, this)
		this.node.on("restart", this.restart, this)
	},
	// 界面初始化
	initialFrame() {
		this.guideNode.active = true
		this.gameNode.active = false
		this.gameoverNode.active = false
		this.successNode.active = false
	},
	// 游戏开始
	gamestart() {
		this.gameNode.active = true
		this.guideNode.active = false
	},
	// 游戏结束
	gameover() {
		this.gameoverNode.active = true
		this.gameNode.active = false
	},
	// 游戏胜利
	gamewin() {
		this.successNode.active = true
		this.gameNode.active = false
	},
	// 重新开始
	restart() {
		this.initialFrame()
	}
	// update (dt) {},
})
