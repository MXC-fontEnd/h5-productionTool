
cc.Class({
    extends: cc.Component,
    properties: {
        success: {
            default: null,
            type: cc.Prefab,
            displayName: '成功'
        },

        fail: {
            default: null,
            type: cc.Prefab,
            displayName: '失败'
        },
    },

    onLoad() {
    },

    setRadius() {
        console.log('setRadius')
        let mxcCir = this.node.getComponent(cc.CircleCollider);
        mxcCir.radius = 0;
    },

    /**
      * 当碰撞产生的时候调用
      * @param  {Collider} other 产生碰撞的另一个碰撞组件
      * @param  {Collider} self  产生碰撞的自身的碰撞组件
      */

    onCollisionEnter: function (other, self) {
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        let a = { position: other.world.position, radius: other.world.radius };
        let b = { position: self.world.position, radius: self.world.radius };
        if (cc.Intersection.circleCircle(a, b)) {
            if(self.radius == 0) return;
            if (self.tag == other.tag) {
                let data = {
                    name: other.tag
                }
                // 辣手摧圾
                let cee = new cc.Event.EventCustom('detroyTrash', true);
                cee.setUserData(data);
                this.node.dispatchEvent(cee);

                let success = cc.instantiate(this.success);
                success.parent = this.node;
                success.setPosition(60, 60);

                let act1 = cc.spawn(cc.moveBy(1, cc.v2(60, 60)), cc.scaleTo(1, .4))
                let act2 = cc.callFunc(() => {
                    success.destroy();
                }, this);
                let act = cc.sequence(act1, act2);
                success.runAction(act);
            } else {
                let fail = cc.instantiate(this.fail);
                fail.parent = this.node;
                fail.setPosition(60, 60);

                let act1 = cc.spawn(cc.moveBy(1, cc.v2(60, 60)), cc.scaleTo(1, .4))
                let act2 = cc.callFunc(() => {
                    fail.destroy();
                }, this);
                let act = cc.sequence(act1, act2);
                fail.runAction(act);
            }
        }
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {

    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        console.log('onCollisionExit')
    }
    // update (dt) {},
});
