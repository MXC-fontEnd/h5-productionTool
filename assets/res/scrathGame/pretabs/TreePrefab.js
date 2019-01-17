
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
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteList[randomIdx];
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

});
