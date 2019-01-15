/**
 * 障碍物处理类
 */
class Pool {
	private Swith: number
	private Sheight: number
	//添加进去的容器
	private ctnrBer: egret.Sprite

	public ordinaryUI: OrdinaryUI
	public normalScene: NormalScene

	public pmove: number

	//障碍物间距
	private range: number
	//障碍物高度
	private barHeight: number = 330
	//跳跃
	private jump: boolean = false
	//跳跃所剩时间
	private jumpTime: number
	//同一个地方障碍物
	private sameloca: number = 2

	private barlistAll = []
	private barlist0 = []
	private barlist1 = []
	private barlist2 = []

	public constructor(Swith, Sheight, ctnrBer: egret.Sprite) {
		this.Swith = Swith;
		this.Sheight = Sheight
		this.ctnrBer = ctnrBer
		this.range = this.Swith / 2 - this.Swith * 0.22
		this.init()
	}

	/**
	 * 初始化
	 */
	public init() {
		for (let i = 0; i < this.barlistAll.length; i++) {
			let ber = this.barlistAll[i]
			this.disposeBer(ber, i)
			--i
		}
		this.barlistAll = []
	}

	/**
	 * 添加障碍物
	 */
	public addBarrier(num: number) {
		let name = "barlist" + num;   //生成函数名
		//判断回收站是否有这对象，有则取出，没则new
		let ber: egret.Bitmap
		if (this[name][0]) {
			ber = this[name].shift()
		} else {
			ber = this.createBitmapByName("icon_barrier" + num + "_png")
			ber.name = name
		}
		let leng;
		//位置概率
		if (this.sameloca == 1) leng = this.berrShow(0.1, 0.55, 1)
		else if (this.sameloca == 2) leng = this.berrShow(0.45, 0.55, 1)
		else leng = this.berrShow(0.45, 0.9, 1)

		this.ctnrBer.addChild(ber);
		this.barlistAll.push(ber)
		ber.x = this.Swith / 2 - ber.width / 2 - leng
		ber.y = -ber.height
	}

	private berrShow(one: number, twe: number, three: number): number {
		//出现位置概率
		let leng;
		var random: Number = Math.random();
		if (random < one) {
			leng = - this.range;
			this.sameloca = 1
		}
		else if (random < twe) {
			leng = 0;
			this.sameloca = 2
		}
		else if (random < three) {
			leng = this.range;
			this.sameloca = 3
		}
		return leng
	}

	/**
	 * 障碍物总数组y轴变化随背景变化，超过舞台高度则放到回收站
	 */
	public update(speed, player: egret.Bitmap) {
		if (this.barlistAll == [] || this.barlistAll == undefined)
			return
		for (let i = 0; i < this.barlistAll.length; i++) {
			this.barlistAll[i].y += speed
			let ber = this.barlistAll[i]
			let topX = player.x + player.width / 2
			let buttomY = player.y + player.height
			//判断车辆碰撞事件（前进）
			if (this.dotCrash(ber, topX, player.y) || this.dotCrash(ber, topX, buttomY)) {
				this.loseLife();
				this.disposeBer(ber, i)
				i--
			} else if (ber.y > (this.Sheight + this.barHeight)) { //障碍物超过主页面高度
				this.disposeBer(ber, i)
				i--
			}
			//判断是否跳跃中
			// if (this.jump) {
			// 	if (this.jumpTime == 5) {
			// 		//播放跳跃动画
			// 	}
			// 	if (this.jumpTime == 0) {
			// 		//结束跳跃动画

			// 		this.jump = false
			// 		//按钮jump键回复正常

			// 		this.jumpTime = 1
			// 	}
			// 	this.jumpTime--
			// } else {
			// 	//左右判断事件
			// 	if (this.pmove == -1) {

			// 	}

			// }
		}
	}

	/**
	 * 丢失生命，0为结束游戏
	 */
	private loseLife() {
		let up = +this.ordinaryUI.textUp.text
		//console.log(up)
		this.ordinaryUI.textUp.text = "" + (up - 1)
		if (up - 1 <= 0) {
			this.normalScene.gameOver = true
		}
	}

	/**
	 * 处理显示障碍物
	 */
	private disposeBer(ber, i) {
		this.barlistAll.splice(i, 1)
		let barName = ber.name
		this[barName].push(ber)
		this.ctnrBer.removeChild(ber)
	}

	/**
	 * 触碰点
	 */
	private dotCrash(ber, x, y): boolean {
		if (ber.x <= x && ber.x + ber.width >= x && ber.y <= y && ber.y + ber.height >= y) {
			return true
		}
		return false
	}

	private createBitmapByName(name: string): egret.Bitmap {
		let result = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(name);
		result.texture = texture;
		return result;
	}
}