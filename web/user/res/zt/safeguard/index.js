;(function(){
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
            }).insertAfter(self.element).attr('class', 'placeholder').css({
                'left': self.element.css('padding-left'),
                'line-height': self.element.css('line-height')
            });
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
$(function(){
    var p1 = new Placeholder({
        id: '#phone'
    });
    var p2 = new Placeholder({
        id: '#name'
    });
    var Supervision = function(){}
    Supervision.prototype.init = function(){
        this.submitBtn = $('#submitBtn');
        this.popup = $('#j-popup');
        this.name = $('#name');
        this.phone = $('#phone');
        this.bName = false;
        this.bPhone = false;
        this.popupSubmit = $('#popup-submit');
        this.popupForm = $('#popup-form');
        this.tabs = $('#j-tabs');
        this.main = $('#j-main');
        this.tabEvent();
        this.applyEvent();
        this.submitForm();
    }
    Supervision.prototype.tabEvent = function(){
        var aLi = this.tabs.find('li');
        var _this = this;
        aLi.each(function(i,e){
            $(e).on('click',function(){
                var type = $(this).data('btn');
                $(this).addClass('active').siblings().removeClass('active');
                _this.main.find("[data-box="+type+"]").removeClass('hide').siblings('.showBox').addClass('hide');
            })
        })
    }
    Supervision.prototype.applyEvent = function(){
        var _this = this;
        this.submitBtn.on('click',function(){
            _this.popupMian();
            return false;
        })
    }
    Supervision.prototype.popupMian = function(){
        this.popup.fadeIn();
        var close = this.popup.find('.close');
        var mask = this.popup.find('.popup-mask');
        var _this = this;
        close.on('click',function(){
            _this.popupClose();
        });
        mask.on('click',function(){
            _this.popupClose();
        });
        this.verifyForm();
    }
    Supervision.prototype.popupClose = function(){
        this.popup.hide();
        this.clearForm();
    }
    Supervision.prototype.verifyForm = function(){
        var _this = this;
        var nameOff = false;
        var phoneOff = false;
        function isMobile(mobile){
            return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
        }
        this.name.on('focus',function(){
            nameOff = true;
        });
        this.phone.on('focus',function(){
            phoneOff = true;
        });
        this.name.on('blur',function(){
            if(nameOff){
                if(!$.trim($(this).val())){
                    $(this).addClass('error').siblings('.errorMsg').html('姓名不能为空');
                    _this.popupSubmit.addClass('u-btns-disabled');
                    _this.bName = false;
                }else{
                    $(this).removeClass('error').siblings('.errorMsg').html('');
                    _this.bName = true;
                    if(_this.bPhone){
                        _this.popupSubmit.removeClass('u-btns-disabled');
                    }
                }
            }
        });
        this.phone.on('blur',function(){
            if(phoneOff){
                if(!$.trim($(this).val())){
                    $(this).addClass('error').siblings('.errorMsg').html('手机号码不能为空');
                    _this.popupSubmit.addClass('u-btns-disabled');
                    _this.bPhone = false;
                }else if(!isMobile($(this).val())){
                    $(this).addClass('error').siblings('.errorMsg').html('手机号码不正确');
                    _this.popupSubmit.addClass('u-btns-disabled');
                    _this.bPhone = false;
                }else{
                    $(this).removeClass('error').siblings('.errorMsg').html('');
                    _this.bPhone = true;
                    if(_this.bName){
                        _this.popupSubmit.removeClass('u-btns-disabled');
                    }
                }
            }
        });
    }
    Supervision.prototype.submitForm = function(){
        var _this = this;
        this.popupForm.on('submit',function(){
            setTimeout(function(){
                if(!_this.popupSubmit.hasClass('u-btns-disabled')){
                    _this.ajax();
                }
            },300);
            return false;
        });
    }
    Supervision.prototype.ajax = function(){
        var _this = this;
        var successHide = $('.successHide');
        $.ajax({
            url : RootUrl+'api/v2/web/add_angel_user',
            type: 'post',
            contentType : 'application/json; charset=utf-8',
            dataType: 'json',
            data : JSON.stringify({
                "phone":this.phone.val(),
                "name":this.name.val(),
                "district":'贷款保险web',
                "house_area":undefined,
                "total_price":undefined
            }),
            processData : false
        })
        .done(function(res) {
            if(res.msg == "success"){
                successHide.hide().siblings('.success').show();
                _this.done();
                _this.clearForm();
            }
        })
        .fail(function(res) {
            console.log(res);
        });
    }
    Supervision.prototype.clearForm = function(){
        this.phone.val('').removeClass('error').blur().siblings('.errorMsg').html('');
        this.name.val('').removeClass('error').blur().siblings('.errorMsg').html('');
        this.popupSubmit.addClass('u-btns-disabled');
        this.bName = false;
        this.bPhone = false;
    }
    Supervision.prototype.done = function(){
        var _this = this;
        var successHide = $('.successHide');
        $('#successBtn').on('click',function(){
            _this.popupClose();
            successHide.show().siblings('.success').hide();
        })
    }
    var s = new Supervision().init();
})











































