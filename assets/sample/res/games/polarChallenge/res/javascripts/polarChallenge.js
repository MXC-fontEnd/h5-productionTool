/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 11:21:22
 * @LastEditTime: 2019-10-11 14:47:32
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {
        startCover: {
            default: null,
            type: cc.Node,
            displayName: "开始面"
        },
        game: {
            default: null,
            type: cc.Node,
            displayName: "游戏面"
        },
    },

    onLoad: function () {
        if (window.messageProxy) {
            this.curUuid = this.node.uuid;
            window.messageProxy.on(this.curUuid, (data) => {
                if (data.method && data.method == "onFileMessage") {
                    data = data.handleData;
                }
                switch (data.type) {
                    case "GAME_START":
                    case "GAME_EASY":
                    case "GAME_DIFFICULT":
                        this.startCoverScript[data.handleData.method](null);
                        break;
                    case "GAME_MXCJUMP":
                    case "GAME_RESTARTGAME":
                        this.gameScript[data.handleData.method](null);
                        break;
                    default:
                        break;
                }
            });
        }

        this.startCoverScript = this.startCover.getComponent("polar-startCover");
        this.gameScript = this.game.getComponent("polar-game");

        this.node.on("polarChallengeIC", this.polarChallengeIC, this);
    },

    polarChallengeIC(event) {
        event.stopPropagation();
        let detail = event.detail;
        switch (detail) {
            case "GAME_RESTARTGAME":
                this.startCoverScript.beActive();
                break;
            case "GAME_EASY":
                this.gameScript.aVer(15);
                break;
            case "GAME_DIFFICULT":
                this.gameScript.aVer(5);
                break;
            default:
                break;
        }
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onDestroy(){
        if (window.messageProxy) {
            window.messageProxy.off(this.curUuid);
        }
    }
});
