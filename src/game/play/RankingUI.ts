/**
 * 得分显示类
 */
class RankingUI extends eui.Component implements eui.UIComponent {
	public mbtnRestart: eui.ToggleButton
	public mbtnBack: eui.ToggleButton
	public src_ranking: eui.Scroller;
	public list_raning: eui.List;
	public textUse: eui.Label;
	public textOldUse: eui.Label;
	public mbtnRanking: eui.ToggleButton

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.mbtnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this)
		this.mbtnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this)
		this.mbtnRanking.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this)
		//初始化
		//this.init();
	}

	public initNormal(){
		this.textUse.text="本局所得分数："
		this.textOldUse.text="历史最大得分数："
	}

	public initRacing(){
		this.textUse.text="本局使用时间："
		this.textOldUse.text="历史最快时间：："
	}

	public init() {
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
	}

	private restart() {
		GameConst.removeChild(this)
	}

}