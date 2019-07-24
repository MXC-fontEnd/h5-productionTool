cc.Class({
    extends: cc.Component,

    properties: {
        xText: {
            default: null,
            type: cc.Label
        },
        yText: {
            default: null,
            type: cc.Label
        },

        fSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        tSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },

        xNodes: {
            default: [],
            type: [cc.Node]
        },

        yNodes: {
            default: [],
            type: [cc.Node]
        },

        ljList: {
            default: [],
            type: [cc.Node]
        },

        ljBarrels: {
            default: [],
            type: [sp.Skeleton]
        },

    },

    onLoad() {
        this.flag = true;

        this.khsLjBarrel = this.ljBarrels[0];
        this.ydLjBarrel = this.ljBarrels[1];
        this.sLjBarrel = this.ljBarrels[2];
        this.gLjBarrel = this.ljBarrels[3];
        // 垃圾坐标
        this.ljCoor = [cc.v2(10, 10), cc.v2(10, 20), cc.v2(10, 30), cc.v2(20, 10), cc.v2(20, 20), cc.v2(20, 30), cc.v2(30, 10), cc.v2(30, 20), cc.v2(30, 30)];

        // 垃圾桶配置
        this.ljtConfig = ['sLjBarrel','gLjBarrel','gLjBarrel','khsLjBarrel','ydLjBarrel','khsLjBarrel','ydLjBarrel','gLjBarrel','sLjBarrel'];

        // spine命名不规范适配
        this.ljtSpineList = {
            khsLjBarrel: {
                seq: 0,
                open: 'open',
                happy: 'omo-happy',
                sad: 'omo-sad',
                kwy: 'omostandby',
                stop: 'stop',
            },
            ydLjBarrel: {
                seq: 1,
                open: 's-open',
                happy: 's-happy',
                sad: 's-sad',
                kwy: 's-standby',
                stop: 's-stop',
            },
            sLjBarrel: {
                seq: 2,
                open: 'open',
                happy: 'green-happy',
                sad: 'green-sad',
                kwy: 'green-standby',
                stop: 'stop',
            },
            gLjBarrel: {
                seq: 3,
                open: 'jojo-open',
                happy: 'jojo-happy',
                sad: 'jojo-sad',
                kwy: 'jojo-standby',
                stop: 'jojo-stop',
            },
        };

        this.shootLjBind = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            let data = JSON.parse(e.data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'shootLj') {
                            let method = data.handleData.method;
                            let pars = parseInt(data.handleData.pars);
                            switch (method) {
                                case 'resetGame':
                                        this.resetGame('stop');
                                    break;
                                case 'setX':
                                        this.setX(null,pars);
                                    break;
                                case 'setY':
                                        this.setY(null,pars);
                                    break;
                                    default:
                                    break;
                            }
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.shootLjBind, false);
    },

    start() {

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

    resetGame(v){
        for (let i = 0; i < this.ljList.length; i++) {
           this.ljList[i].active = true;   
        }
        if(v !== 'stop') this.sentMessage('shootLj','resetGame');
    },

    setX(e, v) {
        if(e) this.sentMessage('shootLj','setX',v);
        this.xText.string = v;
        switch (parseInt(v)) {
            case 10:
                this.setXFn(0);
                break;

            case 20:
                this.setXFn(1);
                break;

            case 30:
                this.setXFn(2);
                break;
        }

    },

    setY(e, v) {
        if(e) this.sentMessage('shootLj','setY',v);
        this.yText.string = v;
        switch (parseInt(v)) {
            case 10:
                this.setYFn(0);
                break;

            case 20:
                this.setYFn(1);
                break;

            case 30:
                this.setYFn(2);
                break;
        }
    },

    setXFn(seq) {
        for (let index = 0; index < this.xNodes.length; index++) {
            let curSprite = this.xNodes[index].getComponent(cc.Sprite);
            if (index == seq) {
                curSprite.spriteFrame = this.tSpriteFrames[index];
            } else {
                curSprite.spriteFrame = this.fSpriteFrames[index];
            }
        }
    },

    setYFn(seq) {
        for (let index = 0; index < this.yNodes.length; index++) {
            let curSprite = this.yNodes[index].getComponent(cc.Sprite);
            if (index == seq) {
                curSprite.spriteFrame = this.tSpriteFrames[index];
            } else {
                curSprite.spriteFrame = this.fSpriteFrames[index];
            }
        }
    },

    ljConfig(n) {
        let seq;
        this.ljCoor.forEach((element, i) => {
            if (element.x == n.x && element.y == n.y) seq = i;
        });
        return seq;
    },

    update(dt) {
        if (this.xText.string && this.yText.string && this.flag) {
            this.flag = false;
            let seq = this.ljConfig(cc.v2(parseInt(this.xText.string), parseInt(this.yText.string)));
            let old_ljPosition = this.ljList[seq].getPosition();
            let ljtPosition = this[this.ljtConfig[seq]].node.getPosition();

            let act1 = cc.scaleTo(.3, .6);
            let act2 = cc.callFunc(() => {
                this[this.ljtConfig[seq]].setAnimation(0,this.ljtSpineList[this.ljtConfig[seq]]['open'],false);
            }, this);
            let act3 = cc.moveTo(1.2, cc.v2(ljtPosition.x,ljtPosition.y + 70));
            let act4 = cc.callFunc(() => {
                this.ljList[seq].active = false;
                this.ljList[seq].setPosition(old_ljPosition);
                this.ljList[seq].setScale(1);
                this[this.ljtConfig[seq]].setAnimation(0,this.ljtSpineList[this.ljtConfig[seq]]['happy'],false);
                this[this.ljtConfig[seq]].addAnimation(0,this.ljtSpineList[this.ljtConfig[seq]]['kwy'],true);
            }, this);
            let action = cc.sequence(act1, act2,act3,act4);
            this.ljList[seq].runAction(action);

            this.scheduleOnce(function () {
                this.flag = true;
                this.xText.string = '';
                this.yText.string = '';

                this.setXFn();
                this.setYFn();
            }, .5);
        }
    },

    onDestroy(){
        window.removeEventListener("message", this.shootLjBind);
    }

});
