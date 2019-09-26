/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-26 13:35:14
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,

    // 属性
    properties: {
        OMO: {
            default: null,
            type: cc.Node,
            displayName: 'OMO射箭'
        },

        arrow: {
            default: null,
            type: cc.Node,
            displayName: '箭'
        },

        xCoo: {
            default: null,
            type: cc.Node,
            displayName: 'x轴坐标'
        },

        xChoose: {
            default: null,
            type: cc.Node,
            displayName: 'x轴坐标选择列表'
        },

        yCoo: {
            default: null,
            type: cc.Node,
            displayName: 'y轴坐标'
        },

        yChoose: {
            default: null,
            type: cc.Node,
            displayName: 'y轴坐标选择列表'
        },

        fishPool: {
            default: null,
            type: cc.Node,
            displayName: '鱼池'
        },

        winGame: {
            default: null,
            type: cc.Node,
            displayName: '胜利'
        },

        reStart: {
            default: null,
            type: cc.Node,
            displayName: '再来一次'
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.arrowOriginPos = this.arrow.getPosition();
        this.OMO.on(cc.Node.EventType.TOUCH_START, this.OMOArchery, this);
        this.xCoo.on(cc.Node.EventType.TOUCH_START, this.xCooList, this);
        this.yCoo.on(cc.Node.EventType.TOUCH_START, this.yCooList, this);

        for (let n = 0; n < this.xChoose.children.length; n++) {
            const element = this.xChoose.children[n];
            element.on(cc.Node.EventType.TOUCH_START, this.xChoosed, this);
        }

        for (let n = 0; n < this.yChoose.children.length; n++) {
            const element = this.yChoose.children[n];
            element.on(cc.Node.EventType.TOUCH_START, this.yChoosed, this);
        }
        
        this.init();

        this.fnName = Date.now();
        this.isMessageAction = false;
        window.messageProxy.on(this.fnName, (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "GAME_SHOOTBUBBLE":
                    this[data.handleData.method](data.handleData);
                    break;
                default:
                    break;
            }
            this.isMessageAction = false;
        })

    },

    onDestroy() {
        window.messageProxy.off(this.fnName);
    },
    
    init() {
        if (!this.isMessageAction) {
            this.sentMessage('GAME_SHOOTBUBBLE',  {
                method:"init"
            });
        }

        this.winGame.setPosition(cc.v2(0, 540));

        // 所选鱼坐标轴
        this.fishX = null;
        this.fishY = null;

        // 鱼被射击总数
        this.fishTotal = 0;

        // 
        this._labelStringChange(this.xCoo, '__');
        this._labelStringChange(this.yCoo, '__');

        // 飞箭隐藏
        this.arrow.runAction(cc.fadeOut());

        this.archeryState = false;
        // omo 角度调正
        this.OMO.rotation = 0;

        // 坐标列表显示状态
        this.xChoose.runAction(cc.hide());
        this.yChoose.runAction(cc.hide());
        this.xCooActive = false;
        this.yCooActive = false;

        // 鱼坐标集合
        this.fishCooArray = [cc.v2(10, 10), cc.v2(10, 20), cc.v2(10, 30), cc.v2(20, 10), cc.v2(20, 20), cc.v2(20, 30), cc.v2(30, 10), cc.v2(30, 20), cc.v2(30, 30)];

        // 显示所有鱼
        this._showAllFish();
    },

    // OMO射箭
    OMOArchery(event) {
        if (!(this.fishX && this.fishY)) return;
        if (this.archeryState) return;

        if (!this.isMessageAction) {
            this.sentMessage('GAME_SHOOTBUBBLE', {
                method:"OMOArchery"
            });
        }

        this.archeryState = true;
        // 小鱼坐标
        let curFishPos;
        let fishPos = cc.v2(this.fishX, this.fishY);

        for (let n = 0; n < this.fishCooArray.length; n++) {
            if (this.fishCooArray[n].x == this.fishX && this.fishCooArray[n].y == this.fishY) {
                curFishPos = this.fishPool.children[n].getPosition();
            }
        }

        // 飞箭最高点坐标
        let topPos = cc.v2(this.arrow.x, 240);

        let pos1 = topPos.sub(cc.v2(this.arrow.x, this.arrow.y));
        let pos2 = topPos.sub(curFishPos);

        // 飞箭旋转角度
        let deg = pos1.angle(pos2) * 180 / 3.1415;

        // 轨迹动画
        let action = cc.fadeIn(.2);
        let action1 = cc.moveTo(.4, topPos);
        action1.easing(cc.easeOut(.4));

        let action2 = cc.rotateTo(.2, deg - 90);

        let action3 = cc.moveTo(.8, curFishPos);
        action3.easing(cc.easeIn(.8));

        let action4 = cc.fadeOut(.2);

        let action5 = cc.callFunc(this._fishDestroy, this);

        let All = cc.sequence(action, action1, action2, action3, action4, action5);

        this.arrow.runAction(All);
    },

    _fishDestroy() {
        this.arrow.rotation = 90;
        this.arrow.setPosition(this.arrowOriginPos);
        this.archeryState = false;

        for (let n = 0; n < this.fishCooArray.length; n++) {
            if (this.fishCooArray[n].x == this.fishX && this.fishCooArray[n].y == this.fishY) {
                let curFish = this.fishPool.children[n];
                let sprite = curFish.getComponent(cc.Sprite);

                if (sprite.enabled) {
                    sprite.enabled = false;
                    this.fishTotal = this.fishTotal + 1;

                    if (this.fishTotal === 9) {
                        let b1 = cc.moveTo(0, cc.v2(0, 0));
                        this.winGame.runAction(b1);
                    }
                }

            }
        }
    },

    _omoRotate() {
        if (!(this.fishX && this.fishY)) return;
        this.OMO.runAction(cc.rotateTo(.4, 45));
    },

    xChoosed(event) {
        if (!this.isMessageAction) {
            let curLabel = event.currentTarget.children[0].getComponent(cc.Label);
            this.fishX = parseInt(curLabel.string);
            this.sentMessage('GAME_SHOOTBUBBLE', {
                method:'xChoosed',
                sub: this.fishX
            });
        } else {
            this.fishX = event.sub;
        }
        
        this.isMessageAction = true;
        this.xCooList();
        this.isMessageAction = false;

        this._labelStringChange(this.xCoo, this.fishX);
        this._omoRotate();
    },

    yChoosed(event) {
        if (!this.isMessageAction) {
            let curLabel = event.currentTarget.children[0].getComponent(cc.Label);
            this.fishY = parseInt(curLabel.string);
            this.sentMessage('GAME_SHOOTBUBBLE', {
                method:'yChoosed',
                sub: this.fishY
            });
        } else {
            this.fishY = event.sub;
        }

        this.isMessageAction = true;
        this.yCooList();
        this.isMessageAction = false;
        
        this._labelStringChange(this.yCoo, this.fishY);
        this._omoRotate();
    },


    xCooList() {
        if (!this.isMessageAction) {
            this.sentMessage('GAME_SHOOTBUBBLE', {
                method:'xCooList'
            });
        }
        if (this.xCooActive) {
            this.xChoose.runAction(cc.hide());
        } else {
            this.xChoose.runAction(cc.show());
        }

        this.xCooActive = this.xCooActive ? false : true;
    },

    yCooList() {
        if (!this.isMessageAction) {
            this.sentMessage('GAME_SHOOTBUBBLE', {
                method:'yCooList'
            });
        }

        if (this.yCooActive) {
            this.yChoose.runAction(cc.hide());
        } else {
            this.yChoose.runAction(cc.show());
        }

        this.yCooActive = this.yCooActive ? false : true;
    },

    _showAllFish() {
        let fishs = this.fishPool.children;
        for (let m = 0; m < fishs.length; m++) {
            let curFish = fishs[m];
            let sprite = curFish.getComponent(cc.Sprite);
            if (!sprite.enabled) {
                sprite.enabled = true;
            }
        }
    },

    _labelStringChange(context, data) {
        let curLabel = context.children[1].getComponent(cc.Label);
        curLabel.string = data;
    },

    // 发射messAge
    sentMessage(type, handleData) {
        if (window !== window.parent) {
            window.parent.postMessage(JSON.stringify({
                type,
                handleData
            }), '*');
        }
    },
});
