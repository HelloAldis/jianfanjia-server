require.config({
    baseUrl: '/static/js/',
    paths: {
        jquery: 'lib/jquery',
        lodash: 'lib/lodash',
        cookie: 'lib/jquery.cookie',
        webuploader: 'lib/webuploader.min'
    },
    shim   : {
        'webuploader': {
            deps: ['jquery']
        }
    }
});
require(['jquery', 'index/search'], function ($, Search) {
    var search = new Search();
    search.init();
});
require(['jquery', 'lib/jquery.cookie', 'utils/common', 'utils/tooltip','lib/webuploader.min'], function ($, cookie, common, Tooltip,WebUploader) {
    var Home = function () {};
    Home.prototype = {
        init: function () {
            this.body = $('body');
            this.home = $("#j-home");
            this.product = this.home.find('.m-home-product');
            this.toFrom = 0;
            this.toPage = 1;
            new Tooltip('.tooltip');
            this.user = new common.User();
            this.goto = new common.Goto();
            this.user.init2();
            this.goto.init({scroll : false});
            this.addBg();
            this.loadmore();
            this.fixed();
            this.remove();
            this.loadList(this.toFrom);
        },
        fixed: function () {
            var $follow = this.home.find('.m-follow');
            var $followTop = $follow.offset().top;
            $(window).on('scroll', function () {
                if ($(this).scrollTop() >= $followTop) {
                    $follow.addClass('fixed');
                } else {
                    $follow.removeClass('fixed');
                }
            });
        },
        loadmore: function () {
            var _this = this;
            var total = this.product.find('li').size();
            var limit = 6;
            var page = Math.round(total / limit);
            this.product.delegate('.loadmore', 'click', function (ev) {
                ev.preventDefault();
                if ($(this).hasClass('not')) {
                    return;
                }
                if (_this.toPage >= page) {
                    $(this).addClass('not').html('没有更多了').fadeIn(500);
                } else {
                    _this.toPage++;
                }
                _this.toFrom += limit;
                _this.loadList(_this.toFrom);

            });
        },
        addBg :function(){
            var _this = this;
            this.home.delegate('.add-bg','click',function(){
                _this.upload();
            });
        },
        renderList: function () {
            var aLi = this.product.find('li');
            aLi.addClass('hide');
            this.loadList(this.toFrom + 6, true);
            // 如果删除li多，长度不够点击就隐藏更多按钮
            if (aLi.size() < this.toFrom + 7) {
                this.product.find('.loadmore').hide();
            }
        },
        loadList: function (size, render) {
            var aLi;
            if (size === 0) {
                aLi = this.product.find('li:lt(6)');
            } else if (render) {
                aLi = this.product.find('li:lt(' + size + ')');
            } else {
                aLi = this.product.find('li:gt(' + (size - 1) + '):lt(6)');
            }
            aLi.hide().removeClass('hide').fadeIn();
            aLi.find('img').each(function (index, el) {
                $(el).attr('src', $(this).data('src'));
            });
        },
        remove: function () {
            var _this = this;
            this.product.delegate('.remove', 'click', function (ev) {
                ev.preventDefault();
                var id = $(this).data('uid');
                var parents = $(this).parents('li');
                _this.myConfirm('您确定要删除作品吗？', function (choose) {
                    if (choose == 'yes') {
                        $.ajax({
                            url: '/api/v2/web/designer/product/delete',
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            data: JSON.stringify({
                                "_id": id
                            }),
                            processData: false
                        })
                            .done(function (res) {
                                if (res.msg === "success") {
                                    parents.remove();
                                    _this.renderList();
                                }
                            });
                    }
                });
            });
        },
        upload : function () {
            // 检测是否已经安装flash，检测flash的版本
            var flashVersion = (function() {
                var version;
                try {
                    version = navigator.plugins[ 'Shockwave Flash' ];
                    version = version.description;
                } catch ( ex ) {
                    try {
                        version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                .GetVariable('$version');
                    } catch ( ex2 ) {
                        version = '0.0';
                    }
                }
                version = version.match( /\d+/g );
                return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
            })();
            if(WebUploader.browser.ie && !flashVersion){
                alert('您的浏览器没有安装flash插件，或者flash版本过低，请及时更新。');
                return ;
            }
            var _this = this;
            var modat = '<div class="modal-dialog">\
                          <div class="modal-content">\
                            <div class="modal-title">\
                                <h3 class="f-fl">上传背景图片</h3>\
                               <div class="f-fr close">\
                                    <i class="iconfont">&#xe642;</i>\
                               </div>\
                            </div>\
                            <div class="modal-body">\
                               <div class="upload">\
                                    <div id="fileToUpload" class="fileBtn"></div>\
                                    <p class="file"></p>\
                               </div>\
                               <div class="progress"><span>0%</span><div class="progress-in"></div></div>\
                               <div class="error f-cb"><p class="f-fl">上传取消</p><div class="cancelupload f-fl"><i class="iconfont">&#xe642;</i></div></div>\
                               <p class="text">提示：为了达到最佳的显示效果，请上传宽度大于2000，高度大于500的图片</p>\
                            </div>\
                            <div class="modal-footer">\
                              <button type="button" class="u-btns u-btns-revise cancel">取消</button>\
                              <button type="button" class="u-btns define">上传图片</button>\
                            </div>\
                          </div>\
                        </div>\
                      </div>';
            var $modal = $('<div class="k-modal addbg" id="j-modal"></div>'),
                $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
            $modal.html(modat);
            this.body.append($backdrop);
            $backdrop.fadeIn();
            this.body.append($modal);
            $modal.fadeIn();
            var loadId,uploadData;
            uploader = WebUploader.create({
                pick: {
                    id: '#fileToUpload',
                    innerHTML : '选择文件'
                },
                paste: document.body,
                accept: {
                    title: 'Images',
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/*'
                },
                'method': 'post',
                'timeout' : 4 * 60 * 1000,    // 3分钟
                'fileVal' : 'Filedata',
                //'runtimeOrder':'flash',   //  [默认值：html5,flash] 指定运行时启动顺序 调试用
                // swf文件路径
                swf : '/static/js/lib/Uploader.swf',
                disableGlobalDnd: true,
                chunked: true,
                server: '/api/v2/web/image/upload',
                fileNumLimit: 1,    //允许上传9张图片
                fileSingleSizeLimit: 3 * 1024 * 1024    // 3 M 单个文件大小
            });
            uploader.on( 'fileQueued', function( file ) {   //当文件被加入队列以后触发。
                loadId = file.id;
                console.log(loadId)
                $modal.find('.file').html(file.name);
                $modal.find('.progress').show();
                $modal.find('.error').show();
                $modal.find('.upload').append('<div class="disable"></div>');
            });
            uploader.on( 'uploadProgress', function( file, percentage ) {  //上传过程中触发，携带上传进度。
                var loading = parseInt(percentage * 100, 10) + '%';
                    $modal.find('.progress-in').css('width',loading);
                    $modal.find('.progress').find('span').html(loading);
             });
            uploader.on( 'uploadSuccess', function( file , data) {  //当文件上传成功时触发。
                callbackImg(data.data);
            });
            uploader.on( 'uploadError', function( file ) {   //当文件上传出错时触发。
                $modal.find('.error').find('p').html('上传错误，请重新上传');
                $modal.find('.error').show();
            });
            uploader.on('error',function(error){   //当validate不通过时
                if(error === 'F_EXCEED_SIZE'){
                    alert('图片大小超出限制。');
                }
                if(error === 'F_DUPLICATE'){
                    alert('图片已经上传过了，请不要重复上传。');
                }
            });
            uploader.on( 'uploadComplete', function( file ) {   //不管成功或者失败，文件上传完成时触发。
                $modal.find('.disable').remove();
            });
            $modal.on('click', '.cancelupload', function() {    //取消上传
                uploader.cancelFile( loadId );
                $modal.find('.error').hide();
                $modal.find('.error').find('p').html('上传取消');
                $modal.find('.progress').hide();
                $modal.find('.file').html('');
                $modal.find('.progress-in').css('width','0%');
                $modal.find('.progress').find('span').html('0%');
                $modal.find('.disable').remove();
                $modal.find('.define').removeClass('u-btns-disabled');
                loadId = null;
            });
            $modal.find('.close').on('click', function (ev) {
                ev.preventDefault();
                hide();
            });
            $modal.find('.define').on('click', function (ev) {    //开始上传
                ev.preventDefault();
                if($(this).hasClass('u-btns-disabled') || !loadId){
                    return ;
                }
                uploader.upload(loadId);
                $(this).addClass('u-btns-disabled');
            });
            function hide() {
                $modal.remove();
                $backdrop.remove();
                loadId = null;
            }
            $modal.find('.cancel').on('click', function (ev) {
                ev.preventDefault();
                hide();
            });
            $modal.find('.close').on('click', function (ev) {
                ev.preventDefault();
                hide();
            });
            function callbackImg(data) {
                uploader.removeFile(loadId);
                _this.home.find('.m-potter-banner').css('backgroundImage','url(/api/v2/web/thumbnail2/1920/420/'+data+')');
                $.ajax({
                    url:'/api/v2/web/designer/no_review_info',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        big_imageid : data
                    }),
                    processData : false
                });
                hide();
            }
        },
        myConfirm : function (msg, callback) {
            var modat = '<div class="modal-dialog">\
                      <div class="modal-content">\
                        <div class="modal-body">\
                           <div class="icon">\
                                <i class="iconfont">&#xe619;</i>\
                           </div>\
                           <p class="text">' + msg + '</p>\
                        </div>\
                        <div class="modal-footer">\
                          <button type="button" class="u-btns u-btns-revise cancel">取消</button>\
                          <button type="button" class="u-btns define">确定</button>\
                        </div>\
                      </div>\
                    </div>\
                  </div>';
            var _this = this;
            var $modal = $('<div class="k-modal dialog" id="j-modal"></div>'),
                $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
            $modal.html(modat);
            this.body.append($backdrop);
            $backdrop.fadeIn();
            this.body.append($modal);
            $modal.fadeIn();
            $modal.find('.define').on('click', function (ev) {
                ev.preventDefault();
                callback && callback('yes');
                hide()
            });
            function hide() {
                $modal.remove();
                $backdrop.remove();
            }
            $modal.find('.cancel').on('click', function (ev) {
                ev.preventDefault();
                callback && callback('no');
                hide()
            });
        }
    };
    var home = new Home();
    home.init();
});

