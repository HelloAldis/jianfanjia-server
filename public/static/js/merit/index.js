require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
})
require(['jquery','lodash'],function($,_){
    var $content = $('#j-content');
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
        }
    };
    core.create = function(){
        var _this = this;
        var core = this.section;
        var dot = this.section.find('.dot');
        _this.coreMove(1)
    }
    core.coreMoveIn = function(){

    },
    core.coreMoveOut = function(){

    },
    core.coreMove = function(num){
        var _this = this;
        var core = this.section;
        var oH2 = core.find('h2');
        var main = core.find('.main');
        var detail = core.find('.detail');
        var gem = core.find('.gem');
        var ray = core.find('.ray'+num);
        var aH3 = core.find('.adv'+num);
        main.addClass('opacity');
        var arr = [];
        oH2.stop().fadeOut();
        gem.stop().fadeOut();
        _.forEach(_this.data[num], function(v,k) {
            if(_this.data[num].length == 1){
                arr.push('<p>'+v+'</p>')
            }else{
                arr.push('<p>'+(k+1)+'，'+v+'</p>')
            }
        })
        detail.find('.txt').html(arr.join(''));
        aH3.addClass('adv').stop().animate({left:0,top:0,width:100+'%',fontSize:60,opacity:1},function(){
            ray.stop().fadeIn();
        });
        detail.show().stop().animate({top:144,opacity:1});
    },
    core.create();
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
        }
    };

    //s3 第三方监理服务具体如何运作
    var operate = {
        section : $content.find('.section3'),
        data : [
            {
                day : '01',
                name : '开工',
                bz : ['一、三方（业主、设计师和项目经理、平台监理方）见面，交换联系方式；','二、设计方案交底；','三、工期安排交底。'],
                gj : ['一、三方（业主、设计师和项目经理、平台监理方）见面，交换联系方式；','二、设计方案交底；','三、工期安排交底。']
            },
            {
                day : '03',
                name : '水电材料进场',
                bz : [],
                gj : ['一、材料验收；','二、施工及验收要求交底；','三、布线需求交底。']
            },
            {
                day : '12',
                name : '水电验收',
                bz : ['一、根据《水电验收标准》验收。'],
                gj : ['一、根据《水电验收标准》验收。']
            },
            {
                day : '16',
                name : '泥木材料进场',
                bz : [],
                gj : ['一、材料验收；','二、施工及验收要求交底。']
            },
            {
                day : '18',
                name : '防水验收',
                bz : ['一、根据《防水验收标准》验收。'],
                gj : ['一、根据《防水验收标准》验收。']
            },
            {
                day : '20',
                name : '泥工巡检',
                bz : [],
                gj : ['一、检查是否存在错贴、误贴；','二、检查是否存在空鼓、颜色搭配等问题；','三、成品报护及现场卫生处理。']
            },
            {
                day : '24',
                name : '泥工验收',
                bz : [],
                gj : ['一、根据《泥工验收标准》验收。']
            },
            {
                day : '32',
                name : '吊顶验收',
                bz : [],
                gj : ['一、根据《木工验收标准》验收。']
            },
            {
                day : '34',
                name : '木作巡检',
                bz : [],
                gj : ['一、检查是否根据图纸要求施工；','二、检查木作施工中是否存在不规范的操作；','三、成品保护及现场卫生处理。']
            },
            {
                day : '36',
                name : '木作验收',
                bz : ['一、根据《泥木工程验收标准》验收。'],
                gj : ['一、根据《泥木工程验收标准》验收。']
            },
            {
                day : '37',
                name : '油漆材料进场',
                bz : [],
                gj : ['一、材料验收；','一、材料验收；']
            },
            {
                day : '42',
                name : '油漆基础处理',
                bz : [],
                gj : ['一、检查墙面接缝处理情况；','二、检查墙面基层有无空鼓；','二、检查墙面基层有无空鼓；']
            },
            {
                day : '46',
                name : '油漆验收',
                bz : ['一、根据《油漆验收标准》验收；'],
                gj : ['一、根据《油漆验收标准》验收；']
            },
            {
                day : '58',
                name : '安装验收',
                bz : ['一、根据《安装验收标准》验收；'],
                gj : ['一、根据《安装验收标准》验收；']
            },
            {
                day : '60',
                name : '竣工验收',
                bz : ['一、根据《竣工验收标准》验收。'],
                gj : ['一、根据《竣工验收标准》验收。']
            }
        ]
    };
    operate.create = function(){
        var _this = this;
        var operate = this.section;
        var arr = [
            '<header>',
                '<span class="arrow1"></span>',
                '<span class="arrow2"></span>',
                '<span class="arrow3"></span>',
                '<h2>第三方监理服务具体如何运作</h2>',
                '<p>“简繁家”引入第三方监理服务，和传统装修公司相比，该监理服务绝不会走过场，认真检验、核对每个施工节点，保证装修按时、按质完成，并且不再需要业主每天亲自跑工地，为业主节约了大量的时间和精力。“简繁家”提供了标准型和管家型两种监理服务，它们是具体是如何运作的，两者之间有哪些区别呢？</p>',
            '</header>',
            '<ul></ul>'
        ];
        operate.html(arr.join(''));
        this.operateCreate(operate);
        this.operateMoveIn();
        setTimeout(function(){
            _this.operateMoveOut();
        }, 3000)
    }
    operate.operateCreate = function(operate){
        var _this = this;
        var oUl = operate.find('ul');
        arr = [];
        _.forEach(_this.data, function(v, k) {
            var strBz = '';
            var strGj = '';
            _.forEach(v.bz, function(m) {
                strBz += '<p>'+m+'</p>'
            })
            _.forEach(v.gj, function(n) {
                strGj += '<p>'+n+'</p>'
            })
            var temp = [
                '<li data-left="'+(k%5*231)+'" data-top="'+(Math.floor(k/5)*226)+'">',
                    '<div class="tags">',
                        '<span>DAY</span>',
                        '<h3>'+v.day+'</h3>',
                        '<p>'+v.name+'</p>',
                    '</div>',
                    '<div class="hover '+(k%5 == 3 || k%5 == 4 ? 'right' : 'left')+'">',
                        '<dl>',
                            '<dt>标准监理</dt>',
                            '<dd>'+strBz+'</dd>',
                        '</dl>',
                        '<dl>',
                            '<dt>管家监理</dt>',
                            '<dd>'+strBz+'</dd>',
                        '</dl>',
                    '</div>',
                '</li>'
            ]
            arr.push(temp.join(''));
        });
        oUl.html(arr.join(''));
    }
    operate.operateMoveIn = function(){   //入场
        var operate = this.section;
        var oHeader = operate.find('header');
        var aLi = operate.find('li');
        oHeader.find('p,span').fadeOut();
        oHeader.find('h2').stop().animate({fontSize: 46});
        oHeader.animate({
            top: 150,height:100},function(){
                aLi.each(function(index, el) {
                    $(this).stop().animate({
                    opacity : 1,
                    left: parseInt($(this).data('left')),
                    top: parseInt($(this).data('top'))});
                });
            }).addClass('step');
        aLi.each(function(index, el) {
            $(this).on('mouseenter',function(){
                var This = $(this);
                $(this).attr('class','active');
                $(this).find('dl').hide();
                $(this).find('.left').stop().animate({
                    opacity : 1,
                    width: 678},function(){
                        $(this).find('dl').hide();
                        $(this).find('dl').stop().fadeIn();
                    });
                $(this).find('.right').stop().animate({
                    opacity : 1,
                    marginLeft : -462,
                    width: 678},function(){
                        $(this).find('dl').stop().fadeIn();
                    });
            }).on('mouseleave',function(){
                $(this).attr('class','');
                $(this).find('dl').stop().fadeOut();
                $(this).find('.left').stop().animate({
                    opacity :0,
                    width: 0});
                $(this).find('.right').stop().animate({
                    opacity : 1,
                    marginLeft : 216,
                    width: 0});
            })
        });
    }
    operate.operateMoveOut = function(){    //出场
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
    }
    operate.create();
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
        }
    };
    filter.create = function(){

    }
    filter.create();
    //s5 为什么要收取设计费
    var fee = {
        section : $content.find('.section7')
    }
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
        this.feeMoveIn();
        setTimeout(function(){
            _this.feeMoveOut();
        }, 3000)
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
                    aItem1.find('p').stop().animate({left:-300,opacity : 1})
                })
                aItem2.find('.black').stop().animate({left:152,opacity : 1},800,function(){
                    aItem2.find('.dot').stop().fadeIn();
                    aItem2.find('p').stop().animate({left:370,opacity : 1})
                })
                aItem3.find('.black').stop().animate({left:-20,top:111,opacity : 1},1000,function(){
                    aItem3.find('.dot').stop().fadeIn();
                    aItem3.find('p').stop().animate({left:-290,opacity : 1})
                })
            }).addClass('step');
    },
    fee.feeMoveOut = function(){
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
        aItem1.find('p').stop().animate({left:-350,opacity : 0})
        aItem1.find('.black').stop().animate({left:0,top:-35,opacity : 0})
        aItem2.find('.dot').stop().fadeOut();
        aItem2.find('p').stop().animate({left:420,opacity :0})
        aItem2.find('.black').stop().animate({left:165,opacity : 0})
        aItem3.find('.dot').stop().fadeOut();
        aItem3.find('p').stop().animate({left:-330,opacity : 0})
        aItem3.find('.black').stop().animate({left:-40,top:131,opacity : 0})
        oMain.stop().fadeOut();
        fee.find('span').stop().fadeOut();
    },
    fee.create();
    //s6 7大装修工序全程一手掌握
    var app = {
        section : $content.find('.section6')
    };
    app.create = function(){
        var _this = this
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
            ],
            posDot = [
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
            posName = [
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
            ];
            _.forEach(posDot,function(v,k){
                arr.push('<span data-index="'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" class="dot dot'+(k+1)+'"></span>')
            });
            _.forEach(posName,function(v,k){
                arr.push('<h3 class="adv'+(k+1)+'" data-left="'+v.left+'" data-top="'+v.top+'" style="left:'+v.oL+'px;top:'+v.oT+'px;">'+v.name+'</h3>')
            })
            this.section.html(arr.join(''));
            app.dotMoveIn();
            setTimeout(function(){
                app.stepMoveIn();
            }, 3000)
    };
    app.dotMoveIn = function(){
        var _this = this,
            dot = this.section.find('.dot'),
            oH2 = this.section.find('h2'),
            bg = this.section.find('.bg'),
            icon = this.section.find('.icon'),
            app = this.section.find('.app');
            oH2.fadeIn(500);
            icon.fadeIn(800);
            bg.delay(300).fadeIn(300);
            app.delay(500).fadeIn(400);
            dot.each(function(index, el) {
                var $this = $(this),
                    index = $this.data('index'),
                    left = parseInt($this.data('left')),
                    top = parseInt($this.data('top')),
                    adv = _this.section.find('h3.adv'+index),
                    advL = parseInt(adv.data('left')),
                    advT = parseInt(adv.data('top'));
                $this.stop().animate({left:left,top:top,opacity:1},function(){
                    adv.stop().animate({left:advL,top:advT,opacity:1})
                });
            });
    };
    app.stepMove = function(num){
        var _this = this,
            bg = this.section.find('.bg'),
            stepIcon = this.section.find('.step-icon');
            stepIcon.show();
            stepIcon.stop().animate({top:377,opacity:0}).css('top',209)
            stepIcon.addClass('step-icon'+num).stop().animate({top:256,opacity:1} ,function(){
                bg.addClass('bg'+num);
                _.forEach(arr,function(v,k){
                    if(k < num){
                        _this.section.find('.dot'+(k+1)).addClass('flash');
                        _this.section.find('.adv'+(k+1)).addClass('adv');
                    }
                });
            });
    };
    app.stepMoveIn = function(){
        var _this = this,
            dot = this.section.find('.dot'),
            oH2 = this.section.find('h2'),
            icon = this.section.find('.icon'),
            optical = this.section.find('.optical'),
            shim = this.section.find('.app-shim');
            bg = this.section.find('.bg'),
            lightCircle = this.section.find('.light-circle'),
            app = this.section.find('.app');
        app.stop().animate({top:400,opacity:0},function(){
            app.addClass('app1').delay(300).animate({top:388,opacity:1});
            shim.delay(600).stop().show().animate({top:377,opacity:1},function(){
                optical.stop().animate({top:246,height:163} ,function(){
                    lightCircle.stop().fadeIn();
                    _this.stepMove(7);
                });
            });

        });
        oH2.addClass('step').stop().animate({top:366,fontSize:38},function(){
            icon.fadeOut(300);
        });
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
    }
    diff.create = function(){
        var diff = this.section;
        var arr = [
            '<h2 class="title">简繁家对比传统装修</h2>',
            '<div class="main"></div>',
            '<div class="bg"></div>'
        ];
        diff.html(arr.join(''));
        var diffBg = diff.find('.bg');
        var diffTt = diff.find('h2');
        var diffMain = diff.find('.main');
        this.diffTitleMove(diffTt,diffMain);
        this.diffBgCreate(diffBg);
        //this.diffCreate(diff)
        this.diffEdgeCreate(diffMain);
    };
    diff.diffTitleMove = function(diffTt,diffMain){
        var _this = this;
        diffTt.animate({
            opacity : 1,
            top: 50+'%'},function(){
                _this.diffEdgeMoveIn(diffTt,diffMain);
            });
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
   diff.diffEdgeMove = function(diffMain){
        var iNum = 0;
        var body = diffMain.find('.body');
        var edge = diffMain.find('.edge');
        var time = null;
        move();
        diffMain.addClass('active');
        function move(){
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
        }
        edge.each(function(index, el) {
            $(this).on('mouseenter',function(){
                iNum = $(this).data('index');
                move();
                clearTimeout(time);
            }).on('mouseleave',function(){
                clearTimeout(time);
                time = setTimeout(function(){
                    iNum = 0;
                    move();
                }, 2000)
            });
        });
    }
    diff.diffEdgeMoveIn = function(diffTt,diffMain){
        var _this = this;
        var edge = diffMain.find('.edge');
        edge.each(function(index, el) {
            $(this).animate({
            opacity : 1,
            left: parseInt($(this).data('left')),
            top: parseInt($(this).data('top'))});
        });
        setTimeout(function(){
            diffTt.fadeOut();
            _this.diffEdgeMove(diffMain);
        }, 2000)
    }
    diff.diffEdgeMoveOut = function(diffMain){
        var edge = diffMain.find('.edge');
        edge.each(function(index, el) {
            $(this).animate({
            opacity : 0,
            left: 124,
            top: 107});
        });
    }
    diff.diffBgCreate = function(obj){
        var _this = this,
            str = '';
        _.forEach(_this.pos, function(v, k) {
            str += '<div style="left:'+v.left+'px;top:'+v.top+'px;"></div>'
        });
        obj.hide().html(str).fadeIn();
    }
    diff.create();
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
        _this.linkMoveIn();
    },
    link.linkMoveIn = function(){   //入场
        var link = this.section;
        var oH2 = link.find('h2');
        var aLi = link.find('li');
        oH2.animate({
            opacity : 1,
            top: 0});
        aLi.each(function(index, el) {
            $(this).animate({
            opacity : 1,
            left: parseInt($(this).data('left')),
            top: parseInt($(this).data('top'))});
        });
    },
    link.linkMoveOut = function(){    //出场
        var link = this.content.find('.section8');
        var oH2 = link.find('h2');
        var aLi = link.find('li');
        oH2.animate({
            opacity : 0,
            top: -185});
        aLi.each(function(index, el) {
            $(this).animate({
            opacity : 0,
            left: 473,
            top: 0});
        });
    }
    link.create();
    var Merit = function(){};
    Merit.prototype = {
        init  : function(){
            this.win = $(window);
            this.body = $('body');
            if(this.win.height() > 980){
                this.body.height(980)
            }
            //this.link();
           //this.diff();
            //this.operate();
            //this.fee();
            //this.core();
        },
        create : function(){    //创建集合
            app.create();
        },
        bindEvent : function(){    //事件列表

        },
        listEvent : function(num){    //事件列表
            return [1][num]
        }
    }
    var merit = new Merit();
    merit.init();

});
