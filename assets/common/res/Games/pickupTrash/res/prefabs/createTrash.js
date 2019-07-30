
cc.Class({
    extends: cc.Component,

    properties: {
        trashAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            displayName: '垃圾图集'
        }
    },

    onLoad() {
        let curSprite = this.node.getComponent(cc.Sprite);
        let spriteFrames = this.trashAtlas.getSpriteFrames();
        let seq = Math.floor(Math.random() * spriteFrames.length);
        curSprite.spriteFrame = spriteFrames[seq];
    },
});
