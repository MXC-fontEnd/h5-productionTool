/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-08-27 18:58:52
 * @LastEditors: Please set LastEditors
 */

const { sendMessage } = require("messageUtils");

cc.Class({
    extends: cc.Component,
    properties: {
        videoList: {
            default: [],
            type: [cc.Node]
        },
        scaleSmaller: 0.8,
        scaleBigger: 1.2,
        scaleSpeed: .5,
        curActive: 0
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // 当前被激活下标
        this.curActiveSub = this.curActive;
        // 缩放差
        this.scaleGap = this.scaleBigger - this.scaleSmaller;
        // videoplayer数组
        this.videoplayerList = [];
        //
        for (let n = 0; n < this.videoList.length; n++) {
            let videoBox = this.videoList[n];
            // 视频绑定事件
            videoBox.on(cc.Node.EventType.TOUCH_START, this._videoClicked, this);
            //
            let videoplayer = videoBox.getChildByName('videoplayer').getComponent(cc.VideoPlayer);
            this.videoplayerList.push(videoplayer);
        }

        // 监听视频被点击发射事件
        this.node.on('videoplayerClicked', this._videoClicked, this);

        // 监听课件message
        window.messageCallback = (data) => {
            switch (data.type) {
                case "SWITCH_VIDEO_PLAY":
                    let sub = parseInt(data.handleData.sub);
                    let curVideoplayer = this.videoplayerList[sub];
                    this._switchAnimation(curVideoplayer, sub);
                    break;
                default:
                    break;
            }
        }
    },

    _videoClicked(event) {
        event.stopPropagation();
        // 当前被点击的视频播放器
        let target = event.target;
        let curVideoplayer = target.getChildByName('videoplayer').getComponent(cc.VideoPlayer);

        // 获取当前播放器的下标
        let curVideoplayerSub = null;
        for (let n = 0; n < this.videoplayerList.length; n++) {
            if (curVideoplayer === this.videoplayerList[n]) {
                curVideoplayerSub = n;
            }
        }

        // 发送message
        sendMessage("SWITCH_VIDEO_PLAY", { sub: curVideoplayerSub });

        // 切换动画
        this._switchAnimation(curVideoplayer, curVideoplayerSub);

    },

    _switchAnimation(curVideoplayer, curVideoplayerSub) {
        // 根据下标及激活情况，判断进行下一步
        if (this.curActiveSub === curVideoplayerSub) {
            curVideoplayer.play();
        } else {
            for (let n = 0; n < this.videoplayerList.length; n++) {
                let videoplayerNode = this.videoplayerList[n].node.parent;
                if (curVideoplayerSub === n) {
                    this.curActiveSub = curVideoplayerSub;

                    let action1 = cc.scaleTo(this.scaleSpeed, this.scaleBigger);
                    let action2 = cc.callFunc(this._afterClicked, true, curVideoplayer);
                    videoplayerNode.runAction(cc.sequence(action1, action2));
                } else {
                    this.videoplayerList[n].stop();

                    let action1 = cc.scaleTo(this.scaleSpeed, this.scaleSmaller);
                    let action2 = cc.callFunc(this._afterClicked, this);
                    videoplayerNode.runAction(cc.sequence(action1, action2));
                }
            }
        }
    },

    _afterClicked(event, videoplayer) {
        if (videoplayer) {
            videoplayer.play();
        }
    },

});
