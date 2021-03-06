/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 14:40:28
 * @LastEditTime: 2019-09-25 18:07:23
 * @LastEditors: Please set LastEditors
 */

module.exports = {
    monitorMessage: (fn) => {
        window.addEventListener("message", (e) => {
            if (e) {
                if (e.data && typeof e.data == "string") {
                    return fn(JSON.parse(e.data));
                } else {
                    return console.log("message有误！");
                }
            }
        })
    },

    sendMessage: (type, handleData) => {
        if (window !== window.parent) {
            if (window.MXC_TKY) {
                window.parent.postMessage(JSON.stringify({
                    method:"onFileMessage",
                    handleData:{
                        type,
                        handleData,
                    }
                }), '*'); 
            } else if (window.MXC_AGORA) {
                window.parent.postMessage(JSON.stringify({
                    type,
                    handleData,
                }), '*');
            }
        }
    },
};