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
        //this.lightGem.on(cc.Node.EventType.TOUCH_START, this._countGem, this);
        this.init();

        this.collectGemBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'collectGem-init') {
                            this.init();
                        }

                        if (data.handleData && data.handleData.type == 'collectGem-collect') {
                            let sub = parseInt(data.handleData.sub);
                            let curGemNode = this.gemPool.children[sub];
                            this._countGem(false,curGemNode);
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.collectGemBind, false);
    },

    onDestroy() {
        window.removeEventListener('message', this.collectGemBind, false);
    },

    init(target,pars) {
        if(pars == 'restart'){
            this.sentMessage('collectGem-init');
        }
        this.winGame.setPosition(cc.v2(0, 540));
        this.count.string = 0;
        this.gemPool.removeAllChildren();
        this.randomV2 = [];

        // 因拓课云通信机制调整
        //this.randomTotal = [5, 6, 7, 8][Math.floor(Math.random() * 4)];

        this.randomTotal = 7;
        this._randomV2();
    },

    _randomV2() {
        let width = this.gemPool.width;
        let height = this.gemPool.height;

        if (this.randomV2.length < this.randomTotal) {
            let x = Math.random() > 0.5 ? -Math.floor(Math.random() * (width - 100)/2) : Math.floor(Math.random() * (width - 100)/2);
            let y = Math.random() > 0.5 ? -Math.floor(Math.random() * (height - 100)/2) : Math.floor(Math.random() * (height - 100)/2);
            this.randomV2.push(cc.v2(x, y));
            this._randomV2();
        } else {
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

    _countGem(event,curGemNode) {
        let lightGem;
        let sub;
        if(event){
            lightGem = event.currentTarget;
            let gemPool = event.currentTarget.parent;
            for (let index = 0; index < gemPool.children.length; index++) {
                if(lightGem == gemPool.children[index]){
                    sub = index;
                }
            }
            this.sentMessage('collectGem-collect', sub);
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

    sentMessage(type, sub) {
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    sub: sub
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    // update (dt) {},
});
