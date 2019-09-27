/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 16:45:43
 * @LastEditTime: 2019-09-27 15:47:58
 * @LastEditors: Please set LastEditors
 */
// 派送自定义事件
function trigger(node, name, data, bubbles = true) {
	if (node) {
		let event = new cc.Event.EventCustom(name, bubbles)
		event.setUserData(data)
		node.dispatchEvent(event)
	}
}
// 添加观察者
function createObserver() {
	if (window && !window.observer) {
		window.observer = {
			on(type, cb, self) {
				if (!this.handlers) {
					this.handlers = {}
				}
				if (!this.handlers[type]) {
					this.handlers[type] = []
				}
				this.handlers[type].push({
					self,
					cb
				})
			},
			off(type, cb, self) {
				if (this.handlers && Array.isArray(this.handlers[type])) {
					this.handlers[type] = this.handlers[type].filter(
						item => item.self !== self && item.cb !== cb
					)
				}
			},
			emit(type, ...args) {
				if (this.handlers && Array.isArray(this.handlers[type])) {
					for (let item of this.handlers[type]) {
						if (typeof item.cb === "function") {
							try {
								item.cb.apply(item.self, args)
							} catch (err) {
								console.log(err)
							}
						}
					}
				}
			}
		}
	}
}
// 创建UUID
function createUUID() {
	return Math.random()
		.toString(16)
		.substr(2)
}
// 发送自定义事件
function customEvent(type, data) {
	window.parent.postMessage(
		JSON.stringify({
			type: "GAME_COSMIC_ADVENTURE",
			handleData: {
				isCustom: true,
				type,
				data
			}
		}),
		"*"
	)
	// onFileMessage事件第三方不会分发到本地，所以主动做本地分发
	observer.emit(type, data)
}

module.exports = { trigger, createObserver, createUUID, customEvent }
