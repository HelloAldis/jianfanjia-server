$(function(){
	var winHash = window.location.hash.substring(1),
		hashData = {
			'about' : 0,
			'contact' : 1
		},
		index = hashData[winHash],
		$about = $('#j-about'),
		$aLi = $about.find('.axis').find('li'),
		$oList = $about.find('.list'),
		$aDl = $oList.find('dl');
	fnToggle()
	function fnToggle(){
		var top = $aDl.eq(index).position().top;
		$aLi.eq(index).attr('class', 'active').siblings().attr('class','');
		$oList.stop().animate({top: -top}, 500);
	};
	$aLi.on('click',function(){
		index = $(this).index();
		fnToggle()
	})
})