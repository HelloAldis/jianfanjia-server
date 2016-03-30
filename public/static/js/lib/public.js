// 全局数据
var globalData = {
	role : function(input){
		return {
			"0" : "管理员",
			"1" : "业主",
			"2" : "设计师"
		}[input]
	},
	sex : function(input){
		return {
			"0" : "男",
			"1" : "女",
			"2" : "不限"
		}[input]
	},
	dec_type : function(input){
		return {
			"0" : "家装",
			"1" : "商装",
			"2" : "软装"
		}[input]
	},
	work_type : function(input){
		return {
			"0" : "设计＋施工(半包)",
			"1" : "设计＋施工(全包)",
			"2" : "纯设计"
		}[input]
	},
	dec_style : function(input){
		return {
			"0" : "欧式",
			"1" : "中式",
			"2" : "现代",
			"3" : "地中海",
			"4" : "美式",
			"5" : "东南亚",
			"6" : "田园"
		}[input]
	},
	price_area : function(input){
		return {
			"0" : "50-100",
			"1" : "100-200",
			"2" : "200-300",
			"3" : "300以上"
		}[input]
	},
	house_type : function(input){
		return {
			"0" : "一室",
			"1" : "二室",
			"2" : "三室",
			"3" : "四室",
			"4" : "复式",
			"5" : "别墅",
			"6" : "LOFT",
			"7" : "其他"
		}[input]
	},
	dec_flow : function(input){
		return {
			"0" : "量房",
			"1" : "开工",
			"2" : "拆改",
			"3" : "水电",
			"4" : "泥木",
			"5" : "油漆",
			"6" : "安装",
			"7" : "竣工"
		}[input]
	}
}
var global_success_url = window.location;
var RootUrl = '/';
// 检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
function testCss3(c){var p=['webkit','Moz','ms','o'],i,a=[],s=document.documentElement.style,t=function(r){return r.replace(/-(\w)/g,function($0,$1){return $1.toUpperCase()})};for(i in p){a.push(t(p[i]+'-'+c));a.push(t(c))}for(i in a){if(a[i]in s){return true}}return false};
// 检测浏览器是否支持html5上传，来给低版本浏览器做优雅降级；
var checkSupport = function(){
	var input = document.createElement('input');
	var fileSupport = !!(window.File && window.FileList);
	var xhr = new XMLHttpRequest();
	var fd = !!window.FormData;
	return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in xhr && fd ? 'html5' : 'flash';
};
!(function() {
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = window.console || {};

    while (length--) {
        // Only stub undefined methods.
        console[methods[length]] = console[methods[length]] || noop;
    }
}());
/*
	1,格式化形式 "yyyy-MM-dd hh:mm:ss"
	2，时间

*/
function format(format,data){
	var date = new Date(data)
    var o = {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(),    //day
        "h+" : date.getHours(),   //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
        "S" : date.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o){
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
    }
    return format;
}
function IdentityCodeValid(code){
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }else{
        if(code.length == 18){
            code = code.split('');
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    return {
        verify : pass,
        info : tip
    }
}
/*
	str  要截取字符串
	len  截取长度
*/
function ellipsisStr(str, len){
	if(str.length*2 <= len) {
	    return str;
	}
    var strlen = 0;
    var s = "";
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
	return s;
}

/*
格式化时间
 */
(function(){
  var e, t = /\\?([a-z])/gi, n = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], r = function(e, t) {
      return s[e] ? s[e]() : t
  }, i = function(e, t) {
      return (e += "").length < t ? (new Array(++t - e.length)).join("0") + e : e
  }, s = {d: function() {
          return i(s.j(), 2)
      },D: function() {
          return s.l().slice(0, 3)
      },j: function() {
          return e.getDate()
      },l: function() {
          return n[s.w()] + "day"
      },N: function() {
          return s.w() || 7
      },S: function() {
          var e = s.j();
          return e < 4 | e > 20 && ["st", "nd", "rd"][e % 10 - 1] || "th"
      },w: function() {
          return e.getDay()
      },z: function() {
          var e = new Date(s.Y(), s.n() - 1, s.j()), t = new Date(s.Y(), 0, 1);
          return Math.round((e - t) / 864e5) + 1
      },W: function() {
          var e = new Date(s.Y(), s.n() - 1, s.j() - s.N() + 3), t = new Date(e.getFullYear(), 0, 4);
          return i(1 + Math.round((e - t) / 864e5 / 7), 2)
      },F: function() {
          return n[6 + s.n()];
      },m: function() {
          return i(s.n(), 2)
      },M: function() {
          return s.F().slice(0, 3)
      },n: function() {
          return e.getMonth() + 1
      },t: function() {
          return (new Date(s.Y(), s.n(), 0)).getDate()
      },L: function() {
          var e = s.Y();
          return e % 4 == 0 & e % 100 != 0 | e % 400 == 0;
      },o: function() {
          var e = s.n(), t = s.W(), n = s.Y();
          return n + (e === 12 && t < 9 ? -1 : e === 1 && t > 9)
      },Y: function() {
          return e.getFullYear();
      },y: function() {
          return (s.Y() + "").slice(-2)
      },a: function() {
          return e.getHours() > 11 ? "pm" : "am"
      },A: function() {
          return s.a().toUpperCase();
      },B: function() {
          var t = e.getUTCHours() * 3600, n = e.getUTCMinutes() * 60, r = e.getUTCSeconds();
          return i(Math.floor((t + n + r + 3600) / 86.4) % 1e3, 3);
      },g: function() {
          return s.G() % 12 || 12;
      },G: function() {
          return e.getHours();
      },h: function() {
          return i(s.g(), 2);
      },H: function() {
          return i(s.G(), 2);
      },i: function() {
          return i(e.getMinutes(), 2);
      },s: function() {
          return i(e.getSeconds(), 2);
      },u: function() {
          return i(e.getMilliseconds() * 1e3, 6);
      },e: function() {
          throw "Not supported (see source code of date() for timezone on how to add support)";
      },I: function() {
          var e = new Date(s.Y(), 0), t = Date.UTC(s.Y(), 0), n = new Date(s.Y(), 6), r = Date.UTC(s.Y(), 6);
          return 0 + (e - t !== n - r);
      },O: function() {
          var t = e.getTimezoneOffset(), n = Math.abs(t);
          return (t > 0 ? "-" : "+") + i(Math.floor(n / 60) * 100 + n % 60, 4);
      },P: function() {
          var e = s.O();
          return e.substr(0, 3) + ":" + e.substr(3, 2);
      },T: function() {
          return "UTC";
      },Z: function() {
          return -e.getTimezoneOffset() * 60;
      },c: function() {
          return "Y-m-d\\Th:i:sP".replace(t, r);
      },r: function() {
          return "D, d M Y H:i:s O".replace(t, r);
      },U: function() {
          return e / 1e3 | 0;
      }};
  Date.format = function(n, i) {
      return arguments.length == 1 ? (i = n, n = "Y-m-d H:i:s") : arguments.length == 0 && (i = null, n = "Y-m-d H:i:s"), e = i == null ? new Date : i instanceof Date ? new Date(i) : new Date(i * 1e3), n.replace(t, r);
  }, Date.prototype.format = function(e) {
      return Date.format(e, this);
  }
})();
/*个性化时间*/
(function(){
  var e = {lessThanMinuteAgo: "刚刚",minuteAgo: " 1 分钟前",minutesAgo: " {delta} 分钟前",hourAgo: " 1 小时前",hoursAgo: " {delta} 小时前",dayAgo: "昨天",daysAgo: " {delta} 天前",weekAgo: " 1 周前",weeksAgo: " {delta} 周前",monthAgo: " 1个月前",monthsAgo: " {delta} 个月前",yearAgo: " 1 年前",yearsAgo: " {delta} 年前",lessThanMinuteUntil: "从现在开始不到 1 分钟",minuteUntil: "从现在开始約 1 分钟",minutesUntil: "从现在开始约 {delta} 分钟",hourUntil: "从现在开始 1 小时",hoursUntil: "从现在开始约 {delta} 小时",dayUntil: "从现在开始 1 天",daysUntil: "从现在开始 {delta} 天",weekUntil: "从现在开始 1 星期",weeksUntil: "从现在开始 {delta} 星期",monthUntil: "从现在开始 1 个月",monthsUntil: "从现在开始 {delta} 个月",yearUntil: "从现在开始 1 年",yearsUntil: "从现在开始 {delta} 年"};
  Date.getTimePhrase = function(e) {
      var t = e < 0 ? "Until" : "Ago";
      e < 0 && (e *= -1);
      var n = {minute: 60,hour: 60,day: 24,week: 7,month: 52 / 12,year: 12,eon: Infinity}, r = "lessThanMinute";
      for (var i in n) {
          var s = n[i];
          if (e < 1.5 * s) {
              e > .75 * s && (r = i);
              break;
          }
          e /= s, r = i + "s";
      }
      return e = Math.round(e), {msg: r,delta: e,suffix: t}
  }, Date.timeAgo = function(t) {
      var n = t == null ? (new Date()).getTime() : (new Date(t)).getTime(), r = Math.round((new Date - n) / 1e3);
      if (r > 2592e3)
          return Date.format("Y-m-d H:i:s", n);
      var i = Date.getTimePhrase(r);
      return e[i.msg + i.suffix].replace("{delta}", i.delta);
  }, Date.prototype.timeAgo = function() {
      return Date.timeAgo(this);
  }
})();
/*格式化时间*/
(function(){
  var e = function(e, t) {
      return e.getUTCFullYear() === t.getUTCFullYear() && e.getUTCMonth() === t.getUTCMonth() && e.getUTCDate() === t.getUTCDate()
  }, t = function(e, t) {
      return e.getUTCFullYear() === t.getUTCFullYear() && e.getUTCMonth() === t.getUTCMonth() && e.getUTCDate() === t.getUTCDate() - 1
  }, n = function(e, t) {
      return e.getUTCFullYear() === t.getUTCFullYear()
  };
  Date.formatMoment = function(r) {
      var i = r == null ? new Date : r instanceof Date ? new Date(r) : new Date(r * 1e3), s = new Date, o;
      return e(i, s) ? o = "今天 H:i" : t(i, s) ? o = "昨天 H:i" : n(i, s) ? o = "m 月 d 日 H:i" : o = "Y 年 m 月 d 日 H:i", Date.format(o, i);
  }, Date.prototype.formatMoment = function() {
      return Date.formatMoment(this);
  }
})();

function formatNumber(num){
    var num = parseFloat(num);
    if(isNaN(num)){
        throw "这不是一个数字，不能被格式化";
    }
    if(num < 1000){
        return num;
    }else if(num >= 1000 && num < 10000){
        return Math.floor(num / 1000)+'千';
    }else if(num >= 10000 && num < 100000000){
        return Math.floor(num / 10000)+'万';
    }else if(num >= 100000000){
        return Math.floor(num / 100000000)+'亿'
    }
}
function commaNumber(num){
    if(num > 100000000){
        throw "超出范围";
    }
    if(num < 1000){
        return num;
    }
    var source = String(num).split(".");//按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
    return source.join(".");//再将小数部分合并进来
}
