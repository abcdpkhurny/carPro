/**
 * 普通模式控制类
 */
class OrdinaryUI extends eui.Component implements eui.UIComponent {
	public mbtnLeft: eui.ToggleButton
	public mbtnRight: eui.ToggleButton

	public mbtns = []

	public textScore: eui.Label
	public textUp: eui.Label
	public textPattern: eui.Label
	public textPass: eui.Label
	public textGrande: eui.Label

	public play_car: eui.Image
	public play_end: eui.Image

	public pool: Pool
	public normalScene: NormalScene

	//车的变动距离
	public range: number
	public _stage: egret.Stage

	public btnBack: eui.Button
	public btnShop: eui.Button
	public constructor(_stage: egret.Stage) {
		super();
		this._stage = _stage
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		//车的移动距离
		this.range = this._stage.stageWidth / 2 - this.stage.stageWidth * 0.22
		this.mbtnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moreLeft, this)
		this.mbtnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.moreRight, this)
		this.mbtns = [this.mbtnLeft, this.mbtnRight]
		this.init();
		//console.log(this)
	}

	/**
	 * 初始化
	 */
	public init() {
		//车初始定位
		this.play_car.x = this._stage.stageWidth / 2 - this.play_car.width / 2
		this.play_car.alpha = 0
		this.textScore.text = "0";
		this.textPass.text = "1";
		this.textUp.text = "3";
	}

	//左移
	private moreLeft() {
		if (this.mbtnLeft.selected)
			this.mbtnLeft.selected = false
		if (this.play_car.x > this.stage.stageWidth * 0.3) {
			this.play_car.x -= this.range
			this.pool.pmove = -1
		}
	}

	//右移
	private moreRight() {
		if (this.mbtnRight.selected)
			this.mbtnRight.selected = false
		if (this.play_car.x < this.stage.stageWidth * 0.6) {
			this.play_car.x += this.range
			this.pool.pmove = 1
		}
	}

	/**
	 * 计时
	 */
	public passTime(s: number) {
		this.textPass.text = s + "s";
	}

	/**
	 * 计算得分
	 */
	public sumScore(num: number, i: number): number {
		let sum = num + i
		this.textScore.text = num + ""
		return sum
	}

	/**
	 * 控制按钮
	 */
	public controlMbtns(flay: boolean) {
		for (let i = 0; i < this.mbtns.length; i++) {
			this.mbtns[i].touchEnabled = flay
		}
	}
}