/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-09 18:26:31
 * @LastEditTime: 2019-09-12 13:59:44
 * @LastEditors: Please set LastEditors
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    onVideoPlayerEvent(videoplayer, eventType, customEventData) {
        // videoplayer元信息加载完毕
        if (eventType === cc.VideoPlayer.EventType.META_LOADED) {
            console.log('videoplayer元信息加载完毕');
        }

        // videoplayer已准备好
        if (eventType === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            console.log('videoplayer已准备好');
            videoplayer.play();
            videoplayer.stop();
        }

        // videoplayer正在播放
        if (eventType === cc.VideoPlayer.EventType.PLAYING) {
            console.log('videoplayer正在播放');
        }

        // videoplayer暂停
        if (eventType === cc.VideoPlayer.EventType.PAUSED) {
            console.log('videoplayer暂停');
        }

        // videoplayer关闭
        if (eventType === cc.VideoPlayer.EventType.STOPPED) {
            console.log('videoplayer关闭');
        }

        // videoplayer播放完毕
        if (eventType === cc.VideoPlayer.EventType.COMPLETED) {
            console.log('videoplayer播放完毕');
        }

        // videoplayer被点击
        if (eventType === cc.VideoPlayer.EventType.CLICKED) {
            console.log('videoplayer被点击');
            videoplayer.play();
        }

    },
    // update (dt) {},
});
