var homeData = [
			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			},
 			{
				pic    : '../../img/index/index-live-01.jpg',
				title  : '清江山水',
				area   : '120m&sup2;',
				type   : '三室一厅',
				style  : '现代简约',
				idea   : 'This is the brand new house for family johnson.',
				url    : 'detail.html'
 			}
		];
$(function(){
	var $homePage = $('#j-home-list');
	var $homePageUl = $('<ul>').attr('class','f-cb');
	$homePage.append($homePageUl)
	var page = new Pageing({
		id : 'j-home-page',
		allNumPage : homeData.length,
		itemPage : 6,
		showPageNum : 9,
		endPageNum : 1,
		currentPage : 0,
		linkTo : '',
		callback : function(num,obj){
			var maxElem = Math.min((num+1)*this.itemPage , this.allNumPage)
			$homePageUl.html('');
			for(var i=num*this.itemPage;i<maxElem;i++){

				$homePageUl.append(createList(homeData[i]));
			}
			obj.find('.btn').on('click' , function(ev){
				ev.stopPropagation();
				$('body,html').animate({scrollTop:$homePage.offset().top},1000);
			});
			
			return false;
		}
	});
	function createList(data){
		return	'<li>'+
				     '<div class="pic"><img alt="清江山水" src="'+data.pic+'" alt="'+data.title+'" /></div>'+
				     '<div class="txt"><h4>'+data.title+'</h4><div class="desc"><span>'+data.area+'</span><span>'+data.type+'</span><span>'+data.style+'</span></div><p>'+data.idea+'</p></div>'+
					'<a href="'+data.url+'" class="btn">查看详情</a>'+
				'</li>'
	}
});