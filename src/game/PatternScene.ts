/**
 * 游戏模式选择类
 */
class PatternScene extends eui.Component implements eui.UIComponent {
	public mbtnRacing: eui.ToggleButton;
	public mbtnNormal: eui.ToggleButton;
	public mbtnBack: eui.ToggleButton;
	public mbtns: eui.ToggleButton[];

	private testText: eui.TextInput;
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.mbtns = [this.mbtnRacing, this.mbtnNormal, this.mbtnBack];
		for (var i: number = this.mbtns.length - 1; i > -1; --i) {
			// 事件委托, 点击按钮的时候触发toggleBtn
			this.mbtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
				let theBtn = <eui.ToggleButton>e.target
				this.toggleBtn(theBtn)
			}, this)
		}
		//this.addReq()
	}

	public ajaxReq() {
		let url = GameConst.url + "fecthSessionId.do"
		let param = "openId=123"
		let req = GameConst.reqGetJSON(url + "?" + param);
		req.addEventListener(egret.Event.COMPLETE,()=>{
			console.log(JSON.parse(req.response))
		},this)
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
		// 0 1 2  对应 竞速模式，普通模式，返回
		let index = this.mbtns.lastIndexOf(btn)
		switch (index) {
			case 0:
				SceneManager.toRacing();
				break
			case 1:
				SceneManager.toOrdinary();
				break
			case 2:
				this.closePrise();
			default:
				break
		}

	}
	//关闭本页面带框
	private closePrise() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}