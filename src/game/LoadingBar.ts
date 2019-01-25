/**
 * 资源加载类
 */
class LoadingBar extends egret.Sprite implements RES.PromiseTaskReporter {
	public background: egret.Bitmap;		//读条背景图片
	public bar: egret.Bitmap;				//读条图片
	public barMask: egret.Rectangle;
	public bg: egret.Bitmap;

	public _bg: string		//读条背景
	public _bar: string		//读条
	private textField: egret.TextField; // 文本
	private timeText;		//定时器
	private imgCar: egret.Bitmap;
    /**
     * 反向进度条
     * */
	public reverse = false;
	public constructor(_bg: string, _bar: string) {
		super();
		// 当被添加到舞台的时候触发 (被添加到舞台,说明资源组已经加载完成)
		this._bg = _bg 		//读条背景
		this._bar = _bar	//读条
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this)
	}

	public createView() {
		this.width = this.stage.stageWidth
		this.height = this.stage.stageHeight
		var iconB = GameConst.CreateBitmapByName("icon_back_png")
		this.addChild(iconB)
		iconB.width = this.width
		iconB.height = this.height

		this.bg = GameConst.CreateBitmapByName("main_item_bg_png")
		this.addChild(this.bg)
		this.bg.y = this.height - this.bg.height

		var logo = GameConst.CreateBitmapByName("icon_logo_png")
		this.addChild(logo)
		logo.x = this.width / 2 - logo.width / 2
		logo.y = 167 / 1136 * this.height

		this.background = new egret.Bitmap(RES.getRes(this._bg));
		this.bar = new egret.Bitmap(RES.getRes(this._bar));
		this.addChild(this.background);
		this.addChild(this.bar);
		this.background.x = this.width / 2 - this.background.width / 2
		this.background.y = this.height * 3 / 5

		this.bar.x = (this.background.width - this.bar.width) / 2 + this.background.x
		this.bar.y = (this.background.height - this.bar.height) / 2 + this.background.y
		this.barMask = new egret.Rectangle(0, 0, 0, this.bar.height);
		this.bar.mask = this.barMask;

		//这里动态加载文字
		this.textField = new egret.TextField();
		this.addChild(this.textField);
		this.textField.width = 480;
		this.textField.height = 40;
		this.textField.x = this.width / 2 - this.textField.width / 2;
		this.textField.y = this.background.y + 100
		this.textField.size = 30
		this.textField.textAlign = "center";
		this.textField.text = '正努力加载中'
		var t = 1
		this.timeText = window.setInterval(() => {
			var tt = '正努力加载中'
			for (var i = 0; i < t; i++) {
				tt = tt + "."
			}
			t++
			if (t > 3) t = 1
			this.textField.text = tt
		}, 600)

		//跟随进度条的图片
		this.imgCar = GameConst.CreateBitmapByName("icon_loading_car_png")
		this.addChild(this.imgCar)
		this.imgCar.x = this.width / 2 - this.background.width / 2
		this.imgCar.y = this.height * 3 / 5 - this.imgCar.height + 1

		//从舞台删除时执行
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.clearTime, this)
	}

	private clearTime() {
		window.clearInterval(this.timeText)
		GameConst.removeChild(this.textField)
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.clearTime, this)
	}
	// 这个函数在加载中会自动调用
	public onProgress(current: number, total: number): void {
		let per = Math.floor((current / total) * 100) / 100
		this.barMask = new egret.Rectangle(0, 0, (this.reverse ? (1 - per) : per) * this.bar.width, this.bar.height);
		this.bar.mask = this.barMask;
		//对比百分百车子行走
		var startper = this.imgCar.width / this.bar.width
		if (per > startper) this.imgCar.x = this.width / 2 - this.background.width / 2 + (per - startper) * this.bar.width
	}
}