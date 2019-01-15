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
 * 普通场景类
 */
var NormalScene = (function (_super) {
    __extends(NormalScene, _super);
    function NormalScene() {
        var _this = _super.call(this) || this;
        //障碍物出现间距
        _this.berSpace = 6;
        _this.sumScore = 0;
        /**速度等级 */
        _this.speedGrade = 1;
        _this.goUpBarr = 0;
        return _this;
    }
    //普通
    NormalScene.prototype.toOrdinary = function () {
        if (this.ctnrOR) {
            this.addChild(this.ctnrOR);
            //数据初始化 	
            this.ordinaryUI.init();
            this.bg.y = 0;
            this.sumScore = 0;
            this.gameOver = false;
            this.pool.init();
        }
        else {
            this.ctnrOR = new egret.Sprite();
            this.ctnrBer = new egret.Sprite();
            this.createBg(this.ctnrOR);
            this.addChild(this.ctnrOR);
            this.ctnrOR.addChild(this.ctnrBer);
            //控制player类（皮肤）
            this.ordinaryUI = new OrdinaryUI(this._stage);
            this.ctnrOR.addChild(this.ordinaryUI);
            //障碍物处理类
            this.pool = this.ordinaryUI.pool = new Pool(this._stage.width, this._stage.height, this.ctnrBer);
            this.pool.ordinaryUI = this.ordinaryUI;
            this.pool.normalScene = this;
            this.ordinaryUI.normalScene = this;
            //测试用
            // this.ordinaryUI.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 	console.log("黄色")
            // }, this)
            // this.ordinaryUI.btnShop.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 	this.clearTime();
            // 	this.gameOver = false
            // 	if (this.checkUI) {
            // 		this.closePrise(this.checkUI);
            // 	}
            // 	this.closePrise(this.ctnrOR);
            // 	console.log("蓝色")
            // }, this)
        }
        this.openCheckUI();
        //this.openChooseUI()
        //this.ordRun();
    };
    /**
     * 普通动态
     */
    NormalScene.prototype.ordRun = function () {
        var _this = this;
        window.clearInterval(this.timeBg);
        window.clearInterval(this.timeScore);
        //背景动画
        this.timeBg = window.setInterval(function () {
            //判断是否有效结束
            if (_this.gameOver) {
                _this.clearTime();
                _this.openRanking();
            }
            //每一段时间随机生成障碍物添加到障碍物集合
            if (_this.berSpace >= 15 && _this.goUpBarr < 2) {
                console.log(_this.goUpBarr);
                _this.goUpBarr++;
                _this.berSpace = 0;
                _this.loopBarrier();
            }
            else if (_this.goUpBarr >= 2) {
                _this.goUpBarr = 0;
                _this.berSpace = 0;
            }
            //障碍物速度更新
            _this.pool.update(20, _this.ordinaryUI.play_car);
            _this.berSpace += 1;
            _this.bg.y = _this.bg.y + 20;
            if (_this.bg.y >= -_this.bgLen) {
                _this.bg.y = 0;
            }
        }, 40);
        this.timeScore = window.setInterval(function () {
            _this.sumScore = _this.ordinaryUI.sumScore(_this.sumScore, 1);
            if (_this.sumScore > _this.speedGrade * 100) {
                _this.speedGrade++;
                _this.ordinaryUI.textPass.text = _this.speedGrade + "";
                _this.ordRun();
            }
        }, 100);
    };
    //背景
    NormalScene.prototype.createBg = function (ctnr) {
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
    /**
     * 生成随机障碍物
     */
    NormalScene.prototype.loopBarrier = function () {
        //出现概率
        if (Math.random() > 0.8) {
            return;
        }
        else {
            this.berSpace = 6;
        }
        //障碍物种类概率
        var number = Math.floor(Math.random() * 3);
        this.pool.addBarrier(number);
    };
    NormalScene.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 控制黑底出现
     */
    NormalScene.prototype.controlBacksh = function (flay) {
        if (!this.backShp) {
            this.backShp = new egret.Shape();
            this.backShp.graphics.beginFill(0x000000, 0.2);
            this.backShp.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
            this.backShp.graphics.endFill();
        }
        if (flay) {
            this.ctnrOR.addChild(this.backShp);
        }
        else {
            this.closePrise(this.backShp);
        }
        this.ordinaryUI.controlMbtns(!flay);
    };
    /**
     * 关闭所有的定时器
     */
    NormalScene.prototype.clearTime = function () {
        window.clearInterval(this.timeBg);
        window.clearInterval(this.timeScore);
    };
    /**
     * 打开排行榜
     */
    NormalScene.prototype.openRanking = function () {
        var _this = this;
        if (!this.rankingUI)
            this.rankingUI = new RankingUI();
        this.controlBacksh(true);
        this.ctnrOR.addChild(this.rankingUI);
        this.rankingUI.initNormal();
        this.rankingUI.textUse.text = this.rankingUI.textUse.text + this.sumScore + "分";
        this.rankingUI.textOldUse.text = this.rankingUI.textOldUse.text + GameConst.player.maxscore + "分";
        //更新自己服务器后台
        if (this.sumScore > GameConst.player.score) {
            var url = GameConst.url + "/carPro/updateRankingScore.do";
            var param = "openid=" + GameConst.player.openid + "&score=" + this.sumScore;
            var req_1 = GameConst.reqGetJSON(url + "?" + param);
            req_1.addEventListener(egret.Event.COMPLETE, function () {
                //这里更新用户，然后把用户资料存到这里
                var data = req_1.response;
                var josnDate = JSON.parse(data);
                console.log(josnDate);
                GameConst.player = josnDate.data;
            }, this);
        }
        //更新微信后台
        this.rankingNom == SceneManager.instance.ranking;
        if (!this.rankingNom) {
            this.rankingNom = new Ranking();
        }
        this.rankingNom.initParent(this.ctnrOR);
        this.rankingNom.curScore = this.sumScore;
        this.rankingNom.type = 1;
        this.rankingNom.updateMessage();
        //添加重新开始事件，然后弹出验证框
        this.rankingUI.mbtnRestart.once(egret.TouchEvent.TOUCH_TAP, function () {
            _this.openCheckUI();
        }, this);
        this.rankingUI.mbtnBack.once(egret.TouchEvent.TOUCH_TAP, function () {
            _this.clearTime();
            _this.gameOver = false;
            _this.closePrise(_this.ctnrOR);
        }, this);
        this.rankingUI.mbtnRanking.once(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("点击了好友排行榜");
            _this.controlBacksh(true);
            _this.rankingNom.initParent(_this.ctnrOR);
            _this.rankingNom.hasRestart = false;
            _this.rankingNom.curScore = _this.sumScore;
            _this.rankingNom.type = 1;
            _this.rankingNom.onButtonClick();
            _this.rankingNom.btnClose.once(egret.TouchEvent.TOUCH_END, function () {
                _this.clearTime();
                _this.gameOver = false;
                _this.closePrise(_this.ctnrOR);
            }, _this);
        }, this);
    };
    //检验
    NormalScene.prototype.openCheckUI = function () {
        var _this = this;
        if (!this.checkUI) {
            this.checkUI = new CheckUI();
        }
        else {
            this.checkUI.init();
        }
        this.controlBacksh(true);
        this.ctnrOR.addChild(this.checkUI);
        this.checkUI.once(egret.Event.REMOVED_FROM_STAGE, function () {
            if (!_this.checkUI.pass) {
                return;
            }
            _this.controlBacksh(false);
            _this.gameOver = false;
            _this.toOrdinary();
            _this.checkUI.pass = false;
            if (_this.checkUI.isExit) {
                _this.clearTime();
                GameConst.removeChild(_this.ctnrOR);
            }
            else {
                _this.openChooseUI();
            }
        }, this);
    };
    /**
     * 打开选车
     */
    NormalScene.prototype.openChooseUI = function () {
        var _this = this;
        if (!this.chooseUI) {
            this.chooseUI = new ChooseUI();
        }
        else {
            this.chooseUI.init();
        }
        this.controlBacksh(true);
        this.ctnrOR.addChild(this.chooseUI);
        this.chooseUI.mbtnYse.once(egret.TouchEvent.TOUCH_END, function () {
            _this.controlBacksh(false);
            _this.ordinaryUI.play_car.source = _this.chooseUI.player;
            _this.ordinaryUI.play_car.alpha = 1;
            _this.ordRun();
        }, this);
    };
    //关闭本页面带框
    NormalScene.prototype.closePrise = function (obj) {
        if (obj.parent) {
            obj.parent.removeChild(obj);
        }
    };
    return NormalScene;
}(eui.Component));
__reflect(NormalScene.prototype, "NormalScene");
//# sourceMappingURL=NormalScene.js.map