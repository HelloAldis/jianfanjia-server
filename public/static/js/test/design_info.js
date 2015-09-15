$(function(){
	var winHash = window.location.search.substring(1);
    //获取对象
    var desName = $("#design-name");
    var desSex = $("#design-sex");
    var desEmail = $("#design-email");
    var desArea = $("#design-area");
    var desAddr = $("#design-addr");
    var desUid = $('#design-uid');
    var desCom = $("#design-com");
    var desDecType = $("#decoration-type");
    var desDecStyle = $("#decoration-style");
    var desDecArea = $("#decoration-area");
    var desPrice = $("#design-price");
    var desDecPrice0 = $('#decoration-price0');
    var desDecPrice1= $("#decoration-price1");
    var desChatType = $("#chat-type");
    var desHouseIntent = $("#house-intent");
    var desPhilosophy = $("#design-philosophy");
    var desAchievement = $("#design-achievement");
    var desBankCardName = $("#decoration-bankCardName");
    var desBankCardNum = $("#decoration-bankCardNum");
    var desSchools = $("#design-schools");
    var desWorkYear = $("#design-workYear");
	function loadList(){
		var url = RootUrl+'api/v1/admin/designer/'+winHash;
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			success: function(res){
				var data = res['data'];
				if(data != null){
					console.log(data)
					$('#return-home').attr('href', '../tpl/design/homepage.html?'+winHash);
					desName.html(data.username);
					desAddr.html(data.address);
					desEmail.html(data.email || "");
					$('#design-phone').html(data.phone);
					if(data.sex == 0 || data.sex == 1){
						desSex.html((data.sex == 0 ? '男' : '女'));
					}
					desUid.html(data.uid)
					if(!!data.province){
						var designAreaQuery = data.province+" "+data.city+" "+data.district;
						desArea.html(designAreaQuery)
					}else{
						desArea.html("")
					}
					desCom.html(data.company || "");
					desPhilosophy.html(data.philosophy || "");
					desAchievement.html(data.achievement || "");
					desChatType.html(globalData.des_type[data.communication_type] || "")
					desPrice.html(globalData.price_area[data.design_fee_range] || "")
					desDecPrice0.html(data.dec_fee_half || "")
					desDecPrice1.html(data.dec_fee_all || "")
					$('#product-count').html(data.product_count+'个');
					$('#team-count').html(data.team_count+'个');
					$('#team-more').attr('href', 'design_team.html?'+winHash);;
					var decsty = '';
					for (var i = 0,len = data.dec_styles.length; i < len; i++) {
						decsty += ' '+globalData.dec_style[data.dec_styles[i]]+' '
					};
					desDecStyle.html(decsty)
					var dectype = '';
					for (var i = 0,len = data.dec_types.length; i < len; i++) {
						dectype += ' '+globalData.dec_type[data.dec_types[i]]+' '
					};
					desDecType.html(dectype);
					var desdis = ""
					for (var i = 0,len = data.dec_districts.length; i < len; i++) {
							desdis += ' '+globalData.orders_area[data.dec_districts[i]]+' '
					};
					desDecArea.html(desdis);
					var yxhx = ""
					for (var i = 0,len = data.dec_house_types.length; i < len; i++) {
							yxhx += ' '+globalData.house_type[data.dec_house_types[i]]+' '
					};
					desHouseIntent.html(yxhx);
					if(!!data.imageid){	
						$('#upload').find('img').attr('src',RootUrl+'api/v1/image/'+data.imageid)
					}
    				desSchools.html(data.university || "");
					desWorkYear.html(data.work_year || "");
					desBankCardName.val(data.bank || "");
        			desBankCardNum.val(data.bank_card || "");
					var img = data.imageid != null && !!data.imageid  ?  RootUrl+'api/v1/image/'+data.imageid : '../../../static/img/public/headpic.jpg'
					$('#userHead').attr('src',img).data('img',data.imageid != null ? data.imageid : null)
				}
		   	}
		});
	}
	loadList();
})