/*参数：
		1，id
		2，数据长度
		3，每页显示的列表数
		4, 分页链接显示数
		5, 起始与结束点的数目
		6, 当前页码显示数字
		7, href里面显示内容
		8, 上一页按钮文本（默认class为prev）
		9, 下一页按钮文本（默认class为next）
		10, 截取信息显示文本（与第五个参数有关）
		11, 显示首尾页按钮 （默认为false）
		12，显示数据信息多少条数据，多少页，当前多少页（默认false）
		13, 回调函数，第一个参数当前页码，默认从0开始，使用时需要+1;
*/
define(['jquery'], function($){
	var Pageing = function(){}
	Pageing.prototype = {
		id  : '#j-page',
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(self.settings = {
				id : '#j-page',
				allNumPage : 10,
				itemPage : 5,
				showPageNum : 10,
				endPageNum : 0,
				currentPage : 0,
				linkTo:"#",
				prevText:"Prev",
				nextText:"Next",
				ellipseText:"...",
				showUbwz : false,
				pageInfo : false,
				callback : function(){return false;}
			},options || {});
			this.pageBox = $(this.settings.id);
			//创建一个显示条数和每页显示条数值
			this.settings.allNumPage = (!this.settings.allNumPage || this.settings.allNumPage < 0) ? 1 : this.settings.allNumPage;
			this.settings.itemPage = (!this.settings.itemPage || this.settings.itemPage < 0) ? 1 : this.settings.itemPage;
			//生成分页显示
			this.createLinks();
			//回调函数
			this.settings.callback(this.settings.currentPage,this.pageBox);
		},
		createLinks : function(){
			this.destroy();
			var self = this,
				interval = this.getInterval(),
				np = this.numPages();
			// 这个辅助函数返回一个处理函数调用有着正确pageId的pageSelected。
			this.getClickHandler()
			if(self.settings.pageInfo){
				$("<span>共<em>"+this.settings.allNumPage+"</em>条项目</span>").addClass('text').appendTo(this.pageBox);
			}
			// 产生首页按钮
			if(self.settings.showUbwz && self.settings.currentPage > 0 ){
				this.appendItem(0,{text:'首页', classes:"first"},np)
			}
			// 产生上一个按钮
			if(self.settings.prevText && (self.settings.currentPage > 0)){
				this.appendItem(self.settings.currentPage-1,{text:self.settings.prevText, classes:"prev"},np)
			}
			// 产生起始点
			if (interval[0] > 0 && this.settings.ellipseText > 0){
				var end = Math.min(this.settings.endPageNum, interval[0]);
				for(var i=0; i<end; i++){
					this.appendItem(i,{},np);
				}
				if(this.settings.endPageNum < interval[0] && this.settings.ellipseText){
					$("<span>"+this.settings.ellipseText+"</span>").addClass('btns').appendTo(this.pageBox);
				}
			}
			// 产生内部的些链接
			for(var i=interval[0]; i<interval[1]; i++) {
				this.appendItem(i,{},np);
			}
			// 产生结束点
			if (interval[1] < np && this.settings.endPageNum > 0){
				if(np-this.settings.endPageNum > interval[1] && this.settings.ellipseText)
				{
					$("<span>"+this.settings.ellipseText+"</span>").addClass('btns').appendTo(this.pageBox);
				}
				var begin = Math.max(np-this.settings.endPageNum, interval[1]);
				for(var i=begin; i<np; i++) {
					this.appendItem(i,{},np);
				}
			}
			//  产生下一页按钮
			if(self.settings.nextText && (this.settings.currentPage < np-1)){
				this.appendItem(this.settings.currentPage+1,{text:self.settings.nextText, classes:"next"},np);
			}
			// 产生尾页按钮
			if(self.settings.showUbwz && this.settings.currentPage < np-1 ){
				this.appendItem(np,{text:'尾页', classes:"last"},np)
			}
			if(self.settings.pageInfo){
				$("<span>当前第<em>"+(this.settings.currentPage+1)+"</em>页/共<em>"+this.numPages()+"</em>页</span>").addClass('text').appendTo(this.pageBox);
			}
		},
		getClickHandler : function(pageId){
			var self = this;
			return function(ev){ return self.pageSelected(pageId,ev); }
		},
		appendItem : function(pageId, appendopts,np){  //生成按钮
			var lnk;
			pageId = pageId<0?0:(pageId<np?pageId:np-1); // 规范page id值
			appendopts = $.extend({text:pageId+1, classes:""}, appendopts||{});
			if(pageId == this.settings.currentPage){
				lnk = $("<span class='current'>"+(appendopts.text)+"</span>").addClass('btns');
			}else{
				lnk = $("<a>"+(appendopts.text)+"</a>")
					.on("click", this.getClickHandler(pageId))
					.addClass('btns')
					.attr('href', this.settings.linkTo.replace(/__id__/,pageId+1));
			}
			if(appendopts.classes){lnk.addClass(appendopts.classes);}
			this.pageBox.append(lnk);
		},
		numPages : function(){   //计算最大分页显示数目
			var self = this;
			return Math.ceil(self.settings.allNumPage/self.settings.itemPage);
		},
		getInterval : function(){ //极端分页的起始和结束点，这取决于currentPage 和 showPgaeNum返回数组
			var self = this,
				ne_half = Math.ceil(self.settings.showPageNum/2),
			    np = this.numPages(),
			    upper_limit = np-self.settings.showPageNum,
			    start = self.settings.currentPage>ne_half?Math.max(Math.min(self.settings.currentPage-ne_half, upper_limit), 0):0,
			    end = self.settings.currentPage>ne_half?Math.min(self.settings.currentPage+ne_half, np):Math.min(self.settings.showPageNum, np);
			return [start,end]
		},
		pageSelected : function(pageId,ev){  //分页链接事件处理函数  pageId 为新页码
			var self = this;
			this.settings.currentPage = pageId;
			this.createLinks();
			var continuePropagation = this.settings.callback(pageId, self.pageBox);
			if (!continuePropagation) {
				if (ev.stopPropagation) {
					ev.stopPropagation();
				}
				else {
					ev.cancelBubble = true;
				}
			}
			return continuePropagation;
		},
		selectPage : function(pageId){ // 获得附加功能的元素
			this.pageSelected(pageId);
		},
		prevPage : function(){  // 上一个按钮
			var self = this;
			if (self.settings.currentPage > 0) {
				this.pageSelected(self.settings.currentPage - 1);
				return true;
			}else {
				return false;
			}
		},
		nextPage : function(){  // 下一个按钮
			var self = this;
			if(self.settings.currentPage < this.numPages()-1) {
				this.pageSelected(self.settings.currentPage+1);
				return true;
			}else {
				return false;
			}
		},
		destroy  : function(){
			if(!!this.pageBox){
				this.pageBox.html('');
			}else{
				$(this.id).html('');
			}
		}
	}
	return Pageing;
});
