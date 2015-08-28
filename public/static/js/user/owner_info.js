	function loadList(){
		var url = RootUrl+'api/v1/user/'+'55d13e750a2e2c9910b0fa1b'+'/info';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				$('#owner-name').val(res['data']['username'] || "");
				$('#owner-mobile').val(res['data']['phone']);
				$('#owner-addr').val(res['data']['address']);
				$('#owner-sex').find('input[value='+res['data']['sex']+']').attr('checked','checked');
				$('#owner-area').empty()
				var ownerArea = new CitySelect({id :'owner-area','query':res['data']['city']});
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
		var userCity = $('#owner-area').find('input[name=owner-area]').val();
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
				"city":userCity,
				"district":"不知道是什么字段",
				"address":userAddr
			}),
			processData : false,
			success: function(res){
				if(res['msg'] === "success"){
					loadList()
				}else{
					$('#error-info').html(res['err_msg']).removeClass('hide');
				}
		   	}
		});
		return false;
	});