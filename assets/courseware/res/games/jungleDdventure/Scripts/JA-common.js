/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:31
 * @LastEditTime: 2019-08-27 18:11:57
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