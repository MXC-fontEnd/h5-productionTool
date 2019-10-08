/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 14:17:01
 * @LastEditTime: 2019-10-08 10:11:52
 * @LastEditors: Please set LastEditors
 */

// 接入fundebug
// var fundebug = require("fundebug-javascript");
// fundebug.apikey = "04722b46808513df1807dc6f87450c69fbbe07be6a8f78eebce59d09aa26384c";

const { monitorMessage, sendMessage } = require("postMessage");

cc.Class({
    extends: cc.Component,

    properties: {
        tky: {
            default: false,
            displayName: '拓课云',
        },

        agora: {
            default: false,
            displayName: '声网',
        },

        pageCount: {
            default: 1,
            tooltip: "总页数",
            displayName: '总页数',
        },

        initPage: {
            default: 1,
            tooltip: "初始页"
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
        this.sceneName = "origin";
        // 1.是否为常驻节点，2.不是则设置节点常驻
        cc.game.isPersistRootNode(this.node) ? console.log("我是常驻节点") : cc.game.addPersistRootNode(this.node);

        switch (true) {
            case this.juniorCoursewareState == true:
                this.courseware = this.juniorCoursewarePage;
                break;
            case this.seniorCoursewareState == true:
                this.courseware = this.seniorCoursewarePage;
                break;
        }
        // cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, () => {
        //     console.log("加载新场景之前所触发的事件");
        // });

        // cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
        //     console.log("运行新场景之前所触发的事件");
        // });

        // cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
        //     console.log("运行新场景之后所触发的事件")
        //     sendMessage("CW_SCENE_LOADED", {
        //         name: this.sceneName
        //     });
        // });
        if (this.tky) {
            this.tkyInit();
        } else if (this.agora) {
            this.agoraInit();
        }
    },

    tkyInit() {
        window.MXC_TKY = true;
        // 端对端通信 监听
        monitorMessage((data) => {
            // 积木通信
            if (data.type) {
                window.messageProxy.emit(data);
            };

            switch (data.method) {
                case "onJumpPage":
                    cc.director.loadScene(this.getSceneName(parseInt(data.toPage)));
                    break;
                case 'onFileMessage':
                    if (data.handleData && data.handleData.isDocument) {
                        let triggerEle = document;
                        var ev = document.createEvent('HTMLEvents');
                        ev.initEvent(
                            data.handleData.eventType,
                            false,
                            true
                        );
                        ev.clientX =
                            (data.handleData.clientX *
                                window.innerWidth) /
                            data.handleData.width;
                        ev.clientY =
                            (data.handleData.clientY *
                                window.innerHeight) /
                            data.handleData.height;
                        //添加是否主动属性,防止死循环
                        const externalData = { isInitiative: false };
                        ev.externalData = externalData;
                        //触发事件
                        triggerEle.dispatchEvent(ev)
                    };

                    // 整合声网
                    window.messageProxy.emit(data);
                    break;
                default:
                    break;
            }
        })

        window.parent.postMessage(
            JSON.stringify({ method: 'onPagenum', totalPages: this.pageCount }),
            '*'
        );

        // 屏幕分辨率
        window.parent.postMessage(
            JSON.stringify({
                method: 'onLoadComplete',
                coursewareRatio: 16 / 9,
            }),
            '*'
        );
    },

    agoraInit() {
        window.MXC_AGORA = true;
        // 端对端通信 监听
        monitorMessage((data) => {
            switch (data.type) {
                case "SWITCHBOX_GO_PREVPAGE":
                case "SWITCHBOX_GO_NEXTPAGE":
                case "SWITCHBOX_GO_HANDLE_KEYDOWN":
                    cc.director.loadScene(this.getSceneName(data.handleData.page));
                    break;
                default:
                    window.messageProxy.emit(data);
                    break;
            }
        })

        // 课件总页数
        window.parent.postMessage(
            JSON.stringify({ type: 'SWITCHBOX_SET_TOTAL_PAGE', totalPage: this.pageCount }),
            '*'
        );

        // 课件已加载
        sendMessage('COURSEWARE_ONLOAD');

        cc.director.loadScene(1);
    },

    start() { },

    // 
    // 根据传参加载对应的场景
    //
    getSceneName(page) {
        let curPageNum = this.courseware[page - 1];
        if (!curPageNum) {
            return console.log("请先配置课件");
        }
        // 为了打包时的页码排序
        this.sceneName = curPageNum < 10 ? "page0" + curPageNum : "page" + curPageNum;
        return this.sceneName;
    },
});
