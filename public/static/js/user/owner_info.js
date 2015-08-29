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
				console.log(res['data'])
				if(data !== null){
					$('#owner-name').val(data.username || "");
					$('#owner-mobile').val(data.phone || "");
					$('#owner-addr').val(data.address || "");
					
					if(!!data.sex){
						$('#owner-sex').find('input[value='+data.sex+']').attr('checked','checked');
					}
					if(!!data.province){
						console.log(data.province)
						$('#owner-area').empty()
						var ownerArea = new CitySelect({id :'owner-area',"query":data.province+" "+data.city+" "+data.district});
					}else{
						$('#owner-area').empty()
						var ownerArea = new CitySelect({id :'owner-area'});
					}
				}else{
					$('#owner-area').empty()
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
		var userLocation = $ownerArea.find('input[name=owner-area]')
		var userProv = sProv;
		var userCity = sCity;
		var userDist = sDist;
		var userAddr = $('#owner-addr').val();
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
				"address":userAddr
			}),
			processData : false,
			cache : false,
			success: function(res){
				if(res['msg'] === "success"){
					loadList()
					userLocation.val(userProv+" "+userCity+" "+userDist);
					alert('保存成功')
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	});