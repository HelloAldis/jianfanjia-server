define(['jquery','cookie'], function($){
  var Search = function(){};
  Search.prototype = {
    init : function(options){
      var self = this;
      this.win = $(window);
      this.doc = $(document);
      this.body = $(document.body);
      $.extend(self.settings = {
        id : '#j-sch',
        urlAPI : [
                {
                    title : '设计师',
                    url   : '/tpl/design/index.html',
                    api   : 'api/v2/web/designer/search'
                },
                {
                    title : '装修美图',
                    url   : '/tpl/mito/index.html',
                    api   : 'api/v2/web/search_beautiful_image'
                }
            ],
        defaults : 0,
        callback : function(){}
      },options || {});
      this.container = $(this.settings.id);
      this.iNum = this.settings.defaults;
      //生成试图显示
      this.create(this.settings.urlAPI);
      this.input = this.container.find('.input');
      //绑定事件
      this.bindEvent();
    },
    create : function(data){
      this.container.empty();
      var self = this;
      var strArr =  ['<form><div class="u-sch-box f-fl">',
              '<div class="u-sch-ds f-fl '+(data.length == 1 ? 'not' : '')+'">',
              '<div class="u-sch-ds-txt">',
                '<span>'+data[this.iNum].title+'</span>',
                '<i class="arrow"></i>',
              '</div>'
              ];
        if(data.length > 1){
          strArr.push('<ul class="u-sch-ds-sel">');
          for (var i = 0,len = data.length; i < len; i++) {
            strArr.push('<li data-uid="'+i+'">'+data[i].title+'</li>');
          }
          strArr.push('</ul>');
        }
        strArr.push('</div>');
        strArr.push('<div class="u-sch-inp f-fl">');
        strArr.push('<input type="text" name="" class="input" value="搜索'+data[this.iNum].title+'" id="" />');
        strArr.push('</div>');
        strArr.push('</div>');
        strArr.push('<button class="u-sch-btn f-fl" type="submit">搜索</button></form>');
        str = strArr.join('');
        this.container.html(str);
    },
    bindEvent : function(){
      var self = this;
      if(this.settings.urlAPI.length > 1){
        this.downSelect();
      }
      this.inputFocus();
      this.submitBtn();
    },
    downSelect : function(){
      var self = this,
        downSelect = this.container.find('.u-sch-ds'),
        oUl = downSelect.find('ul'),
        oSapn = downSelect.find('.u-sch-ds-txt span');
      downSelect.on('click',function(){
        if(!$(this).hasClass('u-sch-us')){
          $(this).addClass('u-sch-us');
        }
      }).on('mouseleave',function(){
        $(this).removeClass('u-sch-us');
      }).delegate('li', 'click', function(event) {
        event.preventDefault();
        oSapn.html($(this).html());
        self.iNum = $(this).data('uid');
        self.input.val('搜索'+$(this).html());
      });
    },
    getInputVal : function(){
      return this.htmlfilter($.trim(this.input.val()));
    },
    inputFocus : function(){
      var inputBox = this.container.find('.u-sch-inp'),
        downSelect = this.container.find('.u-sch-ds'),
        oSapn = downSelect.find('.u-sch-ds-txt span'),
        self = this;
      inputBox.on('mouseenter',function(){
        $(this).addClass('u-sch-inp-focus');
      }).on('mouseleave',function(){
        if(!!self.getInputVal() && self.getInputVal() == '搜索'+oSapn.html()){
          $(this).removeClass('u-sch-inp-focus');
        }
      });
      this.input.on('focus',function(){
        if($(this).val() === '搜索'+oSapn.html()){
          $(this).val('');
        }
      }).on('blur',function(){
        if(self.getInputVal()){
          $(this).val(self.getInputVal());
        }
        if(!self.getInputVal() || self.getInputVal() == '搜索'+oSapn.html()){
          $(this).val('搜索'+oSapn.html());
          inputBox.removeClass('u-sch-inp-focus');
        }
      })
    },
    htmlfilter : function(value,parameter){
        var setthe = {},s,p,n;
        if(parameter != undefined){
          setthe.fhtml = parameter.fhtml || true;
          setthe.fjs = parameter.fjs || false;
          setthe.fcss = parameter.fcss || false;
          setthe.fself = parameter.fself || false;
        }else{
          setthe.fhtml = true;
          setthe.fjs = false;
          setthe.fcss = false;
          setthe.fself = false;
        }
        if(typeof value === 'string'){
          s = value;
        }else if(typeof value === 'object'){
          s = value.value;
          p = value.preplace;
          n = value.nextplace;
        }
        if(!s){
          return s;
        }
        if (!setthe.fhtml && !setthe.fjs && !setthe.fcss && !setthe.fself){
          setthe.fhtml = true;
        }
        if (setthe.fjs){
          s = s.replace(/<\s*script[^>]*>(.|[\r\n])*?<\s*\/script[^>]*>/gi, '');
        }
        if (setthe.fcss){
          s = s.replace(/<\s*style[^>]*>(.|[\r\n])*?<\s*\/style[^>]*>/gi, '');
        }
        if (setthe.fhtml) {
          s = s.replace(/<\/?[^>]+>/g, '');
          s = s.replace(/\&[a-z]+;/gi, '');
          s = s.replace(/\s+/g, '\n');
        }

        if (setthe.fself && typeof value === 'object'){
          s = s.replace(new RegExp(p, 'g'), n);
        }
        return s;
    },
    submitBtn : function(){  //生成按钮
      var submitBtn = this.container.find('form'),
        downSelect = this.container.find('.u-sch-ds'),
        oSapn = downSelect.find('.u-sch-ds-txt span'),
        self = this;
      submitBtn.on('submit',function(){
        if(!!self.getInputVal() && self.getInputVal() != '搜索'+oSapn.html()){
          self.ajax(self.getInputVal());
        }
        return false;
      })
    },
    ajax : function(input){
      var url = this.settings.urlAPI[this.iNum].url;
      if(window.location.href.indexOf(url) == -1){
        window.location.href = url+'?page=1&query='+input
      }
    }
  };
  var User = function(){};
  User.prototype = {
    init : function(options){
      var self = this;
      this.win = $(window);
      this.doc = $(document);
      this.body = $(document.body);
      this.usertype = $.cookie("usertype");
      $.extend(self.settings = {
        id : '#j-user',
        callback : function(){}
      },options || {});
      this.del = '咨询热线：400-8515-167';
      this.container = $(this.settings.id);
      this.container.html('');
      //生成试图显示
      switch(this.usertype){
        case '0' : this.createAdmin();
        break;
        case '1' : this.createOwner();
        break;
        case '2' : this.createDesign();
        break;
        case undefined : this.createDefault();
        break;
        default : this.createDefault();
      }
      //绑定事件
      this.bindEvent();
      this.bindQuit();
    },
    init2 : function(options){
      var self = this;
      this.win = $(window);
      this.doc = $(document);
      this.body = $(document.body);
      this.usertype = $.cookie("usertype");
      $.extend(self.settings = {
        id : '#j-user',
        callback : function(){}
      },options || {});
      this.del = '咨询热线：400-8515-167';
      this.container = $(this.settings.id);
      //绑定事件
      this.bindEvent();
      this.bindQuit();
    },
    createAdmin : function(){
      var arr = [
          '<ul>',
            '<li>'+this.del+'</li>',
            '<li class="line"></li>',
            '<li class="login">',
              '<a href="/jyz/login.html"><span><img src="/static/jyz/img/login-logo.png" alt=""></span>管理员</a>',
              '<div class="user">',
                '<span class="arrow"><i></i></span>',
                '<ul>',
                  '<li><a href="javascript:;" class="quit">退出登录</a></li>',
                '</ul>',
              '</div>',
            '</li>',
          '</ul>'
        ];
      this.container.html(arr.join(''));
    },
    createOwner : function(off){
      var self = this;
      $.ajax({
        url: '/api/v2/web/user_statistic_info',
        type: 'POST',
        dataType: 'json',
        contentType : 'application/json; charset=utf-8'
      }).done(function(res){
        if(res.data != null){
          if(!off){
            self.createInfo(res.data,false);
          }
          self.createOwnerPulldown(res.data);
        }
      }).fail(function(err){
        if(err.status == 403){
          self.createDefault();
        }
      });
    },
    createDesign : function(off){
      var self = this;
      $.ajax({
        url: '/api/v2/web/designer_statistic_info',
        type: 'POST',
        dataType: 'json',
        contentType : 'application/json; charset=utf-8'
      }).done(function(res){
        if(res.data != null){
          if(!off){
            self.createInfo(res.data,true);
          }
          self.createDesignPulldown(res.data);
        }
      }).fail(function(err){
        if(err.status == 403){
          self.createDefault();
        }
      });
    },
    createInfo : function(data,type){
      var arr = [
            '<ul><li>'+this.del+'</li><li class="line"></li><li class="login">',
            '<a href="'+(type ? '/tpl/user/designer.html#/index' : '/tpl/user/owner.html#/index')+'"><span class="u-head u-head-radius">'+(!!data.imageid ? '<img src="/api/v2/web/thumbnail2/24/24/'+data.imageid+'" alt="'+data.username+'">' : '')+'</span>'+data.username+'</a>',
            '<div class="user"></div></li></ul>'
        ];
        this.container.html(arr.join(''));
    },
    createOwnerPulldown : function(data){
      var arr = [
        '<span class="arrow"><i></i></span><ul>',
        '<li><a href="/tpl/user/owner.html#/release">免费发布装修需求</a></li>',
        '<li><a href="/tpl/user/owner.html#/requirementList">装修需求列表'+(!!data.requirement_count ? '<i>'+data.requirement_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/owner.html#/designer/1">我的意向设计师'+(!!data.favorite_designer_count ? '<i>'+data.favorite_designer_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/owner.html#/favorite/1">收藏作品'+(!!data.favorite_product_count ? '<i>'+data.favorite_product_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/owner.html#/notice/list/1?type=4-99">系统通知'+(!!data.platform_message_count ? '<i>'+data.platform_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/owner.html#/remind/list/1?type=7-8-13-9-10">需求提醒'+(!!data.requirement_message_count ? '<i>'+data.requirement_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/owner.html#/comment/1">评论'+(!!data.comment_message_count ? '<i>'+data.comment_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="javascript:;" class="quit">退出登录</a></li>',
        '</ul>'
      ];
      this.container.find('.user').html(arr.join(''));
    },
    createDesignPulldown : function(data){
      var arr = [
        '<span class="arrow"><i></i></span><ul>',
        '<li><a href="/tpl/user/designer.html#/requirementList">装修需求列表'+(!!data.requirement_count ? '<i>'+data.requirement_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/designer.html#/products/1">我的作品'+(!!data.product_count ? '<i>'+data.product_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/designer.html#/favorite/1">收藏作品'+(!!data.favorite_product_count ? '<i>'+data.favorite_product_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/designer.html#/authHeart">认证中心</a></li>',
        '<li><a href="/tpl/user/designer.html#/notice/list/1?type=2-5-6-7-8-9-10-11-12-13-99">系统通知'+(!!data.platform_message_count ? '<i>'+data.platform_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/designer.html#/remind/list/1?type=14-15-16-17-18">需求提醒'+(!!data.requirement_message_count ? '<i>'+data.requirement_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="/tpl/user/designer.html#/comment/1">评论'+(!!data.comment_message_count ? '<i>'+data.comment_message_count+'</i>' : '')+'</a></li>',
        '<li><a href="javascript:;" class="quit">退出登录</a></li>',
        '</ul>'
      ];
      this.container.find('.user').html(arr.join(''));
    },
    createDefault : function(){
      var arr = [
          '<ul>',
            '<li><a href="/tpl/user/login.html">登录</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/tpl/user/reg.html">注册</a></li>',
            '<li class="line"></li>',
            '<li><a href="/tpl/user/designer_reg.html">设计师入驻</a></li>',
            '<li class="line"></li>',
            '<li>'+this.del+'</li>',
          '</ul>'
        ];
      this.container.html(arr.join(''));
    },
    bindQuit : function(){
      var slef = this;
      this.container.delegate('.quit','click',function(ev){
        ev.preventDefault();
        $.ajax({
          url: '/api/v2/web/signout',
          type: 'POST',
          dataType: 'json',
          contentType : 'application/json; charset=utf-8'
        }).done(function(res){
          if(res.msg === "success"){
            window.location.href = "/"
          }
        }).fail(function(err){
          console.log(err)
        })
      });
    },
    bindEvent : function(pageId){
      var self = this,
        timer = null,
        bian = true;
      this.container.delegate('.login','mouseenter',function(ev){
        ev.preventDefault();
        if(bian){
          $(this).find('.user').show().css({'opacity':0}).animate({top: 43,'opacity':1});
        }
      }).delegate('.login','mouseleave',function(ev){
        ev.preventDefault();
        var This = $(this);
        timer = setTimeout(function(){
          This.find('.user').hide().css({'opacity':0,'top':132});
        }, 300);
      }).delegate('.user','mouseenter',function(ev){
        ev.preventDefault();
        clearTimeout(timer);
        bian = false;
      }).delegate('.user','mouseleave',function(ev){
        ev.preventDefault();
        bian = true;
      });
    },
    updateInfo : function(){
      this.container.html('');
      switch(this.usertype){
        case '0' : this.createAdmin();
        break;
        case '1' : this.createOwner();
        break;
        case '2' : this.createDesign();
        break;
        default : this.createDefault();
      }
    },
    updateData : function(){
      this.container.find('.user').html('');
      switch(this.usertype){
        case '0' : this.createAdmin();
        break;
        case '1' : this.createOwner(true);
        break;
        case '2' : this.createDesign(true);
        break;
        default : this.createDefault();
      }
    }
  };
  var Goto = function(){};
  Goto.prototype = {
    init : function(options){
      var self = this;
      this.win = $(window);
      this.doc = $(document);
      this.body = $(document.body);
      $.extend(self.settings = {
        shop : false,
        scroll : true,
        callback : function(){return false;}
      },options || {});
      this.container = $('<div>').attr({
        'id' : '#j-goto',
        'class' : 'g-goto'
      });
      this.usertype = $.cookie("usertype");
      this.create();
      this.getPosition();
      this.setTop();
      this.body.append(this.container);
      this.show();
      this.goto();
      this.addkefu();
      this.hover('.weixin',-70);
      if(this.settings.shop && this.usertype == 1){
        this.getRequirement();
        this.addDesigners();
      }
      if(this.usertype == 1 || this.usertype == undefined){
        $('#j-release').show();
      }
    },
    create : function(){
      this.container.empty();
      var self = this,
        template,
        data = [
          {
            'name' : '我的意向',
            'sclass' : 'add',
            'url'  : '/tpl/user/owner.html#/designer/1',
            'icon' : '&#xe614;',
            'hover' : ''
          },
          {
            'name' : '监理服务',
            'sclass' : 'supervise',
            'url'  : '/zt/supervision/index.html',
            'icon' : '&#xe635;',
            'hover' : '',
          },
          {
            'name' : '装修保障',
            'sclass' : 'protect',
            'url'  : '/tpl/merit/index.html',
            'icon' : '&#xe639;',
            'hover' : ''
          },
          {
            'name' : '关注微信',
            'sclass' : 'weixin',
            'url'  : '',
            'icon' : '&#xe633;',
            'hover' : '<img src="/static/img/public/erweima.jpg" width="160" height="160" />'
          },
          {
            'name' : '联系客服',
            'sclass' : 'kefu',
            'url'  : 'http://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=611886&configID=139921&jid=3699665419',
            'icon' : '&#xe63a;',
            'hover' : ''
          },
          {
            'name' : '回到顶部',
            'sclass' : 'goto',
            'url'  : '',
            'icon' : '&#xe632;',
            'hover' : ''
          }
        ],
        templates = ['<ul>'],
        url = this.usertype == 1 ? data[0].url : '/tpl/user/login.html?'+window.location.href;
        for (var i = 0,len = data.length; i < len; i++) {
          var li;
          if(this.settings.shop && i === 0 && (this.usertype == 1 || this.usertype == undefined)){
            li = '<li><a class="link '+data[i].sclass+'" href="'+url+'"><span></span><i class="iconfont">'+data[i].icon+'</i><strong>'+data[i].name+'</strong></a><div class="hover"><span><i></i></span><div>'+data[i].hover+'</div></div></li>';
          }else{
            if(i === 0){
              continue;
            }
            li = '<li><a class="link '+data[i].sclass+'" href="'+(!!data[i].url ? data[i].url : 'javascript:;')+'" '+(!!data[i].url ? 'target="_blank"' : '')+'><i class="iconfont">'+data[i].icon+'</i><strong>'+data[i].name+'</strong></a><div class="hover"><span><i></i></span><div>'+data[i].hover+'</div></div></li>';
          }
          templates.push(li);
        }
        templates.push('</ul>');
        template =  templates.join('');
        this.container.html(template);
    },
    setTop : function(){
      var top = (this.win.height() - this.container.height())/2;
          this.container.css({'top':top});
    },
    getPosition : function(){
      var left,
          right,
          width = this.win.width();
          if(width > 1280){
            left = (width - 1200)/2 + 1200 +20;
            right = 'auto';
          }else{
            right = 0;
            left = 'auto';
          }
        this.container.css({
          left : left,
          right : right
        });
    },
    goto : function(){
      this.container.find('.goto').on('click',function(){
          $('html,body').animate({scrollTop: 0}, 500);
          return false;
        });
    },
    show : function(){
      var self = this;
      if(this.settings.scroll){
        self.container.show();
      }else{
        var height = 800 //this.win.height();
        $(window).on('scroll',function(){
          if($(this).scrollTop() > height){
            self.container.fadeIn(500);
          }else{
            self.container.fadeOut(500);
          }
        });
      }
    },
    offset : function(offset){
      return {
        left : parseFloat(this.container.css('left')),
        top : parseFloat(this.container.css('top'))
      }
    },
    getRequirement : function(){
      var self = this;
      $.ajax({
        url: '/api/v2/web/user_my_requirement_list',
        type: 'POST',
        contentType : 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(function(res) {
        if(res.data.length > 0){
          self.setRequirement(res.data);
          self.hover('.add',-80);
        }
      }).fail(function(err){
        console.log(err)
      });
    },
    setRequirement : function(data){
      var self = this,
        $add = this.container.find('.add'),
        sibling = $add.siblings('.hover').find('div'),
        sUl = ['<ul>'],
        str;
        for (var i = 0, len = data.length; i < len; i++) {
          str = '<li><a title="'+(!!data[i].basic_address ? data[i].basic_address : '')+(!!data[i].detail_address ? data[i].detail_address : '')+'" href="/tpl/user/owner.html#/requirement/'+data[i]._id+'/booking"><span><i class="iconfont2">&#xe61f;</i><strong>'+(!!data[i].basic_address ? data[i].basic_address : '')+(!!data[i].detail_address ? data[i].detail_address : '')+'</strong></span><span><time>'+this.format(data[i].create_at,'yyyy/MM/dd hh:mm:ss')+'</time><span></a></li>';
          sUl.push(str);
        }
        sUl.push('</ul>');
        sibling.html(sUl.join(''));
    },
    addDesigners : function(){
      var self = this,
        $Span = this.container.find('.add').find('span');
      $.ajax({
        url: '/api/v2/web/favorite/designer/list',
        type: 'POST',
        contentType : 'application/json; charset=utf-8',
        dataType: 'json',
        data : JSON.stringify({
           "from": 0,
           "limit":10
        }),
        processData : false
      }).done(function(res) {
        $Span.html(res.data.total);
      }).fail(function(err){
        console.log(err)
      });
    },
    format : function(date,format){
      var time = new Date(date),
        o = {
          "M+" : time.getMonth()+1, //month
          "d+" : time.getDate(), //day
          "h+" : time.getHours(), //hour
          "m+" : time.getMinutes(), //minute
          "s+" : time.getSeconds(), //second
          "q+" : Math.floor((time.getMonth()+3)/3), //quarter
          "S" : time.getMilliseconds() //millisecond
        };
      if(/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
      }
      return format;
    },
    hover : function(obj,top){
      var self = this,
        $add = this.container.find(obj),
        parent = $add.closest('li'),
        sibling = $add.siblings('.hover'),
        timer = null,
        bian = true;
      parent.on('mouseenter',function(){
        if(bian){
          $(this).find('.hover').show().css({'opacity':0}).animate({top: top,'opacity':1});
        }
      }).on('mouseleave',function(){
        var This = $(this);
        timer = setTimeout(function(){
          This.find('.hover').hide().css({'opacity':0,'top':0});
        }, 300);
      });
      sibling.on('mouseenter',function(){
        clearTimeout(timer);
        bian = false;
      }).on('mouseleave',function(){
        bian = true;
      });
    },
    addkefu : function(){
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-45900898-17']);
       _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
       })();
    }
  };
  return {
    Search : Search,
    User : User,
    Goto : Goto
  }
});
