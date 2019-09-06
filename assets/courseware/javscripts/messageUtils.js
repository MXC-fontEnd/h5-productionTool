/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 14:16:04
 * @LastEditTime: 2019-09-04 15:02:23
 * @LastEditors: Please set LastEditors
 */


module.exports = {
    sendMessage: (type, handleData) => {
        if (window !== window.parent) {
            window.parent.postMessage(JSON.stringify({
                type,
                handleData,
            }), '*');
        }
    },
};