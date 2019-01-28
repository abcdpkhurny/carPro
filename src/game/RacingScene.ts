/**
 * 竞速场景类
 */
class RacingScene extends eui.Component {
	public _stage: egret.Stage

	public racingUI: RacingUI
	public checkUI: CheckUI
	public rankingUI: RankingUI
	public chooseUI: ChooseUI
	public rankingRac: Ranking
	public backShp: egret.Shape
	public bg: egret.Sprite		//背景
	public bgLen: number		//需要背景重置的距离

	private ctnrRA: egret.Sprite;

	private timeBg;
	private timePass;
	private timeEnd;
	private timeCheck;
	private kmGrade: number = 0;
	private pass_time: number = 0;
	private kmPass: number = 0;
	private kmSum: number;

	private gameOver: boolean = true
	public constructor() {
		super()
	}
	//竞速
	public toRacing() {
		//正常设置100
		this.kmSum = 5;
		if (this.ctnrRA) {
			GameConst.removeChild(this.checkUI)
			this.addChild(this.ctnrRA);
			//数据初始化 	
			this.bg.y = 0;
			this.kmGrade = 0;
			this.pass_time = 0;
			this.kmPass = 0;
			this.gameOver = true;
			this.racingUI.init();
			//加速度
			this.racingUI.up = "0"
		} else {
			this.ctnrRA = new egret.Sprite();
			this.addChild(this.ctnrRA);
			this.createBg(this.ctnrRA);
			this.racingUI = new RacingUI(this._stage);
			this.ctnrRA.addChild(this.racingUI);
			//测试
			this.racingUI.up = this.kmGrade + "";
		}
		//this.racingRun();
		//this.openChooseUI()
		this.openCheckUI()
	}

	/**
	 * 竞速动态
	 */
	public racingRun() {
		window.clearInterval(this.timeBg)
		window.clearInterval(this.timePass)
		window.clearInterval(this.timeCheck)
		//背景动画
		this.timeBg = window.setInterval(() => {
			if (this.gameOver) {
				this.clearTime()
			}
			//游戏结束
			if (this.kmPass * 0.01 >= this.kmSum) {
				this.clearTime()
				this.gameOver = true;
				GameConst.removeChild(this.checkUI)
				this.checkUI = null
				this.controlBacksh(false)
				//这里排行榜出现
				this.openRanking();
			}
			this.bg.y += 20;
			this.kmPass += 2
			this.racingUI.KMTime(this.kmSum, this.kmPass)
			//最后一段距离显示终点线
			if ((this.kmSum - this.kmPass * 0.01) < 0.44)
				this.racingUI.play_end.y += 20
			if (this.bg.y >= -this.bgLen) {
				this.bg.y = 0
			}
		}, 40 - this.kmGrade * 3)
		//时间
		this.timePass = window.setInterval(() => {
			this.racingUI.passTime(++this.pass_time);
		}, 1000)
		//每段时间检测
		this.timeCheck = window.setInterval(() => {
			if (!this.checkUI.parent) {
				if (this.racingUI.textKM.text === "0.00km") {
					return
				}
				this.openCheckUI()
			}
		}, 1000)
	}

	//背景
	private createBg(ctnr) {
		let a: egret.Bitmap = this.createBitmapByName("play_bg_jpg")
		a.y = this._stage.stageHeight - a.height;
		let b: egret.Bitmap = this.createBitmapByName("play_bg_jpg")
		b.y = this._stage.stageHeight - b.height - b.height;
		let c: egret.Bitmap = this.createBitmapByName("play_bg_jpg")
		this.bgLen = c.y = this._stage.stageHeight - a.height - b.height - c.height;
		this.bg = new egret.Sprite()
		this.bg.addChild(a);
		this.bg.addChild(b);
		this.bg.addChild(c);
		ctnr.addChild(this.bg)
	}


	private createBitmapByName(name: string): egret.Bitmap {
		let result = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(name);
		result.texture = texture;
		return result;
	}

