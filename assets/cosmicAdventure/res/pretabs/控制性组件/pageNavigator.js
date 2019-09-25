/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 14:17:01
 * @LastEditTime: 2019-09-25 18:08:39
 * @LastEditors: Please set LastEditors
 */

// 接入fundebug
var fundebug = require("fundebug-javascript");
fundebug.apikey = "04722b46808513df1807dc6f87450c69fbbe07be6a8f78eebce59d09aa26384c";

const { monitorMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,

    properties: {
        pageCount: {
            default: 1,
            tooltip: "总页数"
        },

        initPage: {
            default: 1,
            tooltip: "初始页"
        },

        localDebugging: {
            default: false,
            displayName: '本地课件预览',
            tooltip: "本地课件预览"
        },

        // 低龄课件选中状态
        juniorCoursewareState: {
            default: true,
            displayName: '低龄课件'
        },

        // 低龄课件页面配置
        juniorCoursewarePage: {
            default: [],
            type: [cc.Integer],
            displayName: '低龄课件页面'
        },

        // 高龄课件选中状态
        seniorCoursewareState: {
            default: false,
            displayName: '高龄课件'
        },

        // 高龄课件页面配置
        seniorCoursewarePage: {
            default: [],
            type: [cc.Integer],
            displayName: '高龄课件页面'
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // 端对端通信
        monitorMessage((data) => {
            switch (data.type) {
                case "SWITCHBOX_GO_PREVPAGE":
                case "SWITCHBOX_GO_NEXTPAGE":
                case "SWITCHBOX_GO_HANDLE_KEYDOWN":
                    this.loadscene(data.handleData.page);
                    break;
                default:
                    window.messageProxy.emit(data);
                    break;
            }
        })

        // 页面数
        window.parent.postMessage(
            JSON.stringify({ type: 'SWITCHBOX_SET_TOTAL_PAGE', totalPage: this.pageCount }),
            '*'
        );

        // 1.是否为常驻节点，2.不是则设置节点常驻
        cc.game.isPersistRootNode(this.node) ? console.log("我是常驻节点") : cc.game.addPersistRootNode(this.node);

        // 课件页 库
        if (this.juniorCoursewareState) {
            this.courseware = this.juniorCoursewarePage;
        } else if (this.seniorCoursewareState) {
            this.courseware = this.seniorCoursewarePage;
        }

        // 本地与远程
        if (this.localDebugging) this.node.getChildByName("localControl").active = true;
    },

    start() {
        let initPage = 1;
        if (this.initPage < 10) initPage = "0" + this.initPage;
        cc.director.preloadScene("page" + initPage, () => {
            console.log(`${"page" + initPage}预加载完!`);
            this.loadscene(this.initPage);
            // 页面数
            window.parent.postMessage(
                JSON.stringify({ type: 'COURSEWARE_ONLOAD' }),
                '*'
            );
        });
    },

    prev() {
        if (this.initPage > 0) {
            this.initPage--;
            this.loadscene(this.initPage);
        }
    },

    next() {
        if (this.initPage < this.pageCount) {
            this.initPage++;
            this.loadscene(this.initPage);
        }
    },

    // 
    // 根据传参加载对应的场景
    //
    loadscene(page) {
        let curPageNum = this.courseware[page - 1];
        let nextPageNum = this.courseware[page];
        if (!curPageNum) return console.log("请先配置课件");
        // 为了打包时的页码排序
        if (curPageNum < 10) curPageNum = "0" + curPageNum;
        if (nextPageNum < 10) nextPageNum = "0" + nextPageNum;
        cc.director.loadScene('page' + curPageNum, () => {
            // if (nextPageNum) {
            //     cc.director.preloadScene("page" + nextPageNum, () => {
            //         console.log(`page${this.courseware[page]}预加载完!`);
            //     });
            // }
        });
    },
});
