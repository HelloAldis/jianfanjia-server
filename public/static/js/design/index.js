$(function(){
	(function(window,undefined){
		// Establish Variables
		var History = window.History, // Note: We are using a capital H instead of a lower h
			State = History.getState();
		var $design = $("#j-design-list");
		var $list = $design.find('.m-list');
		var $filter = $design.find('.m-filter');
		var $sort = $design.find('.m-sort');
		var pageOFF = true;
		var toFrom = 0;
		var toQuery = {};
		var toSort = {"product_count":-1};
		function setDefault(State){
			if(!State.url.split("?")[1]){
				History.pushState({state:1}, "互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 设计师第1页", "?page=1");
				setQuery({});
				setSort({"product_count":-1});
			}else{
				var urlJson = strChangeJson(State.url.split("?")[1])
				var current = urlJson.page != undefined ? parseInt(urlJson.page)-1 : 0;
				var oQuery = {};
				var oSort = {};
				toFrom = current*5;
				for(var i in urlJson){
					if(i != 'page'){
						if( i == 'product_count' || i == 'order_count' ||  i == 'view_count'){
							oSort[i] = urlJson[i];
						}else{
							oQuery[i] = urlJson[i];
						}
					}
				}
				toQuery = oQuery;
				setQuery(toQuery);
				if(!$.isEmptyObject(oSort)){
					toSort = oSort;
					setSort(toSort);
				}else{
					oSort = {};
					setSort({"product_count":-1});
				}
			}
		}
		setDefault(State)
		function setQuery(query){
			$filter.find('a').removeClass()
			if(!$.isEmptyObject(query)){
				$filter.find('dl').each(function(index, el) {
					$.each(query,function(i){
						if($(el).data('type') == i){
							$(el).find('a').each(function(index, el1) {
								$(el1).removeClass();
								if($(el1).data('query') == query[i]){
									$(el1).addClass('current');
								}
							})
							return false;
						}else{
							$(el).find('a').eq(0).addClass('current');
						}
					})
				})
			}else{
				$filter.find('dl').each(function(index, el) {
					$(this).find('a').eq(0).addClass('current');
				})
			}
			
		}
		function setSort(sort){
			$sort.find('a').removeClass();
			$sort.find('a').each(function(index, el) {
				$.each(sort,function(i){
					if($(el).data('sort') == i){
						if(sort[i] == 1){
							$(el).attr('class', 'current sort');
						}else{
							$(el).attr('class', 'current');
						}
					}else{
						$(el).removeClass();
					}	
				});
			})
		}
		//渲染生成列表
		function loadList(data){
			$list.html('<div class="loading" id="j-loading"></div>');
			var oldData = {"query":toQuery,"sort":toSort,"from":toFrom,"limit":5}
			$.ajax({
				url:RootUrl+'api/v2/web/designer/search',
				type: 'POST',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify(oldData),
				processData : false,
				success: function(res){
					if(res['data'].total > 0){
						page(res['data'],oldData)
					}else{
						$list.html('<div style="text-align: center;font-size: 20px;line-height: 50px;color: #fe7004;">没有您筛选的数据</div>')
					}
			   	}
			});
		}
		loadList()
		//创建列表
		function createList(data){
			var ImgId = !!data.imageid && data.imageid != null  ? RootUrl+'api/v1/thumbnail/90/'+data.imageid : '../../static/img/public/headpic.jpg';
			var decStyles = '';
			var decStylesLen = data.dec_styles.length > 3 ? 3 : data.dec_styles.length
	 			for (var i = 0; i < decStylesLen; i++) {
					decStyles += '<span>'+globalData.dec_style[data.dec_styles[i]]+'</span>';
				};
				var decDistricts = '';
				for (var i = 0,len = data.dec_districts.length; i < len; i++) {
					decDistricts += '<span>'+data.dec_districts[i]+'</span>'
				};
				var gohome = "";			
				if(window.usertype == 2){
					gohome = '<a href="homepage.html?'+data._id+'" class="btn">查看详情</a>'
				}else if(window.usertype != 1 && window.usertype != 2 && window.usertype != 0){
					gohome = '<a href="../user/login.html?'+window.location.href+'" data-uid="'+data._id+'" class="btn addIntent">添加意向</a>'
				}else if(window.usertype == 1 && window.usertype != 2 ){
					if(data.is_my_favorite){
						gohome = '<a href="homepage.html?'+data._id+'" class="btn">查看详情</a>'
					}else{
						gohome = '<a href="../user/owner_design.html" data-uid="'+data._id+'" class="btn addIntent">添加意向</a>'
					}
				}
				var images  = $.ajax({
					url:RootUrl+'api/v2/web/search_designer_product',
					type: 'POST',
					contentType : 'application/json; charset=utf-8',
					dataType: 'json',
					data : JSON.stringify({
					  "query":{
					    "designerid":data._id
					  },
					  "from": 0,
					  "limit" : data.authed_product_count
					}),
					processData : false,
					async : false,
					success: function(res){
						return res['data'];
				   	}
				});
				var imgData = $.parseJSON(images.responseText)['data']['products'];
				var len1 = imgData.length > 3 ? 3 : imgData.length;
				var works = '';
		        if(len1){
					for (var i = 0; i < len1; i++) {
						if(!!imgData[i].images[0]){
							works += '<a class="works" href="detail.html?'+imgData[i]._id+'" target="_blank"><img src="'+RootUrl+'api/v1/thumbnail/383/'+imgData[i].images[0].imageid+'" alt="'+imgData[i].cell+'"/></a>'
						}else{
							works = '<a class="works" href="homepage.html?'+data._id+'"><img src="../../static/img/public/default_products.jpg" alt="'+data.username+'的作品"/></a>';
						}
					};
				}else{
					works = '<a class="works" href="homepage.html?'+data._id+'"><img src="../../static/img/public/default_products.jpg" alt="'+data.username+'的作品"/></a>';
				}
				var order = '';
				if(data.design_fee_range != undefined){
					order = '<div class="order f-fr"><h5>设计费</h5><p><strong>'+globalData.price_area[data.design_fee_range]+'</strong>元/m&sup2;</p>'+gohome+'</div></div>'
				}else{
					order = '<div class="order f-fr"><h5>&nbsp;</h5><p>&nbsp;</p>'+gohome+'</div></div>'
				}
				return '<li>'
		          		+'<div class="g-wp">'
		          			+'<div class="m-tt f-cb">'
		          				+'<div class="info f-fl">'
		          					+'<a class="m-head" href="homepage.html?'+data._id+'"><img src="'+ImgId+'" alt="'+data.username+'"/></a>'
		          					+'<div class="msg f-cb">'
		          						+'<dl>'
		          							+'<dt>'+data.product_count+'</dt>'
		          							+'<dd>作品</dd>'
		          						+'</dl>'
		          						+'<dl>'
		          							+'<dt>'+data.order_count+'</dt>'
		          							+'<dd>预约</dd>'
		          						+'</dl>'
		          					+'</div>'
		          				+'</div>'
		          				+'<div class="status f-fl">'
			          				+'<h4><a href="homepage.html?'+data._id+'">'+data.username+'</a><span class="i-icon sex'+data.sex+'"></span></h4>'
		          					+'<div class="atte atte'+(data.auth_type-1)+'"><span class="i-icon"></span>认证设计师</div>'
		          					+'<div class="addr"><strong>接单区域：</strong>'+decDistricts+'<span class="i-icon"></span></div>'
		          					+'<div class="style"><strong>擅长风格：</strong>'+decStyles+'</div>'
		          				+'</div>'+order+'<div class="m-ct f-cb">'+works+'</div>'
		          		+'</div>'
		           +'</li>'
		};
		function page(arr,data){
			var maxElem =  Math.ceil(arr.total/5);
			var current =!History.getState().url.split("?")[1] ? 0 : parseInt(strChangeJson(History.getState().url.split("?")[1]).page) - 1
			if(current+1 > maxElem){
				History.pushState({state:1}, "互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 设计师第1页", "?page=1");
				setQuery(toQuery);
				setSort(toSort);
				loadList();
				return false;
			}
			var page = new Pageing({
				id : 'j-page',
				allNumPage : arr.total,
				itemPage : 5,
				showPageNum : 9,
				endPageNum : 1,
				currentPage : current,
				prevText:"上一页",
				nextText:"下一页",
				linkTo : '__id__',
				showUbwz : true,
				callback : function(num,obj){
					var dataArr = [];
					for(var i=0;i<arr.designers.length;i++){
						dataArr.push(createList(arr.designers[i]));
					}
					$list.html(dataArr);
					$design.find('li:odd').attr('class', 'even');
					obj.find('.btns').on('click',function(ev){
						ev.preventDefault();
						var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0]
						toFrom = (index-1)*5;
						History.pushState({state:index}, "互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 设计师第 "+index+" 页", "?page="+index+jsonChangeStr(toQuery)+jsonChangeStr(toSort));
						loadList()
						return false;
					});
				}
			});
		};
		//筛选
		$filter.find('a').on('click',function(){
			if($(this).hasClass('current')){
				return false;
			}
			$(this).attr('class','current').siblings().attr('class', '');
			FilterSort();
			return false;
		});
		//排序
		function FilterSort(){
			var filter = {},
				sort = {};
				$sort.find('a').each(function(index, el) {
					if($(el).hasClass('current')){
						if($(el).hasClass('sort')){
							sort[$(el).data('sort')] = 1
						}else{
							sort[$(el).data('sort')] = -1
						}
					}
				});
				$filter.find('a').each(function(index, el) {
					var oDl = $(this).closest('dl');
					if($(this).hasClass('current') && $(this).data('query') != -1){
						filter[oDl.data('type')] = $(this).data('query');
					}
				});
			toQuery = filter;
			toSort = sort;
			toFrom = 0;
			setQuery(toQuery);
			setQuery(toQuery);
			History.pushState({state:1}, "互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 设计师第1页", "?page=1"+jsonChangeStr(toQuery)+jsonChangeStr(toSort));
			loadList();	
		}
		// 对象转字符串
		function jsonChangeStr(json){
			var str = '';
			for (var i in json) {
				str += '&'+i+'='+json[i]
			};
			return str;
		}
		// 字符串转对象
		function strChangeJson(str){
			var json = {};
			if(str.indexOf("&") != -1){
				var arr = str.split("&");
				for (var i = 0,len = arr.length; i < len; i++) {
					var  temp = arr[i].split("=");
					json[temp[0]] = temp[1]
				};
			}else{
				var  temp = str.split("=");
				json[temp[0]] = temp[1]
			}
			return json;
		}
		//排序
		$sort.find('a').on('click',function(){
			var oDl = $(this).closest('dl');
			$(this).addClass('current').siblings().removeClass('current');
			if($(this).hasClass('sort')){
				$(this).removeClass('sort');
			}else{
				$(this).addClass('sort');
			}
			FilterSort()
			return false;
		});
		$('#j-filter-more').on('click',function(){
			if($(this).hasClass('filterMore')){
				$(this).html('更多选择').removeClass();
				$('#j-filter').find('.more').addClass('hide');
			}else{
				$(this).html('收起').addClass('filterMore');
				$('#j-filter').find('.more').removeClass('hide');
			}
		});
		$design.delegate('.addIntent','click',function(ev){
			var slef = $(this)
			if(window.usertype == 1){
				ev.preventDefault();
				var uidname = $(this).data('uid');
				var url = RootUrl+'api/v2/web/favorite/designer/add';
				$.ajax({
					url:url,
					type: 'POST',
					contentType : 'application/json; charset=utf-8',
					dataType: 'json',
					data : JSON.stringify({
						"_id":uidname
					}),
					processData : false,
					success: function(res){
						if(res["msg"] == "success"){
							slef.html('查看详情').attr('href','homepage.html?'+uidname).removeClass('addIntent')
							/*if(confirm('添加成功，是否继续添加')){
								slef.html('查看详情').attr('href','homepage.html?'+uidname).removeClass('addIntent')
							}else{
								window.location.href = "../user/owner.html#/designer";
							}*/
						}else{
							alert("添加失败")
						}
				   	}
				});
			}
		});
		History.Adapter.bind(window,'statechange',function(){
			var State = History.getState();
			setDefault(State)
		});
	})(window)
});