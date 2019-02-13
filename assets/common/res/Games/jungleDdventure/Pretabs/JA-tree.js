cc.Class({
    extends: cc.Component,
    properties: {
        spriteList: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },
    // use this for initialization
    onLoad: function () {
        var randomIdx = this.getRandomInt(0, this.spriteList.length);
        var sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteList[randomIdx];
        
        // 设置碰撞区域
        var circleCollider = this.node.addComponent(cc.CircleCollider);
        circleCollider.offset.y = this.node.height/2;
        circleCollider.radius = 42;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

});
