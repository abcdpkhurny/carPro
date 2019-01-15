var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 场景管理类
 */
var SceneManager = (function () {
    // 在构造函数中创建好场景，保存到属性
    function SceneManager() {
        //加载资源 排行榜
        var platform = window.platform;
        platform.openDataContext.postMessage({
            command: 'loadRes'
        });
        this.mainScene = new MainScene();
        this.patternScene = new PatternScene();
        this.normalScene = new NormalScene();
        this.racingScene = new RacingScene();
    }
    Object.defineProperty(SceneManager, "instance", {
        get: function () {
            if (!this.sceneManager) {
                this.sceneManager = new SceneManager();
            }
            return this.sceneManager;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置根场景
     */
    SceneManager.prototype.setStage = function (s) {
        this._stage = s;
    };
    /**
     * 登陆场景
     */
    SceneManager.toLoginScene = function () {
        var stage = this.instance._stage;
        GameConst.StageH = this.instance._stage.height;
        GameConst.StageW = this.instance._stage.width;
        var loginScene = new LoginScene();
        if (!loginScene.parent) {
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(loginScene);
        }
    };
    /**
     * 主场景
     */
    SceneManager.toMainScene = function () {
        var stage = this.instance._stage; // (根) 舞台
        GameConst.StageH = this.instance._stage.height;
        GameConst.StageW = this.instance._stage.width;
        if (!SceneManager.instance.ranking) {
            SceneManager.instance.ranking = new Ranking();
        }
        var mainScene = SceneManager.instance.mainScene; // 主场景
        // 判断主场景是否有父级(如果有,说明已经被添加到了场景中)
        if (!mainScene.parent) {
            // 未被添加到场景
            // 把主场景添加到之前设置好的根舞台中
            stage.addChild(mainScene);
        }
    };
    /**
     * 选择模式
     */
    SceneManager.toPatternScene = function () {
        console.log(GameConst.player);
        this.instance.mainScene.parent.addChild(this.instance.patternScene);
    };
    /**
     * 普通模式
     */
    SceneManager.toOrdinary = function () {
        this.instance.mainScene.parent.addChild(this.instance.normalScene);
        this.instance.normalScene._stage = this.instance._stage.stage;
        this.instance.normalScene.toOrdinary();
    };
    /**
     * 竞速模式
     */
    SceneManager.toRacing = function () {
        this.instance.mainScene.parent.addChild(this.instance.racingScene);
        this.instance.racingScene._stage = this.instance._stage.stage;
        this.instance.racingScene.toRacing();
    };
    return SceneManager;
}());
__reflect(SceneManager.prototype, "SceneManager");
//# sourceMappingURL=SceneManager.js.map