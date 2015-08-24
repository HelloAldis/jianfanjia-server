$(function(){
	var winHash = window.location.hash.substring(1),
		index = 0,
		$design = $('#j-design'),
		$aLi = $design.find('.tabNav').find('li'),
		$oList = $design.find('.list');
		$createBtn = $design.find('.create-btn');
		if(winHash != 'new'){
			fnToggle(index)
		}
	function fnToggle(index){
		$aLi.eq(index).attr('class', 'active').siblings().attr('class','');
		$oList.eq(index).removeClass('hide').siblings().addClass('hide');
	};
	$aLi.on('click',function(){
		fnToggle($(this).index())
	})
	$createBtn.on('click',function(){
		fnToggle(1)
		return false;
	})
})