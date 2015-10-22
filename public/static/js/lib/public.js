// 全局数据
var globalData = {
	role: ['管理员', '业主', '设计师'],
	sex: ['男', '女'],
	dec_type: ['家装', '商装', '软装'],
	work_type: ['半包', '全包'],
	dec_style: ['欧式', '中式', '现代', '地中海', '美式', '东南亚', '田园'],
	scheme_state: ['沟通中', '已中标', '未中标'],
	orders_area: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '洪山区', '青山区'],
	price_area: ['50－100', '100-200', '200－300', '300以上'],
	house_type: ['一室', '二室', '三室', '四室', '复式', '别墅', 'LOFT', '其他'],
	dec_flow: ['开工', '拆改', '水电', '泥木', '油漆', '安装', '竣工'],
	des_type: ['不限', '表达型', '聆听型'],
	auth_type: ['未提交认证', '审核中', '审核通过'],
	scheme_status: ['已预约但没有响应', '已拒绝业主', '已响应但是没有方案', '提交了方案', '方案被拒绝', '方案被选中']
}
var global_success_url = window.location;
// var RootUrl = 'http://www.jianfanjia.com/';
var RootUrl = 'http://127.0.0.1/';
// 检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
function testCss3(c) {
	var p = ['webkit', 'Moz', 'ms', 'o'],
		i, a = [],
		s = document.documentElement.style,
		t = function (r) {
			return r.replace(/-(\w)/g, function ($0, $1) {
				return $1.toUpperCase()
			})
		};
	for (i in p) {
		a.push(t(p[i] + '-' + c));
		a.push(t(c))
	}
	for (i in a) {
		if (a[i] in s) {
			return true
		}
	}
	return false
};
//检测是否支持html5文件上传
function checkSupport() {
	var input = document.createElement('input');
	var fileSupport = !!(window.File && window.FileList);
	var xhr = new XMLHttpRequest();
	var fd = !!window.FormData;
	return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in
		xhr && fd ? 'html5' : 'flash';
}
//Cookie操作
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function ($) {
	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch (e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function (key, value, options) {
		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires,
					t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}
			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}
		var result = key ? undefined : {},
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;
		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');
			if (key === name) {
				result = read(cookie, value);
				break;
			}
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function (key, options) {
		$.cookie(key, '', $.extend({}, options, {
			expires: -1
		}));
		return !$.cookie(key);
	};
}));
window.username = $.cookie("username");
window.usertype = $.cookie("usertype");
$.ajaxSetup({
		cache: false
	}) //全局缓存，解决ie问题
	//消息提示框
function promptMessage(str, msg) {
	var $win = $(window);
	var $body = $(document.body);
	var $promptBox = $('<div class="k-prompt"><h3>消息提示</h3><p class="' + msg +
		'">' + str + '</p></div>');
	$body.append($promptBox)
	var top = ($win.height() - $promptBox.outerHeight()) / 2;
	$promptBox.stop().animate({
		top: top,
		opacity: 1
	}, function () {
		setTimeout(function () {
			$promptBox.stop().fadeToggle('slow', 0, function () {
				$promptBox.remove();
			})
		}, 2000)
	});
}
/*
	下拉选择框插件
	3个参数：
		1：id用来生成input的name值的提供给后台
		2：下拉选项列表数据
		3：是否有下拉箭头按钮
*/
;
(function ($) {
	function ComboBox(options) {
		this.init(options)
	}
	ComboBox.prototype = {
		init: function (options) {
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(this.settings = {
				id: null,
				list: [],
				btn: true,
				editor: false,
				index: false,
				query: 0,
				callback: function () {}
			}, options || {});
			self.settings.callback(this.settings.query);
			this.selectBox = $('#' + this.settings.id);
			this.input = $('<input type="hidden" name="' + this.settings.id +
				'" value="' + (this.settings.index ? this.settings.query : this.settings
					.list[this.settings.query]) + '" />');
			this.option = $('<div class="option"><span class="value">' + this.settings
				.list[this.settings.query] + '</span>' + (this.settings.btn ?
					'<span class="arrow"><em></em><i></i></span>' : '') + '</div>');
			this.editor = $('<div class="editor"><input class="value" name="' + this.settings
				.id + '" value="' + this.settings.list[this.settings.query] + '" />' +
				(this.settings.btn ? '<span class="arrow"><em></em><i></i></span>' : '') +
				'</div>');
			this.createList(this.settings.list);
			if (this.settings.editor) {
				this.selectBox.append(this.editor);
				this.editorEvent();
			} else {
				this.selectBox.append(this.input);
				this.selectBox.append(this.option);
				this.optionEvevt();
			}
			this.select = this.selectBox.find('.select');
			this.selectEvent();
		},
		createList: function (data) {
			var sLi = '<ul class="select">';
			for (var i = 0; i < data.length; i++) {
				sLi += '<li><a href="javascript:;">' + data[i] + '</a></li>'
			};
			sLi += '</ul>';
			this.selectBox.append(sLi);
		},
		optionEvevt: function () {
			var self = this;
			self.option.on('click', function (ev) {
				self.body.click();
				self.selectShow();
				return false;
			});
		},
		selectEvent: function () {
			var self = this;
			this.body.on('click', function (ev) {
				self.selectHide();
			});
			this.select.delegate('li', 'click', function (ev) {
				ev.stopPropagation();
				var value = $(this).find('a').text();
				if (self.settings.index) {
					self.input.val($(this).index());
				} else {
					self.input.val(value)
				}
				if (self.settings.editor) {
					self.editor.find('.value').val(value).data('val', value);
				} else {
					self.option.find('.value').html(value);
				}
				self.settings.callback($(this).index());
				self.selectHide();
			});
		},
		editorEvent: function () {
			var self = this;
			this.editor.on('click', function (ev) {
				self.body.click();
				self.selectShow();
				return false;
			});
			this.editor.find('.value').on('focus keyup', function () {
				self.selectShow();
				return false;
			})
		},
		selectHide: function () {
			this.selectBox.each(function (index, el) {
				$(el).css('zIndex', 5).find('.select').hide();
			});
		},
		selectShow: function () {
			this.select.show();
			this.selectBox.css('zIndex', 20)
		}
	}
	window["ComboBox"] = ComboBox;
})(jQuery);
/*
	1,格式化形式 "yyyy-MM-dd hh:mm:ss"
	2，时间

*/
function format(format, data) {
	var date = new Date(data)
	var o = {
		"M+": date.getMonth() + 1, //month
		"d+": date.getDate(), //day
		"h+": date.getHours(), //hour
		"m+": date.getMinutes(), //minute
		"s+": date.getSeconds(), //second
		"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
		"S": date.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() +
		"").substr(4 - RegExp.$1.length));
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[
				k]).substr(("" + o[k]).length));
	}
	return format;
}

