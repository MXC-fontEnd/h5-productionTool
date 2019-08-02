
cc.Class({
    extends: cc.Component,

    properties: {
        highAge: true,
        complete: true,

        moveSpeed: 40,
        mxc: {
            default: null,
            type: cc.Node,
            displayName: '秒小程'
        },

        mxcAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            displayName: '秒小程图集'
        },

        upStreet: {
            default: null,
            type: cc.Node,
            displayName: '滚动的背景'
        },

        trashPrefabs: {
            default: [],
            type: [cc.Prefab],
            displayName: '垃圾预制板'
        },

        scoreText: {
            default: null,
            type: cc.Label,
            displayName: '得分栏'
        },

        trashBarrels: {
            default: [],
            type: [sp.Skeleton],
            displayName: '垃圾桶列表'
        },

        otherBg: {
            default: null,
            type: cc.SpriteFrame,
            displayName: '其他的背景'
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // spine命名不规范适配
        this.ljtSpineList = {
            glj: {
                name: 'jojo',
                open: 'jojo-open',
                happy: 'jojo-happy',
                sad: 'jojo-sad',
                kwy: 'jojo-standby',
                stop: 'jojo-stop',
            },
            slj: {
                name: 'green',
                open: 'open',
                happy: 'green-happy',
                sad: 'green-sad',
                kwy: 'green-standby',
                stop: 'stop',
            },
            khslj: {
                name: 'omostandby',
                open: 'open',
                happy: 'omo-happy',
                sad: 'omo-sad',
                kwy: 'omostandby',
                stop: 'stop',
            },
            ydlj: {
                name: 'sjiangjun',
                open: 's-open',
                happy: 's-happy',
                sad: 's-sad',
                kwy: 's-standby',
                stop: 's-stop',
            },
        };

        // 收集垃圾成功，摧毁之
        this.node.on('detroyTrash', this._detroyTrash, this);
        this.intro = this.node.getChildByName('intro');
        this.startGame = this.node.getChildByName('startGame');
        this.ship = this.node.getChildByName('ship');
        this.mxc.runAction(cc.hide());
        this.scrollBgState = false;
        this.trashSeq = 0;
        
        this.initGame = function() {
            this.intro.active = true;
            this.startGame.active = true;
            let ans = this.mxc.getComponent(cc.Animation);
            ans.play('stand');
            let act2 = cc.moveTo(0.1, cc.v2(100, 220));
            let act1 = cc.scaleTo(0.1, .6);
            let act3 = cc.hide();
            let act = cc.spawn(act1, act2, act3);
            this.mxc.runAction(act);
            this.unschedule(this.initGame);
        },
        
        this.pickupTrashSemiBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'pickupTrashSemi') {
                            let method = data.handleData.method;
                            let pars = data.handleData.pars;
                            switch (method) {
                                case 'startGameFn':
                                    this.startGameFn('stop');
                                    break;
                                case 'trashBarrelAction':
                                    this.trashBarrelAction(null, pars);
                                    break;
                            }
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.pickupTrashSemiBind, false);

        if (!this.complete && !this.highAge) {
            let streetBg = this.upStreet.getComponent(cc.Sprite);
            streetBg.spriteFrame = this.otherBg;
            streetBg.node.y = streetBg.node.y + 50;
        }
    },

    // 发射messAge
    sentMessage(type, method, pars) {
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method,
                    pars: pars
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    startGameFn(v) {
        this.intro.active = false;
        this.startGame.active = false;
        this.upStreet.x = -240;
        this.scoreText.string = 0;
        this.curTrash = null;
        let ans = this.mxc.getComponent(cc.Animation);

        let mxcAct1 = cc.show();
        let mxcAct2 = cc.scaleTo(.4, 1);
        let mxcAct3 = cc.moveTo(.8, cc.v2(-100, -160));
        let mxcAct5 = cc.callFunc(() => {
            this.ship.setPosition(cc.v2(300, 460));
            this.createTrash();
            this.curTrashMoveState = true;
            this.scrollBgState = true;
            ans.play('walk');
            if (!this.complete && this.highAge) {
                this.scheduleOnce(function () {
                    ans.pause();
                }, .1);
            }
        }, this)
        let mxcAct = cc.sequence(mxcAct1, mxcAct2,mxcAct3, mxcAct5);

        let shipAct1 = cc.moveTo(.5, cc.v2(100, 260));
        let shipAct2 = cc.callFunc(() => {
            if (this.complete && this.highAge || this.complete && !this.highAge || !this.complete && this.highAge) {
                this.mxc.runAction(mxcAct);
            }
        }, this);
        let shipAct = cc.sequence(shipAct1, shipAct2);
        this.ship.runAction(shipAct);

        if (v !== 'stop') this.sentMessage('pickupTrashSemi', 'startGameFn');
    },

    update(dt) {
        if (this.scrollBgState) {
            this.upStreet.x -= this.moveSpeed * dt;
            if (this.upStreet.x < -4500) {
                this.upStreet.x = -240
            }
        }

        if (this.curTrash && this.curTrashMoveState) {
            this.curTrash.x -= this.moveSpeed * dt;
            if (this.curTrash.x < -200) {
                let ans = this.mxc.getComponent(cc.Animation);
                ans.play('down');
                this.curTrashMoveState = false;
                this.curTrash.destroy();
                this.curTrash = null;
                this.scrollBgState = false;
        
                this.scheduleOnce(this.initGame, 1.5);
            }
        }
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onDestroy() {
        window.removeEventListener("message", this.pickupTrashSemiBind);
    },

    getBarrelSeq(name) {
        let seq;
        let arr = ['glj', 'slj', 'khslj', 'ydlj'];
        for (let i = 0; i < arr.length; i++) {
            if (name == arr[i]) {
                seq = i;
            }
        }
        return seq;
    },
    // 摧毁垃圾
    _detroyTrash(v) {
        this.curTrashMoveState = false;
        let data = v.detail;
        let curTrash = this.node.getChildByName(data.name);
        let seq = this.getBarrelSeq(data.name);
        let curBarrelPosition = this.trashBarrels[seq].node.getPosition();
        let act1 = cc.moveTo(1, cc.v2(curBarrelPosition.x, curBarrelPosition.y + 100))
        let act2 = cc.callFunc(() => {
            curTrash.destroy();
            this.trashBarrels[seq].setAnimation(0, this.ljtSpineList[data.name]['happy'], false);

            this.trashBarrels[seq].addAnimation(0, this.ljtSpineList[data.name]['kwy'], true);
            this.curTrash = null;
            this.createTrash();
            this.scoreText.string = parseInt(this.scoreText.string) + 1;
        }, this);

        let act = cc.sequence(act1, act2);
        curTrash.runAction(act);
    },

    // 创建垃圾
    createTrash() {
        this.curTrashMoveState = true;
        if (this.trashSeq < 3) {
            this.trashSeq++
        } else {
            this.trashSeq = 0;
        }
        // let seq = Math.floor(Math.random() * this.trashPrefabs.length)
        let trash = cc.instantiate(this.trashPrefabs[this.trashSeq]);
        let trashCir = trash.getComponent(cc.CircleCollider);
        trashCir.tag = ['glj', 'slj', 'khslj', 'ydlj'][this.trashSeq];
        trash.parent = this.node;
        trash.setPosition(360, -130);
        this.curTrash = trash;
    },

    // 垃圾桶出动
    trashBarrelAction(e, data) {
        if (!this.complete && !this.highAge || !this.complete && this.highAge) return;
        let trashBarrel = cc.find("underStreet/" + this.ljtSpineList[data]['name'], this.node);
        let curSpine = trashBarrel.getComponent(sp.Skeleton);
        curSpine.setAnimation(0, this.ljtSpineList[data]['open'], false);
        let ans = this.mxc.getComponent(cc.Animation);
        ans.playAdditive('pickup');
        let mxcCir = this.mxc.getComponent(cc.CircleCollider);
        mxcCir.tag = data;
        mxcCir.radius = 80;
        this.scheduleOnce(function () {
            curSpine.setAnimation(0, this.ljtSpineList[data]['kwy'], true);
        }, 1);

        if (e) this.sentMessage('pickupTrashSemi', 'trashBarrelAction', data);
    },

});
