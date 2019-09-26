/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-09-26 12:22:57
 * @LastEditors: Please set LastEditors
 */
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad() { },
    onVideoPlayerEvent(videoplayer, eventType, customEventData) {
        switch (eventType) {
            case cc.VideoPlayer.EventType.META_LOADED:
                console.log('videoplayer加载完成');
                break;
            // videoplayer已准备好
            case cc.VideoPlayer.EventType.READY_TO_PLAY:
                console.log('videoplayer已准备好');
                // ipad 视频不播放，不会显示第一帧
                // 加载玩，先播放，在停止，让其显示第一帧
                videoplayer.play();
                videoplayer.stop();
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
                this.node.dispatchEvent(new cc.Event.EventCustom('videoClicked', true));
                break;
            default:
                break;
        }
    },

});
