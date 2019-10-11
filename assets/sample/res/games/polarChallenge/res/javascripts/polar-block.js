/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 11:21:22
 * @LastEditTime: 2019-10-11 11:02:59
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,
    properties: {
        normalBlocks: {
            default: [],
            type: [cc.SpriteFrame]
        },
        snowBlocks: {
            default: [],
            type: [cc.SpriteFrame]
        },
    },
    onLoad: function () {
        this.moveFlag = true;
        this.randomNum = Math.floor(Math.random() * 7);
        this.curSprite = this.node.getComponent(cc.Sprite);

        // game 脚本
        this.game = this.node.parent.parent.parent;
        this.gameScript = this.game.getComponent("polar-game");
    },

    start() {
        this.curSprite.spriteFrame = this.normalBlocks[this.randomNum];
    },

    // 初始化位置
    initPosition(position) {
        this.node.x = position.x;
        this.node.y = position.y;
    },

    // 换装
    crossDress() {
        this.curSprite.spriteFrame = this.snowBlocks[this.randomNum];
    },

    onCollisionEnter: function (other, self) {
        let otherAabb = other.world.aabb;
        let selfAabb = self.world.aabb;

        if (cc.Intersection.rectRect(otherAabb, selfAabb)) {
            if (other.tag == 1) {
                let mxcY = Math.ceil(other.node.y);
                let blockHeight = self.node.height * self.node.scale;
                // 0 为 floor
                // 1 为 mxc
                // 2 为 block
                if (self.tag == 2 && mxcY >= self.node.y + blockHeight) {
                    self.tag = 0;
                    this.moveFlag = false;
                    if (this.gameScript.prevBlockX == this.node.x) {
                        this.gameScript.addScoreMXC(10);
                        this.crossDress();
                    } else {
                        this.gameScript.addScoreMXC(1);
                        this.gameScript.prevBlockX = this.node.x;
                    }
                }
            }
        }
    },

    onCollisionStay: function (other, self) { },

    onCollisionExit: function (other, self) { },

    update: function (dt) {
        if (this.moveFlag) {
            this.node.x -= 4;
        }
    },
});
