/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 11:21:22
 * @LastEditTime: 2019-10-11 14:37:43
 * @LastEditors: Please set LastEditors
 */
const { dispatchFn } = require("polar-until");

cc.Class({
    extends: cc.Component,

    properties: {
        masking: {
            default: null,
            type: cc.Node,
            displayName: "蒙版"
        },

        block: {
            default: null,
            type: cc.Prefab,
            displayName: "飞砖"
        },
    },

    onLoad: function () {
        // content 内容
        this.content = this.node.getChildByName("content");
        this.mxc = this.content.getChildByName("mxc");
        this.mxcScript = this.mxc.getComponent("polar-mxc")
        this.mxcTrumb = this.mxc.getComponent(cc.Animation);
        this.perfect = this.content.getChildByName("perfect");
        this.blockBox = this.content.getChildByName("blockBox");

        // info 内容
        this.info = this.node.getChildByName("info");
        this.matte = this.info.getChildByName("matte");
        this.boy = this.info.getChildByName("boy");
        this.girl = this.info.getChildByName("girl");
        this.boyScore = this.boy.getChildByName("score");
        this.boyScoreLabel = this.boyScore.getComponent(cc.Label);
        this.girlScore = this.girl.getChildByName("score");
        this.girlScoreLabel = this.girlScore.getComponent(cc.Label);
        this.countDown = this.info.getChildByName("countDown");
        this.countDownLabel = this.countDown.getComponent(cc.Label);
        this.gameSuccess = this.info.getChildByName("gameSuccess");
        this.gameFail = this.info.getChildByName("gameFail");
        this.restart = this.info.getChildByName("restart");

        // block 对象池
        this.blockPool = new cc.NodePool();
        for (let i = 0; i < 50; i++) {
            let block = cc.instantiate(this.block);
            this.blockPool.put(block);
        };

        // 点击 mxc跳跃
        this.node.on(cc.Node.EventType.TOUCH_START, this.mxcJump, this);

        // 基本参数 初始化
        this.init();
    },

    // 基本参数初始化
    init() {
        // mxc
        this.mxc.y = -400;

        // 积木
        this.blockPosition = cc.v2(260, -400);
        this.blockHeight = 0;
        this.prevBlockX = null;
        // 销毁已有积木
        this.blockBox.removeAllChildren();

        // score信息层
        this.info.active = false;
        this.matte.active = true;
        this.boy.y = this.girl.y = -5;
        this.boyScoreLabel.string = this.girlScoreLabel.string = "000";
        this.countDownLabel.string = "60";
        this.gameSuccess.scale = this.gameFail.scale = 0;
        this.restart.active = false;
    },

    mxcJump(e){
        if (!this.mxcScript.jumping) {
            this.mxcScript.collisionY = 0;
            this.mxcScript.jumping = true;
            this.mxcScript.speed.y = this.mxcScript.jumpSpeed;
        }
        this.mxcTrumb.play();
        
        if (e) {
            dispatchFn(this.node, "gameIC",{
                type:"GAME_MXCJUMP",
                handleData:{
                    method:"mxcJump"
                }
            });
        }
    },

    // 重新开始游戏
    restartGame(e,customEventData) {
        dispatchFn(this.node, "polarChallengeIC","GAME_RESTARTGAME");
        this.init();

        if (e) {
            dispatchFn(this.node, "gameIC",{
                type:"GAME_RESTARTGAME",
                handleData:{
                    method:"restartGame"
                }
            });
        }
    },

    // 开场动画
    aVer(degree) {
        this.degree = degree;
        this.masking.active = false;
        this.info.active = true;

        this.scheduleOnce(() => {
            this.matte.active = false;
            this.boy.runAction(cc.sequence(cc.moveTo(.8, cc.v2(this.boy.x, 330)), cc.callFunc(this.mxcStart, this)));
            this.girl.runAction(cc.moveTo(.8, cc.v2(this.girl.x, 330)));
        }, 1);
    },

    // mxc开始游戏
    mxcStart() {
        this.countDown.active = true;
        this.boyScore.active = true;
        this.girlScore.active = true;
        this.mxc.active = true;

        // 视角跟随mxc
        const follow = cc.follow(this.mxc, cc.rect(0, 0, 960, 2800));
        this.content.runAction(follow);

        // 倒计时60秒
        this.count = 0;
        this.schedule(() => {
            this.countDownFn();

            if (this.count % 2 == 0) {
                this.addScoreAI();
                this.createBlock(this.blockBox);
            }

            this.count++;

            if (this.count == 60) {
                this.countDown.active = false;
                this.scheduleOnce(() => {
                    this.gameEnd();
                }, 1);
            }
        }, 1, 59, 1);
    },

    // 游戏结束
    gameEnd() {
        this.mxc.active = false;
        this.masking.active = true;
        this.restart.active = true;
        this.boy.runAction(cc.moveTo(.8, cc.v2(this.boy.x, -70)));
        this.girl.runAction(cc.moveTo(.8, cc.v2(this.girl.x, -70)));
        this.scheduleOnce(() => {
            const boySore = parseInt(this.boyScoreLabel.string);
            const girlSore = parseInt(this.girlScoreLabel.string)
            if (boySore > girlSore) {
                this.gameSuccess.runAction(cc.spawn(cc.scaleTo(1.4, 0.8), cc.rotateBy(1.4, 360)));
            } else {
                this.gameFail.runAction(cc.spawn(cc.scaleTo(1.4, 0.8), cc.rotateBy(1.4, 360)));
            }
        }, 1);
    },

    // 60倒计时
    countDownFn() {
        let num = parseInt(this.countDownLabel.string) - 1;
        this.countDownLabel.string = num > 9 ? num : "0" + num;
    },

    // AI得分机制
    addScoreAI() {
        let mill = parseInt(this.countDownLabel.string);
        let curScore = parseInt(this.girlScoreLabel.string);
        let num = mill % this.degree == 0 ? curScore + 10 : curScore + 1;
        this.girlScoreLabel.string = num > 9 ? "0" + num : "00" + num;
    },

    // MXC 得分 
    addScoreMXC(score) {
        let curScore = parseInt(this.boyScoreLabel.string) + score;
        this.boyScoreLabel.string = curScore > 9 ? "0" + curScore : "00" + curScore;
        // 完美
        if (score > 1) {
            this.perfect.setPosition(cc.v2(this.mxc.x, this.mxc.y + 200));
            this.scheduleOnce(() => {
                this.perfect.setPosition(cc.v2(500, 0));
            }, 1.5);
        }
    },

    // 创建飞砖
    createBlock(parentNode) {
        let block = null;
        if (this.blockPool.size() > 0) {
            block = this.blockPool.get();
        } else {
            block = cc.instantiate(this.block);
        }
        block.parent = parentNode;
        // 飞砖产生位置
        block.getComponent("polar-block").initPosition(this.blockPosition);

        this.blockHeight = block.height * block.scale;
        // 校正下个block 位置
        this.blockPosition.y = this.blockPosition.y + this.blockHeight;
    },

    // 销毁飞砖
    onBlockKilled(blockNode) {
        // 校正下个block 位置
        this.blockPosition.y = this.blockPosition.y - this.blockHeight;
        this.blockPool.put(blockNode);
    },

    onDestroy() {
        // 清空飞砖池
        this.blockPool.clear();
    },
});
