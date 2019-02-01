const {postMessage} = require('JA-common');

cc.Class({
    extends: cc.Component,

    properties: {
        tree: {
            default: null,
            type: cc.Prefab
        },

        cloud: {
            default: null,
            type: cc.Prefab
        },

        sun: {
            default: null,
            type: cc.Prefab
        },

        gameOver: {
            default: null,
            type: cc.Prefab
        },

        backgroundList: {
            default: [],
            type: cc.Node
        },

        backgroundAudio: {
            default: null,
            type: cc.AudioClip
        },

        speed: 30
    },

    // LIFE-CYCLE CALLBACKS:

    init(initMessage) {
        this.Cover = this.node.parent.getChildByName('Cover');
        this.CoverPos = this.Cover.getPosition();
        this.Cover.setPosition(this.CoverPos.x - 2000, this.CoverPos.y);

        let player = this.node.getChildByName('player');
        player.getComponent(cc.BoxCollider).enabled = true;
        player.getComponent(cc.Animation).play('walk');
        player.setPosition(-60, 0);

        this.scoreCount = cc.find("score/box/count", this.node).getComponent(cc.Label);
        this.scoreCount.string = 0;

        if (!this.haveCreateBackground) this.createBackground();
        if (this.sunObj) this.sunObj.removeFromParent();
        if (this.cloudObj) this.cloudObj.removeFromParent();
        if (this.treeObj) this.treeObj.removeFromParent();
        if (this.gameOverObj) this.gameOverObj.removeFromParent();

        this.createTree();
        this.createCloud();
        this.createSun();

        this.treeRunnig = true;
        this.cloudRunnig = true;
        this.sunRunnig = true;
        this.backgroundRunning = true;

        // 播放背景音乐
        cc.audioEngine.play(this.backgroundAudio, false, .2);

        if(initMessage !== 'initMessage'){
            postMessage({'type':'jungleAdventure-init'});
        }
    },

    gameStop() {
        this.treeRunnig = false;
        this.cloudRunnig = false;
        this.sunRunnig = false;
        this.backgroundRunning = false;

        this.treeObj.runAction(cc.fadeOut(1.0));

        this.scheduleOnce(function () {
            this.createGameOver();
        }, 1.3);

        this.scheduleOnce(function () {
            this.coverShow();
            cc.audioEngine.stopAll();
        }, 3);
    },

    onLoad() {

        this.node.on('gameOver', function (event) {
            event.stopPropagation();
            this.gameStop();
        }.bind(this));

        this.node.on('init', function (event) {
            event.stopPropagation();
            this.init('initMessage');
        }.bind(this));

    },

    update(dt) {
        
        // 树
        if (this.treeRunnig) {
            this.treeObj.x -= 100 * dt;

            if (this.treeObj.x < -80 && !this.treeObj.addScore) {
                this.treeObj.addScore = true;
                this.addScore();
            }

            if (this.treeObj.x < -100) {
                this.treeObj.removeFromParent();
                this.createTree();
            }
        }

        // 云
        if (this.cloudRunnig) {
            this.cloudObj.x -= 80 * dt;
            if (this.cloudObj.x < -90) {
                this.cloudObj.removeFromParent();
                this.createCloud();
            }
        }

        // 太阳
        if (this.sunRunnig) {
            this.hairObj.angle += 60 * dt;
        }

        // 背景滚动
        if (this.backgroundRunning) {
            // 页面滚动
            for (let i = this.backgroundList.length - 1; i >= 0; i--) {
                this.backgroundList[i].x -= dt * this.speed;
            }
            // 页面滚动限制条件
            this.checkMoveLeftAllPos();
        };

    },

    // 封面
    coverShow() {
        this.Cover.setPosition(this.CoverPos.x, this.CoverPos.y);
    },

    // gameOver 
    createGameOver() {
        this.gameOverObj = cc.instantiate(this.gameOver);
        this.gameOverObj.parent = this.node;
    },

    // 初始化背景数据
    createBackground() {

        // 首页位置
        this.headPos = this.backgroundList[0].getPosition();
        // 尾页位置
        this.footPos = this.backgroundList[this.backgroundList.length - 1].getPosition();
        // 首页限制
        this.headLimit = this.headPos.x - this.backgroundList[0].getContentSize().width;
        // 尾页限制
        this.footLimit = this.footPos.x;

        this.haveCreateBackground = true;
    },

    // 生成树
    createTree() {
        var tree = cc.instantiate(this.tree);
        var horizon = this.node.getChildByName("horizon");
        tree.parent = horizon;
        this.treeObj = horizon.getChildByName("tree");
    },

    // 生成云
    createCloud() {
        var cloud = cc.instantiate(this.cloud);
        cloud.parent = this.node;
        this.cloudObj = this.node.getChildByName("cloud");
    },

    // 生成太阳
    createSun() {
        var sun = cc.instantiate(this.sun);
        sun.parent = this.node;
        this.sunObj = this.node.getChildByName("sun");
        this.hairObj = this.sunObj.getChildByName("hair");
    },

    addScore() {
        let count = parseInt(this.scoreCount.string) + 1;
        this.scoreCount.string = count;
    },

    // 背景滚动
    checkMoveLeftAllPos() {
        if (this.backgroundList[0].x < this.headLimit) {
            var offset = this.footLimit - this.backgroundList[this.backgroundList.length - 1].x - this.backgroundList[this.backgroundList.length - 1].width;
            this.backgroundList[0].x = this.footLimit - offset;
            this.backgroundList.push(this.backgroundList.splice(0, 1)[0]);
        }
    },

});
