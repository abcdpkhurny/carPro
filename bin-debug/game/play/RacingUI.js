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
 * 竞速模式控制类
 */
var RacingUI = (function (_super) {
    __extends(RacingUI, _super);
    function RacingUI(_stage) {
        var _this = _super.call(this) || this;
        _this.up = "123";
        _this._stage = _stage;
        return _this;
    }
    RacingUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    RacingUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
        //console.log(this)
    };
    RacingUI.prototype.init = function () {
        //车初始定位
        this.play_car.x = this._stage.stageWidth / 2 - this.play_car.width / 2;
        this.play_car.alpha = 0;
        this.textKM.text = "0km";
        this.textTime.text = "0s";
        this.play_end.y = -87;
    };
    /**
     * 计时
     */
    RacingUI.prototype.passTime = function (s) {
        this.textTime.text = s + "s";
    };
    /**
     * 计算路程
     */
    RacingUI.prototype.KMTime = function (sum, k) {
        var km = sum - k * 0.01;
        if (km <= 0)
            km = 0;
        this.textKM.text = km.toFixed(2) + "km";
    };
    //关闭本页面带框
    RacingUI.prototype.closePrise = function (obj) {
        if (obj.parent) {
            obj.parent.removeChild(obj);
        }
    };
    return RacingUI;
}(eui.Component));
__reflect(RacingUI.prototype, "RacingUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=RacingUI.js.map