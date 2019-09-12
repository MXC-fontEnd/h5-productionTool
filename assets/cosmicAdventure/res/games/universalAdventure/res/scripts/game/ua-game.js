const { trigger, createUUID, customEvent } = require("ua-utils")

cc.Class({
	extends: cc.Component,

	properties: {
		hero: cc.Prefab,
		prologue: cc.Prefab,
		bullet: cc.Prefab,
		bulletSpeed: 10,
		monster: [cc.Prefab],
		items: [cc.Prefab],
		itemsSpeed: 15,
		winScore: 30,
		audios: {
			type: cc.AudioClip,
			default: []
		},
		audioVolume: 0.5,
		_isHost: false,
		_bulletType: 1,
		_bulletPool: [],
		_monsterPool: [],
		_itemsPool: [],
		_start: false,
		_score: 0
	},

	onLoad() {
		this.initialData()
		this.initialFrame()
		this.initialEvent()
	},

	onEnable() {
		if (this.node._complete) {
			this.heroToStage()
		} else {
			this._start = true
		}
	},
	// 事件初始化
	initialEvent() {
		// PC端鼠标移动，人物移动；移动端鼠标点击，人物移动。
		this.node.on(cc.Node.EventType.MOUSE_MOVE, this.postEvent, this)
		this.node.on(cc.Node.EventType.TOUCH_START, this.postEvent, this)

		this.node.on("gain-items", this.gainItems, this)
		this.node.on("hit-monster", this.hitMonster, this)
		this.node.on("gameover", this.gameover, this)
		this._root.on("restart", this.restart, this)

		observer.on(
			"calibration-host-" + this.node._seq,
			this.calibrationHost,
			this
		)
		observer.on("hero-move-" + this.node._seq, this.heroMove, this)
		observer.on("hero-attack-" + this.node._seq, this.heroAttack, this)
		observer.on("create-monster-" + this.node._seq, this.monsterInvade, this)
		observer.on("create-items-" + this.node._seq, this.createItems, this)
	},
	// 数据初始化
	initialData() {
		this._root = cc.find("Canvas")
		this._uuid = createUUID()
		this._bgNode = this.node.getChildByName("bg")
		this._heroNode = this.node.getChildByName("hero")
		this._bulletNode = this.node.getChildByName("bullet")
		this._monsterNode = this.node.getChildByName("monster")
		this._itemsNode = this.node.getChildByName("items")
		this._scoreNode = this.node.getChildByName("score")
	},
	// 界面初始化
	initialFrame() {
		cc.director.getCollisionManager().enabled = true
		// cc.director.getCollisionManager().enabledDebugDraw = true
	},
	// 事件分发
	postEvent(e) {
		if (!this._isHost) {
			customEvent("calibration-host-" + this.node._seq, { uuid: this._uuid })
		}
		if (!this.node._complete) return
		switch (e.type) {
			case "mousemove":
				customEvent("hero-move-" + this.node._seq, {
					pos: this.node.convertToNodeSpace(e.getLocation())
				})
				break
			case "touchstart":
				customEvent("hero-attack-" + this.node._seq, {
					pos: this.node.convertToNodeSpace(e.getLocation()),
					colorRd: Math.random()
				})
				break
		}
	},
	// 校准身份
	calibrationHost(data) {
		this._isHost = this._uuid === data.uuid
	},
	// 英雄登场
	heroToStage() {
		if (this.hero) {
			// 创建英雄
			this._hero = cc.instantiate(this.hero)
			this._hero.setPosition(cc.v2(0, -300))
			this._hero._category = 3
			this._heroNode.addChild(this._hero)
			// 闪亮登场
			const scale = cc.scaleTo(0.5, this._hero.scale).easing(cc.easeBackOut()),
				cb = cc.callFunc(() => {
					this.heroPrologue()
				}),
				actionSequence = cc.sequence([scale, cb])
			this._hero.scale = 0.1
			this._hero.runAction(actionSequence)
		} else {
			console.log("这个世界怎能没有英雄")
		}
	},
	// 开场白
	heroPrologue() {
		if (this.prologue) {
			// 创建开场白
			this._prologue = cc.instantiate(this.prologue)
			this._heroNode.addChild(this._prologue)
			// 开场白显隐
			const scaleIn = cc.scaleTo(0.5, 1).easing(cc.easeBackOut()),
				scaleOut = cc.scaleTo(0.5, 0).easing(cc.easeBackIn()),
				cb1 = cc.callFunc(() => {
					setTimeout(() => {
						this._prologue.runAction(actionSequence2)
					}, 2000)
				}),
				cb2 = cc.callFunc(() => {
					this._prologue.active = false
					// 怪物来袭
					this._start = true
				}),
				actionSequence1 = cc.sequence([scaleIn, cb1]),
				actionSequence2 = cc.sequence([scaleOut, cb2])
			this._prologue.scale = 0
			this._prologue.runAction(actionSequence1)
		} else {
			console.log("这个英雄没有开场白呢")
		}
	},
	// 主机分发怪物信息
	postCreateMonster() {
		customEvent("create-monster-" + this.node._seq, {
			typeRd: Math.random(),
			xRd: Math.random()
		})
	},
	// 怪物入侵
	monsterInvade(info) {
		if (this.monster.length) {
			// 随机创建怪物
			const type = ~~(info.typeRd * this.monster.length),
				{ width, height } = this.node
			let monster = null
			// 缓存池检查
			for (let ms of this._monsterPool) {
				if (!ms.active && ms._type === type) {
					monster = ms
					break
				}
			}
			// 缓存池中没有则新建
			if (!monster) {
				monster = cc.instantiate(this.monster[type])
				monster._type = type
				monster._category = 2
				this._monsterNode.addChild(monster)
				this._monsterPool.push(monster)
			}
			// 定位
			monster.setPosition(
				cc.v2(
					(info.xRd - 0.5) * width,
					(monster.height * monster.scale) / 2 + height / 2
				)
			)
			// 怪物激活
			monster.active = true
			// 最新怪物记录
			this._lastMonster = monster
		} else {
			console.log("竟然没有怪物，英雄要失业咯")
		}
	},
	// 怪物移动
	monsterMove() {
		const { height } = this.node,
			activeMonsters = this._monsterPool.filter(ms => ms.active)

		for (let monster of activeMonsters) {
			monster.y -= 3
			// 激活判断
			if (monster.y + (monster.height * monster.scale) / 2 < -height / 2) {
				monster.active = false
			}
		}

		if (
			(!activeMonsters.length ||
				height / 2 - this._lastMonster.y > Math.random() * 50 + 100) &&
			this._isHost
		) {
			this.postCreateMonster()
		}
	},
	// 英雄移动
	heroMove(data) {
		if (!this._start) return

		const { x } = data.pos,
			{ width } = this.node

		this._hero.x = x - width / 2
	},
	// 英雄攻击
	heroAttack(data) {
		if (!this._start) return
		// 移动端没有hover事件，所以攻击前移动到相应位置
		this.heroMove(data)

		if (this.bullet) {
			// 创建子弹
			const deactiveBullets = this._bulletPool.filter(bt => !bt.active),
				createBullet = this.createBullet(deactiveBullets),
				initScale = this.bullet.data.scale,
				color = [65535, 65280, 255][~~(data.colorRd * 3)]
			let bullet = []

			if (this._bulletType === 1) {
				// 普通子弹
				bullet = createBullet(this.bullet, 1, this._bulletPool)
				bullet[0]._angle = 0
				bullet[0].scale = initScale
				bullet[0].color = cc.color(255, 255, 255)
				cc.audioEngine.play(this.audios[0], false, this.audioVolume)
			} else if (this._bulletType === 2) {
				// R弹
				bullet = createBullet(this.bullet, 1, this._bulletPool)
				bullet[0]._angle = 0
				bullet[0].scale = initScale * 1.5
				bullet[0].color = cc.color(color)
				cc.audioEngine.play(this.audios[2], false, this.audioVolume)
			} else if (this._bulletType === 3) {
				// S弹
				bullet = createBullet(this.bullet, 3, this._bulletPool)
				for (let i = 0; i < 3; i++) {
					bullet[i]._angle = (i - 1) * 20
					bullet[i].scale = initScale * 1.5
					bullet[i].color = cc.color(color)
				}
				cc.audioEngine.play(this.audios[1], false, this.audioVolume)
			}

			for (let bt of bullet) {
				bt.active = true
				bt.setPosition(this._hero.position)
			}
		} else {
			console.log("英雄没有武器没法消灭怪物哦")
		}
	},
	// 创建子弹
	createBullet(filterPool) {
		return (prefab, size, originPool) => {
			let arr = []
			for (let i = 0; i < size; i++) {
				if (filterPool[i]) {
					arr.push(filterPool[i])
				} else {
					let bullet = cc.instantiate(prefab)
					bullet._category = 1
					this._bulletNode.addChild(bullet)
					arr.push(bullet)
					originPool.push(bullet)
				}
			}
			return arr
		}
	},
	// 子弹移动
	bulletMove() {
		const { width, height } = this.node,
			activeBullets = this._bulletPool.filter(bt => bt.active)

		for (let bullet of activeBullets) {
			bullet.x += this.bulletSpeed * Math.sin((bullet._angle * Math.PI) / 180)
			bullet.y += this.bulletSpeed * Math.cos((bullet._angle * Math.PI) / 180)
			// 激活判断
			if (
				bullet.y - (bullet.height * bullet.scale) / 2 > height / 2 ||
				bullet.x + (bullet.width * bullet.scale) / 2 < -width / 2 ||
				bullet.x - (bullet.width * bullet.scale) / 2 > width / 2
			) {
				bullet.active = false
			}
		}
	},
	// 分发创建道具信息
	postCreateItems() {
		customEvent("create-items-" + this.node._seq, {
			typeRd: Math.random(),
			xRd: Math.random(),
			scaleRd: Math.random()
		})
	},
	// 创建道具
	createItems(info) {
		if (this.items.length) {
			// 生成道具
			const type = ~~(info.typeRd * this.items.length),
				{ width, height } = this.node,
				initScale = this.items[type].data.scale
			let items = null
			// 缓存池检查
			for (let it of this._itemsPool) {
				if (!it.active && it._type === type) {
					items = it
					break
				}
			}
			// 缓存池中没有则新建
			if (!items) {
				items = cc.instantiate(this.items[type])
				items._type = type
				items._category = 4
				this._itemsNode.addChild(items)
				this._itemsPool.push(items)
			}
			// 定位
			items.setPosition(
				cc.v2((info.xRd - 0.5) * width, items.height / 2 + height / 2)
			)
			items.scale = (info.scaleRd * 0.5 + 0.5) * initScale
			// 激活
			items.active = true
		} else {
			console.log("没有游戏道具哦")
		}
	},
	// 道具掉落
	itemsDrop() {
		const { height } = cc.winSize,
			activeItems = this._itemsPool.filter(it => it.active)

		for (let items of activeItems) {
			items.y -= this.itemsSpeed
			// 激活判断
			if (items.y + items.height / 2 < -height / 2) {
				items.active = false
			}
		}

		if (this._start && !this._itemsTimeout && this._isHost) {
			this._itemsTimeout = setTimeout(() => {
				this.postCreateItems()
				this._itemsTimeout = null
			}, Math.random() * 3000 + 2000)
		}
	},
	// 英雄获得道具
	gainItems(e) {
		const { type } = e.getUserData()
		this._bulletType = type + 2
		setTimeout(() => {
			this._bulletType = 1
		}, 1000)

		this._bgNode.getComponents(cc.Animation).forEach(ani => ani.play())
	},
	// 击中怪物
	hitMonster() {
		this._score += 1
		this.updateScore()
	},
	// 更新分数
	updateScore() {
		const label = this._scoreNode.children[0].getComponents(cc.Label)[0]
		label.string = this._score

		if (this._score >= this.winScore) {
			this._start = false
			trigger(this.node, "gamewin")
		}
	},
	// 游戏结束
	gameover() {
		this._start = false
	},
	// 重新开始
	restart() {
		this._start = false
		this._score = 0
		this.updateScore()
		this._monsterPool = []
		this._bulletPool = []
		this._itemsPool = []
		this._heroNode.destroyAllChildren()
		this._monsterNode.destroyAllChildren()
		this._bulletNode.destroyAllChildren()
		this._itemsNode.destroyAllChildren()

		if (this._itemsTimeout) {
			clearTimeout(this._itemsTimeout)
			this._itemsTimeout = null
		}
	},

	update(dt) {
		if (this._start) {
			this.monsterMove()
			this.bulletMove()
			this.itemsDrop()
		}
	}
})
