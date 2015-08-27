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
	dec_flow : ['开工','拆改','水电','泥木','油漆','安装','竣工'],
	des_type : ['不限','表达型','聆听型'],
	auth_type : ['未提交认证','审核中','审核通过'],
	scheme_status : ['已预约但没有响应','已拒绝业主','已响应但是没有方案','提交了方案','方案被拒绝','方案被选中']
}
//var RootUrl = 'http://192.168.1.107:80/';
var global_success_url = window.location;
var RootUrl = 'http://192.168.1.107:8080/';
// 检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
function testCss3(c){var p=['webkit','Moz','ms','o'],i,a=[],s=document.documentElement.style,t=function(r){return r.replace(/-(\w)/g,function($0,$1){return $1.toUpperCase()})};for(i in p){a.push(t(p[i]+'-'+c));a.push(t(c))}for(i in a){if(a[i]in s){return true}}return false};
/*
	下拉选择框插件
	3个参数：
		1：id用来生成input的name值的提供给后台
		2：下拉选项列表数据
		3：是否有下拉箭头按钮
*/
;(function($){
	function ComboBox(options){
		this.init(options)
	}
	ComboBox.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(this.settings = {
				id : null,
				list : [],
				btn : true,
				editor : false,
				index : false
			},options || {})
			this.selectBox = $('#'+this.settings.id);
			this.input = $('<input type="hidden" name="'+this.settings.id+'" value="'+(this.settings.index ? "0" : this.settings.list[0])+'" />');
			this.option = $('<div class="option"><span class="value">'+this.settings.list[0]+'</span>'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>');
			this.editor = $('<div class="editor"><input class="value" name="'+this.settings.id+'" value="'+this.settings.list[0]+'" />'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>');
			this.createList(this.settings.list);
			if(this.settings.editor){
				this.selectBox.append(this.editor);
				this.editorEvent();
			}else{
				this.selectBox.append(this.input);
				this.selectBox.append(this.option);
				this.optionEvevt();
			}
			this.select = this.selectBox.find('.select');
			this.selectEvent();
		},
		createList : function(data){
			var sLi = '<ul class="select">';
			for (var i = 0; i < data.length; i++) {
				sLi+= '<li><a href="javascript:;">'+data[i]+'</a></li>'
			};
			sLi+='</ul>';
			this.selectBox.append(sLi);
		},
		optionEvevt : function(){
			var self = this;
			self.option.on('click' , function(ev){
				self.body.click(); 
				self.selectShow();
				return false;
			});
		},
		selectEvent : function(){
			var self = this;
			this.body.on('click' , function(ev){
				self.selectHide(); 
			});
			this.select.delegate('li', 'click' , function(ev){
				ev.stopPropagation();
				var value = $(this).find('a').text();
				if(self.settings.index){
					self.input.val($(this).index())
				}else{
					self.input.val(value)
				}
				self.option.find('.value').html(value);
				if(self.settings.editor){
					self.editor.find('.value').val(value);
				}else{
					self.option.find('.value').html(value);
				}
				self.selectHide();
			});
		},
		editorEvent : function(){
			var self = this;
			this.editor.on('click' , function(ev){
				self.body.click(); 
				self.selectShow();
				return false;
			});
			this.editor.find('.value').on('focus keyup',function(){
				self.selectShow();
				return false;
			})
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