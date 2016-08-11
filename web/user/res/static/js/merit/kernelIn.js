/**
 * Created by Administrator on 2016/6/3.
 */
define(['jquery'],function ($) {
    var kernel = {
        data  : {
            "1" : [
                '坐在家中在线提交装修需求，免费得到经过精准匹配的三位设计师提供的三套平面设计方案，全程在线沟通；',
                '托管20%装修款，确认方案后签署三方保障协议并付款；',
                '第三方监理服务对施工全流程进行监督和管理，业主坐在家中通过网站或手机APP查看装修进度，完全不需要疲于奔波。'
            ],
            "2" : [
                '优化装修流程，去除层级，至少降低20%不必要的装修成本，绝不以牺牲设计质感与装修质量为代价。'
            ],
            "3" : [
                '提交需求、确认设计方案等沟通过程可在线完成，业主还可以通过手机APP客户端全程查看施工进度，不用亲自前往工地，让装修更为快速高效。'
            ]
        },
        posDot : [
            {
                top:-28,
                left:-26
            },
            {
                top: -5,
                left: 485
            },
            {
                top: 313,
                left: 212
            }
        ],
        posName : [
            {
                name : '操作简单',
                left :-62,
                top:-86,
                oL : -100,
                oT : -86
            },
            {
                name : '流程透明',
                left :456,
                top:-63,
                oL : 500,
                oT : -63
            },
            {
                name : '快速高效',
                left :181,
                top:360,
                oL : 181,
                oT : 400
            }
        ]
    };
    function enqueue(i) {

    }
    function outqueue(i) {

    }
    function hideTitle(obj) {
        obj.fadeOut();
    }
    function show(i) {

    }
    function kernelIn() {
        var length = kernel.data.length;
        var iNum = 0;
        var timer = null;
        var doc = $(document);
        var $section1 = $('#j-section1');
        var span = '',h3 = '';
        $.each(kernel.posDot,function(v,k){
            span += '<span data-index="'+(v+1)+'" data-left="'+k.left+'" data-top="'+k.top+'" class="dot dot'+(v+1)+'"></span>';
        });
        $.each(kernel.posName,function(v,k){
            h3 += '<h3 class="adv'+(v+1)+'" data-left="'+k.left+'" data-top="'+k.top+'" style="left:'+k.oL+'px;top:'+k.oT+'px;">'+k.name+'</h3>';
        });
        var oH2 = $('<h2>3大核心优势</h2>');
        var oMain = $('<div class="main"></div>');
        oMain.html('<div class="bg"></div>'+
        '<div class="gem"></div>'+
            '<span class="ray ray1"></span>'+
            '<span class="ray ray2"></span>'+
            '<span class="ray ray3"></span>'+
            '<div class="detail">'+
            '<div class="txt"></div>'+
            '<span class="arrow"><i></i></span></div>'+span+h3);
        $section1.append(oH2).append(oMain).fadeIn();
        var dot = $section1.find('.dot'),
            gem = $section1.find('.gem'),
            detail = $section1.find('.detail'),
            txt = $section1.find('.txt'),
            bg = $section1.find('.bg');
            oH2.fadeIn();
            bg.delay(300).fadeIn(300);
            gem.delay(500).fadeIn(400);
            dot.each(function(index, el) {
                var $this = $(this),
                    _index = $this.data('index'),
                    left = parseInt($this.data('left')),
                    top = parseInt($this.data('top')),
                    adv = $section1.find('h3.adv'+_index),
                    advL = parseInt(adv.data('left')),
                    advT = parseInt(adv.data('top'));
                $this.stop().animate({left:left,top:top,opacity:1},function(){
                    adv.stop().animate({left:advL,top:advT,opacity:1});
                });
                $(this).on('click',function(){
                    console.log(_index)
                });
            });
        $section1.one('mousewheel', mousewheelFn);
        $section1.on('mousewheel',function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        });
        function move() {
            console.log(iNum);
            hideTitle(oH2);
        }
        function mousewheelFn(ev, direction) {
            if (direction < 1) {  //向下滚动
                if (iNum === length -1){
                    iNum = 0;
                }else{
                    iNum ++;
                }
            } else {  //向上滚动
                if (iNum === 0){
                    iNum = length - 1;
                }else{
                    iNum --;
                }
            }
            move();
            clearTimeout(timer);
            timer = setTimeout(function () {
                $section1.one("mousewheel", mousewheelFn);
            }, 1200);
        }
        console.log('kernelIn');
    }
    return kernelIn;
});