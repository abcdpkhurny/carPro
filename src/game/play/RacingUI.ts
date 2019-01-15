/**
 * 竞速模式控制类
 */
class RacingUI extends eui.Component implements eui.UIComponent {
	public mbtnLeft: eui.ToggleButton
	public mbtnRight: eui.ToggleButton

	public textKM: eui.Label
	public textTime: eui.Label

	public play_car: eui.Image
	public play_end: eui.Image

	//车的变动距离
	public _stage: egret.Stage

	public btnBack: eui.Button
	public btnShop: eui.Button

	public textUp: eui.Label
	public up = "123"
	public constructor(_stage: egret.Stage) {
		super();
		this._stage = _stage
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.init();
		//console.log(this)
	}

	public init() {
		//车初始定位
		this.play_car.x = this._stage.stageWidth / 2 - this.play_car.width / 2
		this.play_car.alpha = 0
		this.textKM.text = "0km";
		this.textTime.text = "0s";
		this.play_end.y = -87;
	}

	/**
	 * 计时
	 */
	public passTime(s: number) {
		this.textTime.text = s + "s";
	}

	/**
	 * 计算路程
	 */
	public KMTime(sum: number, k: number) {
		let km: number = sum - k * 0.01
		if (km <= 0)
			km = 0
		this.textKM.text = km.toFixed(2) + "km"
	}

	//关闭本页面带框
	private closePrise(obj) {
		if (obj.parent) {
			obj.parent.removeChild(obj);
		}
	}
}