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
	public imgBg: eui.Image

	public imgWhite: eui.Image
	public src_build: eui.Scroller

	protected childrenCreated(): void {
		super.childrenCreated();
		this.imgBg.height = GameConst.StageH;
		this.imgWhite.height = this.imgWhite.height / this.height * GameConst.StageH;
		this.src_build.height = this.src_build.height / this.height * GameConst.StageH;
		(this.imgWhite.height + this.imgWhite.y) > (GameConst.StageH - 20) ? this.imgWhite.height = GameConst.StageH - this.imgWhite.y - 20 : this.imgWhite.height;
		(this.src_build.height + this.src_build.y) > (GameConst.StageH - 20) ? this.src_build.height = GameConst.StageH - this.src_build.y - 20 : this.src_build.height;
		this.imgClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			GameConst.removeChild(this)
		}, this)
	}

}