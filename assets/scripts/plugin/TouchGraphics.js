/**
 * 触摸绘图
 */
let TouchGraphics = cc.Class({
    extends: cc.Graphics,

    properties: {
        _points: null,
    },

    onLoad () {
        console.log(this);
        
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);


        this.drawMessage = function (e) {
            if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            var data = JSON.parse(e.data);
            if (data) {
                switch (data.method) {
                    case "onFileMessage":
                        if (data.handleData && data.handleData.type == 'onTouchStart') {
                            this._points = [];
                            var location = data.handleData.location;
                            this._drawGraphics(location);
                        }

                        if (data.handleData && data.handleData.type == 'onTouchMove') {
                            var location = data.handleData.location;
                            this._drawGraphics(location);
                        }

                        if (data.handleData && data.handleData.type == 'onTouchEnd') {
                            var location = data.handleData.location;
                            this._drawGraphics(location);
                            this.node.emit('draw-end', this);
                        }
                }
            }
        }.bind(this);

        window.addEventListener("message", this.drawMessage, false);

    },

    onDestroy() {
        console.log('onDestroy');
        window.removeEventListener('message', this.drawMessage, false);
    },

    emitMessage(type,location){

        if (window !== window.parent) {
            let data = JSON.stringify({
                method: 'onFileMessage',
                handleData: {
                    type: type,
                    text: location
                },
            });
            window.parent.postMessage(data, '*');
        }
    },

    _onTouchStart(event) {
        console.log('aside');
        this._points = [];
        let location = event.getLocation();
        this._drawGraphics(location);

        this.emitMessage('onTouchStart',location);
    },

    drawGraphics(location) {
        this._drawGraphics(location);
    },

    _onTouchMove(event) {
        console.log('move');
        let location = event.getLocation();
        this._drawGraphics(location);

        this.emitMessage('onTouchMove',location);
    },

    _onTouchEnd(event) {
        let location = event.getLocation();
        this._drawGraphics(location);
        this.node.emit('draw-end', this);

        this.emitMessage('onTouchEnd',location);
    },

    getTrailPoints() {
        return this._points;
    },

    _drawGraphics(location) {
        let point = this.node.convertToNodeSpaceAR(location);
        let rect = this.node.getBoundingBox();
        rect.origin = cc.v2(0, 0);

        if (!rect.contains(this.node.convertToNodeSpace(location))) {
            return;
        }
      
        if (this._points.length === 0) {
            this.moveTo(point.x, point.y);
            this._points.push(point);
            this.node.emit('draw-start', this);
            return;
        }

        if (point.x === 0 && point.y === 0) {
            return;
        }

        let last = this._points[this._points.length - 1];
        if (last && last.sub(point).mag() < 4) {
            return;
        }
        
        this._points.push(point);
        this.lineTo(point.x, point.y);
        this.stroke();
        this.node.emit('draw-move', this);
    },
});

cc.Class.Attr.setClassAttr(TouchGraphics, 'miterLimit', 'visible', false);

module.exports = TouchGraphics;