/**
 * 游戏说明
 */
class MainInfo extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}
	public imgClose: eui.Image

	protected childrenCreated(): void {
		super.childrenCreated();
		this.imgClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			GameConst.removeChild(this)
		}, this)
	}

}