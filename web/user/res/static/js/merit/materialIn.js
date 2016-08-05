/**
 * Created by Administrator on 2016/6/3.
 */
define(['jquery'],function ($) {
    function materialIn(){
        console.log('materialIn');
        var $section8 = $('#j-section8');
        var oHeader = $('<header><h2>辅材品牌圈</h2></header>');
        var oUl = '<ul>';
        for (var i = 0; i < 20; i++) {
            oUl += '<li data-left="'+(i%5*241)+'" data-top="'+(Math.floor(i/5)*104)+'"><img src="/static/img/merit/link'+(i+1)+'.jpg" alt=""></li>';
        }
        oUl += '</ul>';
        $section8.append(oHeader).append(oUl).show();
        var oH2 = $section8.find('h2');
        var aLi = $section8.find('li');
        oH2.animate({
            opacity : 1,
            top: 0});
        aLi.each(function(index, el) {
            $(this).animate({
                opacity : 1,
                left: parseInt($(this).data('left')),
                top: parseInt($(this).data('top'))});
        });
    }
    return materialIn;
})