	/**
	 * 关闭所有定时器
	 */
	private clearTime() {
		window.clearInterval(this.timeBg)
		window.clearInterval(this.timePass)
		window.clearInterval(this.timeEnd)
		window.clearInterval(this.timeCheck)
	}
	/**
	 * 控制黑底出现
	 */
	private controlBacksh(flay: boolean) {
		if (!this.backShp) {
			this.backShp = new egret.Shape();
			this.backShp.graphics.beginFill(0x000000, 0.2);
			this.backShp.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
			this.backShp.graphics.endFill();
		}
		if (flay) {
			this.ctnrRA.addChild(this.backShp)
		} else {
			GameConst.removeChild(this.backShp)
		}
	}
	/**
	 * 打开排行榜
	 */
	private openRanking() {
		if (!this.rankingUI)
			this.rankingUI = new RankingUI()
		this.controlBacksh(true)
		this.ctnrRA.addChild(this.rankingUI)
		this.rankingUI.initRacing()
		this.rankingUI.textUse.text = this.rankingUI.textUse.text + this.pass_time + "s"
		this.rankingUI.textOldUse.text = this.rankingUI.textOldUse.text + GameConst.player.mintime + "s"
		//更新自己服务器后台
		if (this.pass_time < GameConst.player.time) {
			let url: string = GameConst.url + "/carPro/updateRankingTime.do"
			let param: string = "openid=" + GameConst.player.openid + "&time=" + this.pass_time
			let req = GameConst.reqGetJSON(url + "?" + param)
			req.addEventListener(egret.Event.COMPLETE, () => {
				//这里更新用户，然后把用户资料存到这里
				let data: string = req.response
				let josnDate = JSON.parse(data)
				console.log(josnDate)
				GameConst.player = josnDate.data
			}, this)
		}
		//更新
		this.rankingRac == SceneManager.instance.ranking
		if (!this.rankingRac) {
			this.rankingRac = new Ranking();
		}
		this.rankingRac.curScore = this.pass_time;
		this.rankingRac.type = 0;
		this.rankingRac.updateMessage();
		//添加重新开始事件，然后弹出验证框
		this.rankingUI.mbtnRestart.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.openCheckUI()
			this.gameOver = false
			this.toRacing()
		}, this)
		this.rankingUI.mbtnBack.once(egret.TouchEvent.TOUCH_TAP, () => {
			GameConst.removeChild(this.ctnrRA);
			this.gameOver = false
			this.clearTime();
		}, this)
		this.rankingUI.mbtnRanking.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.controlBacksh(true)
			this.rankingRac.initParent(this.ctnrRA);
			this.rankingRac.hasRestart = false
			this.rankingRac.curScore = this.pass_time;
			this.rankingRac.type = 0;
			this.rankingRac.onButtonClick()
			this.rankingRac.btnClose.once(egret.TouchEvent.TOUCH_END, () => {
				GameConst.removeChild(this.ctnrRA);
				this.gameOver = false
				this.clearTime();
			}, this)
		}, this)
	}

	/**
	 * 打开验证
	 */
	private openCheckUI() {
		if (!this.checkUI) {
			this.checkUI = new CheckUI()
		} else {
			this.checkUI.init()
		}
		this.controlBacksh(true)
		this.ctnrRA.addChild(this.checkUI)
		console.log(this.ctnrRA)
		console.log(this.checkUI.parent)
		this.checkUI.once(egret.Event.REMOVED_FROM_STAGE, () => {
			if (!this.checkUI.pass) {
				return
			}
			this.controlBacksh(false)
			this.checkUI.pass = false
			if (this.checkUI.isExit) {
				let grade = ++this.kmGrade
				this.racingUI.up = grade + ""
				this.racingRun()
				this.clearTime()
				this.gameOver = true;
				GameConst.removeChild(this.ctnrRA)
			}
			if (this.gameOver) {
				this.openChooseUI();
			}
			//console.log(this.checkUI.isExit)
		}, this)
	}

	/**
	 * 打开选车
	 */
	private openChooseUI() {
		if (!this.chooseUI) {
			this.chooseUI = new ChooseUI()
		} else {
			this.chooseUI.init()
		}
		this.gameOver = false
		this.controlBacksh(true)
		this.ctnrRA.addChild(this.chooseUI)
		this.chooseUI.mbtnYse.once(egret.TouchEvent.TOUCH_END, () => {
			this.controlBacksh(false)
			this.racingUI.play_car.source = this.chooseUI.player
			this.racingUI.play_car.alpha = 1
			this.openCheckUI()
			this.racingRun()
		}, this)
	}
}