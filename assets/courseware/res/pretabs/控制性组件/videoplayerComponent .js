/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-04 15:31:59
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,
    properties: {},
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
    },

    // update (dt) {},

    onVideoPlayerEvent(videoplayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED:
                console.log('videoplayer加载完成');
                break;

            case cc.VideoPlayer.EventType.PLAYING:
                console.log('videoplayer正在播放');
                break;

            case cc.VideoPlayer.EventType.PAUSED:
                console.log('videoplayer暂停');
                break;

            case cc.VideoPlayer.EventType.STOPPED:
                console.log('videoplayer关闭');
                break;

            case cc.VideoPlayer.EventType.COMPLETED:
                console.log('videoplayer播放完毕');
                break;

            case cc.VideoPlayer.EventType.CLICKED:
                console.log('videoplayer被点击');
                break;
            default:
                break;
        }
    },

});
