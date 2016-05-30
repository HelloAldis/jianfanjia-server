require.config({
    baseUrl: '/static/js/',
    paths: {
        jquery: 'lib/jquery',
        lodash: 'lib/lodash',
        cookie: 'lib/jquery.cookie',
        uploadify: 'lib/jquery.uploadify.min'
    },
    shim   : {
        'uploadify': {
            deps: ['jquery']
        }
    }
});
require(['jquery', 'index/search'], function ($, Search) {
    var search = new Search();
    search.init();
});
require(['jquery', 'cookie', 'utils/common', 'utils/tooltip','uploadify'], function ($, cookie, common, Tooltip,uploadify) {
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
            this.goto.init();
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
                                    <div id="fileToUpload" class="fileBtn">\
                                        <input class="hide" id="fileToUpload" type="file" name="upfile">\
                                        <input type="hidden" id="sessionId" value="${pageContext.session.id}" />\
                                        <input type="hidden" value="1215154" name="tmpdir" id="id_file">\
                                    </div>\
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
            var loadId;
            $('#fileToUpload').uploadify({
                'auto': false, //自动上传
                'removeTimeout': 1,
                'swf': '/tpl/user/uploadify.swf',
                'uploader': '/api/v2/web/image/upload',  //上传的api
                'method': 'post',
                'buttonText': '选择文件',
                'fileObjName': 'Filedata',
                'multi': true,  //一次只能选择一个文件
                'queueSizeLimit': 1,
                'width': 76,
                'height': 28,
                'fileTypeDesc': 'Image Files',
                'fileTypeExts': '*.jpeg;*.jpg;*.png', //文件类型选择限制
                'fileSizeLimit': '5MB',  //上传最大文件限制
                'onSelect': function (file) {
                    loadId = file.id;
                    console.log(loadId)
                    $modal.find('.file').html(file.name);
                    $modal.find('.progress').show();
                    $('#fileToUpload').uploadify('disable', true);
                    $modal.find('.error').show();
                    $modal.find('.upload').append('<div class="disable"></div>');
                },
                'onUploadStart': function (file) {

                },
                'onUploadSuccess': function (file, data, response) {
                    callbackImg(data);
                },
                'onUploadError': function (file, errorCode, errorMsg, errorString) {
                    if (errorMsg === '500' && errorCode === -200) {
                        $modal.find('.error').find('p').html('上传超时，请重新上传');
                        $modal.find('.error').show();
                    }
                },
                'onCancel': function () {
                    $('#fileToUpload').uploadify('disable', false);
                    $modal.find('.error').hide();
                    $modal.find('.error').find('p').html('上传取消');
                    $modal.find('.progress').hide();
                    $modal.find('.file').html('');
                    $modal.find('.progress-in').css('width','0%');
                    $modal.find('.progress').find('span').html('0%');
                    $modal.find('.disable').remove();
                },
                'onUploadProgress': function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var loading = parseInt(bytesUploaded / bytesTotal * 100, 10) + '%';
                    $modal.find('.progress-in').css('width',loading);
                    $modal.find('.progress').find('span').html(loading);
                }
            });
            $modal.find('.define').on('click', function (ev) {
                ev.preventDefault();
                $('#fileToUpload').uploadify('upload','*');
            });
            function hide() {
                $modal.remove();
                $backdrop.remove();
                $('#fileToUpload').uploadify('cancel',loadId);
                $('#fileToUpload').uploadify('destroy');
                loadId = null;
            }
            $modal.find('.cancel').on('click', function (ev) {
                ev.preventDefault();
                hide();
            });
            $modal.find('.cancelupload').on('click', function (ev) {
                ev.preventDefault();
                $('#fileToUpload').uploadify('cancel',loadId);
                loadId = null;
            });
            $modal.find('.close').on('click', function (ev) {
                ev.preventDefault();
                hide();
            });
            function callbackImg(arr) {
                var data = $.parseJSON(arr);
                $('#fileToUpload').uploadify('destroy');
                _this.home.find('.m-potter-banner').css('backgroundImage','url(/api/v2/web/thumbnail2/1920/420/'+data.data+')');
                $.ajax({
                    url:'/api/v2/web/designer/info',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        big_imageid : data.data
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

