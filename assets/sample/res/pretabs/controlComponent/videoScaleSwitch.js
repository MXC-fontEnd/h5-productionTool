/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 14:33:27
 * @LastEditTime: 2019-09-30 10:35:15
 * @LastEditors: Please set LastEditors
 */
const { sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,
    properties: {
        videoList: {
            default: [],
            type: [cc.Node],
            displayName: "视频节点列表"
        },
        scaleSmaller: 0.8,
        scaleBigger: 1.2,
        scaleSpeed: .5,
        curActive: 0
    },

    onLoad() {
        this.curUuid = this.node.uuid;

        window.messageProxy.on(this.curUuid, (data) => {
            if(data.method && data.method == "onFileMessage"){
                data = data.handleData;
            }
            switch (data.type) {
                case "CW_VIDEOSCALESWITCH_ACTIVED":
                    this[data.handleData.method](data.handleData.customEventData);
                    break;
                default:
                    break;
            }
        });

        for (let i = 0; i < this.videoList.length; i++) {
            if (this.curActive == i) {
                this.videoList[i].scale = 1.2;
            } else {
                this.videoList[i].scale = .8;
            }  
        }

    },

    switchAnimation(customEventData) {
        for (let i = 0; i < this.videoList.length; i++) {
            if (customEventData == i) {
                let target = this.videoList[customEventData];
                let action1 = cc.scaleTo(this.scaleSpeed, this.scaleBigger);
                let action2 = cc.callFunc(this.afterAnimation, true, target);
                target.runAction(cc.sequence(action1, action2));
            } else {
                this.videoList[i].getComponent(cc.VideoPlayer).stop();
                let action1 = cc.scaleTo(this.scaleSpeed, this.scaleSmaller);
                this.videoList[i].runAction(action1);
            }
        }
    },

    afterAnimation(event,target){
        let videPlayer = target.getComponent(cc.VideoPlayer);
        videPlayer.play();
    },

    onVideoPlayerEvent: function (videoplayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED:
                console.log('videoplayer meta-loaded');
                break;

            case cc.VideoPlayer.EventType.READY_TO_PLAY:
                console.log('videoplayer ready-to-play');
                break;
            case cc.VideoPlayer.EventType.PLAYING:
                console.log('videoplayer playing');
                break;

            case cc.VideoPlayer.EventType.PAUSED:
                console.log('videoplayer paused');
                break;

            case cc.VideoPlayer.EventType.STOPPED:
                console.log('videoplayer stopped');
                break;

            case cc.VideoPlayer.EventType.COMPLETED:
                console.log('videoplayer completted');
                break;
                
            case cc.VideoPlayer.EventType.CLICKED:
                console.log('videoplayer clicked');
                sendMessage("CW_VIDEOSCALESWITCH_ACTIVED", { method: "switchAnimation", customEventData });
                this.switchAnimation(customEventData);
                break;
            default:
                break;
        }
    },

    onDestroy() {
        window.messageProxy.off(this.curUuid);
    },
});

