/**
 * Created by Administrator on 2016/6/3.
 */
define(['jquery'],function ($) {
    function materialOut(){
        console.log('materialOut');
        var $section8 = $('#j-section8');
        var oH2 = $section8.find('h2');
        var aLi = $section8.find('li');
        aLi.each(function(index, el) {
            $(this).animate({
                opacity : 0,
                left: 473,
                top: 0
            });
        });
        oH2.animate({
            opacity : 0,
            top: 185},function(){
            $section8.html('').hide();
        });
    }
    return materialOut;
});