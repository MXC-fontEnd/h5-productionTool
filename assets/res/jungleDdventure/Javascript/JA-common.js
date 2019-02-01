
// function monitorMessage(e) {
//         if (window === window.parent) return;
//         if (typeof e.data !== 'string') return;
//         var data = JSON.parse(e.data);
//         if (data) {
//             switch (data.method) {
//                 case "onFileMessage":

//                     if (data.handleData && data.handleData.type == 'playerJump') {

//                     }

//             }
//         }
// }

function postMessage(handleData){
    if (window !== window.parent) {
        let data = JSON.stringify({
            method: 'onFileMessage',
            handleData:handleData,
        });
        window.parent.postMessage(data, '*');
    }
}

module.exports = {
	postMessage: postMessage
};