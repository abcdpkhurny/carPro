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
 * 得分显示类
 */
var RankingUI = (function (_super) {
    __extends(RankingUI, _super);
    function RankingUI() {
        return _super.call(this) || this;
    }
    RankingUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    RankingUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.mbtnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);
        this.mbtnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);
        this.mbtnRanking.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);
        //初始化
        //this.init();
    };
    RankingUI.prototype.initNormal = function () {
        this.textUse.text = "本局所得分数：";
        this.textOldUse.text = "历史最大得分数：";
    };
    RankingUI.prototype.initRacing = function () {
        this.textUse.text = "本局使用时间：";
        this.textOldUse.text = "历史最快时间：：";
    };
    RankingUI.prototype.init = function () {
        this.mbtnRestart.alpha = 1;
        // 数组数据
        // let dataArr: any[] = [
        // 	{ image: "resource/art/ranking/icon_head0.png", no: "1", text: "20s" },
        // 	{ image: "resource/art/ranking/icon_head1.png", no: "2", text: "20s" },
        // 	{ image: "resource/art/ranking/icon_head2.png", no: "3", text: "10s" },
        // 	{ image: "resource/art/ranking/icon_head3.png", no: "4", text: "21s" },
        // 	{ image: "resource/art/ranking/icon_head4.png", no: "5", text: "26s" },
        // 	{ image: "resource/art/ranking/icon_head1.png", no: "6", text: "22s" },
        // 	{ image: "resource/art/ranking/icon_head0.png", no: "7", text: "10s" }
        // ]
        // // 把数组数据转成EUI数组
        // let euiArr: eui.ArrayCollection = new eui.ArrayCollection(dataArr)
        // // 把EUI数组作为list的数据源
        // this.list_raning.dataProvider = euiArr
        // // 隐藏进度条
        // this.src_ranking.horizontalScrollBar.autoVisibility = false
    };
    RankingUI.prototype.restart = function () {
        GameConst.removeChild(this);
    };
    return RankingUI;
}(eui.Component));
__reflect(RankingUI.prototype, "RankingUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=RankingUI.js.map