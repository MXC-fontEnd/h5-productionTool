module.exports = {
	init: function(context) {
		if (!context) return

		// 页面数
		window.parent.postMessage(
			JSON.stringify({ method: "onPagenum", totalPages: context.pageCount }),
			"*"
		)
		// 屏幕分辨率
		window.parent.postMessage(
			JSON.stringify({
				method: "onLoadComplete",
				coursewareRatio: 16 / 9
			}),
			"*"
		)

		// 端对端通信
		window.addEventListener("message", function(e) {
			// if (window.top === window.self || typeof e.data !== "string") return
			var data = JSON.parse(e.data)
			if (data) {
				switch (data.method) {
					// 上一页
					case "onPageup":
						console.log("onPageup")
						break
					case "onPagedown":
						console.log("onPagedown")
						break
					case "onJumpPage":
						console.log("onJumpPage")
						observer.emit("jumpPage", data.toPage)
						break
					case "onFileMessage":
						const res = data.handleData
						if (data.handleData && data.handleData.isDocument) {
							let triggerEle = document
							var ev = document.createEvent("HTMLEvents")
							ev.initEvent(data.handleData.eventType, false, true)
							ev.clientX =
								(data.handleData.clientX * window.innerWidth) /
								data.handleData.width
							ev.clientY =
								(data.handleData.clientY * window.innerHeight) /
								data.handleData.height
							//添加是否主动属性,防止死循环
							const externalData = { isInitiative: false }
							ev.externalData = externalData
							//触发事件
							triggerEle.dispatchEvent(ev)
						}
						if (res && res.isCustom) {
							const { type, data } = res
							console.log("接收到事件：", type, "传递参数：", data)
							observer.emit(type, data)
						}
						break
				}
			}
		})
	},
	jumpPage(page) {
		window.parent.postMessage(
			JSON.stringify({ method: "onJumpPage", toPage: page }),
			"*"
		)
	},
	customEvent(type, data) {
		window.parent.postMessage(
			JSON.stringify({
				method: "onFileMessage",
				handleData: {
					isCustom: true,
					type,
					data
				}
			}),
			"*"
		)
		// onFileMessage事件第三方不会分发到本地，所以主动做本地分发
		observer.emit(type, data)
	}
}
