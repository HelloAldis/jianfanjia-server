define(['jquery'], function($){
    /**
     * [Tooltip 工具提示]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     */
    var Tooltip = function(element, options){
        this.init(element, options);
    }
    Tooltip.VERSION = '1.0.0';
    /**
     * [DEFAULTS 默认配置]
     * @type {Object}
     *              animation 是否动画
     *              placement 显示方向
     *              selector  为模板添加选择器
     *              template  显示模板
     *              trigger   执行动画
     *              title     提示文字
     *              delay     延迟时间
     *              html      html过滤
     *              viewportSelector  插入选择器
     *              viewportPadding   是否有内填充
     */
    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector : '',
        template: '<div class="k-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        viewportSelector: 'body',
        viewportPadding:'3px 8px'
    }
    /**
     * [init 初始化]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Tooltip.prototype.init = function(element, options) {
        this.$element  = $(element);
        this.options   = this.getOptions(this.$element,options);
        this.bindEvent(this.$element,this.options);
    };
    /**
     * [bindEvent 绑定事件]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     */
    Tooltip.prototype.bindEvent = function(element,options){
        var _this = this;
        for (var i = 0; i < element.size(); i++) {
            var triggers = options[i].trigger.split(' ');
            if($.inArray("click", triggers) != -1){
                this.$element.eq(i).on('click',$.proxy(this.toggle, this, this.$element.eq(i), options[i]));
            }else{
                var eventIn  = $.inArray('hover',triggers) != -1 ? 'mouseenter' : 'focusin';
                var eventOut = $.inArray('hover',triggers) != -1 ? 'mouseleave' : 'focusout';
                this.$element.eq(i).on(eventIn,$.proxy(this.enter, this, this.$element.eq(i), options[i]));
                this.$element.eq(i).on(eventOut,$.proxy(this.leave, this, this.$element.eq(i), options[i]));
            }
        }
    }
    /**
     * [getOptions 配置参数]
     * @param  {[String]} options   [接收参数]
     * @return {[Object]}           [配置参数]
     */
    Tooltip.prototype.getOptions = function (element,option) {
        var options = [];
        for (var i = 0; i < element.size(); i++) {
            options[i] = $.extend({}, this.getDefaults(), element.eq(i).data(), option);
        }
        return options;
    }
    /**
     * [getOptions 默认参数]
     * @return {[Object]}           [默认参数]
     */
    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS;
    }
    /**
     * [toggle 切换状态]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Tooltip.prototype.toggle = function(element,options) {
        if(element.hasClass('tooltip-toggle')){
            this.leave(element,options);
            element.removeClass('tooltip-toggle');
        }else{
            this.$element.removeClass('tooltip-toggle');
            this.enter(element,options);
            element.addClass('tooltip-toggle');
        }
    };
    /**
     * [enter 移入状态]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Tooltip.prototype.enter = function(element,options) {
        this.getViewportInclude(element,options);
    };
    /**
     * [leave 移出状态]
     * @param  {[String]} element [选择器]
     * @param  {[Object]} options [接收参数]
     * @return {[type]}           [description]
     */
    Tooltip.prototype.leave = function(element,options) {
        this.destroy();
    };
    /**
     * [placement 显示位置]
     * @param  {[String]} placement   [方向]
     * @return {[Function]}           [显示位置]
     */
    Tooltip.prototype.placement = function(element,options){
        this.setContent(element,options);
        switch(options.placement){
            case 'top':
                this.placementTop(element,options,this.getPosition(element,options));
            break;
            case 'left':
                this.placementLeft(element,options,this.getPosition(element,options));
            break;
            case 'bottom':
                this.placementBottom(element,options,this.getPosition(element,options));
            break;
            case 'right':
                this.placementRight(element,options,this.getPosition(element,options));
            break;
        }
    }
    /**
     * [placementTop 显示上面位置]
     * @param  {[String]} placement   [方向]
     * @return {[Function]}           [显示位置]
     */
    Tooltip.prototype.placementTop = function(element,options,position){
        var ew = element.height();
        var tw = this.$tip.width();
        var th = this.$tip.height();
        var difference = 0;
        if(tw > ew){
            difference = (tw - ew)/2;
        }else{
            difference = (ew - tw)/2;
        }
        this.$tip.addClass('top in').css({
            left:position.left - difference,
            top:position.top - th -5
        });
    }
    /**
     * [placementTop 显示左边位置]
     * @param  {[String]} placement   [方向]
     * @return {[Function]}           [显示位置]
     */
    Tooltip.prototype.placementLeft = function(element,options,position){
        var eh = element.height();
        var tw = this.$tip.width() + 10;
        var th = this.$tip.height();
        var difference = 0;
        if(th > eh){
            difference = (th - eh)/2;
        }else{
            difference = (eh - th)/2;
        }
        this.$tip.addClass('left in').css({
            left:position.left - tw -5,
            top:position.top + difference
        });
    }
    /**
     * [placementTop 显示下面位置]
     * @param  {[String]} placement   [方向]
     * @return {[Function]}           [显示位置]
     */
    Tooltip.prototype.placementBottom = function(element,options,position){
        var ew = element.width();
        var tw = this.$tip.width();
        var th = this.$tip.height();
        var difference = 0;
        if(tw > ew){
            difference = (tw - ew)/2;
        }else{
            difference = (ew - tw)/2;
        }
        this.$tip.addClass('bottom in').css({
            left:position.left - difference,
            top:position.top + th +5
        });
    }
    /**
     * [placementTop 显示右边位置]
     * @param  {[String]} placement   [方向]
     * @return {[Function]}           [显示位置]
     */
    Tooltip.prototype.placementRight = function(element,options,position){
        var eh = element.height();
        var ew = element.width();
        var th = this.$tip.height();
        var difference = 0;
        if(th > eh){
            difference = (th - eh)/2;
        }else{
            difference = (eh - th)/2;
        }
        this.$tip.addClass('right in').css({
            left:position.left + ew,
            top:position.top - difference
        });
    }
    Tooltip.prototype.getPosition = function(element,options){
        return element.offset();
    }
    Tooltip.prototype.template = function (options) {
        if (!this.$tip) {
          this.$tip = $(options.template)
          if (this.$tip.length != 1) {
            throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
          }
        }
        return this.$tip
    }
    Tooltip.prototype.getViewportInclude = function(element,options){
        var tip = this.template(options);
        this.setContent(tip,options);
        tip.attr('class', 'k-tooltip').find('.tooltip-inner').css('padding',options.viewportPadding);
        $(options.viewportSelector).append(tip);
        this.placement(element,options);
    }
    Tooltip.prototype.setContent = function (tip,options) {
        tip.find('.tooltip-inner')[options.html ? 'html' : 'text'](options.title);
    }
    /**
     * [destroy 销毁组件]
     */
    Tooltip.prototype.destroy = function(){
        this.$element.removeClass('tooltip-toggle');
        this.$tip && this.$tip.remove();
    }
    return Tooltip;
})
