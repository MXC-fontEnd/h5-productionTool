// 派送自定义事件
export function trigger(node, name, data, bubbles = true) {
	if (node) {
		let event = new cc.Event.EventCustom(name, bubbles)
		event.setUserData(data)
		node.dispatchEvent(event)
	}
}
