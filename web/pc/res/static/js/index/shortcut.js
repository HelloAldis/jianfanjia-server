define(['jquery'], function($){
    var Shortcut = function(id){
        this.init(id);
    };
    Shortcut.prototype = {
        init : function(id){
            this.container = $(id);
            this.type = 'name';
            this.tab();
            this.bind();
            this.ConsentAgreement = true;
            this.agree();
            this.error = $('#error-info');
        },
        tab: function() {
            var _this = this;
            var slogan = {
                'name': '立即免费获取三套方案',
                'house_area': '立即免费获取装修报价'
            };
            var aDiv = this.container.find('.j-apply-form');
            var oH3 = this.container.find('h3');
            this.container.on('click', '.tab li', function(event) {
                event.preventDefault();
                _this.type = $(this).data('type');
                $(this).addClass('active').siblings('li').removeClass('active');
                aDiv.addClass('hide');
                oH3.html(slogan[_this.type]);
                aDiv.eq($(this).index()).removeClass('hide');
                _this.reset();
            });
        },
        reset: function () {
            this.container.find('.input').val('');
            this.container.find('.item').removeClass('focus error');
            this.error.html('').addClass('hide');
        },
        verify : {
            isMobile : function(mobile){
                return /^(13[0-9]{9}|15[012356789][0-9]{8}|18[0123456789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|177[0-9]{8})$/.test(mobile);
            },
            isnumber : function(str){
                return (/^[1-9][0-9]{0,10}$/.test(str));
            }
        },
        errmsg : {
            'empty': '不能为空',
            'mobile' : '手机号不正确',
            'number' : '请输入整数',
            'submit1' : '您的称呼或手机号不正确',
            'submit2' : '房屋面积或手机号不正确'
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
            },
            'number': function(obj) {
                var $area = $('#area-house_area');
                var val = $area.val();
                var parents = $area.parents('.item');
                if (!$.trim(val)){
                    parents.removeClass('focus').addClass('error');
                    obj.error.html(obj.errmsg.empty).removeClass('hide');
                    return false;
                }else if (!obj.verify.isnumber(val)){
                    parents.removeClass('focus').addClass('error');
                    obj.error.html(obj.errmsg.number).removeClass('hide');
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
            $('#area-house_area').on('focus',function(){
                $(this).parents('.item').removeClass('error').addClass('focus');
            }).on('blur',function(){
                _this.check.number(_this);
            });
            this.container.on('click', '#reg-agreement span', function(event) {
                event.preventDefault();
                $(this).toggleClass('active');
                _this.ConsentAgreement = $(this).hasClass('active');
                if (!$(this).hasClass('active')){
                    _this.error.html('请同意注册协议').removeClass('hide');
                }else{
                    _this.error.html('').addClass('hide');
                }
                console.log(_this.ConsentAgreement);
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
            if (!obj.ConsentAgreement){
                obj.error.html('请同意注册协议').removeClass('hide');
                return false;
            }
            if(obj.type === 'name'){
                if(!obj.check.phone(obj) && !obj.check.name(obj)){
                    obj.error.html(obj.errmsg.submit1).removeClass('hide');
                    return false;
                }
                if (!obj.check.name(obj)){
                    obj.error.html(obj.errmsg.empty).removeClass('hide');
                    return false;
                }
            }else{
                if(!obj.check.phone(obj) && !obj.check.number(obj)){
                    obj.error.html(obj.errmsg.submit2).removeClass('hide');
                    return false;
                }
                if (!obj.check.number(obj)){
                    obj.error.html(obj.errmsg.number).removeClass('hide');
                    return false;
                }
            }
            if (!obj.check.phone(obj)) {
                obj.error.html(obj.errmsg.mobile).removeClass('hide');
                return false;
            }
            var data = obj.strToJson($('#apply-form').serialize());
            data.district = obj.type === 'name' ? '3.1web免费设计' : '3.1web免费报价';
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
    return Shortcut;
});
