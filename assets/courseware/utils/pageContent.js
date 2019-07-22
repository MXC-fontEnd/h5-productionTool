cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: [],
            type: [cc.Prefab]
        },
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        for (let i = 0; i < this.content.length; i++) {
            if (this.content[i]) {
                let content = cc.instantiate(this.content[i]);
                content.parent = this.node;
            }
        }
    },
});
