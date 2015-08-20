// 全局数据
var globalData = {
	role : ['管理员','业主','设计师'],
	sex  : ['男','女'],
	dec_type : ['家装','商装','软装'],
	work_type : ['半包','全包'],
	dec_style : ['欧式','中式','现代','地中海','美式','东南亚'],
	scheme_state : ['沟通中','已中标','未中标'],
	orders_area : ['汉口','汉阳','武昌'],
	price_area  : ['50－100','100-200','200－300','300以上'],
	house_type : ['一居','二居','三居','四居','复式','别墅'],
	dec_flow : ['开工','拆改','水电','泥木','油漆','安装','竣工']
}
var RootUrl = 'http://192.168.1.107:8080/';
// 检测函数
function isMobile(mobile){
	return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
}
function isPassword(str){
   return (/^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/.test(str));
}
function isVerifyCode(num){
   return (/^[\d]{6,22}$/.test(str));
}




/*
	下拉选择框插件
	3个参数：
		1：id用来生成input的name值的提供给后台
		2：下拉选项列表数据
		3：是否有下拉箭头按钮
*/
;(function($){
	function ComboBox(options){
		var self = this;
		this.win = $(window);
		this.doc = $(document);
		this.body = $(document.body);
		$.extend(this.settings = {
			id : null,
			list : [],
			btn : true
		},options || {})
		this.selectBox = $('#'+this.settings.id);
		this.input = $('<input type="hidden" name="'+this.settings.id+'" value="'+this.settings.list[0]+'" />');
		this.option = $('<div class="option"><span class="value">'+this.settings.list[0]+'</span>'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>')
		this.createList(this.settings.list);
		this.selectBox.append(this.input);
		this.selectBox.append(this.option);
		this.select = this.selectBox.find('.select');
		this.selectEvent();
	}
	ComboBox.prototype = {
		createList : function(data){
			var sLi = '<ul class="select">';
			for (var i = 0; i < data.length; i++) {
				sLi+= '<li><a href="javascript:;">'+data[i]+'</a></li>'
			};
			sLi+='</ul>';
			this.selectBox.append(sLi);
		},
		selectEvent : function(){
			var self = this;
			self.option.on('click' , function(ev){
				self.body.click(); 
				self.selectShow();
				return false;
			});
			this.body.on('click' , function(ev){
				self.selectHide(); 
			});
			this.select.delegate('li', 'click' , function(ev){
				ev.stopPropagation();
				var value = $(this).find('a').text();
				self.input.val(value)
				self.option.find('.value').html(value);
				self.selectHide();
			});
		},
		selectHide : function(){
			this.selectBox.each(function(index, el) {
				$(el).css('zIndex',5).find('.select').hide();
			});
		},
		selectShow : function(){
			this.select.show(); 
			this.selectBox.css('zIndex',20)
		}
	}
	window["ComboBox"] = ComboBox;
})(jQuery);