var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 障碍物处理类
 */
var Pool = (function () {
    function Pool(Swith, Sheight, ctnrBer) {
        //障碍物高度
        this.barHeight = 330;
        //跳跃
        this.jump = false;
        //同一个地方障碍物
        this.sameloca = 2;
        this.barlistAll = [];
        this.barlist0 = [];
        this.barlist1 = [];
        this.barlist2 = [];
        this.Swith = Swith;
        this.Sheight = Sheight;
        this.ctnrBer = ctnrBer;
        this.range = this.Swith / 2 - this.Swith * 0.22;
        this.init();
    }
    /**
     * 初始化
     */
    Pool.prototype.init = function () {
        for (var i = 0; i < this.barlistAll.length; i++) {
            var ber = this.barlistAll[i];
            this.disposeBer(ber, i);
            --i;
        }
        this.barlistAll = [];
    };
    /**
     * 添加障碍物
     */
    Pool.prototype.addBarrier = function (num) {
        var name = "barlist" + num; //生成函数名
        //判断回收站是否有这对象，有则取出，没则new
        var ber;
        if (this[name][0]) {
            ber = this[name].shift();
        }
        else {
            ber = this.createBitmapByName("icon_barrier" + num + "_png");
            ber.name = name;
        }
        var leng;
        //位置概率
        if (this.sameloca == 1)
            leng = this.berrShow(0.1, 0.55, 1);
        else if (this.sameloca == 2)
            leng = this.berrShow(0.45, 0.55, 1);
        else
            leng = this.berrShow(0.45, 0.9, 1);
        this.ctnrBer.addChild(ber);
        this.barlistAll.push(ber);
        ber.x = this.Swith / 2 - ber.width / 2 - leng;
        ber.y = -ber.height;
    };
    Pool.prototype.berrShow = function (one, twe, three) {
        //出现位置概率
        var leng;
        var random = Math.random();
        if (random < one) {
            leng = -this.range;
            this.sameloca = 1;
        }
        else if (random < twe) {
            leng = 0;
            this.sameloca = 2;
        }
        else if (random < three) {
            leng = this.range;
            this.sameloca = 3;
        }
        return leng;
    };
    /**
     * 障碍物总数组y轴变化随背景变化，超过舞台高度则放到回收站
     */
    Pool.prototype.update = function (speed, player) {
        if (this.barlistAll == [] || this.barlistAll == undefined)
            return;
        for (var i = 0; i < this.barlistAll.length; i++) {
            this.barlistAll[i].y += speed;
            var ber = this.barlistAll[i];
            var topX = player.x + player.width / 2;
            var buttomY = player.y + player.height;
            //判断车辆碰撞事件（前进）
            if (this.dotCrash(ber, topX, player.y) || this.dotCrash(ber, topX, buttomY)) {
                this.loseLife();
                this.disposeBer(ber, i);
                i--;
            }
            else if (ber.y > (this.Sheight + this.barHeight)) {
                this.disposeBer(ber, i);
                i--;
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
    };
    /**
     * 丢失生命，0为结束游戏
     */
    Pool.prototype.loseLife = function () {
        var up = +this.ordinaryUI.textUp.text;
        //console.log(up)
        this.ordinaryUI.textUp.text = "" + (up - 1);
        if (up - 1 <= 0) {
            this.normalScene.gameOver = true;
        }
    };
    /**
     * 处理显示障碍物
     */
    Pool.prototype.disposeBer = function (ber, i) {
        this.barlistAll.splice(i, 1);
        var barName = ber.name;
        this[barName].push(ber);
        this.ctnrBer.removeChild(ber);
    };
    /**
     * 触碰点
     */
    Pool.prototype.dotCrash = function (ber, x, y) {
        if (ber.x <= x && ber.x + ber.width >= x && ber.y <= y && ber.y + ber.height >= y) {
            return true;
        }
        return false;
    };
    Pool.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Pool;
}());
__reflect(Pool.prototype, "Pool");
//# sourceMappingURL=Pool.js.map