define(function(){
    /**
     * [loadImg 图片加载]
     * @param  {[type]} opt [
     *      arr  ： 加载数组
     *      successFn ： 成功回调函数
     *      errorFn  ： 失败回调函数
     *      loadingTime ：图片加载耗时
     *      loadingFn  ： 开始加载
     *      admissionfn ： 入场动画
     * ]
     * @return {[type]}     [description]
     *
     */
    return function(opt){
        var set = {
            arr: opt.arr || [],
            successFn : opt.successFn || function(){},
            errorFn : opt.errorFn || function(){},
            loadingTime : opt.loadingTime || 5000,
            loadingFn : opt.loadingFn || function(){},
            admissionfn : opt.admissionfn || function(){}
        }
        var iTime = new Date().getTime();
        var timer = null;
        var num = 0;
        var len = set.arr.length;
        var bImgLoad = (len == 0) ? true : false;
        var bTime = false;
        timer = setInterval(function(){
            if(new Date().getTime()- iTime>=set.loadingTime){
                bTime=true;
            }
            if( bImgLoad && bTime ){
                clearInterval(timer);
                set.loadingFn()
            }
        },1000);
        if(len){
            for(var i=0;i<len;i++){
                var oImg=new Image();
                oImg.src=set.arr[i];
                oImg.onload=function(){
                    num++;
                    if (num == len) {
                        bImgLoad = true;
                        set.successFn()
                    }
                }
                oImg.error = function(){
                    bImgLoad = true;
                    set.errorFn()
                }
            }
        }
        set.admissionfn()
    }
})
