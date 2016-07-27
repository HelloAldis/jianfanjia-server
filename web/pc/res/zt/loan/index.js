!function(a,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t(require,exports,module):a.CountUp=t()}(this,function(a,t,n){var e=function(a,t,n,e,i,r){for(var o=0,s=["webkit","moz","ms","o"],m=0;m<s.length&&!window.requestAnimationFrame;++m)window.requestAnimationFrame=window[s[m]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[s[m]+"CancelAnimationFrame"]||window[s[m]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a,t){var n=(new Date).getTime(),e=Math.max(0,16-(n-o)),i=window.setTimeout(function(){a(n+e)},e);return o=n+e,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});var u=this;u.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null};for(var l in r)r.hasOwnProperty(l)&&(u.options[l]=r[l]);""===u.options.separator&&(u.options.useGrouping=!1),u.options.prefix||(u.options.prefix=""),u.options.suffix||(u.options.suffix=""),u.d="string"==typeof a?document.getElementById(a):a,u.startVal=Number(t),u.endVal=Number(n),u.countDown=u.startVal>u.endVal,u.frameVal=u.startVal,u.decimals=Math.max(0,e||0),u.dec=Math.pow(10,u.decimals),u.duration=1e3*Number(i)||2e3,u.formatNumber=function(a){a=a.toFixed(u.decimals),a+="";var t,n,e,i;if(t=a.split("."),n=t[0],e=t.length>1?u.options.decimal+t[1]:"",i=/(\d+)(\d{3})/,u.options.useGrouping)for(;i.test(n);)n=n.replace(i,"$1"+u.options.separator+"$2");return u.options.prefix+n+e+u.options.suffix},u.easeOutExpo=function(a,t,n,e){return n*(-Math.pow(2,-10*a/e)+1)*1024/1023+t},u.easingFn=u.options.easingFn?u.options.easingFn:u.easeOutExpo,u.formattingFn=u.options.formattingFn?u.options.formattingFn:u.formatNumber,u.version=function(){return"1.7.1"},u.printValue=function(a){var t=u.formattingFn(a);"INPUT"===u.d.tagName?this.d.value=t:"text"===u.d.tagName||"tspan"===u.d.tagName?this.d.textContent=t:this.d.innerHTML=t},u.count=function(a){u.startTime||(u.startTime=a),u.timestamp=a;var t=a-u.startTime;u.remaining=u.duration-t,u.options.useEasing?u.countDown?u.frameVal=u.startVal-u.easingFn(t,0,u.startVal-u.endVal,u.duration):u.frameVal=u.easingFn(t,u.startVal,u.endVal-u.startVal,u.duration):u.countDown?u.frameVal=u.startVal-(u.startVal-u.endVal)*(t/u.duration):u.frameVal=u.startVal+(u.endVal-u.startVal)*(t/u.duration),u.countDown?u.frameVal=u.frameVal<u.endVal?u.endVal:u.frameVal:u.frameVal=u.frameVal>u.endVal?u.endVal:u.frameVal,u.frameVal=Math.round(u.frameVal*u.dec)/u.dec,u.printValue(u.frameVal),t<u.duration?u.rAF=requestAnimationFrame(u.count):u.callback&&u.callback()},u.start=function(a){return u.callback=a,u.rAF=requestAnimationFrame(u.count),!1},u.pauseResume=function(){u.paused?(u.paused=!1,delete u.startTime,u.duration=u.remaining,u.startVal=u.frameVal,requestAnimationFrame(u.count)):(u.paused=!0,cancelAnimationFrame(u.rAF))},u.reset=function(){u.paused=!1,delete u.startTime,u.startVal=t,cancelAnimationFrame(u.rAF),u.printValue(u.startVal)},u.update=function(a){cancelAnimationFrame(u.rAF),u.paused=!1,delete u.startTime,u.startVal=u.frameVal,u.endVal=Number(a),u.countDown=u.startVal>u.endVal,u.rAF=requestAnimationFrame(u.count)},u.printValue(u.startVal)};return e});
;(function($){
    var Select = function(element,options){
        this.init(element,options);
    }
    Select.VERSION = '1.0.0';
    Select.DEFAULTS = {
        type : 'defaults',
        selector : 'k-select',
        animation: true,
        query : '',
        data : [],
        trigger: 'hover focus',
        delay: 500,
        html: false,
        select : function(){}
    }
    /**
     * [init 初始化]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Select.prototype.init = function(element,options) {
        this.$element  = $(element);
        this.options   = this._getOptions(this.$element,options);
        this.$element.addClass(this.options.selector);
        this.query = this.options.query;
        this.oUl = null;
        this._render(this.options);
        this._bindEvent(this.options);
    };
    /**
     * [getOptions 配置参数]
     * @param  {[String]} options   [接收参数]
     * @return {[Object]}           [配置参数]
     */
    Select.prototype._getOptions = function (element,option) {
        return $.extend({}, this.getDefaults(), element.data(), option);
    }
    /**
     * [getOptions 默认参数]
     * @return {[Object]}           [默认参数]
     */
    Select.prototype.getDefaults = function () {
        return Select.DEFAULTS;
    }
    Select.prototype._render = function(option){
        this.oUl = $('<ul class="select"></ul>');
        var length = option.data.length;
        if(!!length){
            var sLi = '';
            switch(option.type){
                case 'defaults' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i].id ? 'active' : '')+'" data-key="'+option.data[i].id+'">'+option.data[i].name+'</li>';
                    }
                    break;
                case 'getKey' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i][1] ? 'active' : '')+'"  data-key="'+option.data[i][0]+'">'+option.data[i][1]+'</li>';
                    }
                    break;
                case 'getValue' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i] ? 'active' : '')+'" >'+option.data[i]+'</li>';
                    }
                    break;
                case 'editor' :
                    for (var i = 0; i < length; i++) {
                        sLi += '<li class="'+(option.query == option.data[i].name ? 'active' : '')+'" >'+option.data[i].name+'</li>';
                    }
                    break;
            }
            this.oUl.html(sLi);
        }
        this.$element.append(this.oUl);
        if(option.type === 'editor'){
            option = '<div class="editor"><input class="value" value="'+option.query+'"><span class="arrow"><em></em><i></i></span></div>';
        }else{
            var value = '';
            switch(option.type){
                case 'defaults' :
                    value = option.data[option.query].name;
                    break;
                case 'getKey' :
                    value = option.data[option.query][1];
                    break;
                case 'getValue' :
                    value = option.query;
                    break;
            }
            option = '<div class="option"><span class="value">'+ value +'</span><span class="arrow"><em></em><i></i></span></div>';
        }
        this.$element.append(option);
        this.value = this.$element.find('.value');
    }
    Select.prototype._bindEvent = function(option){
        var _this = this;
        var timer = null;
        this.$element.on('click',function(){
            _this._show();
        }).on('mouseleave',function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                _this._hide();
            },option.delay);
        }).on('mouseenter',function(){
            clearTimeout(timer);
        });
        switch(option.type){
            case 'defaults' : this._defaults(this.$element);
                break;
            case 'getKey' : this._getKey(this.$element);
                break;
            case 'getValue' : this._getValue(this.$element);
                break;
            case 'editor' : this._editor(this.$element);
                break;
        }
    }
    Select.prototype._show = function(){
        $('.'+this.options.selector).find('.select').hide();
        this.oUl.show();
        this.$element.css('zIndex',20);
    }
    Select.prototype._hide = function(){
        var _this = this;
        setTimeout(function(){
            _this.oUl.hide();
            _this.$element.css('zIndex',2);
        },0);
    }
    Select.prototype._defaults = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).data('key');
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._getKey = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).data('key');
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._getValue = function(element){
        var _this = this;
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).html();
            _this.value.html($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
    }
    Select.prototype._editor = function(element){
        var _this = this;
        var oldName = '';
        element.on('click','li',function(){
            $(this).addClass('active').siblings().removeClass('active');
            _this.query = $(this).html();
            _this.value.val($(this).html());
            _this._hide();
            _this.options.select($(this));
        });
        element.on('focus','.value',function(){
            oldName = $(this).val();
            _this._show();
        }).on('blur','.value',function(){
            if(!$.trim($(this).val())){
                _this.query = oldName;
                $(this).val(oldName);
            }else{
                if(_this.options.html){
                    _this.query = htmlfilter($(this).val());
                }else{
                    _this.query = $.trim($(this).val());
                }
                $(this).val($.trim($(this).val()))
            }
            _this._hide();
            _this.options.select($(this));
        })
        function htmlfilter(value,parameter){
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
        }
    }
    Select.prototype.returnValue = function(){
        return this.query;
    }
    /**
     * [destroy 销毁组件]
     */
    Select.prototype.destroy = function(){
        this.$element.empty();
    }
    window["Select"] = Select;
})($);
;(function($){
    function Placeholder(options){
        var self = this;
        this.settings = {
            id : null,
            className : 'label-placeholder'
        }
        $.extend(this.settings,options || {});
        this.element = $(this.settings.id);
        this.bOff = false;
        this.placeholder = this.element.attr('placeholder');
        this.typeArr = ['input','textarea'];
        if(this.placeholder && this.verify()){
            this.create()
        }
    }
    Placeholder.prototype = {
        verify : function(value){
            this.bOff = (!('placeholder' in document.createElement('input')));
            this.bOff = (!('placeholder' in document.createElement('textarea')));
            return this.bOff
        },
        create : function(){
            var self = this;
            // 文本框ID
            var elementId = self.element.attr('id');
            if (!elementId) {
                var now = new Date();
                elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
                self.element.attr('id', elementId);
            }
            // 添加label标签，用于显示placeholder的值
            var $label = $('<label>', {
                html: self.element.val() ? '' : this.placeholder,
                'for': elementId
            }).insertAfter(self.element).attr('class', 'label-placeholder');

            // 绑定事件
            var _resetPlaceholder = function () {
                if (!!self.element.val()) {
                    $label.hide();
                }else{
                    $label.show();
                }
            }
            $label.on('click',function(){
                self.element.focus();
            })
            self.element.on('focus blur input keyup propertychange resetplaceholder', _resetPlaceholder);
        }
    }
    window["Placeholder"] = Placeholder;
})($);
var Shortcut = function(id){
    this.init(id);
};
Shortcut.prototype = {
    init : function(id){
        this.container = $(id);
        this.bind();
        this.ConsentAgreement = true;
        this.agree();
        this.error = $('#error-info');
    },
    reset: function () {
        this.container.find('.input').val('');
        this.container.find('.item').removeClass('focus error');
        this.error.html('').addClass('hide');
    },
    verify : {
        isMobile : function(mobile){
            return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
        }
    },
    errmsg : {
        'empty': '不能为空',
        'mobile' : '手机号不正确',
        'submit' : '您的称呼或手机号不正确'
    },
    'check': {
        'phone': function(obj) {
            var $phone = $('#design-phone');
            var val = $phone.val();
            var parents = $phone.parents('.item');
            if (!$.trim(val)){
                parents.removeClass('focus').addClass('error');
                obj.error.html(obj.errmsg.empty).removeClass('hide');
                return false;
            }else if (!obj.verify.isMobile(val)){
                parents.removeClass('focus').addClass('error');
                obj.error.html(obj.errmsg.mobile).removeClass('hide');
                return false;
            }else{
                parents.removeClass('focus error');
                obj.error.html('').addClass('hide');
                return true;
            }
        },
        'name': function(obj) {
            var $name = $('#design-name');
            var val = $name.val();
            var parents = $name.parents('.item');
            if (!$.trim(val)){
                parents.removeClass('focus').addClass('error');
                obj.error.html(obj.errmsg.empty).removeClass('hide');
                return false;
            }else{
                parents.removeClass('focus error');
                obj.error.html('').addClass('hide');
                return true;
            }
        }
    },
    agree: function() {
        var _this = this;
        $('#design-phone').on('focus',function(){
            $(this).parents('.item').removeClass('error').addClass('focus');
        }).on('blur',function(){
            _this.check.phone(_this);
        });
        $('#design-name').on('focus',function(){
            $(this).parents('.item').removeClass('error').addClass('focus');
        }).on('blur',function(){
            _this.check.name(_this);
        });
    },
    bind : function() {
        var _this = this;
        $(document).on('keydown',function(e){
            if(e.which == 13){
                _this.submit(_this);
            }
        });
        this.container.on('click','#apply-submit',function(){
            _this.submit(_this);
            return false;
        });
    },
    submit: function(obj) {
        if(!obj.check.phone(obj) && !obj.check.name(obj)){
            obj.error.html(obj.errmsg.submit).removeClass('hide');
            return false;
        }
        if(!obj.check.name(obj)){
            obj.error.html(obj.errmsg.empty).removeClass('hide');
            return false;
        }
        if (!obj.check.phone(obj)) {
            obj.error.html(obj.errmsg.mobile).removeClass('hide');
            return false;
        }
        var data = obj.strToJson($('#apply-form').serialize());
        data.district = '诚一贷装修贷web';
        data.name = window.decodeURI(data.name);
        $.ajax({
            url : '/api/v2/web/add_angel_user',
            type: 'post',
            contentType : 'application/json; charset=utf-8',
            dataType: 'json',
            data : JSON.stringify(data),
            processData : false
        })
            .done(function(res) {
                if(res.msg == "success"){
                    obj.reset();
                    obj.myConfirm();
                }
            })
            .fail(function(res){
                console.log(res);
            });
    },
    myConfirm : function(callback){
        var $body = $('body');
        var modat = '<div class="modal-dialog">\
                          <div class="modal-content">\
                            <div class="modal-body">\
                                <i class="iconfont">&#xe60d;</i>\
                                <h3>&nbsp;申请成功！</h3>\
                                <p>我们的客服人员会在24小时内与您联系，请保持电话畅通。</p>\
                            </div>\
                            <div class="modal-footer">\
                              <button type="button" class="u-btns define">&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;</button>\
                            </div>\
                          </div>\
                        </div>\
                      </div>';
        var $modal = $('<div class="k-modal apply" id="j-modal"></div>'),
            $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
        $modal.html(modat);
        $body.append($backdrop);
        $backdrop.fadeIn();
        $body.append($modal);
        $modal.fadeIn();
        $modal.find('.define').on('click',function(ev){
            ev.preventDefault();
            callback && callback('yes');
            hide();
        });
        function hide(){
            $modal.remove();
            $backdrop.remove();
        }
        $modal.find('.cancel').on('click',function(ev){
            ev.preventDefault();
            callback && callback('no');
            hide();
        });
    },
    strToJson : function(str){
        var json = {};
        if(str.indexOf("&") != -1){
            var arr = str.split("&");
            for (var i = 0,len = arr.length; i < len; i++) {
                var  temp = arr[i].split("=");
                json[temp[0]] = temp[1]
            }
        }else{
            var  temp = str.split("=");
            json[temp[0]] = temp[1]
        }
        return json;
    }
};
$(function(){
    new Placeholder({
        id: '#design-name'
    });
    new Placeholder({
        id: '#design-phone'
    });
    var Supervision = function(){};
    Supervision.prototype.init = function(){
        this.select();
        new Shortcut('#j-apply');
    };

    Supervision.prototype.select = function() {
        var _this = this;
        var cycleArr = [12,24,36];
        var moneyArr = [];
        var money,cycle;
        for(var i=0; i<20; i++){
            moneyArr.push(i+1+'万');
        }
        var s1 = new Select('#j-money',{
            type : 'getValue',
            data : moneyArr,
            query : '请选择贷款金额',
            select : function(obj){
                money = parseInt(s1.returnValue(), 10)*10000;
            }
        });
        var s2 = new Select('#j-cycle',{
            type : 'getValue',
            data : cycleArr,
            query : '请选择贷款周期',
            select : function(obj) {
                cycle = parseInt(s2.returnValue(), 10);
            }
        });
        $('#j-compute').on('click',function (){
            if (!money && !cycle){
                alert('您还没有选择贷款金额或者贷款周期');
                return ;
            }
            if (!money){
                alert('您还没有选择贷款金额');
                return ;
            }
            if (!cycle){
                alert('您还没有选择贷款周期');
                return ;
            }
            _this.compute(money,cycle);
        })
    };
    Supervision.prototype.compute = function (money,cycle) {
        var rate = 0.86/100,
            payment = (rate*money) + (money/cycle);
            total = payment * cycle;
        //console.log((rate*money) + (money/cycle))
        this.result({
            money : money,
            cycle : cycle,
            payment : payment,
            total : total
        });
    };
    Supervision.prototype.result = function (result) {
        var options = {
            useEasing : true,
            useGrouping : true,
            separator : ',',
            decimal : '.',
            prefix : '',
            suffix : ''
        };
        new CountUp("j-result-payment", 0, result.payment, 2, 2.5, options).start();
        new CountUp("j-result-money", 0, result.money, 2, 2.5, options).start();
        new CountUp("j-result-cycle", 0, result.cycle, 0, 2.5, options).start();
        new CountUp("j-result-total", 0, result.total, 2, 2.5, options).start();
    };
    new Supervision().init();
});
