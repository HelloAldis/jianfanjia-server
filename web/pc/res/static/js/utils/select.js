define(['jquery'], function($){
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
    return Select;
});
