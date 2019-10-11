/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 11:21:22
 * @LastEditTime: 2019-10-11 11:03:22
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        jumpSpeed: 300,
    },

    onLoad: function () {
        this.collisionY = 0;
        this.jumping = false;

        this.game = this.node.parent.parent;
        this.gameScript = this.game.getComponent("polar-game");
    },

    stopFall(mxcY){
        this.collisionY = 1;
        this.speed.y = 0;
        this.jumping = false;

        // 位置修正
        this.node.y = mxcY;
    },

    onCollisionEnter: function (other, self) {
        let otherAabb = other.world.aabb;
        let selfAabb = self.world.aabb;
        if (cc.Intersection.rectRect(otherAabb, selfAabb)) {
            // 0 为 floor
            // 1 为 mxc
            // 2 为 block

            // 碰撞检测后值偏差修正
            let mxcY = Math.ceil(this.node.y);
            switch (other.tag) {
                case 0:
                    this.stopFall(mxcY);
                    break;
                case 2:
                    let blockHeight = other.node.height * other.node.scale;
                    if (mxcY > other.node.y + blockHeight) {
                        this.stopFall(mxcY);
                    } else {
                        this.gameScript.onBlockKilled(other.node);
                        this.node.runAction(cc.blink(1, 4));
                    }
                    break;         
                default:
                    break;
            }
        }
    },

    onCollisionStay: function (other, self) { },

    onCollisionExit: function (other) { },

    update: function (dt) {
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
            this.node.y += this.speed.y * dt;
        }
    },
});
