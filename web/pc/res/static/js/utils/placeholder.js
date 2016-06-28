/*
    检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
    placeholder
    this.typeArr = ['input','textarea'];
*/
define(['jquery'], function($){
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
        if(this.placeholder && this.verify()){
            this.create();
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
            var elementId = this.settings.id;
            if (!elementId) {
                var now = new Date();
                elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
                self.element.attr('id', elementId);
            }
            // 添加label标签，用于显示placeholder的值
            var $label = $('<label>', {
                html: self.element.val() ? '' : this.placeholder,
                'for': elementId
            }).insertAfter(self.element).attr('class', this.settings.className);

            // 绑定事件
            var _resetPlaceholder = function () {
                if (self.element.val()) {
                    $label.html('');
                }else {
                    $label.html(this.placeholder);
                }
            }
            $label.on('click',function(){
                self.element.focus();
            })
            self.element.on('focus blur input keyup propertychange resetplaceholder', _resetPlaceholder);
        }
    }
    return Placeholder;
});
