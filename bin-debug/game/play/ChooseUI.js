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
 * 赛车选择类
 */
var ChooseUI = (function (_super) {
    __extends(ChooseUI, _super);
    function ChooseUI() {
        var _this = _super.call(this) || this;
        _this.mbtns = [];
        _this.effect = 0;
        return _this;
    }
    ChooseUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    ChooseUI.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.mbtnYse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickYse, this);
        this.mbtnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickLeft, this);
        this.mbtnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickRight, this);
        this.mbtns = [this.mbtn0, this.mbtn1, this.mbtn2, this.mbtn3];
        for (var i = this.mbtns.length - 1; i > -1; --i) {
            // 事件委托, 点击按钮的时候触发toggleBtn
            this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                var theBtn = e.target;
                _this.toggleBtn(theBtn);
            }, this);
        }
        this.init();
    };
    ChooseUI.prototype.init = function () {
        this.effect = 0;
        this.togglePlayer();
    };
    /**
     * 点击选择
     */
    ChooseUI.prototype.clickYse = function () {
        if (this.mbtnYse.selected)
            this.mbtnYse.selected = false;
        this.closePrise(this);
    };
    /**
     * 点击左
     */
    ChooseUI.prototype.clickLeft = function () {
        if (this.mbtnLeft.selected)
            this.mbtnLeft.selected = false;
        this.effect--;
        this.togglePlayer();
    };
    /**
     * 点击右
     */
    ChooseUI.prototype.clickRight = function () {
        if (this.mbtnRight.selected)
            this.mbtnRight.selected = false;
        this.effect++;
        this.togglePlayer();
    };
    /**
     * 变动选择车
     */
    ChooseUI.prototype.togglePlayer = function () {
        var num;
        if (this.effect >= 0) {
            num = this.effect % 5;
        }
        else {
            num = 5 + (this.effect % 5);
        }
        for (var i = 0; i < 4; i++) {
            var btn = this.mbtns[i];
            if (num == 5) {
                num = 0;
            }
            btn.selected = false;
            if (btn.pic)
                btn.pic.source = "play_car" + num + "_png";
            num++;
        }
        this.mbtnYse.pic.source = "btn_xuan1_png";
        this.mbtnYse.touchEnabled = false;
    };
    /**
     * 切换按钮
     * @param btn 参数是eui.ToggleButton的时候切换按钮, 参数是0的时候设置为全部不选中
     */
    ChooseUI.prototype.toggleBtn = function (btn) {
        //console.log('点击')
        // 先把所有的按钮都设置为不选中
        for (var i = this.mbtns.length - 1; i > -1; --i) {
            this.mbtns[i].selected = false;
        }
        this.player = btn.pic.source;
        // 把传进来的btn设置为选中状态
        btn = btn;
        btn.selected = true;
        this.mbtnYse.pic.source = "btn_xuan_png";
        this.mbtnYse.touchEnabled = true;
    };
    //关闭本页面带框
    ChooseUI.prototype.closePrise = function (obj) {
        if (obj.parent) {
            obj.parent.removeChild(obj);
        }
    };
    return ChooseUI;
}(eui.Component));
__reflect(ChooseUI.prototype, "ChooseUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ChooseUI.js.map