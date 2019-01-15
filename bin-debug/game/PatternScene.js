var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 游戏模式选择类
 */
var PatternScene = (function (_super) {
    __extends(PatternScene, _super);
    function PatternScene() {
        return _super.call(this) || this;
    }
    PatternScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    PatternScene.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.mbtns = [this.mbtnRacing, this.mbtnNormal, this.mbtnBack];
        for (var i = this.mbtns.length - 1; i > -1; --i) {
            // 事件委托, 点击按钮的时候触发toggleBtn
            this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                var theBtn = e.target;
                _this.toggleBtn(theBtn);
            }, this);
        }
        //this.addReq()
    };
    PatternScene.prototype.ajaxReq = function () {
        var url = GameConst.url + "fecthSessionId.do";
        var param = "openId=123";
        var req = GameConst.reqGetJSON(url + "?" + param);
        req.addEventListener(egret.Event.COMPLETE, function () {
            console.log(JSON.parse(req.response));
        }, this);
    };
    /**
     * 切换按钮
     * @param btn 参数是eui.ToggleButton的时候切换按钮, 参数是0的时候设置为全部不选中
     */
    PatternScene.prototype.toggleBtn = function (btn) {
        //console.log('点击')
        // 先把所有的按钮都设置为不选中
        for (var i = this.mbtns.length - 1; i > -1; --i) {
            this.mbtns[i].selected = false;
        }
        if (btn === 0) {
            //console.log('返回');
            return;
        }
        btn = btn;
        // 获取当前点击的按钮的下标, 用来实现不同按钮对应的功能
        // 0 1 2  对应 竞速模式，普通模式，返回
        var index = this.mbtns.lastIndexOf(btn);
        switch (index) {
            case 0:
                SceneManager.toRacing();
                break;
            case 1:
                SceneManager.toOrdinary();
                break;
            case 2:
                this.closePrise();
            default:
                break;
        }
    };
    //关闭本页面带框
    PatternScene.prototype.closePrise = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return PatternScene;
}(eui.Component));
__reflect(PatternScene.prototype, "PatternScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=PatternScene.js.map