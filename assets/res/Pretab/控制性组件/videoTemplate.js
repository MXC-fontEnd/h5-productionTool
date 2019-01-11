cc.Class({
    extends: cc.Component,

    properties: {
        videoList: {
            default: [],
            type: cc.Node
        },

        bindMessage: true
    },

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.videoNode = null;
        this.curVideoPositonY = null;
        this.videoplayer = null;
    },

    onLoad() {
        this.init();

        this.videoTemplateBind = function (e) {
            console.log('videoTemplateBind');
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);

            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData.type == 'videoTemplateMessage') {
                            var pars = data.handleData.pars;
                            switch (data.handleData.method) {
                                case 'videoShow':
                                    this.videoShow(pars.event, parseInt(pars.index), pars.author);
                                    break;
                                case 'videoHide':
                                    this.videoHide(pars.event, parseInt(pars.index), pars.author);
                                    break;
                            }
                        }

                        if (data.handleData.type == 'videoplayer') {
                            if(!this.videoplayer) return;
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

                        break;
                }
            }
        }.bind(this);

        window.addEventListener('message', this.videoTemplateBind, false);
    },

    onDisable() {
        console.log('onDisable');
    },

    onDestroy() {
        console.log('onDestroy');
        if (this.videoTemplateBind) {
            window.removeEventListener('message', this.videoTemplateBind, false);
        }
    },

    // update (dt) {},

    videoShow(event, index, author) {
        console.log('videoShow');
        this.videoNode = this.videoList[index];
        this.curVideoPositonY = this.videoNode.y;
        this.videoNode.y = 0;
        this.videoplayer = this.videoNode.getChildByName("videoplayer").getComponent(cc.VideoPlayer);

        console.log(this.videoplayer);
        if (!author) {
            this.videoTemplateMessage('videoTemplateMessage', 'videoShow', {
                event: '',
                index: index,
                author: true
            });
        }

    },

    videoHide(event, index, author) {
        console.log('videoHide');
        this.videoNode.y = this.curVideoPositonY;
        this.init();
        if (!author) {
            this.videoTemplateMessage('videoTemplateMessage', 'videoHide', {
                event: '',
                index: index,
                author: true
            });
        }

    },

    videoTemplateMessage(type, method, pars) {
        console.log('videoTemplateMessage');
        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    method: method,
                    pars: pars
                },
            });
            window.parent.postMessage(data, '*');
        }
    },


    // onVideoPlayerEvent(videoplayer, eventType, customEventData) {
    //     console.log('onVideoPlayerEvent');
    //     // videoplayer正在播放
    //     if (eventType === cc.VideoPlayer.EventType.PLAYING) {

    //     }

    //     // videoplayer暂停
    //     if (eventType === cc.VideoPlayer.EventType.PAUSED) {

    //     }

    //     // videoplayer关闭
    //     if (eventType === cc.VideoPlayer.EventType.STOPPED) {

    //     }

    //     // videoplayer播放完毕
    //     if (eventType === cc.VideoPlayer.EventType.COMPLETED) {

    //     }

    //     if (eventType === cc.VideoPlayer.EventType.META_LOADED) {
    //         console.log('视频加载完成！');
    //         this.videoplayer = videoplayer;

    //         console.log(this.videoplayer)
    //     }

    // },

    // resume(event, pars) {
    //     console.log('resume');
    //     if (this.videoplayer) {
    //         this.videoplayer.resume();
    //         this.videoPostMessage('videoplayer', 'resume');
    //     }
    // },

    // pause(event, pars) {
    //     console.log('pause');
    //     if (this.videoplayer) {
    //         this.videoplayer.pause();
    //         this.videoPostMessage('videoplayer', 'pause');
    //     }
    // },

    // stop(event, pars) {
    //     console.log('stop');
    //     if (this.videoplayer) {
    //         this.videoplayer.stop();
    //         this.videoPostMessage('videoplayer', 'stop');
    //     }
    // },

    // videoPostMessage(type, method) {
    //     console.log('videoPostMessage');
    //     if (window !== window.parent) {
    //         let data = JSON.stringify({
    //             method: 'onFileMessage',
    //             handleData: {
    //                 type: type,
    //                 method: method
    //             },
    //         });
    //         window.parent.postMessage(data, '*');
    //     }
    // },

});
