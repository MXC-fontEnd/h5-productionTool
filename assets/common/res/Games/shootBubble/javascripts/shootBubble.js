cc.Class({
    extends: cc.Component,

    // 属性
    properties: {
        OMO:{
            default: null,
            type: cc.Node,
            displayName: 'OMO射箭'
        },

        xCoo:{
            default: null,
            type: cc.Node,
            displayName: 'x轴坐标'
        },

        xChoose:{
            default: null,
            type: cc.Node,
            displayName: 'x轴坐标选择列表'
        },

        yCoo:{
            default: null,
            type: cc.Node,
            displayName: 'y轴坐标'
        },

        yChoose:{
            default: null,
            type: cc.Node,
            displayName: 'y轴坐标选择列表'
        },

        fishPool:{
            default: null,
            type: cc.Node,
            displayName: '鱼池'
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.OMO.on(cc.Node.EventType.TOUCH_START, this._OMOArchery, this);

        this.xCoo.on(cc.Node.EventType.TOUCH_START, this._xCooList, this);
        this.yCoo.on(cc.Node.EventType.TOUCH_START, this._yCooList, this);

        for (let n = 0; n < this.xChoose.children.length; n++) {
            const element = this.xChoose.children[n];
            element.on(cc.Node.EventType.TOUCH_START, this._xChoosed, this);
        }

        for (let n = 0; n < this.yChoose.children.length; n++) {
            const element = this.yChoose.children[n];
            element.on(cc.Node.EventType.TOUCH_START, this._yChoosed, this);
        }

        this.init();
    },

    init() {
        // 所选鱼坐标轴
        this.fishX = null;
        this.fishY = null;

        // 
        this._labelStringChange(this.xCoo,'__');
        this._labelStringChange(this.yCoo,'__');

        // 坐标列表显示状态
        this.xChoose.runAction(cc.hide());
        this.yChoose.runAction(cc.hide()); 
        this.xCooActive = false;
        this.yCooActive = false;

        // 鱼坐标集合
        this.fishCooArray = [cc.v2(10,10),cc.v2(10,20),cc.v2(10,30),cc.v2(20,10),cc.v2(20,20),cc.v2(20,30),cc.v2(30,10),cc.v2(30,20),cc.v2(30,30)];

        // 显示所有鱼
        this._showAllFish();
    },

    // OMO射箭
    _OMOArchery(){
        if(!(this.fishX && this.fishY)) return;

        

        for (let n = 0; n < this.fishCooArray.length; n++) {
            if(this.fishCooArray[n].x == this.fishX && this.fishCooArray[n].y == this.fishY){
                let curFish = this.fishPool.children[n];
                let sprite = curFish.getComponent(cc.Sprite);
                sprite.enabled = false;
            }
        }
    },

    _xChoosed(event){
        let curLabel =  event.currentTarget.children[0].getComponent(cc.Label);
        this.fishX = parseInt(curLabel.string);

        this._xCooList();
        this._labelStringChange(this.xCoo,this.fishX);

    },

    _yChoosed(event){
        let curLabel =  event.currentTarget.children[0].getComponent(cc.Label);
        this.fishY = parseInt(curLabel.string);

        this._yCooList();
        this._labelStringChange(this.yCoo,this.fishY);
    },


    _xCooList(){
        if(this.xCooActive) {
            this.xChoose.runAction(cc.hide()); 
        } else {
            this.xChoose.runAction(cc.show()); 
        }

        this.xCooActive = this.xCooActive ? false : true;
    },

    _yCooList(){
        if(this.yCooActive) {
            this.yChoose.runAction(cc.hide()); 
        } else {
            this.yChoose.runAction(cc.show()); 
        }

        this.yCooActive = this.yCooActive ? false : true;
    },

    _showAllFish(){
        let fishs = this.fishPool.children;
        for (let m = 0; m < fishs.length; m++) {
            let curFish = fishs[m];
            let sprite = curFish.getComponent(cc.Sprite);
            if(!sprite.enabled){
                sprite.enabled = true;
            }
        }
    },

    _labelStringChange(context,data){
        let curLabel = context.children[1].getComponent(cc.Label);
        curLabel.string = data;
    },
    // // 发射导弹
    // _launchMissile(event) {
    //     if (this.launchState) return;
    //     if (!this.bubbleX || !this.bubbleY) return;
    //     this.launchState = true;

    //     // 被追踪气球坐标
    //     let bubblePosX = this.axisOrigin.x + this.axisUnitValue.x * this.bubbleX;
    //     let bubblePosY = this.axisOrigin.y + this.axisUnitValue.y * this.bubbleY;
    //     let bubblePos = cc.v2(bubblePosX, bubblePosY);

    //     // 导弹最高点坐标
    //     let topPos = cc.v2(this.missilePos.x, 240);

    //     let pos1 = topPos.sub(this.missilePos);
    //     let pos2 = topPos.sub(bubblePos);

    //     // 导弹旋转角度
    //     let deg = pos1.angle(pos2) * 180 / 3.1415;

    //     // 轨迹动画
    //     let action1 = cc.moveTo(.6, topPos);
    //     action1.easing(cc.easeOut(.6));

    //     let action2 = cc.rotateTo(.6, 180 - deg);

    //     let action3 = cc.moveTo(1.2, bubblePos);
    //     action3.easing(cc.easeIn(1.2));

    //     let action4 = cc.fadeOut(.3);

    //     let action5 = cc.callFunc(this._bigExplosion, this, this._getBubble());

    //     let All = cc.sequence(action1, action2, action3, action4, action5);

    //     this.missile.runAction(All);
    // },

    // _getBubble() {
    //     let bubbles = this.bubbleBox.children;
    //     let sub = (this.bubbleX - 1) * 3 + (this.bubbleY - 1) * 1;
    //     return bubbles[sub];
    // },

    // // 大爆炸
    // _bigExplosion(event, curBubble) {
    //     let combustion = cc.instantiate(this.combustion);
    //     combustion.parent = curBubble;

    //     let sprite = curBubble.getComponent(cc.Sprite);
    //     sprite.scheduleOnce(function () {
    //         sprite.enabled = false;

    //         let bubbles = this.bubbleBox.children;
    //         let result = bubbles.some(function (item,index) {
    //             let sprite = item.getComponent(cc.Sprite);
    //             return sprite.enabled == true;
    //         });

    //         if(!result) this._winGame();
    //     }.bind(this), 3);

    //     this._fillingMissile();
    // },

    // // 游戏胜利
    // _winGame(){
    //     console.log('太厉害了！！');
    //     this.winGame.setPosition(0,0);
    // },

    // // 装填导弹
    // _fillingMissile() {
    //     this.tail.fadeTime = 0;
    //     let action1 = cc.moveTo(.1, cc.v2(520, this.missilePos.y));
    //     let action2 = cc.rotateTo(.1, 90);
    //     let action3 = cc.fadeIn();
    //     let action4 = cc.moveTo(3, this.missilePos);
    //     action4.easing(cc.easeIn(3.0));
    //     let action5 = cc.rotateTo(1.0, 0);

    //     let action6 = cc.callFunc(function () {
    //         this.tail.fadeTime = 0.2;
    //         // 导弹装填完成，待发射
    //         this.launchState = false;
    //     }.bind(this), this);

    //     let All = cc.sequence(action1, action2, action3, action4, action5, action6);
    //     this.missile.runAction(All);
    // },

    // // 设置目标气球x坐标
    // setBubbleX(text, event) {
    //     if(text > 3 || text < 1) return;
    //     this.bubbleX = text;
    // },

    // // 设置目标气球y坐标
    // setBubbleY(text, event) {
    //     if(text > 3 || text < 1) return;
    //     this.bubbleY = text;
    // },

    // update (dt) {},
});
