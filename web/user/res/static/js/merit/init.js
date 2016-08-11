/**
 * Created by Administrator on 2016/6/3.
 */
define(['jquery','merit/kernelIn','merit/sidenav'],function ($,kernelIn,sidenav) {
    function init() {
        console.log('加载成功');
        $('#loading').fadeOut().remove();
        kernelIn();
        sidenav();
    }
    return init;
});