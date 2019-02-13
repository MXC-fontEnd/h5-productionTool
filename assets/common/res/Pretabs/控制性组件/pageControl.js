const postMessage = require('postMessage');

cc.Class({
    extends: cc.Component,

    properties: {

        pageCount: 3,
        currentPageSeq: 1,
        localDebugging: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.nextPageSeq = this.currentPageSeq;
        this.loadState = true;

        // 节点常驻
        cc.game.addPersistRootNode(this.node);

        // 本地与远程
        if (this.localDebugging) {
            this.node.getChildByName("localControl").active = true;
            this.loadscene(this.currentPageSeq);
        } else {
            this.loadscene(this.currentPageSeq,function(){
                postMessage.init(this);
            }.bind(this));
        }



    },

    update(dt) {
        if (this.nextPageSeq && this.nextPageSeq !== this.currentPageSeq && this.loadState) {
            this.loadState = false;
            this.loadscene(this.nextPageSeq, function () {
                this.loadState = true;
            }.bind(this));
        }
    },

    prev() {
        console.log('prev');
        if (this.currentPageSeq > 1) {
            this.currentPageSeq--;
            this.loadscene(this.currentPageSeq);
        }
    },

    next() {
        console.log('next');
        if (this.currentPageSeq < this.pageCount) {
            this.currentPageSeq++;
            this.loadscene(this.currentPageSeq);
        }
    },

    loadscene(seq, callback) {
        var page = 'page' + parseInt(seq);
        if (page) {
            cc.director.loadScene(page, function () {
                this.currentPageSeq = seq;
                if (callback) {
                    callback();
                }
            }.bind(this));
        }
    },

    setNextPageSeq(seq) {
        this.nextPageSeq = parseInt(seq);
    }

});
