/**
 * 普通场景类
 */
class NormalScene extends eui.Component {
	public _stage: egret.Stage
	public ordinaryUI: OrdinaryUI
	public checkUI: CheckUI
	public chooseUI: ChooseUI
	public rankingUI: RankingUI
	public rankingNom: Ranking
	private pool: Pool

	private backShp: egret.Shape
	private bg: egret.Sprite

	private ctnrOR: egret.Sprite;
	private ctnrBer: egret.Sprite;

	//障碍物出现间距
	private berSpace: number = 6
	//背景相隔高度距离
	private bgLen: number
	private sumScore: number = 0

	private timeBg;
	private timeScore;
	private timeBer;

	/**速度等级 */
	private speedGrade = 1

	public gameOver: boolean;

	public constructor() {
		super()
	}

	//普通
	public toOrdinary() {
		if (this.ctnrOR) {
			this.addChild(this.ctnrOR);
			//数据初始化 	
			this.ordinaryUI.init();
			this.bg.y = 0
			this.sumScore = 0
			this.gameOver = false;
			this.pool.init()
		} else {
			this.ctnrOR = new egret.Sprite();
			this.ctnrBer = new egret.Sprite();
			this.createBg(this.ctnrOR);
			this.addChild(this.ctnrOR);
			this.ctnrOR.addChild(this.ctnrBer);
			//控制player类（皮肤）
			this.ordinaryUI = new OrdinaryUI(this._stage);
			this.ctnrOR.addChild(this.ordinaryUI);
			//障碍物处理类
			this.pool = this.ordinaryUI.pool = new Pool(this._stage.width, this._stage.height, this.ctnrBer)
			this.pool.ordinaryUI = this.ordinaryUI
			this.pool.normalScene = this
			this.ordinaryUI.normalScene = this
			//测试用
			// this.ordinaryUI.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 	console.log("黄色")
			// }, this)
			// this.ordinaryUI.btnShop.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 	this.clearTime();
			// 	this.gameOver = false
			// 	if (this.checkUI) {
			// 		this.closePrise(this.checkUI);
			// 	}
			// 	this.closePrise(this.ctnrOR);
			// 	console.log("蓝色")
			// }, this)
		}
		this.openCheckUI()
		//this.openChooseUI()
		//this.ordRun();
	}

	/**
	 * 普通动态
	 */
	private ordRun() {
		window.clearInterval(this.timeBg)
		window.clearInterval(this.timeScore)
		//背景动画
		this.timeBg = window.setInterval(() => {
			//判断是否有效结束
			if (this.gameOver) {
				this.clearTime()
				this.openRanking()
			}
			//每一段时间随机生成障碍物添加到障碍物集合
			if (this.berSpace >= 15 && this.goUpBarr < 2) {
				console.log(this.goUpBarr)
				this.goUpBarr++
				this.berSpace = 0
				this.loopBarrier()
			} else if (this.goUpBarr >= 2) {
				this.goUpBarr = 0
				this.berSpace = 0
			}
			//障碍物速度更新
			this.pool.update(20, this.ordinaryUI.play_car)
			this.berSpace += 1;
			this.bg.y = this.bg.y + 20;
			if (this.bg.y >= -this.bgLen) {
				this.bg.y = 0
			}
		}, 40)
		this.timeScore = window.setInterval(() => {
			this.sumScore = this.ordinaryUI.sumScore(this.sumScore, 1)
			if (this.sumScore > this.speedGrade * 100) {
				this.speedGrade++
				this.ordinaryUI.textPass.text = this.speedGrade + "";
				this.ordRun();
			}
		}, 100)
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

	private goUpBarr: number = 0

	/**
	 * 生成随机障碍物
	 */
	private loopBarrier() {
		//出现概率
		if (Math.random() > 0.8) {
			return
		} else {
			this.berSpace = 6
		}
		//障碍物种类概率
		let number = Math.floor(Math.random() * 3);
		this.pool.addBarrier(number)
	}

	private createBitmapByName(name: string): egret.Bitmap {
		let result = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(name);
		result.texture = texture;
		return result;
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
			this.ctnrOR.addChild(this.backShp)
		} else {
			this.closePrise(this.backShp)
		}
		this.ordinaryUI.controlMbtns(!flay)
	}
	/**
	 * 关闭所有的定时器
	 */
	public clearTime() {
		window.clearInterval(this.timeBg)
		window.clearInterval(this.timeScore)
	}

