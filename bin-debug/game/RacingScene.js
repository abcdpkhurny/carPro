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
 * 竞速场景类
 */
var RacingScene = (function (_super) {
    __extends(RacingScene, _super);
    function RacingScene() {
        var _this = _super.call(this) || this;
        _this.kmGrade = 0;
        _this.pass_time = 0;
        _this.kmPass = 0;
        return _this;
    }
    //竞速
    RacingScene.prototype.toRacing = function () {
        this.kmSum = 100;
        if (this.ctnrRA) {
            GameConst.removeChild(this.checkUI);
            this.addChild(this.ctnrRA);
            //数据初始化 	
            this.bg.y = 0;
            this.kmGrade = 0;
            this.pass_time = 0;
            this.kmPass = 0;
            this.gameOver = false;
            this.racingUI.init();
            //加速度
            this.racingUI.up = "0";
        }
        else {
            this.ctnrRA = new egret.Sprite();
            this.addChild(this.ctnrRA);
            this.createBg(this.ctnrRA);
            this.racingUI = new RacingUI(this._stage);
            this.ctnrRA.addChild(this.racingUI);
            //测试
            this.racingUI.up = this.kmGrade + "";
            //测试用
            // this.racingUI.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 	console.log("黄色")
            // }, this)
            // this.racingUI.btnShop.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 	console.log("蓝色")
            // 	GameConst.removeChild(this.ctnrRA)
            // 	this.clearTime();
            // 	this.gameOver = true
            // }, this)
        }
        //this.racingRun();
        this.openChooseUI();
    };
    /**
     * 竞速动态
     */
    RacingScene.prototype.racingRun = function () {
        var _this = this;
        window.clearInterval(this.timeBg);
        window.clearInterval(this.timePass);
        window.clearInterval(this.timeCheck);
        //背景动画
        this.timeBg = window.setInterval(function () {
            if (_this.gameOver) {
                _this.clearTime();
            }
            //游戏结束
            if (_this.kmPass * 0.01 >= _this.kmSum) {
                _this.clearTime();
                _this.gameOver = true;
                GameConst.removeChild(_this.checkUI);
                _this.checkUI = null;
                _this.controlBacksh(false);
                //这里排行榜出现
                _this.openRanking();
            }
            _this.bg.y += 20;
            _this.kmPass += 2;
            _this.racingUI.KMTime(_this.kmSum, _this.kmPass);
            //最后一段距离显示终点线
            if ((_this.kmSum - _this.kmPass * 0.01) < 0.44)
                _this.racingUI.play_end.y += 20;
            if (_this.bg.y >= -_this.bgLen) {
                _this.bg.y = 0;
            }
        }, 40 - this.kmGrade * 3);
        //时间
        this.timePass = window.setInterval(function () {
            _this.racingUI.passTime(++_this.pass_time);
        }, 1000);
        //每段时间检测
        this.timeCheck = window.setInterval(function () {
            if (!_this.checkUI.parent) {
                if (_this.racingUI.textKM.text === "0.00km") {
                    return;
                }
                _this.openCheckUI();
            }
        }, 1000);
    };
    //背景
    RacingScene.prototype.createBg = function (ctnr) {
        var a = this.createBitmapByName("play_bg_jpg");
        a.y = this._stage.stageHeight - a.height;
        var b = this.createBitmapByName("play_bg_jpg");
        b.y = this._stage.stageHeight - b.height - b.height;
        var c = this.createBitmapByName("play_bg_jpg");
        this.bgLen = c.y = this._stage.stageHeight - a.height - b.height - c.height;
        this.bg = new egret.Sprite();
        this.bg.addChild(a);
        this.bg.addChild(b);
        this.bg.addChild(c);
        ctnr.addChild(this.bg);
    };
    RacingScene.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 关闭所有定时器
     */
    RacingScene.prototype.clearTime = function () {
        window.clearInterval(this.timeBg);
        window.clearInterval(this.timePass);
        window.clearInterval(this.timeEnd);
        window.clearInterval(this.timeCheck);
    };
    /**
     * 控制黑底出现
     */
    RacingScene.prototype.controlBacksh = function (flay) {
        if (!this.backShp) {
            this.backShp = new egret.Shape();
            this.backShp.graphics.beginFill(0x000000, 0.2);
            this.backShp.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
            this.backShp.graphics.endFill();
        }
        if (flay) {
            this.ctnrRA.addChild(this.backShp);
        }
        else {
            GameConst.removeChild(this.backShp);
        }
    };
    /**
     * 打开排行榜
     */
    RacingScene.prototype.openRanking = function () {
        var _this = this;
        if (!this.rankingUI)
            this.rankingUI = new RankingUI();
        this.controlBacksh(true);
        this.ctnrRA.addChild(this.rankingUI);
        this.rankingUI.initRacing();
        this.rankingUI.textUse.text = this.rankingUI.textUse.text + this.pass_time + "s";
        this.rankingUI.textOldUse.text = this.rankingUI.textOldUse.text + GameConst.player.mintime + "s";
        //更新自己服务器后台
        if (this.pass_time < GameConst.player.time) {
            var url = GameConst.url + "/carPro/updateRankingTime.do";
            var param = "openid=" + GameConst.player.openid + "&time=" + this.pass_time;
            var req_1 = GameConst.reqGetJSON(url + "?" + param);
            req_1.addEventListener(egret.Event.COMPLETE, function () {
                //这里更新用户，然后把用户资料存到这里
                var data = req_1.response;
                var josnDate = JSON.parse(data);
                console.log(josnDate);
                GameConst.player = josnDate.data;
            }, this);
        }
        //更新
        this.rankingRac == SceneManager.instance.ranking;
        if (!this.rankingRac) {
            this.rankingRac = new Ranking();
        }
        this.rankingRac.curScore = this.pass_time;
        this.rankingRac.type = 0;
        this.rankingRac.updateMessage();
        //添加重新开始事件，然后弹出验证框
        this.rankingUI.mbtnRestart.once(egret.TouchEvent.TOUCH_TAP, function () {
            _this.openCheckUI();
            _this.gameOver = false;
            _this.toRacing();
        }, this);
        this.rankingUI.mbtnBack.once(egret.TouchEvent.TOUCH_TAP, function () {
            GameConst.removeChild(_this.ctnrRA);
            _this.gameOver = false;
            _this.clearTime();
        }, this);
        this.rankingUI.mbtnRanking.once(egret.TouchEvent.TOUCH_TAP, function () {
            _this.controlBacksh(true);
            _this.rankingRac.initParent(_this.ctnrRA);
            _this.rankingRac.hasRestart = false;
            _this.rankingRac.curScore = _this.pass_time;
            _this.rankingRac.type = 0;
            _this.rankingRac.onButtonClick();
            _this.rankingRac.btnClose.once(egret.TouchEvent.TOUCH_END, function () {
                GameConst.removeChild(_this.ctnrRA);
                _this.gameOver = false;
                _this.clearTime();
            }, _this);
        }, this);
    };
    /**
     * 打开验证
     */
    RacingScene.prototype.openCheckUI = function () {
        var _this = this;
        if (!this.checkUI) {
            this.checkUI = new CheckUI();
        }
        else {
            this.checkUI.init();
        }
        this.controlBacksh(true);
        this.ctnrRA.addChild(this.checkUI);
        this.checkUI.once(egret.Event.REMOVED_FROM_STAGE, function () {
            if (!_this.checkUI.pass) {
                return;
            }
            _this.controlBacksh(false);
            var grade = ++_this.kmGrade;
            _this.racingUI.up = grade + "";
            _this.racingRun();
            _this.checkUI.pass = false;
            if (_this.checkUI.isExit) {
                _this.clearTime();
                _this.gameOver = true;
                GameConst.removeChild(_this.ctnrRA);
            }
            //console.log(this.checkUI.isExit)
        }, this);
    };
    /**
     * 打开选车
     */
    RacingScene.prototype.openChooseUI = function () {
        var _this = this;
        if (!this.chooseUI) {
            this.chooseUI = new ChooseUI();
        }
        else {
            this.chooseUI.init();
        }
        this.controlBacksh(true);
        this.ctnrRA.addChild(this.chooseUI);
        this.chooseUI.mbtnYse.once(egret.TouchEvent.TOUCH_END, function () {
            _this.controlBacksh(false);
            _this.racingUI.play_car.source = _this.chooseUI.player;
            _this.racingUI.play_car.alpha = 1;
            _this.openCheckUI();
            _this.racingRun();
        }, this);
    };
    return RacingScene;
}(eui.Component));
__reflect(RacingScene.prototype, "RacingScene");
//# sourceMappingURL=RacingScene.js.map