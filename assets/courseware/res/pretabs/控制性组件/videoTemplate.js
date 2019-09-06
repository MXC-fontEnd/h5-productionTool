/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-05 11:48:28
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        triggerList: {
            default: [],
            type: cc.Node
        },

        videoList: {
            default: [],
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isMessageAction = false;
        this.init();

        for (let i = 0; i < this.triggerList.length; i++) {
            this.triggerList[i].on(cc.Node.EventType.TOUCH_START, function (e) {
                this.videoShow(parseInt(e.currentTarget.name))
            }, this);
        }

        // 监听课件message
        window.messageCallback = (data) => {
            this.isMessageAction = true;
            switch (data.type) {
                case "CW_VIDEOTEMPLATE_VIDEOSHOW":
                    this.videoShow(data.handleData.index);
                    break;
                case "CW_VIDEOTEMPLATE_RESUME":
                    this.resume();
                    break;
                case "CW_VIDEOTEMPLATE_PAUSE":
                    this.pause();
                    break;
                case "CW_VIDEOTEMPLATE_STOP":
                    this.stop();
                    break;
                default:
                    this.isMessageAction = false;
                    break;
            }
        }
    },

    init() {
        this.videoNode = null;
        this.curVideoPositonY = null;
        this.videoplayer = null;
    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
    },

    // update (dt) {},

    videoShow(index) {
        this.videoNode = this.videoList[index - 1];
        this.curVideoPositonY = this.videoNode.y;
        this.videoNode.y = 0;
        this.videoplayer = this.videoNode.getChildByName("videoplayer").getComponent(cc.VideoPlayer);

        // message信息传输判断
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_VIDEOTEMPLATE_VIDEOSHOW", { index });
    },

    videoHide() {
        this.videoNode.y = this.curVideoPositonY;
        this.init();
    },

    resume() {
        this.videoplayer.resume();
        // message信息传输判断
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_VIDEOTEMPLATE_RESUME");
    },

    pause() {
        this.videoplayer.pause();
        // message信息传输判断
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_VIDEOTEMPLATE_PAUSE");
    },

    stop() {
        this.videoplayer.stop();
        this.videoHide();
        // message信息传输判断
        this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_VIDEOTEMPLATE_STOP");
    },

});
