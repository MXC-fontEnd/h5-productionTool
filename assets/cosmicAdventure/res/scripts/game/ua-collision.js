const { trigger } = require("ua-index")

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad() {},

	start() {},

	onCollisionEnter(other, self) {
		// groupIndex:1->bullet、2->monster、3->hero、4->items
		const otherIdx = other.node._category,
			selfIdx = self.node._category

		if (selfIdx === 1 && otherIdx === 2) {
			// 子弹击中怪物
			self.node.active = false
			other.node.active = false
			trigger(this.node, "hit-monster")
		} else if (selfIdx === 2 && otherIdx === 3) {
			// 怪物集中英雄
			trigger(this.node, "gameover")
		} else if (selfIdx === 3 && otherIdx === 4) {
			// 英雄吃到道具
			other.node.active = false
			trigger(this.node, "gain-items", { type: other.node._type })
		}
	}

	// update (dt) {},
})
