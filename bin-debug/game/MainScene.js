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
 * 主页面场景类
 */
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super.call(this) || this;
    }
    MainScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    MainScene.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.mbtns = [this.mbtnStart, this.mbtnShare, this.mbtnInfo, this.mbtnRanking, this.mbtnMore];
        for (var i = this.mbtns.length - 1; i > -1; --i) {
            // 事件委托, 点击按钮的时候触发toggleBtn
            this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                var theBtn = e.target;
                _this.toggleBtn(theBtn);
            }, this);
        }
    };
    /**
     * 切换按钮
     * @param btn 参数是eui.ToggleButton的时候切换按钮, 参数是0的时候设置为全部不选中
     */
    MainScene.prototype.toggleBtn = function (btn) {
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
        // 0 1 2 3 4 对应 开始游戏, 分享, 商品, 排行，更多
        var index = this.mbtns.lastIndexOf(btn);
        switch (index) {
            case 0:
                SceneManager.toPatternScene();
                break;
            case 1:
                platform.shareAppMessage();
                console.log("分享");
                break;
            case 2:
                this.onClickInfo();
                console.log("说明");
                break;
            case 3:
                //这里是排行榜
                this.onButtonClick();
            default:
                break;
        }
    };
    MainScene.prototype.onClickInfo = function () {
        if (!this.mainInfo)
            this.mainInfo = new MainInfo();
        this.addChild(this.mainInfo);
    };
    /**
     * 点击按钮
     * Click the button
     */
    MainScene.prototype.onButtonClick = function () {
        this.ranking = SceneManager.instance.ranking;
        this.ranking.initParent(this);
        this.ranking.hasRestart = false;
        //this.ranking.curScore = 0;
        this.ranking.flayRanking = true;
        this.ranking.type = 0;
        this.ranking.allRanking();
    };
    return MainScene;
}(eui.Component));
__reflect(MainScene.prototype, "MainScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MainScene.js.map