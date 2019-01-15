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
var CheckUI = (function (_super) {
    __extends(CheckUI, _super);
    function CheckUI() {
        var _this = _super.call(this) || this;
        _this.ChanReqType = "YCW_JSONP";
        _this.cooper_id = "GhaniAG68ks%3D";
        _this.session_id = "3432";
        _this.completePess = false;
        return _this;
    }
    CheckUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    CheckUI.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        if (!this.loading) {
            this.loading = new LoadingUI();
        }
        this.mbtnYse.addEventListener(egret.TouchEvent.TOUCH_END, this.checkout, this);
        this.btnDa.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.imgText.scaleX = 1.2;
            _this.imgText.scaleY = 1.2;
        }, this);
        this.textCheck.addEventListener(egret.FocusEvent.FOCUS_IN, function () {
            _this.y = -400;
        }, this);
        this.textCheck.addEventListener(egret.FocusEvent.FOCUS_OUT, function () {
            _this.y = 0;
        }, this);
        this.btnHuan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.swopText, this);
        this.textCheck.addEventListener(egret.Event.CHANGE, function () {
            if (_this.textCheck.text == "") {
                _this.mbtnYse.touchEnabled = false;
                _this.imgBtn.source = "check_yes1_png";
            }
            else {
                _this.mbtnYse.touchEnabled = true;
                _this.imgBtn.source = "check_yes_png";
                _this.textError.alpha = 0;
            }
        }, this);
        //处理遮罩，避免开放数据域事件影响主域。
        this.loadingMask = new egret.Shape();
        this.loadingMask.graphics.beginFill(0x000000, 1);
        this.loadingMask.graphics.drawRect(0, 0, GameConst.StageW, GameConst.StageH);
        this.loadingMask.graphics.endFill();
        this.loadingMask.alpha = 0.5;
        //禁止底层的事件操作
        this.loadingMask.touchEnabled = true;
        this.init();
    };
    /**
     * 初始化
     */
    CheckUI.prototype.init = function () {
        this.y = 0;
        this.imgText.scaleX = 1;
        this.imgText.scaleY = 1;
        this.textError.alpha = 0;
        this.textCheck.text = "";
        this.mbtnYse.touchEnabled = false;
        if (this.errUI)
            GameConst.removeChild(this.errUI);
        this.isExit = false;
        //这里是检测问题
        this.imgBtn = this.mbtnYse.imgBtn;
        this.imgBtn.source = "check_yes1_png";
        //这里是图片处理
        this.receiveCheck();
    };
    CheckUI.prototype.initTextCheck = function () {
        var _this = this;
        this.textCheck = new eui.TextInput();
        this.textCheck.inputType = egret.TextFieldInputType.TEXT;
        this.textCheck.prompt = "请输入验证码";
        this.textCheck.width = 206;
        this.textCheck.height = 29;
        this.textCheck.horizontalCenter = -87;
        this.textCheck.y = 738.67;
        this.textCheck.addEventListener(egret.FocusEvent.FOCUS_IN, function () {
            _this.y = -400;
        }, this);
        this.textCheck.addEventListener(egret.FocusEvent.FOCUS_OUT, function () {
            _this.y = 0;
        }, this);
    };
    CheckUI.prototype.receiveCheck = function () {
        var _this = this;
        var self = this;
        this.addChild(this.loadingMask);
        this.addChild(this.loading);
        //这里拿session_id,先写死
        //this.session_id = Math.floor(Math.random()*10000).toString()
        console.log(this.session_id);
        var url = "https://zerosky.zerosky.top/game/servlet/ccbNewClient";
        var param = "TXCODE=YCW004&ChanReqType=" + this.ChanReqType + "&cooper_id=" + this.cooper_id + "&session_id=" + this.session_id;
        var req = GameConst.reqGetJSON(url + "?" + param);
        req.addEventListener(egret.Event.COMPLETE, function () {
            var data = req.response;
            var start = data.indexOf("(") + 1;
            var end = data.lastIndexOf(")");
            data = data.substring(start, end);
            //console.log(data);
            var josnDate = JSON.parse(data);
            if (josnDate.status == "0") {
                var tu = josnDate.base64_Pic_Txn_Inf;
                if (tu == "") {
                    self.receiveCheck();
                }
                else {
                    _this.Pcsg_Tsk_ID = josnDate.Pcsg_Tsk_ID;
                    _this.drawBase64(tu);
                    //这里应该是焦点问题
                    var tp = josnDate.Bsn_Cntnt_Tp;
                    if (tp == "1")
                        _this.textCheck.inputType = egret.TextFieldInputType.TEL;
                    else if (tp == "3")
                        _this.textCheck.inputType = egret.TextFieldInputType.TEXT;
                }
            }
            else {
                _this.onErr();
            }
        }, this);
        //网络超时，失败
        req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onErr, this);
    };
    CheckUI.prototype.onErr = function () {
        var _this = this;
        if (!this.errUI)
            this.errUI = new ErrUI();
        else
            this.errUI.init();
        this.addChild(this.errUI);
        this.errUI.once(egret.Event.REMOVED_FROM_STAGE, function () {
            if (_this.errUI.isRe)
                _this.receiveCheck();
            if (_this.errUI.isExit) {
                _this.isExit = true;
                _this.pass = true;
                GameConst.removeChild(_this);
            }
        }, this);
    };
    CheckUI.prototype.drawBase64 = function (base64) {
        var self = this;
        var bitmapdata = egret.BitmapData.create("base64", base64, function (bdata) {
            var texture = new egret.Texture();
            texture.bitmapData = bdata;
            self.imgText.source = texture;
            GameConst.removeChild(self.loading);
            GameConst.removeChild(self.loadingMask);
            self.imgText.scaleX = 1;
            self.imgText.scaleY = 1;
        });
    };
    /**
     * 确认检验
     */
    CheckUI.prototype.checkout = function () {
        var _this = this;
        if (this.mbtnYse.selected)
            this.mbtnYse.selected = false;
        var Inpt_Cntnt = this.textCheck.text;
        var url = GameConst.url + "game/servlet/ccbNewClient";
        var param = "TXCODE=YCW005&cooper_id=" + this.cooper_id + "&session_id=" + this.session_id + "&Pcsg_Tsk_ID="
            + this.Pcsg_Tsk_ID + "&ChanReqType=" + this.ChanReqType + "&Inpt_Cntnt=" + Inpt_Cntnt;
        var req = GameConst.reqGetJSON(url + "?" + param);
        req.addEventListener(egret.Event.COMPLETE, function () {
            var data = req.response;
            var start = data.indexOf("(") + 1;
            var end = data.lastIndexOf(")");
            data = data.substring(start, end);
            //console.log(data)
            var josnDate = JSON.parse(data);
            if (josnDate.isCorrect == "1") {
                _this.textError.alpha = 0;
                //输入正确
                _this.pass = true;
                console.log("通过");
                _this.completePess = true;
                GameConst.removeChild(_this);
            }
            else {
                _this.textError.alpha = 1;
                _this.textCheck.text = "";
                _this.receiveCheck();
            }
        }, this);
        //网络超时，失败
        req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onErr, this);
    };
    /**
     * 交换
     */
    CheckUI.prototype.swopText = function () {
        this.textError.alpha = 0;
        this.receiveCheck();
    };
    CheckUI.prototype.removeChildAll = function () {
        GameConst.removeChild(this.loading);
        GameConst.removeChild(this.loadingMask);
    };
    return CheckUI;
}(eui.Component));
__reflect(CheckUI.prototype, "CheckUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=CheckUI.js.map