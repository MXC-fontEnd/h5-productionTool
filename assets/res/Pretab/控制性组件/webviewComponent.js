const postMessage = require('postMessage');

cc.Class({
    extends: cc.Component,

    properties: {
        url: '',
        eventName:''
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.targetWidth = null;

        if(this.url && this.url !== ''){
            var webview = cc.find("backgroud/webview", this.node).getComponent(cc.WebView);
            webview.url = this.url;
        }
    },

    onDisable(){
        console.log('onDisable'); 
    },

    onDestroy(){
        console.log('onDestroy');
        if(this.EN){
            window.removeEventListener('message',this.EN,false);
        }
    },

    // update (dt) {},

    // webview 監聽事件
    onWebFinishLoad: function (target, event, customEventData) {
        if(!this.targetWidth && this.targetWidth !== 0){
            this.targetWidth = target.node.width;
            target.node.width = 0;
        }

        switch (event) {
            case cc.WebView.EventType.ERROR:
                console.log('ERROR');

                break;
            case cc.WebView.EventType.LOADING:
                console.log('LOADING');
                
                break;
            case cc.WebView.EventType.LOADED:
                console.log('LOADED');
                target.node.width = this.targetWidth;
                if(this.eventName !== ''){
                    var EN = this.eventName;
                    this.EN = postMessage[EN].bind({'target':target});
                    window.addEventListener("message",this.EN,false);
                }
                break;
            default:
                break;
        }

    }

});
