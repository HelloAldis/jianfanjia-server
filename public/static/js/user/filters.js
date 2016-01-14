'use strict';
// 公用自定义筛选
angular.module('filters', [])
	.filter('sexFilter', function () {   //性别筛选
        return function (input) {
            return {
                "0":"男",
                "1":"女",
                "2":"不限"
            }[input];
        }
    })
    .filter('authTypeFilter', function () {    //设计师认证状态
        return function (input) {
            return {
                "0":"未提交认证",
                "1":"审核中",
                "2":"审核通过",
                "3":"审核不通过",
                "4":"违规下线"
            }[input];
        }
    })
    .filter('decTypeFilter', function () {   //装修类别
        return function (input) {
            return {
                "0":"家装",
                "1":"商装",
                "2":"软装"
            }[input];
        }
    })
    .filter('decStyleFilter', function () {   //擅长风格
        return function (input) {
            return {
                "0":"欧式",
                "1":"中式",
                "2":"现代",
                "3":"地中海",
                "4":"美式",
                "5":"东南亚",
                "6":"田园"
            }[input];
        }
    })
    .filter('decDistrictsFilter', function () {     //接单区域
        return function (input) {
            return {
                "0":"江岸区",
                "1":"江汉区",
                "2":"硚口区",
                "3":"汉阳区",
                "4":"武昌区",
                "5":"洪山区",
                "6":"青山区"
            }[input];
        }
    })
    .filter('designFeeRangeFilter', function () {     //设计费报价
        return function (input) {
            return {
                "0":"50-100",
                "1":"100-200",
                "2":"200-300",
                "3":"300以上"
            }[input];
        }
    })
    .filter('designTypeFilter', function () {     //习惯沟通方式
        return function (input) {
            return {
                "0":"不限",
                "1":"表达型",
                "2":"聆听型"
            }[input];
        }
    })
    .filter('designSexFilter', function () {     //习惯沟通方式
        return function (input) {
            return {
                "0":"男",
                "1":"女",
                "2":"不限"
            }[input];
        }
    })
    .filter('workTypeFilter', function () {     //习惯沟通方式
        return function (input) {
            return {
                "0":"设计＋施工(半包)",
                "1":"设计＋施工(全包)",
                "2":"纯设计"
            }[input];
        }
    })
    .filter('houseTypeFilter', function () {     //意向接单户型
        return function (input) {
            return {
                "0":"一居",
                "1":"二室",
                "2":"三室",
                "3":"四室",
                "4":"复式",
                "5":"别墅",
                "6":"LOFT",
                "7":"其他"
            }[input];
        }
    })
	.filter('cityFilter', function () {
        return function (data, parent) {
            var filterData = [];
            angular.forEach(data, function (obj) {
                if (obj.parent == parent) {
                    filterData.push(obj);
                }
            })
            return filterData;
        }
    })
    .filter('processFilter', function () {
        return function (input) {
             return {0:'开工',
                     1:'拆改',
                     2:'水电',
                     3:'泥木',
                     4:'油漆',
                     5:'安装',
                     6:'竣工'}[input];
        }
    })
    .filter('getTimesFilter',function(){
        return function (input) {
             return (new Date(input.replace(/-/g,'/'))).getTime();
        }
    })
    .filter('authFilter', function () {   //设计师审核状态
        return function (input) {
            return {
                "0":"未通过",
                "1":"审核通过",
                "2":"审核不通过",
                "3":"违规下线"
            }[input];
        }
    })
    .filter('requirementFilter', function () {
        return function (input) {
            return {
                "0":"未预约",
                "1":"已预约但无人响应",
                "2":"有响应但无人提交方案",
                "3":"提交方案但无选定方案",
                "4":"选定方案无配置工地",
                "5":"配置工地"
            }[input];
        }
    })
    .filter('planFilter', function () {      //方案状态
        return function (input) {
            return {
                "0":"已预约无响应",
                "1":"已拒绝业主",
                "2":"有响应无方案",
                "3":"已提交方案",
                "4":"方案被拒绝",
                "5":"方案被选中"
            }[input];
        }
    })
    .filter('userStatusTipsFilter', function () {     //业主需求状态进度当前提示文字
        return function (input) {
            return {
                "0":"需要预约设计师",
                "1":"设计师正在响应中",
                "2":"确认设计师上门量房",
                "3":"设计师提交方案中",
                "4":"选择装修方案",
                "5":"生成三方合同",
                "6":"设计师提交方案中",
                "7":"生成三方合同"
            }[input];
        }
    })
    .filter('userRequiremtnesTipsFilter', function () {   //业主需求状态当前提示文字
        return function (input) {
            return {
                "0":"已预约无响应",
                "1":"已拒绝业主",
                "2":"有响应无方案",
                "3":"已提交方案",
                "4":"方案被拒绝",
                "5":"方案被选中"
            }[input];
        }
    })
    .filter('userRequiremtnesBtnFilter', function () {    //业主需求状态当前提示按钮
        return function (input) {
            return {
                "0":"前往预约量房",
                "1":"前往确认设计师上门量房",
                "2":"查看并选择装修方案",
                "3":"前往生成三方合同"
            }[input];
        }
    })
    .filter('timeFormat', function () {    //格式化个性时间
        return function (input) {
            var date = new Date(input),
                curDate = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                curYear = curDate.getFullYear(),
                curHour = curDate.getHours(),
                timeStr;
            if(year < curYear){
                timeStr = year +'年'+ month +'月'+ day +'日 '+ hour +':'+ minute;
            }else{
                var pastTime = curDate - date,
                    pastH = pastTime/3600000;
                if(pastH > curHour){
                      timeStr = month +'月'+ day +'日 '+ hour +':'+ minute;
                }else if(pastH >= 1){
                      timeStr = '今天 ' + hour +':'+ minute +'分';
                }else{
                    var pastM = curDate.getMinutes() - minute;
                    if(pastM > 1){
                        timeStr = pastM +'分钟前';
                    }else{
                        timeStr = '刚刚';
                    }
                }
            }
            return timeStr;
        }
    })
    .filter('numberChinese', function () {    //人民币中文转数字
        return function (input) {
            var numArray = [];
            var unit = "亿万元$";
            for ( var i = 0; i < unit.length; i++) {
                var re = eval("/" + (numArray[i - 1] ? unit.charAt(i - 1) : "") + "(.*)" + unit.charAt(i) + "/");
                if (input.match(re)) {
                    numArray[i] = input.match(re)[1].replace(/^拾/, "壹拾");
                    numArray[i] = numArray[i].replace(/[零壹贰叁肆伍陆柒捌玖]/g, function($1) {
                        return "零壹贰叁肆伍陆柒捌玖".indexOf($1);
                    });
                    numArray[i] = numArray[i].replace(/[分角拾佰仟]/g, function($1) {
                        return "*" + Math.pow(10, "分角 拾佰仟 ".indexOf($1) - 2) + "+"
                    }).replace(/^\*|\+$/g, "").replace(/整/, "0");
                    numArray[i] = "(" + numArray[i] + ")*" + Math.ceil(Math.pow(10, (2 - i) * 4));
                } else
                    numArray[i] = 0;
            }
            return eval(numArray.join("+"));
        }
    })
    .filter('chineseNumber', function () {    //人民币数字转中文
        return function (input) {
            var maxDec = 2,
                minus = "",
                CN_SYMBOL = "",   //币种名称（如“人民币”，默认空）
                vInt = "",
                vDec = "", // 字符串：金额的整数部分、小数部分
                resAIW = "", // 字符串：要输出的结果
                parts, // 数组（整数部分.小数部分），length=1时则仅为整数。
                digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"],  //数字（0~9——零~玖）
                radices = ["", "拾", "佰", "仟"],   // 基（十进制记数系统中每个数字位的基是10——拾,佰,仟）
                bigRadices = ["", "万", "亿", "兆", "京", "垓", "杼", "穰", "沟", "涧", "正"],  //大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）
                decimals = ["角", "分", "厘", "毫", "丝"], //辅币（元以下，角/分/厘/毫/丝）
                zeroCount, // 零计数
                i, p, d, // 循环因子；前一位数字；当前位数字。
                quotient, modulus,   // 整数部分计算用：商数、模数。
              // 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
                NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null || Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
            input = input.toString().replace(/,/g, "");
            input = input.replace(/^0+/, "");
            if (input == "") {
                return "零元整";
            }else if (isNaN(input)){
                return "错误：金额不是合法的数值！";
            }
            if (input.length > 1) {
                if (input.indexOf('-') == 0) {   // 处理负数符号“-”
                    input = input.replace("-", "");
                    minus = "负";
                }
                if (input.indexOf('+') == 0) {   // 处理前导正数符号“+”（无实际意义）
                    input = input.replace("+", "");
                }
            }
            parts = input.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
            if (parts.length > 1) {
                vInt = parts[0];
                vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
                if (NoneDecLen) {
                    maxDec = vDec.length > 5 ? 5 : vDec.length;
                } // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
                var rDec = Number("0." + vDec);
                rDec *= Math.pow(10, maxDec);
                rDec = Math.round(Math.abs(rDec));
                rDec /= Math.pow(10, maxDec); // 小数四舍五入
                var aIntDec = rDec.toString().split('.');
                if (Number(aIntDec[0]) == 1) {
                    vInt = (Number(vInt) + 1).toString();
                } // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
                if (aIntDec.length > 1) {
                    vDec = aIntDec[1];
                } else {
                    vDec = "";
                }
            } else {
                vInt = input;
                vDec = "";
                if (NoneDecLen) {
                    maxDec = 0;
                }
            }
            if (vInt.length > 44) {
                return "错误：金额值太大了！整数位长【" + vInt.length.toString() + "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
            }
            // 处理整数部分（如果有）
            if (Number(vInt) > 0) {
                zeroCount = 0;
                for (i = 0; i < vInt.length; i++) {
                    p = vInt.length - i - 1;
                    d = vInt.substr(i, 1);
                    quotient = p / 4;
                    modulus = p % 4;
                   if (d == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            resAIW += digits[0];
                        }
                        zeroCount = 0;
                        resAIW += digits[Number(d)] + radices[modulus];
                    }
                    if (modulus == 0 && zeroCount < 4) {
                        resAIW += bigRadices[quotient];
                    }
                }
                resAIW += "元";
            }
            // 处理小数部分（如果有）
            for (i = 0; i < vDec.length; i++) {
                d = vDec.substr(i, 1);
                if (d != "0") {
                    resAIW += digits[Number(d)] + decimals[i];
                }
            }
            // 处理结果
            if (resAIW == "") {
                resAIW = "零" + "元";
            } // 零元
            if (vDec == "") {
                resAIW += "整";
            } // ...元整
            resAIW = CN_SYMBOL + minus + resAIW; // 人民币/负......元角分/整
            return resAIW;
        }
    })
    .filter('contractEndTime', function () {    //合同结束日期
        return function (input,duration) {
            var time = 0;
            if(!isNaN(duration)){
                time = input + duration*60*60*24*1000
            }else{
                time = input
            }
            return time;
        }
    })
    .filter('businessHouseTypeFilter', function () {    //商装类型
        return function (input) {
            return {
                "0":"餐厅",
                "1":"服装店",
                "2":"酒吧",
                "3":"美容院",
                "4":"办公室",
                "5":"美发店",
                "6":"幼儿园",
                "7":"酒店",
                "9999":"其他"
            }[input];
        }
    });
