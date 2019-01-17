cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad () {
        cc.director.preloadScene("game", function () {
            cc.log("Next scene preloaded");
        });
    },

    start () {

    },

    gameStart(){
        cc.director.loadScene('game');
    }

    // update (dt) {},
});
