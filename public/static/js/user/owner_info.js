	var $ownerArea = $('#owner-area');
	function loadList(){
		var url = RootUrl+'api/v1/user/info';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			cache : false,
			success: function(res){
				var data = res['data'];
				$ownerArea.empty()
				if(data !== null){
					$('#owner-name').val(data.username || "");
					$('#owner-addr').val(data.address || "");
					$('#owner-phone').html(data.phone);
					if(!!data.sex){
						$('#owner-sex').find('input[value='+data.sex+']').attr('checked','checked');
					}
					if(!!data.province){
						var designAreaQuery = data.province+" "+data.city+" "+data.district;
						$ownerArea.find('input[name=owner-area]').val(designAreaQuery)
						var ownerArea = new CitySelect({id :'owner-area',"query":designAreaQuery});
					}else{
						$ownerArea.find('input[name=owner-area]').val("")
						var ownerArea = new CitySelect({id :'owner-area'});
					}
					var img = data.imageid != null  ?  RootUrl+'api/v1/image/'+data.imageid : '../../../static/img/public/headpic.jpg'
					$('#userHead').attr('src',img).data('img',data.imageid != null ? data.imageid : null)
				}else{
					var ownerArea = new CitySelect({id :'owner-area'});
				}
				
			}	
		});
	}
	loadList();
	//表单提交
	$('#owner-info').on('submit',function(){
        var url = RootUrl+'api/v1/user/info';
		var userName = $('#owner-name').val();
		var userSex = $('#owner-sex').find('input:checked').val();
		var userPhone = $('#owner-mobile').val();
		var $ownerArea = $('#owner-area');
		var sProv = $ownerArea.find('input[name=owner-area0]').val()
		var sCity = $ownerArea.find('input[name=owner-area1]').val()
		var sDist = $ownerArea.find('input[name=owner-area2]').val()
		var userLocation = $ownerArea.find('input[name=owner-area]');
		if(!!userLocation.val()){
			var userArr = userLocation.val().split(" ");
			var userProv = userArr[0];
			var userCity = userArr[1];
			var userDist = userArr[2];
		}else{
			var userProv = sProv;
			var userCity = sCity;
			var userDist = sDist;
		}
		var userAddr = $('#owner-addr').val();
		var imgId = $('#userHead').data('img') || null;
		$.ajax({
			url:url,
			type: 'PUT',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"username" : userName,
				"phone" : userPhone,
				"sex":userSex,
				"province" : userProv,
				"city":userCity,
				"district":userDist,
				"address":userAddr,
				"imageid" : imgId
			}),
			processData : false,
			cache : false,
			success: function(res){
				if(res["msg"] == "success"){
					promptMessage('保存成功',"success")
					userLocation.val(userProv+" "+userCity+" "+userDist);
					loadList();
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	});