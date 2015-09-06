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
	var $teamEditor = $('#team-editor');
	var check_step = 0;
	var submitOff = true;
	var editorOff = true;
	//验证信息
	var errMsg = {
        "reg_name": "请填写项目经理姓名",
        "reg_sex" : "请选择项目经理性别",
        "reg_com": "请填写曾就职装饰公司",
        "reg_year": "请填写从业年限",
        "reg_working" : "请填写正在施工工地",
        "reg_uid" : "请填写正确身份号码"
    };
    //选择器
    var $temaName = $('#tame-manager'),
		$temaSex = $('#tame-sex'),
		$tameUid = $('#tame-uid'),
		$tameCom = $('#tame-company'),
		$tameYear = $('#tame-year'),
		$tameGood = $('#tame-good'),
		$temeWorking = $('#team-working'),
		$tameHometown = $('#tame-hometown');
	//验证函数
    function checkName(){    //姓名
     	var id = "reg_name";
        if (!!$.trim($temaName.val())) {
            return showOk($temaName,id);
        }
        return showError($temaName,id);
    }
    function checkSex(){    //性别
        if($temaSex.find('input').eq(0).is(":checked")){
            check_step--;
            $temaSex.find('.tips-info').addClass('hide').html("")
            return false;
        }else if($temaSex.find('input').eq(1).is(":checked")){
        	check_step--;
            $temaSex.find('.tips-info').addClass('hide').html("")
            return false;
        }else{
        	$temaSex.find('.tips-info').removeClass('hide').html(errMsg["reg_sex"])
        	return false;
        } 
    }
    function checkWorking(){    //工地
     	var id = "reg_working";
        if (!!$.trim($temeWorking.val())){
            return showOk($temeWorking);
        }
        return showError($temeWorking,id);
    }
    function checkCom(){    //公司
     	var id = "reg_com";
        if (!!$.trim($tameCom.val())){
            return showOk($tameCom);
        }
        return showError($tameCom,id);
    }
    function checkUid(){    //身份证验证
     	var id = "reg_uid";
        if (!!$.trim($tameUid.val())  && IdentityCodeValid($tameUid.val()).verify){
            return showOk($tameUid);
        }
        return showError($tameUid,id);
    }
    function checkYear(){    //年限
    	var id = "reg_year";
    	var reg = /^[1-9]*[1-9][0-9]*$/
		if(!!$.trim($tameYear.val())){
			if($tameYear.val() != 0){
				if(reg.test($tameYear.val())){
					return showOk($tameYear);
				}
			}
		}
     	return showError($tameYear,id);
    }
    //显示验证信息
   	function showError(obj,id, msg) {
        var msg = msg || errMsg[id];
        var parent = obj.closest('.m-item');
        parent.find('.tips-icon-ok').addClass('hide');
        parent.find('.tips-icon-err').removeClass('hide');
        parent.find('.tips-info').html(msg).removeClass('hide')
        return false;
    }
    function showOk(obj) {
    	var parent = obj.closest('.m-item');
        parent.find('.tips-icon-err').addClass('hide');
        if ($.trim(obj.val()) != ""){
        	parent.find('.tips-icon-ok').removeClass('hide');
        	parent.find('.tips-info').html('').addClass('hide')
        }
        check_step--;
        return true;
    }
    //事件操作
    $temaName.on('blur',function(){
    	checkName();
    })
    $temaSex.find('label').on('click',function(){
        if($(this).find('input').is(":checked")){
            $(this).find('input').attr("checked","checked");
            $temaSex.find('.tips-info').addClass('hide').html("");
        }
    })
    $tameUid.on('blur',function(){
    	checkUid();
    })
    $tameCom.on('blur',function(){
    	checkCom();
    })
    $temeWorking.on('blur',function(){
    	checkWorking();
    })
    $tameYear.on('blur',function(){
    	checkYear();
    })
    function addTeam(){
		$teamSubmit.removeClass('hide');
    	$teamEditor.addClass('hide');
		$teamSubmit.on('click',function(event){
			event.preventDefault();
			check_step = 6;
	    	checkName();
	    	checkSex();
	    	checkUid();
	    	checkCom();
	    	checkWorking();
	    	checkYear()
	    	if(check_step > 0){
				return false;
			}
	        var url = RootUrl+'api/v1/designer/team';
			var teamName = $temaName.val();
			var teamSex = $temaSex.find('input:checked').val();
			var teamUid = $tameUid.val();
			var teamCom = $tameCom.val();
			var teamWork = parseInt($tameYear.val());
			var teamGood = $tameGood.find('input').val();
			var teamIng = $temeWorking.val();
			var teamProv = $tameHometown.find('.province').find('.value').html();
			var teamCity = $tameHometown.find('.city').find('.value').html();
			var teamDist = $tameHometown.find('.area').find('.value').html();
			if(submitOff){
				submitOff = false;
				$.ajax({
					url:url,
					type: "post",
					contentType : 'application/json; charset=utf-8',
					dataType: 'json',
					data : JSON.stringify({
						"manager": teamName,
						"province": teamProv,
						"city":teamCity,
						"district":teamDist,
						"sex":teamSex,
						"uid":teamUid,
						"company": teamCom,
						"work_year":teamWork,
						"good_at": teamGood,
						"working_on": teamIng
					}),
					processData : false,
					success: function(res){
						closePopup()
						setTimeout(function(){
							loadList()
							clearTeam()
							submitOff = true;
						},100)
				   	}
				});
			}
			return false;
		})
	}
	function editorTeam(id){
		$teamEditor.removeClass('hide');
		$teamSubmit.addClass('hide');
		$teamEditor.on('click',function(){
			check_step = 6;
	    	checkName();
	    	checkSex();
	    	checkUid();
	    	checkCom();
	    	checkWorking();
	    	checkYear();
	    	if(check_step > 0){
				return false;
			}
	        var url = RootUrl+'api/v1/designer/team';
			var teamName = $temaName.val();
			var teamSex = $temaSex.find('input:checked').val();
			var teamUid = $tameUid.val();
			var teamCom = $tameCom.val();
			var teamWork = parseInt($tameYear.val());
			var teamGood = $tameGood.find('input').val();
			var teamIng = $temeWorking.val();
			var userLocation = $tameHometown.find('input[name=tame-hometown]');
			if(!!userLocation.val()){
				var userArr = userLocation.val().split(" ");
				var teamProv = userArr[0];
				var teamCity = userArr[1];
				var teamDist = userArr[2];
			}else{
				var teamProv = $tameHometown.find('.province').find('.value').html();
				var teamCity = $tameHometown.find('.city').find('.value').html();
				var teamDist = $tameHometown.find('.area').find('.value').html();
			}
			if(editorOff){
				editorOff = false;
				$.ajax({
					url:url,
					type: "PUT",
					contentType : 'application/json; charset=utf-8',
					dataType: 'json',
					data : JSON.stringify({
						"_id" : id,
						"manager": teamName,
						"province": teamProv,
						"city":teamCity,
						"district":teamDist,
						"sex":teamSex,
						"uid":teamUid,
						"company": teamCom,
						"work_year":teamWork,
						"good_at": teamGood,
						"working_on": teamIng
					}),
					processData : false,
					success: function(res){
						console.log(res)
						closePopup()
						setTimeout(function(){
							loadList()
							clearTeam()
							editorOff = true;
						}, 100)
				   	}
				});
			}
			return false;
		})
	}
	function clearTeam(){
		$temaName.val("");
		$temaSex.find('input:checked').attr('checked', '');
		$tameUid.val("");
		$tameCom.val("");
		$tameYear.val("");
		$temeWorking.val("");
		$tameHometown.empty();
		var tameHometown = new CitySelect({id : 'tame-hometown'});
	}
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
					console.log(res['data'])
					res['data'].sort(function(n1,n2){
			                return res['data']['_id'] - res['data']['_id']
			        });
					console.log(res['data'])
					//createList(res['data']);
				}
		   	}
		});
	}
	loadList()
	//创建列表
	function createList(data){
		var sLi = '';
		for (var i = 0,len = data.length; i < len; i++) {
			var area = ""
			if(!!data[i].province){
				area += '<p class="itme3"><span class="key">所在地区：</span><span class="value3">'+data[i].province+' '+data[i].city+' '+data[i].district+'</span></p>'
			}else{
				area += '';
			}
			sLi += '<dl data-uid="'+data[i]._id+'">'
					+'<dt>施工团队'+(i+1)+'</dt>'
					+'<dd>'
						+'<p class="itme1"><span class="key">项目经理：</span><span class="value1">'+data[i].manager+'</span></p>'
						+'<P class="itme2"><span class="key">性&nbsp;&nbsp;&nbsp;别：</span><span class="value2">'+globalData.sex[data[i].sex]+'</span></P>'
						+area+'<P class="itme4"><span class="key">身份证号码：</span><span class="value4">'+data[i].uid+'</span></P>'
						+'<p class="itme5"><span class="key">曾就职装饰公司：</span><span class="value5">'+data[i].company+'</span></p>'
						+'<P class="itme6"><span class="key">从业年限：</span><span class="value6">'+data[i].work_year+'</span></P>'
						+'<p class="itme7"><span class="key">擅长工种：</span><span class="value7">'+data[i].good_at+'</span></p>'
						+'<P class="itme8"><span class="key">正在施工工地：</span><span class="value8">'+data[i].working_on+'</span></P>'
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
		clearTeam()
	}
	function openPopup(){   //打开编辑面板
		$popupShade.fadeTo(500,0.5)
		$kPopup.fadeIn(500)
		$body.append($popupShade)
	}
	$addteam.on('click',function(){   //添加
		openPopup()
		addTeam()
	})
	$close.on('click',function(){   //关闭
		closePopup()
		clearTeam()
	})
	$teamCancel.on('click',function(){ //取消
		closePopup()
		clearTeam()
		return false;
	})
	//删除操作
	$designTeam.delegate('.delete','click', function(event) {
		event.preventDefault();
		if(confirm("你确定要删除吗？删除不能恢复")){
			var oDl = $(this).closest('dl');
			var uidName = oDl.data('uid');
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
					if(res["msg"] == "success"){
						promptMessage('删除成功',"success")
						loadList();
					}else{
						promptMessage('删除失败',"error")
					}
			   	}
			});
		}
	});
	//添加操作
	$designTeam.delegate( '.addteam1', 'click',function(event) {
		event.preventDefault();
		$addteam.click();
	});
	//编辑
	$designTeam.delegate( '.editor', 'click', function(event){
	     event.preventDefault();
	     clearTeam();
	     var oDl = $(this).closest('dl');
		 var uidName = oDl.data('uid');
	     console.log(uidName)
		$temaName.val(oDl.find('.value1').text());
		$temaSex.find('input').eq(oDl.find('.value2').text() == "男" ? 0 : 1).attr('checked', 'checked');
		 $tameUid.val(oDl.find('.value4').text());
		$tameCom.val(oDl.find('.value5').text());
		$tameYear.val(oDl.find('.value6').text());
		$tameGood.empty();
		var tameGood = new ComboBox({
			id:'tame-good',
			list:['水电','木工','油工','泥工'],
			query : $.inArray(oDl.find('.value7').text() , ['水电','木工','油工','泥工'])
		});
		$temeWorking.val(oDl.find('.value8').text());
		$tameHometown.empty();
		var tameHometown = new CitySelect({id : 'tame-hometown',query : oDl.find('.value3').text()});
	    openPopup();
	    editorTeam(uidName);
	});
	var tameGood = new ComboBox({
		id:'tame-good',
		list:['水电','木工','油工','泥工']
	});
	var tameHometown = new CitySelect({id : 'tame-hometown'});
})