/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-12 17:37:20
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require('JA-common');

cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        direction: 0,
        jumpSpeed: 300,

        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        failAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function () {
        window.messageCallback = (data) => {
            switch (data.type) {
                case "GAME_JUNGLE_ADVENTURE_INIT":
                    this.node.dispatchEvent(new cc.Event.EventCustom('informedInit', true));
                    break;

                case "GAME_JUNGLE_ADVENTURE_JUMP":
                    this.jump('jumpMessage');
                    break;
                default:
                    break;
            }
        }

        // 跳跃的状态
        this.jumping = false;
        // 前进方向 东西 南北
        this.eastward = false;
        this.westward = false;
        this.southward = true;
        this.northward = false;

        // 绑定 跳跃 事件
        this.node.parent.on('touchstart', this.jump, this);
    },

    update: function (dt) {
        if (this.southward) {
            this.speed.y += this.gravity * dt;
            // 速度限制处理
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        this.node.y += this.speed.y * dt;
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        // cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    // 跳跃
    jump(jumpMessage) {
        if (!this.jumping) {
            cc.audioEngine.play(this.jumpAudio, false, .1);
            this.jumping = true;
            this.speed.y = this.jumpSpeed;
            if (jumpMessage !== 'jumpMessage') sendMessage("GAME_JUNGLE_ADVENTURE_JUMP");
        }

    },

    // 游戏结束
    gameOver() {
        this.node.dispatchEvent(new cc.Event.EventCustom('gameOver', true));

        var playerAnim = this.getComponent(cc.Animation);
        playerAnim.play('stay')
        cc.audioEngine.stopAll();

        setTimeout(function () {
            this.node.getComponent(cc.BoxCollider).enabled = false;
            cc.audioEngine.play(this.failAudio, false, .1);
        }.bind(this), 300);
    },

    // 碰撞 生命周期
    onCollisionEnter: function (other, self) {
        console.log('碰撞进入')

        if (other.name == 'tree<CircleCollider>') {
            this.gameOver();
        }
        // 1.get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();
        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 3.检测纵向碰撞
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            console.log('纵向碰撞')
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.jumping = false;
                this.southward = false;
            }
            this.speed.y = 0;
            other.touchingY = true;
        }
    },

    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other) {
        console.log('碰撞退入')
        // 纵向重置
        if (other.touchingY) {
            other.touchingY = false;
            this.southward = true;
            this.jumping = true;
        }
    },
});
