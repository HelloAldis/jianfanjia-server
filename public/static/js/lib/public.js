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