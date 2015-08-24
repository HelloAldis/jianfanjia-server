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
	des_type : ['不限','表达型','聆听型']
}
var RootUrl = 'http://192.168.1.107:80/';
//var RootUrl = 'http://192.168.1.107:8080/';
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
				editor : false
			},options || {})
			this.selectBox = $('#'+this.settings.id);
			this.input = $('<input type="hidden" name="'+this.settings.id+'" value="'+this.settings.list[0]+'" />');
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
				self.input.val(value)
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

/*
	下拉选择城市插件
	4个参数：
		1：id用来生成input的name值的提供给后台
	    2：city 显示市
		3：area 显示区和县
		4：是否有下拉箭头按钮 
*/
;(function($){
	function CitySelect(options){
		this.init(options)
	}
	CitySelect.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(this.settings = {
				id : null,
				data : {},
				btn : true,
			},options || {})
			this.selectBox = $('#'+this.settings.id);
			var Default = [
				{
					en : 'province',
					cn : '省',
					num : '1'
				},
				{
					en : 'city',
					cn : '市',
					num : '110000'
				},
				{
					en : 'area',
					cn : '县/区',
					num : '110100'
				}
			];
			var selectData = '';
			for (var i = 0; i < Default.length; i++) {
				var selectDataInput = '';
				var selectDataOption = '';
				for (var j = 0; j < 1; j++) {
					selectDataInput += '<input type="hidden" name="'+this.settings.id+i+'" value="'+Default[i].cn+'" />';
					selectDataOption += '<div class="option"><span class="value">请选择'+Default[i].cn+'</span>'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>'
				};
				selectData += '<div class="list '+Default[i].en+'">'+selectDataInput+selectDataOption+'</div>';
			};
			this.bOFF = false;
			this.bOff = false;
			this.selectBox.append(selectData);
			this.list1 = this.selectBox.find('.province');
			this.list2 = this.selectBox.find('.city');
			this.list3 = this.selectBox.find('.area');
			var listArr = [this.list1,this.list2,this.list3]
			for (var i = 0; i < 3; i++) {
				this.createList(Default[i].num,listArr[i]);
				this.selectEvent(listArr[i]);
				this.optionEvevt(listArr[i]);
			};
		},
		createList : function(id,obj){
			obj.find('select').remove();
	    	var sHtml = '<ul class="select">',
	    		data = this.settings.data;
	        for (var i in data) {
	        	if (tdist[i][1] == id) {
	            	sHtml += '<li data-val="'+i+'"><a>'+data[i][0]+'</a></li>';
	        	}
	        }
	        sHtml += '</ul>';
	       obj.append(sHtml)
		},
		optionEvevt : function(obj){
			var self = this;
			var option = obj.find('.option');
			option.on('click' , function(ev){
				self.body.click();
				if(obj == self.list1){
					self.bOFF = true;
					self.bOff = false;
				}
				if(obj == self.list2){
					self.bOff = true;
				}
				if(!self.bOFF){
					if(obj == self.list2){
						alert('请先选择省');
						return false;
					}
				}
				if(!self.bOFF){
					if(obj == self.list3){
						alert('请先选择市');
						return false;
					}
				}else{
					if(!self.bOff){
						if(obj == self.list3){
							alert('请先选择市');
							return false;
						}
					}
				}
				self.selectShow(obj);
				return false;
			});
		},
		selectEvent : function(obj){
			var self = this,
				oInput = obj.find('input'),
				oOption = obj.find('.option').find('.value');
			this.body.on('click' , function(ev){
				self.selectHide(); 
			});
			obj.delegate('li', 'click' , function(ev){
				ev.stopPropagation();
				var dataVal = $(this).data('val'),
					value = $(this).find('a').text();
					oInput.val(value);
					oOption.html(value);
					if(obj == self.list1){
						self.list2.find('.select').remove();
						self.createList(dataVal,self.list2)
						self.selectShow(self.list2)
						self.selectHide(self.list3)
						self.selectHide(self.list1)
						self.clearValue(self.list2);
						self.clearValue(self.list3);
					}
					if(obj == self.list2){
						self.list3.find('.select').remove();
						self.createList(dataVal,self.list3)
						self.selectShow(self.list3)
						self.selectHide(self.list2)
						self.clearValue(self.list3);
					}
					if(obj == self.list3){
						self.selectHide(self.list3)
					}
			});
		},
		clearValue : function(obj){
			var oInput = obj.find('input'),
				oOption = obj.find('.option').find('.value');
				if(obj == this.list2){
					oInput.val('市');
					oOption.html('请选择市');
				}
				if(obj == this.list3){
					oInput.val('县/区');
					oOption.html('请选择县/区');
				}
		},
		selectHide : function(obj){
			this.selectBox.each(function(index, el) {
				if(obj){
					$(el).find(obj).find('.select').hide();
				}else{
					$(el).css('zIndex',5).find('.select').hide();
				}
			});
		},
		selectShow : function(obj){
			obj.find('.select').show(); 
			this.selectBox.css('zIndex',20)
		}
	}
	window["CitySelect"] = CitySelect;
})(jQuery);