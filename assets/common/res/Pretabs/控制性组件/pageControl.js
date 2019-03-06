const postMessage = require('postMessage');

cc.Class({
    extends: cc.Component,

    properties: {
        pageCount: 3,
        currentPageSeq: 1,
        localDebugging: {
            default: false,
            displayName: '本地课件预览'
        },

        juniorCoursewareState: {
            default: true,
            displayName: '低龄课件'
        },

        juniorCoursewarePage: {
            default: [],
            type: [cc.Integer],
            displayName: '低龄课件页面'
        },

        seniorCoursewareState: {
            default: false,
            displayName: '高龄课件'
        },

        seniorCoursewarePage: {
            default: [],
            type: [cc.Integer],
            displayName: '高龄课件页面'
        },

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
            this.loadscene(this.currentPageSeq, function () {
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

    // 
    // 根据传参加载对应的场景
    //
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

    // 
    // 根据传参设置下一页
    //
    setNextPageSeq(seq) {
        this.nextPageSeq = parseInt(seq);
    },

    /**
     * @description: 自定义打包输出课件，通过参数配置拼装各场景
     * @param {type} 
     * @return: 
     */


});
