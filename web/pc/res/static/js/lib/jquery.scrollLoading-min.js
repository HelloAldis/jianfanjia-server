/*!
 * scrollLoading可选参数
 * ttr 	data-url 	获取元素加载地址的属性名 
 * container
	$(window)
	滚动的容器。默认为$(window)，也就是默认的网页滚动。
 * callback
	$.noop
	回调。元素动态加载完毕后执行的回调函数。其中回调函数的上下文this就是当前DOM元素。注意：如果无法获取元素加载地址，则不执行动态加载，但是会触发回调。在某些需求下，您可以缺省url值，仅仅触发回调。
 * $(".scrollLoading").scrollLoading({
    container: $("#zxxMainCon"),
    callback: function() {
        this.style.border = "3px solid #a0b3d6";	
    }
});
 * $(function(){
			$(".imgLoad").scrollLoading(); 
	})
	.imgLoad 图片的类名
*/
(function(a){a.fn.scrollLoading=function(b){var c={attr:"data-url",container:a(window),callback:a.noop};var d=a.extend({},c,b||{});d.cache=[];a(this).each(function(){var h=this.nodeName.toLowerCase(),g=a(this).attr(d.attr);var i={obj:a(this),tag:h,url:g};d.cache.push(i)});var f=function(g){if(a.isFunction(d.callback)){d.callback.call(g.get(0))}};var e=function(){var g=d.container.height();if(d.container.get(0)===window){contop=a(window).scrollTop()}else{contop=d.container.offset().top}a.each(d.cache,function(m,n){var p=n.obj,j=n.tag,k=n.url,l,h;if(p){l=p.offset().top-contop,h=l+p.height();if((l>=0&&l<g)||(h>0&&h<=g)){if(k){if(j==="img"){f(p.attr("src",k))}else{p.load(k,{},function(){f(p)})}}else{f(p)}n.obj=null}}})};e();d.container.bind("scroll",e)}})(jQuery);