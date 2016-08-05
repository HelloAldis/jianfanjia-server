/**
 * Created by Administrator on 2016/6/3.
 */
define(['jquery'],function ($) {
    var side = $('#j-sidenav'),
        data = [
            {
                name : '三大核心优势',
                fileIn : 'kernelIn',
                fileOut : 'kernelOut'
            },
            {
                name : '五大线上靠谱保障',
                fileIn : 'safeguardIn',
                fileOut: 'safeguardOut'
            },
            {
                name : '第三方监理服务具体如何运作',
                fileIn : 'supervisionIn',
                fileOut : 'supervisionOut'
            },
            {
                name : '我们如何筛选设计师',
                fileIn : 'filterIn',
                fileOut : 'filterOut'
            },
            {
                name : '为什么要收取设计费',
                fileIn : 'designfeeIn',
                fileOut : 'designfeeOut'
            },
            {
                name : '七大装修工序全程一手掌握',
                fileIn : 'processIn',
                fileOut : 'processOut'
            },
            {
                name : '简繁家对比传统装修',
                fileIn : 'diffIn',
                fileOut : 'diffOut'
            },
            {
                name : '辅材品牌圈',
                fileIn : 'materialIn',
                fileOut : 'materialOut'
            }
        ];
    function sidenav() {
        var length = data.length;
        var doc = $(document);
        var iNum = 0;
        var timer = null;
        var timerfile = null;
        var positionTop = [];
        var startTop = 70;
        var interval = ($(window).height() -100)/8;
        var str = '<div class="line"></div><ul>';
        $.each(data,function(key,value){
            str += '<li><div class="circle"><div></div></div></li>';
            positionTop.push(interval*key+startTop);
        });
        str += '</ul>';
        side.html(str);
        var aLi = side.find('li');
        var $tips = $('<div class="tips"></div>');
        side.append($tips);
        var oldFlie = 'kernelOut';
        aLi.eq(0).addClass('active');
        $tips.html(data[0].name).css({left:-40,top:positionTop[0] - $tips.height()/2  + 20}).fadeIn(500);
        aLi.each(function(index, el) {
            var $this = $(el);
            $this.animate({top:positionTop[index]});
            $this.on('click',function(){
                if ($this.hasClass('active')){
                    return ;
                }
                iNum = $this.index();
                move();
            });
        });
        doc.one('mousewheel.jyz', mousewheelFn);
        doc.on('mousewheel.jyz', function (ev) {
            ev.preventDefault();
        });
        function move() {
            var name = data[iNum].name;
            var filein = data[iNum].fileIn;
            var fileout = data[iNum].fileOut;
            aLi.eq(iNum).addClass('active').siblings().removeClass('active');
            $tips.html(name).css({top:positionTop[iNum] - $tips.height()/2  + 20}).fadeIn();
            require(['merit/'+oldFlie],function(file){
                file();
                clearTimeout(timerfile);
                timerfile = setTimeout(function () {
                    require(['merit/'+filein],function(file){
                        file();
                        clearTimeout(timerfile);
                    });
                }, 300);
            });
            oldFlie = fileout;
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
                doc.one("mousewheel.jyz", mousewheelFn);
            }, 1200);
        }
    }
    return sidenav;
});