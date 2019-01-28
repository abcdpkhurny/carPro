/**
 * 主页面场景类
 */
class MainScene extends eui.Component implements eui.UIComponent {
	public imgBg: eui.Image

	public imgLogo: eui.Image
	public mbtnStart: eui.ToggleButton;
	public mbtnShare: eui.ToggleButton;
	public mbtnInfo: eui.ToggleButton;
	public mbtnRanking: eui.ToggleButton;
	public labInfo: eui.Label
	public labRanking: eui.Label

	public mbtns: eui.ToggleButton[];

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}
    /**
     * 排行榜关闭按钮
     */
	private btnClose: eui.Button;

	protected childrenCreated(): void {
		super.childrenCreated();
		//适屏误差补充MainScene
		var list: any[] = [this.imgLogo, this.labInfo, this.labRanking, this.mbtnStart, this.mbtnShare, this.mbtnInfo, this.mbtnRanking]
		GameConst.screenDeploy(list, this.height)
		this.imgBg.y = GameConst.StageH - this.imgBg.height
		this.mbtns = [this.mbtnStart, this.mbtnShare, this.mbtnInfo, this.mbtnRanking];
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			// 事件委托, 点击按钮的时候触发toggleBtn
			this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
				let theBtn = <eui.ToggleButton>e.target
				this.toggleBtn(theBtn)
			}, this)
		}
	}

	/**
	 * 切换按钮
	 * @param btn 参数是eui.ToggleButton的时候切换按钮, 参数是0的时候设置为全部不选中
	 */
	public toggleBtn(btn: eui.ToggleButton | number) {
		//console.log('点击')

		// 先把所有的按钮都设置为不选中
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			this.mbtns[i].selected = false
		}
		if (btn === 0) {
			//console.log('返回');
			return
		}

		btn = <eui.ToggleButton>btn

		// 获取当前点击的按钮的下标, 用来实现不同按钮对应的功能
		// 0 1 2 3 4 对应 开始游戏, 分享, 商品, 排行，更多
		let index = this.mbtns.lastIndexOf(btn)
		switch (index) {
			case 0:
				SceneManager.toPatternScene()
				break
			case 1:
				platform.shareAppMessage()
				console.log("分享")
				break
			case 2:
				this.onClickInfo()
				console.log("说明")
				break
			case 3:
				//这里是排行榜
				this.onButtonClick()
			default:
				break
		}
	}

	private onClickInfo() {
		if (!this.mainInfo) this.mainInfo = new MainInfo()
		this.addChild(this.mainInfo)
	}

	private mainInfo: MainInfo
	public ranking: Ranking

    /**
     * 点击按钮
     * Click the button
     */
	private onButtonClick() {
		this.ranking = SceneManager.instance.ranking
		this.ranking.initParent(this)
		this.ranking.hasRestart = false
		//this.ranking.curScore = 0;
		this.ranking.flayRanking = true;
		this.ranking.type = 0;
		this.ranking.allRanking()
	}
}