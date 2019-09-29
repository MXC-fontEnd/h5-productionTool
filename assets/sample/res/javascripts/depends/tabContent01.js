// /*
//  * @Description: In User Settings Edit
//  * @Author: your name
//  * @Date: 2019-08-13 14:33:27
//  * @LastEditTime: 2019-09-05 15:47:47
//  * @LastEditors: Please set LastEditors
//  */
// const { sendMessage } = require("messageUtils");

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         triggers: {
//             default: [],
//             type: [cc.Node]
//         },
//         shows: {
//             default: [],
//             type: [cc.Node]
//         },
//     },

//     // LIFE-CYCLE CALLBACKS:

//     onLoad() {
//         this.isMessageAction = false;

//         for (let n = 0; n < this.triggers.length; n++) {
//             this.triggers[n].on(cc.Node.EventType.TOUCH_START, this.triggerClicked, this);
//         }

//         // 监听课件message
//         window.messageCallback = (data) => {
//             this.isMessageAction = true;
//             switch (data.type) {
//                 case "CW_TABCONTENT":
//                     this[data.handleData.method](null, data.handleData.customEventData)
//                     break;
//                 default:
//                     this.isMessageAction = false;
//                     break;
//             }
//         }
//     },

//     triggerClicked(e, customEventData) {
//         let seq = e ? parseFloat(e.currentTarget.name.slice(-2)) : customEventData;
//         for (let i = 0; i < this.shows.length; i++) {
//             this.shows[i].active = i == seq - 1 ? true : false;
//         }

//         this.isMessageAction ? this.isMessageAction = false : sendMessage("CW_TABCONTENT", { method: "triggerClicked", customEventData: seq });
//     },

//     onDestroy() {
//         console.log('onDestroy');
//     },
// });
