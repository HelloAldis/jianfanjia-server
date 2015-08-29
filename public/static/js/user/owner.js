$(function(){
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
        "owner_area": "请输入装修面积",
        "owner_price": "请输入装修预算金额",
        "owner_cell": "请输入小区名称"
    };
    var check_step = 0;
    var comName = $('#com-name');
    var decArea = $('#dec_area');
    var decBudget = $('#dec-budget');
	//验证函数
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
		check_step = 3;
		checkComName();
		checkDecArear();
		checkDecBudget();
		if(check_step > 0){
			return false;
		}
		var url = RootUrl+'api/v1/user/requirement';
		var disName = comName.val();
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
				"city":"武汉",
				"district":disOwner,
				"cell":disName,
				"house_type":disHouse,
				"house_area":disAreaM,
				"dec_style":disDec,
				"work_type":disWork,
				"total_price":disPrice
			}),
			processData : false,
			success: function(res){
				console.log(res)
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
				console.log(res['data'])
				var data = res['data']
				if(data !== null){
					comName.val(data.cell);
					decArea.val(data.total_price)
					decBudget.val(data.house_area)
					$('#owner-name').val(res['data']['username'] || "");
					$('#owner-mobile').val(res['data']['phone']);
					$('#owner-addr').val(res['data']['address']);
					$('#owner-sex').find('input[value='+res['data']['sex']+']').attr('checked','checked');
					$('#owner-area').empty()
					var ownerArea = new CitySelect({id :'owner-area','query':res['data']['city']});
				}
		   	}
		});
	}
	loadList();
})