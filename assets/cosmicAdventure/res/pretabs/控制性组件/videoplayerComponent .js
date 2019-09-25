cc.Class({
    extends: cc.Component,

    properties: {
        bindMessage: true
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.videoplayer = null;
        if (this.bindMessage) {
            this.videoMessageBind = function (e) {
                if (window === window.parent) return;
                if (typeof e.data !== 'string') return;
                var data = JSON.parse(e.data);

                if (data) {
                    switch (data.method) {
                        case "onFileMessage":
                            if (data.handleData.type == 'videoplayer') {
                                switch (data.handleData.method) {
                                    case 'resume':
                                        this.videoplayer.resume();
                                        break;
                                    case 'pause':
                                        this.videoplayer.pause();
                                        break;
                                    case 'stop':
                                        this.videoplayer.stop();
                                        break;
                                }
                            }

                            // if (data.handleData && data.handleData.type == 'switchPlay') {
                            //     this.node.dispatchEvent(new cc.Event.EventCustom('videoplayerClicked', true));
                            // }

                            break;
                    }
                }
            }.bind(this);

            window.addEventListener('message', this.videoMessageBind, false);
        }

    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');

        if (this.videoMessageBind) {
            window.removeEventListener('message', this.videoMessageBind, false);
        }

    },

    // update (dt) {},

    onVideoPlayerEvent(videoplayer, eventType, customEventData) {
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
            this.node.dispatchEvent(new cc.Event.EventCustom('videoplayerClicked', true));
            // this.videoPostMessage('switchPlay');
        }

        // videoplayer加载完成
        if (eventType === cc.VideoPlayer.EventType.META_LOADED) {
            console.log('videoplayer加载完成');
            this.videoplayer = videoplayer;
        }

    },

    resume(event, pars) {
        console.log('resume');
        if (this.videoplayer) {
            this.videoplayer.resume();
            this.videoPostMessage('videoplayer', 'resume');
        }
    },

    pause(event, pars) {
        console.log('pause');
        if (this.videoplayer) {
            this.videoplayer.pause();
            this.videoPostMessage('videoplayer', 'pause');
        }
    },

    stop(event, pars) {
        console.log('stop');
        if (this.videoplayer) {
            this.videoplayer.stop();
            this.videoPostMessage('videoplayer', 'stop');
        }
    },

    videoPostMessage(type, method) {
        console.log('videoPostMessage');
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

});
