/**
 * 赛车选择类
 */
class ChooseUI extends eui.Component implements eui.UIComponent {
	public imgBg: eui.Image
	public mbtn0: eui.ToggleButton
	public mbtn1: eui.ToggleButton
	public mbtn2: eui.ToggleButton
	public mbtn3: eui.ToggleButton

	private mbtns = []

	private effect: number = 0

	public mbtnYse: eui.ToggleButton
	public mbtnLeft: eui.ToggleButton
	public mbtnRight: eui.ToggleButton

	//选中的车辆
	public player: string

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		var list: any[] = [this.imgBg, this.mbtn0, this.mbtn1, this.mbtn2, this.mbtn3, this.mbtnYse, this.mbtnLeft, this.mbtnRight]
		GameConst.screenDeploy(list, this.height)
		this.mbtnYse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickYse, this)
		this.mbtnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickLeft, this)
		this.mbtnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickRight, this)
		this.mbtns = [this.mbtn0, this.mbtn1, this.mbtn2, this.mbtn3]
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			// 事件委托, 点击按钮的时候触发toggleBtn
			this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
				let theBtn = <eui.ToggleButton>e.target
				this.toggleBtn(theBtn)
			}, this)
		}
		this.init()
	}

	public init() {
		this.effect = 0
		this.togglePlayer()
	}

	/**
	 * 点击选择
	 */
	private clickYse() {
		if (this.mbtnYse.selected)
			this.mbtnYse.selected = false
		this.closePrise(this)
	}

	/**
	 * 点击左
	 */
	private clickLeft() {
		if (this.mbtnLeft.selected)
			this.mbtnLeft.selected = false
		this.effect--
		this.togglePlayer()
	}

	/**
	 * 点击右
	 */
	private clickRight() {
		if (this.mbtnRight.selected)
			this.mbtnRight.selected = false
		this.effect++
		this.togglePlayer()
	}

	/**
	 * 变动选择车
	 */
	private togglePlayer() {
		let num
		if (this.effect >= 0) {
			num = this.effect % 5
		} else {
			num = 5 + (this.effect % 5)
		}
		for (let i = 0; i < 4; i++) {
			let btn = this.mbtns[i]
			if (num == 5) {
				num = 0
			}
			btn.selected = false
			if (btn.pic)
				btn.pic.source = "play_car" + num + "_png"
			num++
		}
		(<any>this.mbtnYse).pic.source = "btn_xuan1_png";
		this.mbtnYse.touchEnabled = false
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
		this.player = (<any>btn).pic.source
		// 把传进来的btn设置为选中状态
		btn = <eui.ToggleButton>btn
		btn.selected = true;
		(<any>this.mbtnYse).pic.source = "btn_xuan_png";
		this.mbtnYse.touchEnabled = true
	}


	//关闭本页面带框
	private closePrise(obj) {
		if (obj.parent) {
			obj.parent.removeChild(obj);
		}
	}



}