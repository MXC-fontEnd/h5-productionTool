/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-10 16:41:11
 * @LastEditTime: 2019-10-10 16:42:27
 * @LastEditors: Please set LastEditors
 */

const dispatchFn = (node, name, detail) => {
    let config = new cc.Event.EventCustom(name, true);
    config.setUserData(detail);
    node.dispatchEvent(config);
}

module.exports = {
    dispatchFn
}