/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 14:40:28
 * @LastEditTime: 2019-09-26 12:06:27
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
            window.parent.postMessage(JSON.stringify({
                type,
                handleData,
            }), '*');
        }
    },
};