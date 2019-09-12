/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-12 11:51:02
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,

    properties: {
        gem: {
            default: null,
            type: cc.Node
        },

        count: {
            default: null,
            type: cc.Label
        },

        gemPool: {
            default: null,
            type: cc.Node
        },

        lightGem: {
            default: null,
            type: cc.Prefab
        },

        winGame: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 监听课件message
        window.messageCallback = (data) => {
            switch (data.type) {
                case "GAME_COLLECTGEM_INIT":
                    this.init();
                    break;

                case "GAME_COLLECTGEM_COLLECT":
                    let curGemNode = this.gemPool.children[parseInt(data.handleData.sub)];
                    this._countGem(false,curGemNode);
                    break;
                default:
                    break;
            }
        }
        this.init();
    },

    onDestroy() {
        console.log("onDestroy");
    },

    init(target, customEventData) {
        if (Object.is("restart", customEventData)) {
            this.sentMessage("GAME_COLLECTGEM_INIT");
        }
        this.winGame.setPosition(cc.v2(0, 540));
        this.count.string = 0;
        this.gemPool.removeAllChildren();
        this.randomV2 = [cc.v2(-350, -120), cc.v2(-270, -150), cc.v2(-180, -180), cc.v2(-80, -100), cc.v2(20, -180), cc.v2(100, -190), cc.v2(280, -190)];

        this.randomTotal = 7;
        this._randomV2();
    },

    _randomV2() {
        if (this.randomV2.length >= this.randomTotal) {
            this._createLightGem();
        }
    },

    _createLightGem() {
        for (let m = 0; m < this.randomV2.length; m++) {
            let lightGem = cc.instantiate(this.lightGem);
            lightGem.parent = this.gemPool;
            lightGem.setPosition(this.randomV2[m]);

            lightGem.on(cc.Node.EventType.TOUCH_START, this._countGem, this);
        }
    },

    _countGem(event, curGemNode) {
        let lightGem;
        let sub;
        if (event) {
            lightGem = event.currentTarget;
            let gemPool = event.currentTarget.parent;
            for (let index = 0; index < gemPool.children.length; index++) {
                if (lightGem == gemPool.children[index]) {
                    sub = index;
                }
            }
            this.sentMessage("GAME_COLLECTGEM_COLLECT", {
                sub
            });
        } else {
            lightGem = curGemNode;
        }

        let position = this.gem.getPosition();
        let action1 = cc.moveTo(.4, position);
        let action2 = cc.scaleTo(.3, .4);
        let action3 = cc.removeSelf();
        let action4 = cc.callFunc(function () {
            let count = parseInt(this.count.string) + 1;
            this.count.string = count;
            if (this.randomV2.length == count) {
                let b1 = cc.moveTo(0, cc.v2(0, 0));
                this.winGame.runAction(b1);
            }
        }, this);

        let All = cc.sequence(action1, action2, action3, action4);
        lightGem.runAction(All);
    },

    sentMessage(type, handleData) {
        if (window !== window.parent) {
            window.parent.postMessage(JSON.stringify({
                type,
                handleData
            }), '*');
        }
    },
});
