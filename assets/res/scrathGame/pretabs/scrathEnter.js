cc.Class({
    extends: cc.Component,

    properties: {
        prefabStart: {
            default: null,
            type: cc.Prefab
        },
        prefabGame: {
            default: null,
            type: cc.Prefab
        },
    },
    onLoad() {
        this.monitorEnter = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);
            console.log('monitorEnter');
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'scrathEnter') {
                            var scrathStart = this.node.getChildByName("scrathStart");
                            scrathStart.active = false;
                            var game = cc.instantiate(this.prefabGame);
                            game.parent = this.node;
                        }
                }
            }
        }.bind(this);
        window.addEventListener("message", this.monitorEnter, false);
    },

    game() {
        var scrathStart = this.node.getChildByName("scrathStart");
        scrathStart.active = false;
        var game = cc.instantiate(this.prefabGame);
        game.parent = this.node;

        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: 'scrathEnter'
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    // update (dt) {},

    onDisable() {
        console.log('onDisable - monitorEnter');
    },

    onDestroy() {
        console.log('onDestroy - monitorEnter');
        window.removeEventListener('message', this.monitorEnter, false);
    },

});