function IdentityCodeValid(code) {
	var city = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江 ",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北 ",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏 ",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外 "
	};
	var tip = "";
	var pass = true;
	if (!code || !
		/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
			code)) {
		tip = "身份证号格式错误";
		pass = false;
	} else if (!city[code.substr(0, 2)]) {
		tip = "地址编码错误";
		pass = false;
	} else {
		if (code.length == 18) {
			code = code.split('');
			var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
			var sum = 0;
			var ai = 0;
			var wi = 0;
			for (var i = 0; i < 17; i++) {
				ai = code[i];
				wi = factor[i];
				sum += ai * wi;
			}
			var last = parity[sum % 11];
			if (parity[sum % 11] != code[17]) {
				tip = "校验位错误";
				pass = false;
			}
		}
	}
	return {
		verify: pass,
		info: tip
	}
}
/*
	str  要截取字符串
	len  截取长度
*/
function ellipsisStr(str, len) {
	if (str.length * 2 <= len) {
		return str;
	}
	var strlen = 0;
	var s = "";
	for (var i = 0; i < str.length; i++) {
		s = s + str.charAt(i);
		if (str.charCodeAt(i) > 128) {
			strlen = strlen + 2;
			if (strlen >= len) {
				return s.substring(0, s.length - 1) + "...";
			}
		} else {
			strlen = strlen + 1;
			if (strlen >= len) {
				return s.substring(0, s.length - 2) + "...";
			}
		}
	}
	return s;
}
$(function () {
	var userLogin = $('#j-userLogin');
	if (window.username && window.usertype) {
		if (window.usertype == 0) {
			userLogin.html('<a href="../jyz/live.html">管理员 ' + decodeURI(window.username) +
				'</a><a href="javascript:;" id="signout">退出</a>')
		} else if (window.usertype == 1) {
			userLogin.html('<a href="../user/owner.html">业主 ' + decodeURI(window.username) +
				'</a><a href="javascript:;" id="signout">退出</a>')
		} else if (window.usertype == 2) {
			userLogin.html('<a href="../user/design.html">设计师 ' + decodeURI(window.username) +
				'</a><a href="javascript:;" id="signout">退出</a>')
		}
	}
	//退出操作
	$(document.body).delegate('#signout', 'click', function (ev) {
		ev.preventDefault();
		var url = RootUrl + 'api/v1/signout';
		$.ajax({
			url: url,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			cache: false,
			success: function (res) {
				if (res["msg"] === "success") {
					$.removeCookie("username");
					$.removeCookie("usertype");
					window.location.href = "/";
					userLogin.html(
						'<a href="../user/login.html">登录</a>/<a href="../user/reg.html">注册</a>'
					)
				} else {
					alert('提交失败')
				}

			}
		});
	});
	//回到顶部
	var winH = $(window).height();
	var $goto = $('<a class="goto" href="javascript:;"></a>');
	$(document.body).append($goto);
	$goto.on('click', function () {
		$('html,body').animate({
			scrollTop: 0
		}, 500)
		return false;
	})
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > winH) {
			$goto.fadeIn(500)
		} else {
			$goto.fadeOut(500)
		}
	});
	//手机app
	var appStr =
		'<div class="m-app"><a href="javascript:;">下载App</a><div class="ewm"><i><em></em></i><span>简繁家App</span><img width="121" src="../../static/img/public/emw.png" alt="简繁家App" /></div></div>'
	userLogin.append(appStr);
	var iBff = true;
	$(document.body).delegate('.m-app', 'mouseenter', function (ev) {
		ev.preventDefault();
		userLogin.find('.ewm').show().animate({
			top: 40,
			opacity: 1
		})
	});
	$(document.body).delegate('.m-app', 'mouseleave', function (ev) {
		ev.preventDefault();
		userLogin.find('.ewm').animate({
			top: -160,
			opacity: 0
		}).hide()
	});
})
