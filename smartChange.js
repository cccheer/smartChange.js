/**
 * Created by yaoxi on 2016-12-22 0022.
 */

var smartChange = new function () {

    this.changeOutput = function (money) {
        var moneyEnum = new Array(1, 5, 10, 20, 50, 100);//人民币面额枚举
        var returnArray = new Array();
        var count = 0;//数组计数
        var thousand = 0;//百位取整
        var quzheng = 0;//金额取整百元
        var realMoney = 0;//无论何时都不会变的实际金额百元以下
        var total = 0;//要放在数组里的总金额
        var dotIndex = money.indexOf('.');//小数点的位置
        //将不找零的结果放到数组中
        returnArray[count] = [money, 0];
        count++;
        //结算金额不足一元的情况，很少发生
        if (money < 1) {
            returnArray[count] = [1, (1 - money)];
            count++;
        }
        //在下面的判断中，money代表结算金额中百以内的零钱，百元及以上用thousand表示
        if (dotIndex == -1) {
            quzheng = money;
        } else {
            quzheng = money.substr(0, dotIndex);
        }
        thousand = Number(quzheng.substring(0, quzheng.length - 2));
        money = money % 100;

        realMoney = money;
        //结算金额中含有几毛钱的情况
        if (!(dotIndex == -1)) {
            money = parseInt(money) + 1;
            returnArray[count] = [thousand * 100 + money, parseFloat(money - realMoney).toFixed(2)];
            count++;
        }

        var flag = true;
        for (var i = 1; i <= moneyEnum.length; i++) {
            if (money == moneyEnum[i]) {
                flag = false;
            } else if (money % 10 == 0 && money != 20/*&&money!=50*/) { //整十元特殊处理
                flag = false;
                var m3 = (parseInt(money / 10)) * 10 + 10;
                total = thousand * 100 + m3;
                returnArray[count] = [total, parseFloat(m3 - realMoney).toFixed(2)];
                count++;
            }
        }

        if (flag) {
            //个位上金额不满五元取五元，五元到下一个整十元取下一个整十元
            if ((money % 10) < 5) {
                var m1 = (parseInt(money / 10)) * 10 + 5;
                var m2 = (parseInt(money / 10)) * 10 + 10;
                total = thousand * 100 + m1;
                returnArray[count] = [total, parseFloat(m1 - realMoney).toFixed(2)];
                count++;
                total = thousand * 100 + m2;
                returnArray[count] = [total, parseFloat(m2 - realMoney).toFixed(2)];
                count++;
            } else {
                var m3 = (parseInt(money / 10)) * 10 + 10;
                total = thousand * 100 + m3;
                returnArray[count] = [total, parseFloat(m3 - realMoney).toFixed(2)];
                count++;
            }
        }


        //取大于结算金额的人民币面值
        for (var i = 1; i <= moneyEnum.length; i++) {
            if (money < moneyEnum[i]) {
                returnArray[count] = [(thousand * 100 + moneyEnum[i]), parseFloat(moneyEnum[i] - realMoney).toFixed(2)];
                count++;
            }
        }

        //数组去重方法
        Array.prototype.distinctArray = function () {
            var res = [];
            var json = {};
            for (var i = 0; i < this.length; i++) {
                if (!json[this[i]]) {
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }
        returnArray = returnArray.distinctArray();

        return returnArray;

    }

    return smartChange;

}
