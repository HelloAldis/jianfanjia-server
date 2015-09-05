$(function(){
	var winHash = window.location.hash.substring(1);
	var ownerArea = new ComboBox({
		id:'owner-area',
		list:globalData.orders_area
	})
	var houseType = new ComboBox({
		id:'house_type',
		list:globalData.house_type
	})
	var decStyle = new ComboBox({
		id:'dec_style',
		list:globalData.dec_style
	})
	var workType = new ComboBox({
		id:'work_type',
		list:globalData.work_type
	});
	var workType = new ComboBox({
		id:'design_type',
		list:globalData.des_type
	});
	var errMsg = {
		"owner_name": "请输入业主名字",
        "owner_area": "请输入装修面积",
        "owner_price": "请输入装修预算金额",
        "owner_cell": "请输入小区名称"
    };
    var check_step = 0;
    var userName = $('#user-name');
    var comName = $('#com-name');
    var decArea = $('#dec_area');
    var decBudget = $('#dec-budget');
	//验证函数
	function checkUserName(){    //小区名称
        var id = "owner_name";
        if ($.trim(userName.val()) != "") {
            return showOk(userName,id);
        }
        return showError(userName,id);
    }
    function checkComName(){    //小区名称
        var id = "owner_cell";
        if ($.trim(comName.val()) != "") {
            return showOk(comName,id);
        }
        return showError(comName,id);
    }
    function checkDecArear(){    //装修面积
     	var id = "owner_area";
        if ($.isNumeric(decArea.val())) {
            return showOk(decArea,id);
        }
        return showError(decArea,id);
    }
    function checkDecBudget(){    //装修预算
        var id = "owner_price";
        if ($.isNumeric(decBudget.val())) {
            return showOk(decBudget,id);
        }
        return showError(decBudget,id);
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
	 userName.on('blur',function(){
        checkUserName()
    });
    comName.on('blur',function(){
        checkComName()
    });
    decArea.on('blur',function(){
        checkDecArear()
    });
    decBudget.on('blur',function(){
        checkDecBudget()
    });
    //表单提交
	$('#form-owner').on('submit',function(){
		check_step = 4;
		checkUserName()
		checkComName();
		checkDecArear();
		checkDecBudget();
		if(check_step > 0){
			return false;
		}
		var url = RootUrl+'api/v1/user/requirement';
		var disName = userName.val();
		var discell = comName.val();
		var disAreaM = parseFloat(decArea.val());
		var disPrice = parseFloat(decBudget.val());
		var disOwner = $('input[name=owner-area]').val();
		var disHouse = $.inArray($('input[name=house_type]').val(),globalData.house_type);
		var disDec = $.inArray($('input[name=dec_style]').val(),globalData.dec_style);
		var disWork = $.inArray($('input[name=work_type]').val(),globalData.work_type);
		var disDesign = $.inArray($('input[name=design_type]').val(),globalData.des_type);
	  	$.ajax({
			url:url,
			type: 'PUT',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			data : JSON.stringify({
				"username":disName,
				"city":"武汉市",
				"district":disOwner,
				"cell":discell,
				"house_type":disHouse,
				"house_area":disAreaM,
				"dec_style":disDec,
				"work_type":disWork,
				"total_price":disPrice,
				"communication_type": disDesign
			}),
			processData : false,
			cache : false,
			success: function(res){
				if(res['msg'] === 'success'){
					window.location.href = 'owner_design.html';
				}else{
					$('#error-info').html(res['err']).removeClass('hide');	
				}
		   	}
		});
		return false;
	})
	function loadList(){
		var url = RootUrl+'api/v1/user/requirement';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				var data = res['data']
				console.log(data)
				if(data !== null){
					userName.val(decodeURI(window.username) || "");
					comName.val(data.cell);
					decArea.val(data.house_area)
					decBudget.val(data.total_price)
					$('#owner-area').find('.value').html(data.district);
					$('#owner-area').find('input[name=owner-area]').val(data.district);
					$('#house_type').find('.value').html(globalData.house_type[data.house_type]);
					$('#house_type').find('input[name=house_type]').val(globalData.house_type[data.house_type]);
					$('#dec_style').find('.value').html(globalData.dec_style[data.dec_style]);
					$('#dec_style').find('input[name=dec_style]').val(globalData.dec_style[data.dec_style]);
					$('#work_type').find('.value').html(globalData.work_type[data.work_type]);
					$('#work_type').find('input[name=work_type]').val(globalData.work_type[data.work_type]);
					$('#design_type').find('.value').html(globalData.des_type[data.communication_type]);
					$('#design_type').find('input[name=design_type]').val(globalData.des_type[data.communication_type]);
				}
		   	}
		});
	}
	if(winHash != 'new'){
		loadList();
	}
})