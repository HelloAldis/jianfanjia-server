require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        },
        'jquery.mousewheel.min' : {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
});
require(['jquery','lodash','lib/jquery.mousewheel.min'],function($,_){
    var $content = $('#j-content');
    var $loading = $('#loading');
    var iNum = 0;
    var bOff = false;
    //s1 3大核心优势
    var core = {
        section : $content.find('.section1'),
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
    core.create = function(){
        var _this = this;
        var core = this.section,
            arr = [
                '<h2>3大核心优势</h2>',
                '<div class="main">',
                '<div class="bg"></div>',
                '<div class="gem"></div>',
                '<span class="ray ray1"></span>',
                '<span class="ray ray2"></span>',
                '<span class="ray ray3"></span>',
                '<div class="detail">',
                '<div class="txt"></div>',
                '<span class="arrow"><i></i></span>',
                '</div>'
            ];
        _.forEach(_this.posDot,function(v,k){
            arr.push('<span data-index="'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" class="dot dot'+(k+1)+'"></span>');
        });
        _.forEach(_this.posName,function(v,k){
            arr.push('<h3 class="adv'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" style="left:'+v.oL+'px;top:'+v.oT+'px;">'+v.name+'</h3>');
        });
        arr.push('</div>');
        this.section.html(arr.join(''));
    };
    core.coreMoveIn = function(){
        var _this = this,
            dot = this.section.find('.dot'),
            oH2 = this.section.find('h2'),
            gem = this.section.find('.gem'),
            bg = this.section.find('.bg');
        oH2.fadeIn(500);
        bg.delay(300).fadeIn(300);
        gem.delay(500).fadeIn(400);
        dot.each(function(index, el) {
            var $this = $(this),
                _index = $this.data('index'),
                left = parseInt($this.data('left')),
                top = parseInt($this.data('top')),
                adv = _this.section.find('h3.adv'+_index),
                advL = parseInt(adv.data('left')),
                advT = parseInt(adv.data('top'));
            $this.stop().animate({left:left,top:top,opacity:1},function(){
                adv.stop().animate({left:advL,top:advT,opacity:1});
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    core.coreMoveOut = function(){
        core.coreMoveHover();
        var _this = this,
            dot = this.section.find('.dot'),
            bg = this.section.find('.bg');
        setTimeout(function(){
            dot.each(function(index, el) {
                var $this = $(this),
                    _index = $this.data('index'),
                    adv = _this.section.find('h3.adv'+_index);
                adv.delay(500).stop().animate({opacity:0});
                $this.stop().delay(600).animate({left:228,top:142,opacity:0});
            });
            bg.delay(600).fadeOut(300,function(){
                core.create();
            });
        }, 1000);
    };
    core.coreMoveHover = function(){
        var _this = this;
        var core = this.section;
        var oH2 = core.find('h2');
        var main = core.find('.main');
        var detail = core.find('.detail');
        var gem = core.find('.gem');
        var ray = core.find('.ray');
        var aH3 = core.find('h3');
        var dot = core.find('.dot');
        main.removeClass('opacity');
        aH3.each(function(index, el) {
            var $this = $(this),
                advL = parseInt($this.data('left')),
                advT = parseInt($this.data('top'));
            $this.css('width','auto').removeClass('adv').animate({left:advL,top:advT,fontSize:30,opacity:1});
        });
        detail.stop().animate({top:200,opacity:0});
        dot.fadeTo(0,1);
        ray.stop().fadeOut();
    };
    core.coreMove = function(num){
        var _this = this;
        var core = this.section;
        var oH2 = core.find('h2');
        var main = core.find('.main');
        var detail = core.find('.detail');
        var gem = core.find('.gem');
        var ray = core.find('.ray'+num);
        var aH3 = core.find('h3');
        var aDot = core.find('.dot');
        var adv = core.find('.adv'+num);
        var dot = core.find('.dot'+num);
        main.addClass('opacity');
        this.coreMoveHover();
        var arr = [];
        oH2.stop().fadeOut();
        gem.stop().fadeOut();
        _.forEach(_this.data[num], function(v,k) {
            if(_this.data[num].length == 1){
                arr.push('<p>'+v+'</p>');
            }else{
                arr.push('<p>'+(k+1)+'，'+v+'</p>');
            }
        });
        detail.find('.txt').html(arr.join(''));
        aH3.fadeTo(0,0.5);
        aDot.fadeTo(0,0.5);
        dot.fadeTo(0,1);
        adv.addClass('adv').stop().animate({left:0,top:0,width:100+'%',fontSize:60,opacity:1},function(){
            ray.stop().fadeIn();
        });
        detail.show().stop().animate({top:144,opacity:1});
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    //s2 5大线上靠谱保障
    var protect = {
        section : $content.find('.section2'),
        data  : {
            "1" : [
                '业主与设计师、”简繁家“平台签署“三房保障合约”，更有约束力，并且由专业的律师事务所存档和托管，并提供相关法律服务，保障业主的合法权益。'
            ],
            "2" : [
                '业主可以将装修款托管至”简繁家“平台，待整个装修全部完工、并验收合格之后支付给设计师，让支付过程更有保障、安全。'
            ],
            "3" : [
                '除了通过”设计师负责制“让设计师直管施工之外，我们还提供了APP程序，让业主可以随时随地通过手机来查看施工进程。同时”简繁家“还提供第三方监理服务，如果业主没有时间亲自去施工现场也没有关系，第三方监理人员会在施工各个关键节点上门监督，保证施工质量和进度。'
            ],
            "4" : [
                '“简繁家”专门成立了专项质保基金，可先行赔付。该基金由设计师个人缴纳和“简繁家”平台划拨基金共同组成，为业主的装修售后服务提供可靠的保证。'
            ],
            "5" : [
                '“简繁家”采用设计师负责制，即让设计师完全掌管从设计到施工的整个装修过程，让设计师成为整个装修过程中的灵魂人物，确保装修效果100%实现最初的意图，不被其它因素影响。同时业主在装修过程中只需要与设计师一人对接，不用担心设计师与施工项目经理互相推脱，让沟通更为轻松顺畅。'
            ]
        },
        posDot : [
            {
                top:-27,
                left:240
            },
            {
                top: 105,
                left: 504
            },
            {
                top: 431,
                left: 400
            },
            {
                top: 400,
                left: 56
            },
            {
                top: 55,
                left: -27
            }
        ],
        posName : [
            {
                name : '合约保障',
                left :208,
                top:-85,
                oL : 208,
                oT : -120
            },
            {
                name : '付款保障',
                left :475,
                top:46,
                oL : 510,
                oT : 46
            },
            {
                name : '售后保障',
                left :370,
                top:479,
                oL : 370,
                oT : 510
            },
            {
                name : '质量保障',
                left :26,
                top:448,
                oL : 26,
                oT : 500
            },
            {
                name : '效果保障',
                left :-58,
                top:-3,
                oL : -100,
                oT : -3
            }
        ]
    };
    protect.create = function(){
        var _this = this;
        var protect = this.section,
            arr = [
                '<h2>5大线上靠谱保障</h2>',
                '<div class="main">',
                '<div class="bg"></div>',
                '<div class="gem"></div>',
                '<span class="ray ray1"></span>',
                '<span class="ray ray2"></span>',
                '<span class="ray ray3"></span>',
                '<span class="ray ray4"></span>',
                '<span class="ray ray5"></span>',
                '<div class="detail">',
                '<div class="txt"></div>',
                '<span class="arrow"><i></i></span>',
                '</div>'
            ];
        _.forEach(_this.posDot,function(v,k){
            arr.push('<span data-index="'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" class="dot dot'+(k+1)+'"></span>');
        });
        _.forEach(_this.posName,function(v,k){
            arr.push('<h3 class="adv'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" style="left:'+v.oL+'px;top:'+v.oT+'px;">'+v.name+'</h3>');
        });
        arr.push('</div>');
        this.section.html(arr.join(''));
    };
    protect.protectMoveIn = function(){
        var _this = this,
            dot = this.section.find('.dot'),
            oH2 = this.section.find('h2'),
            gem = this.section.find('.gem'),
            bg = this.section.find('.bg');
        oH2.fadeIn(500);
        bg.delay(300).fadeIn(300);
        gem.delay(500).fadeIn(400);
        dot.each(function(index, el) {
            var $this = $(this),
                _index = $this.data('index'),
                left = parseInt($this.data('left')),
                top = parseInt($this.data('top')),
                adv = _this.section.find('h3.adv'+_index),
                advL = parseInt(adv.data('left')),
                advT = parseInt(adv.data('top'));
            $this.stop().animate({left:left,top:top,opacity:1},function(){
                adv.stop().animate({left:advL,top:advT,opacity:1});
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    protect.protectMoveOut = function(){
        this.protectHover();
        var _this = this,
            dot = this.section.find('.dot'),
            bg = this.section.find('.bg');
        setTimeout(function(){
            dot.each(function(index, el) {
                var $this = $(this),
                    _index = $this.data('index'),
                    adv = _this.section.find('h3.adv'+_index);
                adv.delay(500).stop().animate({opacity:0});
                $this.stop().delay(600).animate({left:228,top:142,opacity:0});
            });
            bg.delay(600).fadeOut(300,function(){
                protect.create();
            });
        }, 1000);
    };
    protect.protectHover = function(){
        var _this = this;
        var core = this.section;
        var oH2 = core.find('h2');
        var main = core.find('.main');
        var detail = core.find('.detail');
        var ray = core.find('.ray');
        var aH3 = core.find('h3');
        var dot = core.find('.dot');
        main.removeClass('opacity');
        aH3.each(function(index, el) {
            var $this = $(this),
                advL = parseInt($this.data('left')),
                advT = parseInt($this.data('top'));
            $this.css('width','auto').removeClass('adv').animate({left:advL,top:advT,fontSize:30,opacity:1});
        });
        detail.stop().animate({top:200,opacity:0});
        dot.fadeTo(0,1);
        ray.stop().fadeOut();
    };
    protect.protectMove = function(num){
        var _this = this;
        var protect = this.section;
        var oH2 = protect.find('h2');
        var main = protect.find('.main');
        var detail = protect.find('.detail');
        var gem = protect.find('.gem');
        var ray = protect.find('.ray'+num);
        var aH3 = protect.find('h3');
        var aDot = protect.find('.dot');
        var adv = protect.find('.adv'+num);
        var dot = protect.find('.dot'+num);
        _this.protectHover();
        main.addClass('opacity');
        var arr = [];
        oH2.stop().fadeOut();
        gem.stop().fadeOut();
        _.forEach(_this.data[num], function(v,k) {
            if(_this.data[num].length == 1){
                arr.push('<p>'+v+'</p>');
            }else{
                arr.push('<p>'+(k+1)+'，'+v+'</p>');
            }
        });
        detail.find('.txt').html(arr.join(''));
        aH3.fadeTo(0,0.5);
        aDot.fadeTo(0,0.5);
        dot.fadeTo(0,1);
        adv.stop().animate({left:0,top:0,width:100+'%',fontSize:60,opacity:1},function(){
            ray.stop().fadeIn();
        }).addClass('adv');
        detail.show().stop().animate({top:210,opacity:1});
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    //s3 第三方监理服务具体如何运作
    var operate = {
        section : $content.find('.section3'),
        data : [
            {
                day : '1',
                name : '开工',
                bz : ['三方（业主、设计师和项目经理、平台监理方）见面，交换联系方式；设计方案交底；工期安排交底。'],
                gj : ['三方（业主、设计师和项目经理、平台监理方）见面，交换联系方式；设计方案交底；工期安排交底。']
            },
            {
                day : '3',
                name : '水电材料进场',
                bz : [],
                gj : ['&nbsp&nbsp','材料验收；施工及验收要求交底；布线需求交底。']
            },
            {
                day : '12',
                name : '水电验收',
                bz : ['根据《水电验收标准》验收。'],
                gj : ['&nbsp&nbsp','根据《水电验收标准》验收。']
            },
            {
                day : '16',
                name : '泥木材料进场',
                bz : [],
                gj : ['&nbsp&nbsp','材料验收；施工及验收要求交底。']
            },
            {
                day : '18',
                name : '防水验收',
                bz : ['根据《防水验收标准》验收。'],
                gj : ['&nbsp&nbsp','根据《防水验收标准》验收。']
            },
            {
                day : '20',
                name : '泥工巡检',
                bz : [],
                gj : ['检查是否存在错贴、误贴；检查是否存在空鼓、颜色搭配等问题；成品报护及现场卫生处理。']
            },
            {
                day : '24',
                name : '泥工验收',
                bz : [],
                gj : ['&nbsp&nbsp','根据《泥工验收标准》验收。']
            },
            {
                day : '32',
                name : '吊顶验收',
                bz : [],
                gj : ['&nbsp&nbsp','根据《木工验收标准》验收。']
            },
            {
                day : '34',
                name : '木作巡检',
                bz : [],
                gj : ['检查是否根据图纸要求施工；检查木作施工中是否存在不规范的操作；成品保护及现场卫生处理。']
            },
            {
                day : '36',
                name : '木作验收',
                bz : ['根据《泥木工程验收标准》验收。'],
                gj : ['&nbsp&nbsp','根据《泥木工程验收标准》验收。']
            },
            {
                day : '37',
                name : '油漆材料进场',
                bz : [],
                gj : ['&nbsp&nbsp','材料验收；']
            },
            {
                day : '42',
                name : '油漆基础处理',
                bz : [],
                gj : ['&nbsp&nbsp','检查墙面接缝处理情况；检查墙面基层有无空鼓；']
            },
            {
                day : '46',
                name : '油漆验收',
                bz : ['根据《油漆验收标准》验收；'],
                gj : ['&nbsp&nbsp','根据《油漆验收标准》验收；']
            },
            {
                day : '58',
                name : '安装验收',
                bz : ['根据《安装验收标准》验收；'],
                gj : ['&nbsp&nbsp','根据《安装验收标准》验收；']
            },
            {
                day : '60',
                name : '竣工验收',
                bz : ['根据《竣工验收标准》验收。'],
                gj : ['&nbsp&nbsp','根据《竣工验收标准》验收。']
            }
        ]
    };
    operate.create = function(){
        var _this = this;
        var operate = this.section;
        var arr = [
            '<header class="title">',
            '<span class="arrow1"></span>',
            '<span class="arrow2"></span>',
            '<span class="arrow3"></span>',
            '<h2>第三方监理服务具体如何运作</h2>',
            '<p>“简繁家”引入第三方监理服务，和传统装修公司相比，该监理服务绝不会走过场，认真检验、核对每个施工节点，保证装修按时、按质完成，并且不再需要业主每天亲自跑工地，为业主节约了大量的时间和精力。“简繁家”提供了标准型和管家型两种监理服务，它们是具体是如何运作的，两者之间有哪些区别呢？</p>',
            '<div class="tt">',
            '<dl class="f-fl">',
            '<dt>管家监理</dt>',
            '<dd>2000元/户</dd>',
            '</dl>',
            '<dl class="f-fr">',
            '<dt>标准监理</dt>',
            '<dd>1000元/户</dd>',
            '</dl>',
            '</div>',
            '</header>',
            '<div class="scroll"><div class="scrollbar"><div class="bar"></div></div><ul></ul></div>'
        ];
        operate.html(arr.join(''));
        this.operateCreate(operate);
        this.operateIn();
    };
    operate.operateIn = function(){
        var _this = this;
        var operate = this.section;
        var oHeader = operate.find('.title');
        oHeader.find('h2').stop().animate({fontSize: 72,opacity :1});
        oHeader.find('span').stop().delay(500).fadeIn(1000);
        oHeader.find('p').stop().animate({marginTop: 0,opacity :1});
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    operate.operateCreate = function(operate){
        var _this = this;
        var oUl = operate.find('ul');
        arr = [];
        _.forEach(_this.data, function(v, k) {
            var strBz = '';
            var strGj = '';
            _.forEach(v.bz, function(m) {
                strBz += '<p>'+m+'</p>';
            });
            _.forEach(v.gj, function(n) {
                strGj += '<p>'+n+'</p>';
            });
            var temp = [
                '<li>',
                '<div class="gj">'+strGj+'</div>',
                '<div class="day">',
                '<div class="tags">',
                '<h3>第'+v.day+'天</h3>',
                '<p>'+v.name+'</p>',
                '</div>',
                '</div>',
                '<div class="bz">'+strBz+'</div>',
                '</li>'
            ];
            arr.push(temp.join(''));
        });
        oUl.html(arr.join(''));
    };
    operate.operateMoveIn = function(){   //入场
        var _this = this;
        var operate = this.section;
        var oHeader = operate.find('.title');
        var scroll = operate.find('.scroll');
        var aLi = operate.find('li');
        oHeader.find('h2').fadeOut();
        oHeader.find('span').fadeOut();
        oHeader.find('p').fadeOut();
        oHeader.delay(500).animate({
            top: 150,height:100},function(){
            oHeader.find('.tt').fadeIn();
            scroll.fadeIn();
            _this.scroll();
        }).addClass('step');
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    operate.scroll = function(){
        var operate = this.section;
        var scroll = operate.find('.scroll');
        var scrollbar = scroll.find('.scrollbar');
        var bar = scroll.find('.bar');
        var ul = scroll.find('ul');
        var iH = ul.height();
        var cH = 600;
        var bH = 165;
        var iScale = (cH-bH)/cH;
        bar.on('mousedown',function(event){
            var disY=event.clientY-bar.position().top;
            $(document).on('mousemove.scroll',function(event){
                var iTop=event.clientY-disY;
                if(iTop>cH-bH){
                    iTop = cH-bH
                }else if(iTop<0){
                    iTop=0;
                }
                bar.css('top',iTop)
                var Fbai=iTop / (cH-bH);
                ul.css('top',-Fbai*(iH-cH));
            })
            $(document).on('mouseup.scroll',function(){
                $(document).off('mousemove.scroll');
                $(document).off('mouseup.scroll');
            })
            return false;
        })
        ul.on('mousedown',function(event){
            var disY=event.clientY-ul.position().top;
            $(document).on('mousemove.scrolla',function(event){
                var iTop=event.clientY-disY;
                if(iTop>iH-cH){
                    iTop = iH-cH
                }else if(iTop<0){
                    iTop=0;
                }
                ul.css('top',-iTop);
                var Fbai=iTop / (iH-cH);
                bar.css('top',Fbai*(cH-bH));
            })
            $(document).on('mouseup.scrolla',function(){
                $(document).off('mousemove.scrolla');
                $(document).off('mouseup.scrolla');
            })
            return false;
        })
    };
    operate.operateMoveOut = function(){    //出场
        var _this = this;
        var operate = this.section;
        var oHeader = operate.find('header');
        var aLi = operate.find('li');
        oHeader.stop().animate({
            opacity : 0,
            top: -150});
        aLi.each(function(index, el) {
            $(this).animate({
                opacity : 0,
                left: 473,
                top: 0});
        });
        setTimeout(function(){
            _this.create();
        }, 1000);
    };
    //s4 我们如何筛选设计师
    var filter = {
        section : $content.find('.section4'),
        data  : {
            "1" : [
                '只有资深、并且在行业中有知名度的一线设计师才能入驻“简繁家”平台'
            ],
            "2" : [
                '对每一位设计师的身份、品行进行审核，让入驻“简繁家”平台的设计师都是敬业、有职业道德的'
            ],
            "3" : [
                '平台派监理人员实地审核每个设计师前期已经完成的施工作品，保证平台入驻设计师既有设计能力，也有施工质量、工艺实现的管理能力'
            ],
            "4" : [
                '入驻设计师必须提供过去的优秀设计作品，证明自己的业务能力和水平'
            ]
        },
        posDot : [
            {
                top:-19,
                left:-27
            },
            {
                top: -28,
                left: 458
            },
            {
                top: 230,
                left: 513
            },
            {
                top: 345,
                left: 50
            }
        ],
        posName : [
            {
                name : '行业资历认证',
                left :-88,
                top:-77,
                oL : -110,
                oT : -77
            },
            {
                name : '设计师身份认证',
                left :380,
                top:-86,
                oL : 380,
                oT : -110
            },
            {
                name : '施工工地认证',
                left :452,
                top:277,
                oL : 500,
                oT : 277
            },
            {
                name : '个人设计作品认证',
                left :-42,
                top:393,
                oL : -42,
                oT : 440
            }
        ]
    };
    filter.create = function(){
        var _this = this;
        var filter = this.section,
            arr = [
                '<h2>我们如何筛选设计师</h2>',
                '<div class="main">',
                '<div class="bg"></div>',
                '<div class="gem"></div>',
                '<span class="ray ray1"></span>',
                '<span class="ray ray2"></span>',
                '<span class="ray ray3"></span>',
                '<span class="ray ray4"></span>',
                '<div class="detail">',
                '<div class="txt"></div>',
                '<span class="arrow"><i></i></span>',
                '</div>'
            ];
        _.forEach(_this.posDot,function(v,k){
            arr.push('<span data-index="'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" class="dot dot'+(k+1)+'"></span>');
        });
        _.forEach(_this.posName,function(v,k){
            arr.push('<h3 class="adv'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" style="left:'+v.oL+'px;top:'+v.oT+'px;">'+v.name+'</h3>');
        });
        arr.push('</div>');
        this.section.html(arr.join(''));
    };
    filter.filterMoveIn = function(){
        var _this = this,
            dot = this.section.find('.dot'),
            oH2 = this.section.find('h2'),
            gem = this.section.find('.gem'),
            bg = this.section.find('.bg');
        oH2.fadeIn(500);
        bg.delay(300).fadeIn(300);
        gem.delay(500).fadeIn(400);
        dot.each(function(index, el) {
            var $this = $(this),
                _index = $this.data('index'),
                left = parseInt($this.data('left')),
                top = parseInt($this.data('top')),
                adv = _this.section.find('h3.adv'+_index),
                advL = parseInt(adv.data('left')),
                advT = parseInt(adv.data('top'));
            $this.stop().animate({left:left,top:top,opacity:1},function(){
                adv.stop().animate({left:advL,top:advT,opacity:1});
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    filter.filterMoveOut = function(){
        this.filterHover();
        var _this = this,
            dot = this.section.find('.dot'),
            bg = this.section.find('.bg');
        setTimeout(function(){
            dot.each(function(index, el) {
                var $this = $(this),
                    _index = $this.data('index'),
                    adv = _this.section.find('h3.adv'+_index);
                adv.delay(500).stop().animate({opacity:0});
                $this.stop().delay(600).animate({left:228,top:142,opacity:0});
            });
            bg.delay(600).fadeOut(300,function(){
                filter.create();
            });
        }, 1000);
    };
    filter.filterHover = function(){
        var _this = this;
        var core = this.section;
        var oH2 = core.find('h2');
        var main = core.find('.main');
        var detail = core.find('.detail');
        var ray = core.find('.ray');
        var aH3 = core.find('h3');
        var dot = core.find('.dot');
        main.removeClass('opacity');
        aH3.each(function(index, el) {
            var $this = $(this),
                advL = parseInt($this.data('left')),
                advT = parseInt($this.data('top'));
            $this.css('width','auto').removeClass('adv').animate({left:advL,top:advT,fontSize:30,opacity:1});
        });
        detail.stop().animate({top:200,opacity:0});
        dot.fadeTo(0,1);
        ray.stop().fadeOut();
    };
    filter.filterMove = function(num){
        var _this = this;
        var filter = this.section;
        var oH2 = filter.find('h2');
        var main = filter.find('.main');
        var detail = filter.find('.detail');
        var gem = filter.find('.gem');
        var ray = filter.find('.ray'+num);
        var aH3 = filter.find('h3');
        var aDot = filter.find('.dot');
        var adv = filter.find('.adv'+num);
        var dot = filter.find('.dot'+num);
        this.filterHover();
        main.addClass('opacity');
        var arr = [];
        oH2.stop().fadeOut();
        gem.stop().fadeOut();
        _.forEach(_this.data[num], function(v,k) {
            if(_this.data[num].length == 1){
                arr.push('<p>'+v+'</p>');
            }else{
                arr.push('<p>'+(k+1)+'，'+v+'</p>');
            }
        });
        detail.find('.txt').html(arr.join(''));
        aH3.fadeTo(0,0.5);
        aDot.fadeTo(0,0.5);
        dot.fadeTo(0,1);
        adv.addClass('adv').stop().animate({left:0,top:0,width:100+'%',fontSize:50,opacity:1},function(){
            ray.stop().fadeIn();
        });
        detail.show().stop().animate({top:110,opacity:1});
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    //s5 为什么要收取设计费
    var fee = {
        section : $content.find('.section5')
    };
    fee.create = function(){
        var _this = this,
            fee = this.section,
            arr = [
                '<div class="bg">',
                '<span class="arrow1"></span>',
                '<span class="arrow2"></span>',
                '<span class="arrow3"></span>',
                '<span class="arrow4"></span>',
                '</div>',
                '<header>',
                '<h2>为什么要收取设计费</h2>',
                '<p>详尽的设计施工图包括了施工平面布局图，吊顶施工图，衣柜、酒柜等施工图，水电走线图等等，需要花费设计师大量精力，这些是设计师核心价值的体现。此外设计师还要经常亲自来到施工现场进行相关指导，对业主的软装搭配提出指导性意见，并对业主在采购装修材料时提出咨询参考，起到顾问的作用。</p>',
                '</header>',
                '<div class="main">',
                '<div class="body"></div>',
                '<div class="item item1">',
                '<p>软装搭配指导及材料采购咨询</p>',
                '<span class="dot"></span>',
                '<div class="black">20%</div>',
                '</div>',
                '<div class="item item2">',
                '<p>详尽的设计施工图</p>',
                '<span class="dot"></span>',
                '<div class="black">40%</div>',
                '</div>',
                '<div class="item item3">',
                '<p>现场施工的指导和管理</p>',
                '<span class="dot"></span>',
                '<div class="black">40%</div>',
                '</div>',
                '</div>'
            ];
        fee.html(arr.join(''));
    };
    fee.feeIn = function(){
        var _this = this;
        var operate = this.section;
        var oHeader = operate.find('header');
        var bg = operate.find('.bg');
        oHeader.find('h2').stop().animate({fontSize: 72,opacity :1});
        bg.find('span').stop().delay(500).fadeIn(1000);
        oHeader.find('p').stop().animate({marginTop: 0,opacity :1});
        bOff = true;
    };
    fee.feeMoveIn = function(){
        var fee = this.section,
            oHeader = fee.find('header');
        var oMain = fee.find('.main');
        var aItem1 = fee.find('.item1');
        var aItem2 = fee.find('.item2');
        var aItem3 = fee.find('.item3');
        oHeader.find('p').fadeOut();
        oHeader.find('h2').stop().animate({fontSize: 46}).html('设计费包含哪些');
        oHeader.stop().animate({
            top: 200,height:100},function(){
            oMain.show();
            aItem1.find('.black').stop().animate({left:19,top:-16,opacity : 1},function(){
                aItem1.find('.dot').stop().fadeIn();
                aItem1.find('p').stop().animate({left:-300,opacity : 1});
            });
            aItem2.find('.black').stop().animate({left:152,opacity : 1},800,function(){
                aItem2.find('.dot').stop().fadeIn();
                aItem2.find('p').stop().animate({left:370,opacity : 1});
            });
            aItem3.find('.black').stop().animate({left:-20,top:111,opacity : 1},1000,function(){
                aItem3.find('.dot').stop().fadeIn();
                aItem3.find('p').stop().animate({left:-290,opacity : 1});
            });
        }).addClass('step');
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    fee.feeMoveOut = function(){
        var _this = this;
        var fee = this.section;
        var oHeader = fee.find('header');
        var oMain = fee.find('.main');
        var aItem1 = fee.find('.item1');
        var aItem2 = fee.find('.item2');
        var aItem3 = fee.find('.item3');
        oHeader.stop().animate({
            opacity : 0,
            top: -200});
        aItem1.find('.dot').stop().fadeOut();
        aItem1.find('p').stop().animate({left:-350,opacity : 0});
        aItem1.find('.black').stop().animate({left:0,top:-35,opacity : 0});
        aItem2.find('.dot').stop().fadeOut();
        aItem2.find('p').stop().animate({left:420,opacity :0});
        aItem2.find('.black').stop().animate({left:165,opacity : 0});
        aItem3.find('.dot').stop().fadeOut();
        aItem3.find('p').stop().animate({left:-330,opacity : 0});
        aItem3.find('.black').stop().animate({left:-40,top:131,opacity : 0});
        oMain.stop().fadeOut();
        fee.find('span').stop().fadeOut();
        setTimeout(function(){
            _this.create();
        }, 1000);
    };
    //s6 7大装修工序全程一手掌握
    var app = {
        section : $content.find('.section6'),
        posDot : [
            {
                top: -28,
                left: 275
            },
            {
                top: 110,
                left: 530
            },
            {
                top: 426,
                left: 540
            },
            {
                top: 558,
                left: 389
            },
            {
                top: 558,
                left: 162
            },
            {
                top: 426,
                left: 12
            },
            {
                top: 109,
                left: 22
            }
        ],
        posName : [
            {
                name : '开工',
                left :281,
                top:-77,
                oL : 281,
                oT : -100
            },
            {
                name : '拆改',
                left :599,
                top:106,
                oL : 630,
                oT : 106
            },
            {
                name : '水电',
                left :607,
                top:427,
                oL : 640,
                oT : 427
            },
            {
                name : '泥木',
                left :399,
                top:605,
                oL : 399,
                oT : 650
            },
            {
                name : '油漆',
                left :166,
                top:605,
                oL : 166,
                oT : 650
            },
            {
                name : '安装',
                left :-45,
                top:426,
                oL : -80,
                oT : 426
            },
            {
                name : '竣工',
                left :-34,
                top:104,
                oL : -70,
                oT : 104
            }
        ]
    };
    app.create = function(){
        var _this = this,
            arr = [
                '<h2>7大装修工序全程一手掌握</h2>',
                '<div class="main">',
                '<div class="bg"></div>',
                '<div class="app"></div>',
                '<div class="icon">',
                '<div class="icon1"></div>',
                '<div class="icon2"></div>',
                '<div class="icon3"></div>',
                '<div class="icon4"></div>',
                '<div class="icon5"></div>',
                '<div class="icon6"></div>',
                '</div>',
                '<div class="app-shim"></div>',
                '<div class="optical"></div>',
                '<div class="light-circle light-circle1"></div>',
                '<div class="light-circle light-circle2"></div>',
                '<div class="step-icon step-icon1"></div>',
            ];
        _.forEach(_this.posDot,function(v,k){
            arr.push('<span data-index="'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" class="dot dot'+(k+1)+'"></span>');
        });
        _.forEach(_this.posName,function(v,k){
            arr.push('<h3 class="adv'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" style="left:'+v.oL+'px;top:'+v.oT+'px;">'+v.name+'</h3>');
        });
        this.section.html(arr.join(''));
    };
    app.dotMoveIn = function(){
        var _this = this,
            section = $content.find('.section6'),
            dot = section.find('.dot'),
            oH2 = section.find('h2'),
            bg = section.find('.bg'),
            icon = section.find('.icon'),
            app = section.find('.app');
        oH2.fadeIn(500);
        icon.fadeIn(800);
        bg.delay(300).fadeIn(300);
        app.delay(500).fadeIn(400);
        dot.each(function(index, el) {
            var $this = $(this),
                _index = $this.data('index'),
                left = parseInt($this.data('left')),
                top = parseInt($this.data('top')),
                adv = section.find('h3.adv'+_index),
                advL = parseInt(adv.data('left')),
                advT = parseInt(adv.data('top'));
            $this.stop().animate({left:left,top:top,opacity:1},function(){
                adv.stop().animate({left:advL,top:advT,opacity:1});
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    app.stepMove = function(num){
        console.log(num)
        var _this = this,
            bg = this.section.find('.bg'),
            stepIcon = this.section.find('.step-icon');
        stepIcon.show();
        stepIcon.stop().animate({top:377,opacity:0}).css('top',209);
        stepIcon.addClass('step-icon'+num).stop().animate({top:256,opacity:1} ,function(){
            bg.addClass('bg'+num);
            _.forEach(arr,function(v,k){
                if(k < num){
                    _this.section.find('.dot'+(k+1)).addClass('flash');
                    _this.section.find('.adv'+(k+1)).addClass('adv');
                }
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    app.stepMoveIn = function(){
        var _this = this,
            section = this.section,
            dot = section.find('.dot'),
            oH2 = section.find('h2'),
            icon = section.find('.icon'),
            optical = section.find('.optical'),
            shim = section.find('.app-shim');
        bg = section.find('.bg'),
            lightCircle = section.find('.light-circle'),
            _app = section.find('.app');
        oH2.addClass('step').animate({top:366,fontSize:38},function(){
            icon.fadeOut(300);
        });
        _app.stop().animate({top:400,opacity:0},function(){
            _app.addClass('app1').delay(300).animate({top:388,opacity:1});
            shim.delay(600).stop().show().animate({top:377,opacity:1},function(){
                optical.stop().animate({top:246,height:163} ,function(){
                    lightCircle.stop().fadeIn();
                    _this.stepMove(1);
                });
            });
        });
    };
    app.dotMoveOut = function(){
        var _this = this,
            section = this.section,
            dot = section.find('.dot'),
            oH2 = section.find('h2'),
            icon = section.find('.icon'),
            optical = section.find('.optical'),
            stepIcon = section.find('.step-icon'),
            shim = section.find('.app-shim');
        bg = section.find('.bg'),
            lightCircle = section.find('.light-circle'),
            _app = section.find('.app');
        oH2.stop().animate({top:300}).fadeOut();
        lightCircle.stop().fadeOut();
        stepIcon.stop().fadeOut();
        optical.stop().animate({top:409,height:0} ,function(){
            shim.delay(600).stop().show().animate({top:388,opacity:0},function(){
                _app.delay(300).animate({top:400,opacity:0});
                dot.each(function(index, el) {
                    var $this = $(this),
                        _index = $this.data('index'),
                        adv = section.find('h3.adv'+_index);
                    $this.stop().animate({left:276,top:276,opacity:0},function(){
                        adv.stop().animate({opacity:0});
                    });
                });
                bg.delay(500).fadeOut(300);
            })
        });
        setTimeout(function(){
            _this.create();
        }, 1000);
    };
    //s7 简繁家对比传统装修
    var diff = {
        section : $content.find('.section7'),
        data : [
            {
                name : '装修咨询',
                jyz  : '足不出户3套方案到手',
                ct   : '必须出门四处奔波',
                left : 124,
                top  : -209,
            },
            {
                name : '预算报价',
                jyz  : '降低20%不必要的成本',
                ct   : '分担模式价格偏高',
                left : 390,
                top  : -95,
            },
            {
                name : '合同签订',
                jyz  : '三房保障合同托管<br />直至满意验收',
                ct   : '双方合同',
                left : 390,
                top  : 297,
            },
            {
                name : '施工管理',
                jyz  : '手机APP一手掌管<br />装修过程',
                ct   : '不能便捷掌握<br />必须亲自到施工现场',
                left : 124,
                top  : 423,
            },
            {
                name : '售后保障',
                jyz  : '专项质保基金先行赔付',
                ct   : '按部就班解决<br />效率低，周期长',
                left : -139,
                top  : 297,
            },
            {
                name : '监理服务',
                jyz  : '第三方监理',
                ct   : '内部监理',
                left : -139,
                top  : -95,
            },
        ],
        pos : [
            {
                top  : 0,
                left : 52
            },
            {
                top  : 15,
                left : 986
            },
            {
                top  : 79,
                left : 1080
            },
            {
                top  : 98,
                left : 898
            },
            {
                top  : 124,
                left : 92
            },
            {
                top  : 128,
                left : -47
            },
            {
                top  : 128,
                left : 166
            },
            {
                top  : 139,
                left : 804
            },
            {
                top  : 154,
                left : 1178
            },
            {
                top  : 173,
                left : 996
            },
            {
                top  : 199,
                left : 56
            },
            {
                top  : 233,
                left : 186
            },
            {
                top  : 233,
                left : 885
            },
            {
                top  : 239,
                left : 1093
            },
            {
                top  : 258,
                left : 290
            },
            {
                top  : 293,
                left : 988
            },
            {
                top  : 308,
                left : -16
            },
            {
                top  : 341,
                left : 106
            }
        ]
    };
    diff.create = function(){
        var _diff = this.section;
        var arr = [
            '<h2 class="title">简繁家对比传统装修</h2>',
            '<div class="main"></div>',
            '<div class="bg"></div>'
        ];
        _diff.html(arr.join(''));
        var diffBg = _diff.find('.bg');
        var diffTt = _diff.find('h2');
        var diffMain = _diff.find('.main');
        this.diffBgCreate(diffBg);
        this.diffEdgeCreate(diffMain);
        this.diffTitleMove();
    };
    diff.diffTitleMove = function(){
        var _this = this;
        var _diff = this.section;
        var diffTt = _diff.find('.title');
        var body = _diff.find('.body');
        var edge = _diff.find('.edge');
        diffTt.fadeIn(500,function(){
            body.fadeIn();
            edge.each(function(index, el) {
                $(this).delay(500).animate({
                    opacity : 1,
                    left: parseInt($(this).data('left')),
                    top: parseInt($(this).data('top'))});
            });
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    }
    diff.diffEdgeCreate = function(obj){
        var _this = this,
            arr = [
                '<div class="body"></div>'
            ];
        _.forEach(_this.data, function(v, k) {
            arr.push('<div class="edge" data-index="'+k+'" data-left="'+v.left+'" data-top="'+v.top+'" data-jyz="'+v.jyz+'" data-ct="'+v.ct+'">'+v.name+'</div>')
        });
        obj.html(arr.join(''));
    }
    diff.diffEdgeMove = function(){
        var iNum = 0;
        var _this = this;
        var _diff = this.section;
        var body = _diff.find('.body');
        var edge = _diff.find('.edge');
        var time = null;
        _this.diffEdge(0);
        edge.each(function(index, el) {
            $(this).on('mouseenter',function(){
                iNum = $(this).data('index');
                _this.diffEdge(iNum);
                clearTimeout(time);
            }).on('mouseleave',function(){
                clearTimeout(time);
                time = setTimeout(function(){
                    iNum = 0;
                    _this.diffEdge(0);
                }, 2000)
            });
        });
    };
    diff.diffEdge = function(iNum){
        var _diff = this.section;
        var body = _diff.find('.body');
        var edge = _diff.find('.edge');
        var arr = [
            '<dl class="jyz">',
            '<dt>简繁家平台</dt>',
            '<dd>'+edge.eq(iNum).data('jyz')+'</dd>',
            '</dl>',
            '<dl class="ct">',
            '<dd>'+edge.eq(iNum).data('ct')+'</dd>',
            '<dt>传统装修</dt>',
            '</dl>'
        ];
        body.hide().html(arr.join('')).fadeIn();
        edge.eq(iNum).addClass('curr').siblings('.edge').removeClass('curr');
    };
    diff.diffMoveIn = function(){
        var _this = this;
        var _diff = this.section;
        var diffTt = _diff.find('.title');
        var body = _diff.find('.body');
        var edge = _diff.find('.edge');
        var diffMain = _diff.find('.main');
        diffTt.fadeOut(500,function(){
            diffMain.addClass('active');
            _this.diffEdgeMove();
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    diff.diffEdgeMoveOut = function(){
        var diffMain = this.section;
        var edge = diffMain.find('.edge');
        edge.each(function(index, el) {
            $(this).animate({
                opacity : 0,
                left: 124,
                top: 107});
        });
    };
    diff.diffBgCreate = function(obj){
        var _this = this,
            str = '';
        _.forEach(_this.pos, function(v, k) {
            str += '<div style="left:'+v.left+'px;top:'+v.top+'px;"></div>'
        });
        obj.hide().html(str).fadeIn();
    };
    //s8 辅材品牌圈
    var link = {
        section : $content.find('.section8')
    };
    link.create =  function(){
        var _this = this;
        var link = this.section;
        var arr = [
            '<header><h2>辅材品牌圈</h2></header>',
            '<ul>'
        ];
        for (var i = 0; i < 20; i++) {
            arr.push('<li data-left="'+(i%5*241)+'" data-top="'+(Math.floor(i/5)*104)+'"><img src="/static/img/merit/link'+(i+1)+'.jpg" alt=""></li>')
        };
        arr.push('</ul>');
        link.html(arr.join(''));
    };
    link.linkMoveIn = function(){   //入场
        var _link = this.section;
        var oH2 = _link.find('h2');
        var aLi = _link.find('li');
        oH2.animate({
            opacity : 1,
            top: 0});
        aLi.each(function(index, el) {
            $(this).animate({
                opacity : 1,
                left: parseInt($(this).data('left')),
                top: parseInt($(this).data('top'))});
        });
        setTimeout(function(){
            bOff = true;
        }, 2000);
    };
    link.linkMoveOut = function(){    //出场
        var _link = this.section;
        var oH2 = _link.find('h2');
        var aLi = _link.find('li');
        oH2.animate({
            opacity : 0,
            top: -185});
        aLi.each(function(index, el) {
            $(this).animate({
                opacity : 0,
                left: 473,
                top: 0});
        });
        bOff = true;
    };
    var Merit = function(){};
    Merit.prototype = {
        init  : function(){
            this.win = $(window);
            this.body = $('body');
            this.imgLoading();
            this.setHeight();
            this.bindEvent();
            this.create();
        },
        create : function(){    //创建集合
            core.create();
            protect.create();
            operate.create();
            filter.create();
            fee.create();
            app.create();
            diff.create();
            link.create();
            this.sidenav_create();
        },
        logingHide : function(){
            $loading.fadeOut();
            this.listEvent(iNum);
            iNum = 1;
        },
        sidenav_create : function(){
            var side = $('#j-sidenav'),
                data = [
                    {
                        name : '三大核心优势',
                        index : 0
                    },
                    {
                        name : '五大线上靠谱保障',
                        index : 4
                    },
                    {
                        name : '第三方监理服务具体如何运作',
                        index : 10
                    },
                    {
                        name : '我们如何筛选设计师',
                        index : 12
                    },
                    {
                        name : '为什么要收取设计费',
                        index : 17
                    },
                    {
                        name : '七大装修工序全程一手掌握',
                        index : 19
                    },
                    {
                        name : '简繁家对比传统装修',
                        index : 27
                    },
                    {
                        name : '辅材品牌圈',
                        index : 29
                    }
                ];
            var _this = this;
            var arr = [
                '<div class="line"></div>',
                '<ul>'
            ];
            _.forEach(data,function(v,k){
                arr.push('<li data-index="'+v.index+'"><div class="circle"><div></div></div><p>'+v.name+'</p><span>'+v.name+'</span></li>')
            })
            arr.push('</ul>');
            side.html(arr.join('')).hide();
            this.sidenav_event();
        },
        sidenav_event : function(){
            var side = $('#j-sidenav');
            var _this = this;
            var aLi = side.find('li');
            aLi.each(function(index, el) {
                var $this = $(this);
                var oSpan = $this.find('span');
                $this.on('click',function(){
                    if(bOff){
                        $this.removeClass('hover');
                        _this.sidenav_move($this.index());
                        oSpan.css({'marginTop':0});
                        iNum = $this.data('index');
                        _this.listEvent(iNum);
                    }
                });
                _this.sidenav_hover($this);
            });
        },
        sidenav_move : function(num){
            var side = $('#j-sidenav');
            var aLi = side.find('li');
            aLi.stop().animate({marginTop: 50});
            aLi.eq(num).stop().animate({marginTop: 70});
            aLi.eq(num).addClass('active').siblings().removeClass('active');
        },
        sidenav_hover : function($this){
            var oSpan = $this.find('span');
            $this.on('mouseenter',function(){
                if(!$this.hasClass('active')){
                    oSpan.css('marginTop',-oSpan.height()/2);
                    $this.addClass('hover');
                }
            }).on('mouseleave',function(){
                $this.removeClass('hover');
                oSpan.css({'marginTop':0});
            })
        },
        setHeight : function(){   //设计高度
            var _this = this;
            this.getHeight();
            this.win.on('resize',function(){
                _this.throttle(function(){
                    _this.getHeight();
                },{context : _this})
            })
        },
        getHeight : function(){
            if(this.win.height() < 900){
                this.body.height(900)
            }
        },
        transitionIn : function(){
            setTimeout(function(){
                $loading.fadeIn();

            }, 500)
        },
        transitionOut : function(fn){
            setTimeout(function(){
                $loading.fadeOut();
            }, 500)
        },
        show : function(num){
            $content.find('.section').removeClass('active');
            $content.find('.section'+num).addClass('active');
        },
        bindEvent : function(){    //事件列表
            this.WheelEvent();
        },
        listEvent : function(num){    //事件列表\
            var _this = this;
            switch(num){
                case 0:
                    core.coreMoveIn();
                    this.sidenav_move(0);
                    this.show(1);
                    break;
                case 1:
                    core.coreMove(1);
                    break;
                case 2:
                    core.coreMove(2);
                    break;
                case 3:
                    core.coreMove(3);
                    break;
                case 4:
                    core.coreMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(1);
                        _this.show(2);
                        protect.protectMoveIn();
                    }, 1500)
                    break;
                case 5:
                    protect.protectMove(1);
                    break;
                case 6:
                    protect.protectMove(2);
                    break;
                case 7:
                    protect.protectMove(3);
                    break;
                case 8:
                    protect.protectMove(4);
                    break;
                case 9:
                    protect.protectMove(5);
                    break;
                case 10:
                    protect.protectMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(2);
                        _this.show(3);
                        operate.operateIn();
                    }, 1500)
                    break;
                case 11:
                    operate.operateMoveIn();
                    break;
                case 12:
                    operate.operateMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(3);
                        _this.show(4);
                        filter.filterMoveIn();
                    }, 1000)
                    break;
                case 13:
                    filter.filterMove(1);
                    break;
                case 14:
                    filter.filterMove(2);
                    break;
                case 15:
                    filter.filterMove(3);
                    break;
                case 16:
                    filter.filterMove(4);
                    break;
                case 17:
                    filter.filterMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(4);
                        _this.show(5);
                        fee.feeIn();
                    }, 1500)
                    break;
                case 18:
                    fee.feeMoveIn();
                    break;
                case 19:
                    fee.feeMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(5);
                        _this.show(6);
                        app.dotMoveIn();
                    }, 800)
                    break;
                case 20:
                    app.stepMoveIn();
                    break;
                case 21:
                    app.stepMove(2);
                    break;
                case 22:
                    app.stepMove(3);
                    break;
                case 23:
                    app.stepMove(4);
                    break;
                case 24:
                    app.stepMove(5);
                    break;
                case 25:
                    app.stepMove(6);
                    break;
                case 26:
                    app.stepMove(7);
                    break;
                case 27:
                    app.dotMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(6);
                        _this.show(7);
                        diff.diffTitleMove();
                    }, 1500)
                    break;
                case 28:
                    diff.diffMoveIn();
                    break;
                case 29:
                    diff.diffEdgeMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(7);
                        _this.show(8);
                        link.linkMoveIn();
                    }, 1500)
                    break;
                case 30:
                    link.linkMoveOut();
                    setTimeout(function(){
                        _this.sidenav_move(0);
                        _this.show(1);
                        core.coreMoveIn();
                        iNum = 0;
                    }, 1500)
                    break;
            }
        },
        WheelEvent : function(){
            var _this = this;
            $('body').mousewheel(function(event,delta){
                event.stopPropagation();
                event.preventDefault();
                if(!bOff){
                    return ;
                }
                bOff = false;
                _this.throttle(function(){
                    if(delta == -1){
                        _this.listEvent(iNum++)
                    }
                },{context : _this})
            }).unmousewheel(function(){
                console.log('滚动完了')
            })
        },
        throttle  : function(){
            var isClear = arguments[0],fn;
            if(_.isBoolean(isClear)){
                fn = arguments[1];
                fn._throttleID && clearTimeout(fn._throttleID)
            }else{
                fn = isClear;
                param = arguments[1];
                var oP = _.assign({
                    context : null,
                    args : [],
                    time : 300
                },param);
                arguments.callee(true,fn);
                fn._throttleID = setTimeout(function(){
                    fn.apply(oP.context , oP.args)
                }, oP.time)
            }
        },
        imgLoading : function(){
            var _this = this;
            var dirname = '/static/img/';
            var arr = ['merit.png','bg.jpg','core-bg.png','core-ray.png','detail-bg.png','diff-bg.png','diff-edge.png','diff-main.png',
                'dot.png','fee-bg.png','filter-bg.png','filter-ray.png','gem.png','light-circle.png','link1.jpg','link2.jpg','link3.jpg',
                'link4.jpg','link5.jpg','link6.jpg','link7.jpg','link8.jpg','link9.jpg','link10.jpg','link11.jpg','link12.jpg','link13.jpg',
                'link14.jpg','link15.jpg','link16.jpg','link17.jpg','link18.jpg','link19.jpg','link20.jpg','operate-daybg.png','operate-hover.png',
                'operate-icon.png','optical.png','phone1.png','phone2.png','phone-shim.png','protect-bg.png','protect-ray.png','rule.png',
                'screen1-bg.png','shield.png','step-circle.png','step-icon.png'
            ];
            var iNum = 0;
            for(var i=0; i< arr.length; i++){
                var oImg = new Image();
                oImg.onload = function(){
                    this.onload = this.error = null;
                    console.log(iNum)
                    iNum++;
                    console.log(iNum)
                }
                oImg.onerror = function(){
                    iNum++;
                }
                oImg.src = dirname + arr[1];
            }
            // setTimeout(function(){
            //     _this.logingHide();
            //     $('#j-sidenav').fadeIn();
            //     bOff =true;
            //     _this.bindEvent();
            // }, 10000)
        }
    }
    var merit = new Merit();
    merit.init();
});
/**
 * Created by Administrator on 2016/6/3.
 */
