$(function(){
	var teamData = {
		'list' : [
			{
				num : 1,
				name : '张起灵',
				sex  : '',
				addr : '',
				uid  : '',
				firm : '',
				time : '',
				type : '',
				site : ''
			}
		]
	}
	var $body = $(document.body);
	var $win = $(window);
	var $designTeam = $('#j-design-team');
	var $addteam = $designTeam.find('.addteam');
	var $addteam1 = $designTeam.find('.addteam1');
	var $list = $designTeam.find('.list');
	var iNum = 1;
	var $popupShade = $('<div class="popup-shade">').css({'width':$win.width(),'height':$win.height()});
	var $kPopup = $('#team-popup');
	var $close = $kPopup.find('.close');
	var $teamCancel = $('#team-cancel');

	addTeam()
	function addTeam(){
		if(teamData.list.length < 1){
			$list.html('<h2>您还没有施工团队，点击<a href="javascript:;" class="addteam1">添加施工团队</a></h2>');
		}else{
			$list.html('');
			$.each(teamData.list,function(i){
				$list.append(createTeam(teamData.list[i]))
			})
		}
	}
	function formTeam(i){
		teamData.list.push({
			num : i,
			name : '张起灵',
			sex  : '',
			addr : '',
			uid  : '',
			firm : '',
			time : '',
			type : '',
			site : ''
		})
	}
	function loadList(){
		var url = RootUrl+'api/v1/user/info';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				console.log(res)
		   	}
		});
	}
	loadList()
	function createTeam(data){
		return '<dl>'
					+'<dt>施工团队'+data.num+'</dt>'
					+'<dd>'
						+'<p><span>项目经理：</span>'+data.name+'</p>'
						+'<P><span>性&nbsp;&nbsp;&nbsp;别：</span>'+data.sex+'</P>'
						+'<p><span>所在地：</span>'+data.addr+'</p>'
						+'<P><span>身份证号码：</span>'+data.uid+'</P>'
						+'<p><span>曾就职装饰公司：</span>'+data.firm+'</p>'
						+'<P><span>从业年限：</span>'+data.time+'</P>'
						+'<p><span>擅长工种：</span>'+data.type+'</p>'
						+'<P><span>正在施工工地：</span>'+data.site+'</P>'
					+'</dd>'
					+'<dd>'
						+'<a href="javascript:;" class="btn editor">编辑</a>'
						+'<a href="javascript:;" class="btn delete">删除</a>'
					+'</dd>'
				+'</dl>'
	}

	function editorTeam(){
		$body.append($popupShade);
		$body.append($kPopup);
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
	$addteam.on('click',function(){
		iNum ++;
		editorTeam()
		console.log(teamData.list)
		formTeam(iNum)
		addTeam()
		openPopup()
	})
	$close.on('click',function(){   //关闭
		closePopup()
	})
	$teamCancel.on('click',function(){
		closePopup()
		return false;
	})
	//删除
	$designTeam.on('click', '.delete', function(event) {
		event.preventDefault();
		if(confirm("你确定要删除吗？删除不能恢复")){
			$(this).closest('dl').remove();
			teamData.list.splice($(this).closest('dl').index(),1)
			addTeam();
			iNum = teamData.list.length;
		}
	});
	//编辑
	$designTeam.on('click', '.editor', function(event) {
	     event.preventDefault();
	     editorTeam();
	});
	var strengthsType = new ComboBox({
		id:'strengths_type',
		list:['水','火','电']
	});
	var teamCurrentArea = new CitySelect({id : 'team-current-area'});
})