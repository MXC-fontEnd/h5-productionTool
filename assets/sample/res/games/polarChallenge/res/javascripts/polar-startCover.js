/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 11:21:22
 * @LastEditTime: 2019-10-11 14:33:30
 * @LastEditors: Please set LastEditors
 */
const { dispatchFn } = require("polar-until");

cc.Class({
    extends: cc.Component,
    properties: {
        gameExplain: {
            default: null,
            type: cc.Node,
            displayName: "游戏说明"
        },

        startGame: {
            default: null,
            type: cc.Node,
            displayName: "开始游戏"
        },

        easy: {
            default: null,
            type: cc.Node,
            displayName: "普通的"
        },

        difficult: {
            default: null,
            type: cc.Node,
            displayName: "困难的"
        },
    },

    onLoad: function () {
        this.init();
    },

    init() {
        this.gameExplain.active = true;
        this.startGame.active = true;
        this.easy.active = false;
        this.difficult.active = false;
    },

    gameStart(e,customEventData) {
        this.gameExplain.active = false;
        this.startGame.active = false;
        this.easy.active = true;
        this.difficult.active = true;
        if (e) {
            dispatchFn(this.node, "gameIC",{
                type:"GAME_START",
                handleData:{
                    method:"gameStart"
                }
            });
        }
    },

    beActive(){
        this.node.active = true;
    },

    easyGame(e,customEventData) {
        this.node.active = false;
        dispatchFn(this.node, "polarChallengeIC","GAME_EASY");
        
        if (e) {
            dispatchFn(this.node, "gameIC",{
                type:"GAME_EASY",
                handleData:{
                    method:"easyGame"
                }
            });
        }
    },

    difficultGame(e,customEventData) {
        this.node.active = false;
        dispatchFn(this.node, "polarChallengeIC","GAME_DIFFICULT");

        if (e) {
            dispatchFn(this.node, "gameIC",{
                type:"GAME_DIFFICULT",
                handleData:{
                    method:"difficultGame"
                }
            });
        }
    },

    onEnable() {
        this.init();
    },

    onDisable() { }

});