	/**
	 * 打开排行榜
	 */
	private openRanking() {
		if (!this.rankingUI)
			this.rankingUI = new RankingUI()
		this.controlBacksh(true)
		this.ctnrOR.addChild(this.rankingUI)
		this.rankingUI.initNormal();
		this.rankingUI.textUse.text = this.rankingUI.textUse.text + this.sumScore + "分"
		this.rankingUI.textOldUse.text = this.rankingUI.textOldUse.text + GameConst.player.maxscore + "分"
		//更新自己服务器后台
		if (this.sumScore > GameConst.player.score) {
			let url: string = GameConst.url + "/carPro/updateRankingScore.do"
			let param: string = "openid=" + GameConst.player.openid + "&score=" + this.sumScore
			let req = GameConst.reqGetJSON(url + "?" + param)
			req.addEventListener(egret.Event.COMPLETE, () => {
				//这里更新用户，然后把用户资料存到这里
				let data: string = req.response
				let josnDate = JSON.parse(data)
				console.log(josnDate)
				GameConst.player = josnDate.data
			}, this)
		}
		//更新微信后台
		this.rankingNom == SceneManager.instance.ranking
		if (!this.rankingNom) {
			this.rankingNom = new Ranking();
		}
		this.rankingNom.initParent(this.ctnrOR)
		this.rankingNom.curScore = this.sumScore;
		this.rankingNom.type = 1;
		this.rankingNom.updateMessage()
		//添加重新开始事件，然后弹出验证框
		this.rankingUI.mbtnRestart.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.openCheckUI()
		}, this)
		this.rankingUI.mbtnBack.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.clearTime();
			this.gameOver = false
			this.closePrise(this.ctnrOR);
		}, this)
		this.rankingUI.mbtnRanking.once(egret.TouchEvent.TOUCH_TAP, () => {
			console.log("点击了好友排行榜")
			this.controlBacksh(true)
			this.rankingNom.initParent(this.ctnrOR);
			this.rankingNom.hasRestart = false
			this.rankingNom.curScore = this.sumScore;
			this.rankingNom.type = 1;
			this.rankingNom.onButtonClick()
			this.rankingNom.btnClose.once(egret.TouchEvent.TOUCH_END, () => {
				this.clearTime();
				this.gameOver = false
				this.closePrise(this.ctnrOR);
			}, this)
		}, this)
	}

	//检验
	private openCheckUI() {
		if (!this.checkUI) {
			this.checkUI = new CheckUI()
		} else {
			this.checkUI.init()
		}
		this.controlBacksh(true)
		this.ctnrOR.addChild(this.checkUI)
		this.checkUI.once(egret.Event.REMOVED_FROM_STAGE, () => {
			if (!this.checkUI.pass) {
				return
			}
			var flay = this.checkUI.isExit
			this.controlBacksh(false)
			this.gameOver = false
			this.toOrdinary()
			this.checkUI.pass = false
			if (flay) {
				this.clearTime()
				GameConst.removeChild(this.ctnrOR)
			} else {
				this.openChooseUI()
			}
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
		this.controlBacksh(true)
		this.ctnrOR.addChild(this.chooseUI)
		this.chooseUI.mbtnYse.once(egret.TouchEvent.TOUCH_END, () => {
			this.controlBacksh(false)
			this.ordinaryUI.play_car.source = this.chooseUI.player
			this.ordinaryUI.play_car.alpha = 1
			this.ordRun()
		}, this)
	}

	//关闭本页面带框
	private closePrise(obj) {
		if (obj.parent) {
			obj.parent.removeChild(obj);
		}
	}


} 