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

module.exports = { trigger: trigger, createObserver: createObserver }
