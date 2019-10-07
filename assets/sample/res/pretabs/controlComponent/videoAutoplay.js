/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-30 17:43:58
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() {},
    onVideoPlayerEvent: function (videoplayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED:
                console.log('videoplayer meta-loaded');
                break;

            case cc.VideoPlayer.EventType.READY_TO_PLAY:
                console.log('videoplayer ready-to-play');
                videoplayer.play();

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
                break;
            default:
                break;
        }
    }
});