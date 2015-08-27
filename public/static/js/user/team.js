$(function(){
	var $body = $(document.body);
	var $win = $(window);
	var $designTeam = $('#j-design-team');
	var $addteam = $designTeam.find('.addteam');
	var $addteam1 = $designTeam.find('.addteam1');
	var $list = $designTeam.find('.list');
	var $popupShade = $('<div class="popup-shade">').css({'width':$win.width(),'height':$win.height()});
	var $kPopup = $('#team-popup');
	var $close = $kPopup.find('.close');
	var $teamCancel = $('#team-cancel');
	var $teamSubmit = $('#team-submit');
	
	//addTeam()
	function addTeam(type,sUrl,Uid){
		$teamSubmit.on('click',function(){
		
	
			// check_step = 5;
			// checkMobile();
	  //       checkCaptcha();
	  //       checkPassword();
	  //       checkPasswordConfirm();
	  //       checkAgree();
			// if(check_step > 0){
			// 	return false;
			// }
			var sUrl = sUrl || 'api/v1/designer/team';
	        var url = RootUrl+sUrl;
	        var teamId = Uid || '';
			var teamName = $('#tame-manager').val();
			var teamSex = $('#tame-sex').find('input:checked').val();
			var teamHome = $('#tame-hometown').find('input[name=tame-hometown]').val();
			var teamUid = $('#tame-uid').val();
			var teamCom = $('#tame-company').val();
			var teamWork = $('#tame-year').val() || 0;
			var teamGood = $('#tame-good').find('input').val();
			var teamIng = $('#team-working').val();
			var teamProv = $('#tame-hometown').find('input[name=tame-hometown0]').val();
			var teamCity = $('#tame-hometown').find('input[name=tame-hometown1]').val();
			var teamDist = $('#tame-hometown').find('input[name=tame-hometown2]').val();
			$.ajax({
				url:url,
				type: type,
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id" : teamId,
					"manager": teamName,
					"province": teamProv,
					"district":teamCity,
					"city":teamCity,
					"sex":teamSex,
					"hometown":teamHome,
					"uid":teamUid,
					"company": teamCom,
					"work_year":teamWork,
					"good_at": teamGood,
					"working_on": teamIng,
				}),
				processData : false,
				success: function(res){
					closePopup()
					loadList()
			   	}
			});
			return false;
		})
	}
	console.log(IdentityCodeValid('420505258220.657016'))
	//渲染生成列表
	function loadList(){
		var url = RootUrl+'api/v1/designer/team';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				console.log(res['data'])
				if(res['data'].length == 0 || res['data'].length < 1){
					$list.html('<h2>您还没有施工团队，点击<a href="javascript:;" class="addteam1">添加施工团队</a></h2>');
				}else{
					createList(res['data']);
				}
		   	}
		});
	}
	loadList()
	//创建列表
	function createList(data){
		var sLi = '';
		for (var i = 0,len = data.length; i < len; i++) {
			sLi += '<dl data-uid="'+data[i]._id+'">'
					+'<dt>施工团队'+(i+1)+'</dt>'
					+'<dd>'
						+'<p><span>项目经理：</span>'+data[i].manager+'</p>'
						+'<P><span>性&nbsp;&nbsp;&nbsp;别：</span>'+globalData.sex[data[i].sex]+'</P>'
						+'<p><span>所在地区：</span>'+data[i].province+' '+data[i].city+' '+data[i].district+'</p>'
						+'<P><span>身份证号码：</span>'+data[i].uid+'</P>'
						+'<p><span>曾就职装饰公司：</span>'+data[i].company+'</p>'
						+'<P><span>从业年限：</span>'+data[i].work_year+'</P>'
						+'<p><span>擅长工种：</span>'+data[i].good_at+'</p>'
						+'<P><span>正在施工工地：</span>'+data[i].working_on+'</P>'
					+'</dd>'
					+'<dd>'
						+'<a href="javascript:;" class="btn editor">编辑</a>'
						+'<a href="javascript:;" class="btn delete">删除</a>'
					+'</dd>'
				+'</dl>'
		};
		$list.html(sLi)
	}
	function closePopup(){  //关闭编辑面板
		$popupShade.fadeOut(500)
		$kPopup.fadeOut(500)
	}
	function openPopup(){   //打开编辑面板
		$popupShade.fadeTo(500,0.5)
		$kPopup.fadeIn(500)
		$body.append($popupShade)
	}
	$addteam.on('click',function(){   //添加
		openPopup()
		addTeam('post')
	})
	$close.on('click',function(){   //关闭
		closePopup()
	})
	$teamCancel.on('click',function(){
		closePopup()
		return false;
	})
	//删除操作
	$designTeam.on('click', '.delete', function(event) {
		event.preventDefault();
		if(confirm("你确定要删除吗？删除不能恢复")){
			var oDl = $(this).closest('dl');
			var uidName = oDl.data('uid');
			oDl.remove();
			var url = RootUrl+'api/v1/designer/team';
			$.ajax({
				url:url,
				type: 'DELETE',
				contentType : 'application/json; charset=utf-8',
				dataType: 'json',
				data : JSON.stringify({
					"_id" : uidName
				}),
				processData : false,
				success: function(res){
					loadList();
			   	}
			});
		}
	});
	//编辑
	$designTeam.on('click', '.editor', function(event) {
	     event.preventDefault();
	     openPopup()
	     var oDl = $(this).closest('dl');
		 var uidName = oDl.data('uid');
	     addTeam('PUT','api/v1/designer/team',uidName)
	});
	var tameGood = new ComboBox({
		id:'tame-good',
		list:['水电','木工','油工','泥工']
	});
	var tameHometown = new CitySelect({id : 'tame-hometown'});
})