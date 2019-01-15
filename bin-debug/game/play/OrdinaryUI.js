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
 * 普通模式控制类
 */
var OrdinaryUI = (function (_super) {
    __extends(OrdinaryUI, _super);
    function OrdinaryUI(_stage) {
        var _this = _super.call(this) || this;
        _this.mbtns = [];
        _this._stage = _stage;
        return _this;
    }
    OrdinaryUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    OrdinaryUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //车的移动距离
        this.range = this._stage.stageWidth / 2 - this.stage.stageWidth * 0.22;
        this.mbtnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moreLeft, this);
        this.mbtnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moreRight, this);
        this.mbtns = [this.mbtnLeft, this.mbtnRight];
        this.init();
        //console.log(this)
    };
    /**
     * 初始化
     */
    OrdinaryUI.prototype.init = function () {
        //车初始定位
        this.play_car.x = this._stage.stageWidth / 2 - this.play_car.width / 2;
        this.play_car.alpha = 0;
        this.textScore.text = "0";
        this.textPass.text = "1";
        this.textUp.text = "3";
    };
    //左移
    OrdinaryUI.prototype.moreLeft = function () {
        if (this.mbtnLeft.selected)
            this.mbtnLeft.selected = false;
        if (this.play_car.x > this.stage.stageWidth * 0.3) {
            this.play_car.x -= this.range;
            this.pool.pmove = -1;
        }
    };
    //右移
    OrdinaryUI.prototype.moreRight = function () {
        if (this.mbtnRight.selected)
            this.mbtnRight.selected = false;
        if (this.play_car.x < this.stage.stageWidth * 0.6) {
            this.play_car.x += this.range;
            this.pool.pmove = 1;
        }
    };
    /**
     * 计时
     */
    OrdinaryUI.prototype.passTime = function (s) {
        this.textPass.text = s + "s";
    };
    /**
     * 计算得分
     */
    OrdinaryUI.prototype.sumScore = function (num, i) {
        var sum = num + i;
        this.textScore.text = num + "";
        return sum;
    };
    /**
     * 控制按钮
     */
    OrdinaryUI.prototype.controlMbtns = function (flay) {
        for (var i = 0; i < this.mbtns.length; i++) {
            this.mbtns[i].touchEnabled = flay;
        }
    };
    return OrdinaryUI;
}(eui.Component));
__reflect(OrdinaryUI.prototype, "OrdinaryUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=OrdinaryUI.js.map