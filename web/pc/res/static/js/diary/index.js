require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        uploadify: 'lib/jquery.uploadify.min',
        uploadifive: 'lib/jquery.uploadifive.min',
        lazyload : 'lib/lazyload',
        cookie : 'lib/jquery.cookie',
        history : 'lib/jquery.history'
    },
    shim   : {
        'history': {
            deps: ['jquery']
        },
        'uploadify': {
            deps: ['jquery']
        },
        'uploadifive': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','lodash','cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    goto.init();
})
require(['jquery','lodash','cookie','history','utils/common','utils/page','utils/globalData','utils/select','utils/placeholder','utils/checkSupport','uploadify','uploadifive'],function($,_,cookie,history,common,Pageing,globalData,Select,Placeholder,checkSupport){
    var page = new Pageing();
    var Diary = function(){};
    Diary.prototype = {
        init : function(){
            var History = window.History;
            this.winHash = window.location.search.split("?")[1];   //获取URL参数，操作上下文
            this.cookie = $.cookie('usertype');
            this.toFrom = 0;  //搜索分页起始位置
            this.limit = 10;  //获取列表条数
            this.body = $('body');
            this.diary = $('#j-diary');
            this.list = this.diary.find('.m-diary-list');
            this.top = this.diary.offset().top+20;   //获取列表top，供分页切换跳转列表顶部位置
            this.loading = this.diary.find('.k-loading');    //获取数据加载元素
            if(this.cookie === '1'){
                this.add = this.diary.find('.m-diary-add');
                this.addDiary();
                this.diary.find('.create-diary').removeClass('hide');
            }else if(this.cookie === '2' || this.cookie === '0' ){
                this.diary.find('.create-diary').remove();
            }else{
                this.diary.find('.create-diary').attr('href', '/tpl/user/login.html?/tpl/user/owner.html#/diary/add/').removeClass('hide');
            }
            if(!!this.winHash){       //获取URL参数,设置默认值
                this.setDefault(this.winHash);
            }else{
               this.loadList();    //加载数据
               this.favorite();    //点赞
            }
            this.hot(5);
        },
        addDiary : function(){
            var diary = {
                    "diarySetid": "",
                    "content":"",
                    "section_label":"",
                    "images":[]
                }
            var section_label = [
                '准备',
                '开工',
                '拆改',
                '泥木',
                '水电',
                '油漆',
                '安装',
                '竣工',
                '软装',
                '入住'
            ];
            var _this = this;
            var $submit,$addContent;
            var $write = $('<div class="m-write"><i class="iconfont">&#xe629;</i>&nbsp;&nbsp;写日记</div>');
            var $edit = $('<div class="m-edit"></div>');
            var html = '<div class="m-edit-header">\
                            <textarea rows="10" placeholder="记录和分享您的装修之路，不少于15字哦" name="content" class="addContent placeholder"></textarea>\
                        </div>\
                        <div class="m-edit-body insertimage">\
                            <div class="k-uploadbox f-cb">\
                                <div class="list"></div>\
                                <div class="pic" id="create">\
                                    <div class="fileBtn">\
                                        <input class="hide" id="createUpload2" type="file" name="upfile">\
                                        <input type="hidden" id="sessionId" value="${pageContext.session.id}" />\
                                        <input type="hidden" value="1215154" name="tmpdir" id="id_create">\
                                    </div>\
                                    <div class="tips">最多只能上传9张图</div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="m-edit-footer f-cb">\
                            <strong class="tilte f-fl">时间节点</strong>\
                            <div class="k-select f-fl" id="section-label"></div>\
                            <strong class="tilte f-fl">添加到</strong>\
                            <div class="k-select f-fl" id="diary-setname"></div>\
                            <div class="f-fr">\
                                <button class="u-btns submit u-btns-disabled" disabled>&nbsp;&nbsp;&nbsp;提交&nbsp;&nbsp;&nbsp;</button>\
                            </div>\
                        </div>';
            $edit.html(html);
            var data = [];
            $.ajax({
                url: '/api/v2/web/my_diary_set',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                processData : false
            })
            .done(function(res) {
                if(!!res.data.diarySets.length){
                    data = res.data.diarySets;
                }
                _this.add.append($write).show();
            })
            .fail(function(error) {
                console.log(error);
            });
            var select1;
            var setData = [];
            this.add.on('click','.m-write',function(event){   //打开添加日志
                if(!data.length){
                    window.location.href = '/tpl/user/owner.html#/diary/add/';
                }else{
                    _.forEach(data,function(v){
                        setData.push(v.title);
                    })
                    console.log(setData)
                    $(this).hide();
                    _this.add.append($edit);
                    new Placeholder({
                        'id'          : '.addContent',
                        'className'   : 'placeholder'
                    });
                    upload(_this.add);
                    $submit = _this.add.find('.submit');
                    $addContent = _this.add.find('.addContent');
                    diary.section_label = getCurrentSectionlabel(data[0].latest_section_label) || '准备';
                    select1 = new Select('#section-label',{
                        type : 'getValue',
                        data : section_label,
                        query : getCurrentSectionlabel(data[0].latest_section_label) || '时间节点选择',
                        select : function(obj){
                            diary.section_label = select1.returnValue();
                        }
                    });
                    diary.diarySetid = data[0]._id;
                    var select2 = new Select('#diary-setname',{
                        type : 'getValue',
                        data : setData,
                        query : setData[0],
                        select : function(obj){
                            diary.diarySetid = data[obj.index()]._id;
                            diary.section_label = getCurrentSectionlabel(data[obj.index()].latest_section_label) || '时间节点选择';
                            select1.destroy();
                            select1 = new Select('#section-label',{
                                type : 'getValue',
                                data : section_label,
                                query : getCurrentSectionlabel(data[obj.index()].latest_section_label) || '时间节点选择',
                                select : function(obj){
                                    diary.section_label = select1.returnValue();
                                }
                            });
                        }
                    });
                }
            });
            function getCurrentSectionlabel(label){
                if(!label){
                    return ;
                }
                var index = _.indexOf(section_label,label);
                if(index <= section_label.length - 2){
                    return section_label[index + 1];
                }else{
                    return _.last(section_label);
                }
            }
            var VERIFY_CONTENT = /^[\u4e00-\u9fa5]{14,10000}$|^[\dA-Za-z_]{28,20000}$/ig;
            this.add.on('input propertychange','.addContent',function(event){   //添加一条动态
                console.log(VERIFY_CONTENT.test($(this).val()));
                if(!!$.trim($(this).val()) && !$submit.data('complete')){
                    $submit.prop("disabled", false).removeClass('u-btns-disabled');
                }else{
                    $submit.prop("disabled", true).addClass('u-btns-disabled');
                }
            }).on('blur','.addContent',function(event){   //添加一条动态
                diary.content = $.trim($(this).val());
            })
            this.add.on('click','.submit',function(event){   //添加一条动态
                if($(this).attr('disabled')){
                    return ;
                }
                if($(this).data('complete')){
                    alert('图片还没有上传完成');
                    return ;
                }
                if(diary.section_label === '时间节点选择'){
                    alert('请选择时间节点');
                    return ;
                }
                console.log(diary)
                $.ajax({
                    url: '/api/v2/web/add_diary',
                    type: 'POST',
                    dataType: 'json',
                    contentType : 'application/json; charset=utf-8',
                    data : JSON.stringify({
                        "diary" : diary
                    }),
                    processData : false
                })
                .done(function(res) {
                    _this.loadList();    //加载数据
                    $submit.prop({disabled : true}).addClass('u-btns-disabled');
                    $addContent.val('');
                    diary.images = [];
                    _this.add.find('.k-uploadbox .list').empty();
                    diary.section_label = getCurrentSectionlabel(diary.section_label);
                    select1.destroy();
                    select1 = new Select('#section-label',{
                        type : 'getValue',
                        data : section_label,
                        query : diary.section_label,
                        select : function(obj){
                            diary.section_label = select1.returnValue();
                        }
                    });
                })
                .fail(function(error) {
                    console.log(error);
                });
            });
            function upload(o){
                var obj = o.find('.k-uploadbox');
                var $list = obj.find('.list');
                if(checkSupport() === 'html5'){
                    var GUID = 0;
                    var queue = [];
                    $('#createUpload2').uploadifive({
                        'auto'  : true,
                        'dnd'   : false,
                        'buttonText' : '',
                        'method'  : 'post',
                        'queueID' : 'queue',
                        'fileObjName': 'Filedata',
                        'multi': true,  //一次只能选择一个文件
                        'queueSizeLimit': 9,
                        'width': 85,
                        'height': 85,
                        'fileType' : 'image/jpeg,image/png',  //允许上传文件类型
                        'fileSizeLimit': 3072,  //上传最大文件限制
                        'uploadScript' : '/api/v2/web/image/upload',  //上传的api
                        'onAddQueueItem' : function(file){
                            console.log(file)
                            var upload = $('<div class="item" id="queue_upload_'+file.lastModified+'"></div>');
                            var str =   '<div class="queue-item">\
                                            <span class="loading"></span>\
                                            <span class="uploading"><i class="ing">正在上传中</i></span>\
                                            <span class="filename"></span>\
                                            <span class="error" ></span>\
                                            <span class="progress"><span style="0%"></span></span>\
                                            <span class="cancel" ng-click="cancel(img.uploadid)"><i class="iconfont">&#xe642;</i></span>\
                                        </div>\
                                        <div class="queue-img hide">\
                                            <span class="close"><i class="iconfont">&#xe642;</i></span>\
                                            <div class="img">\
                                                <img />\
                                            </div>\
                                        </div>';
                            queue.push(file);
                            upload.html(str);
                            $list.append(upload);
                        },
                        'onProgress' : function(file, event) {
                            setTimeout(function(){
                                var item = $('#queue_upload_'+file.lastModified);
                                var loading = parseInt(event.loaded/event.total*100,10);
                                item.find('.loading').html(loading);
                                item.find('.progress span').css('width',loading + '%');
                            },0);
                        },
                        'onSelect'   : function(file) {
                            obj.find('.pic').append('<div class="disable"></div>');
                            $submit.data('complete',true);
                            $submit.prop("disabled", true).addClass('u-btns-disabled');
                            GUID = file.queued;
                            console.log(file)
                        },
                        'onUploadComplete': function (file, data, response) {
                            console.log('onUploadComplete',arguments);
                            callbackImg(data,file.lastModified);
                            if(GUID-- === 1){
                                $('#createUpload2').uploadifive('clearQueue');
                                obj.find('.disable').remove();
                                $submit.data('complete',false);
                                $submit.prop("disabled", false).removeClass('u-btns-disabled');
                                queue = [];  //清空上传队列
                                console.log('全部上传完成');
                            }
                        },
                        'onError': function (errorMsg, fileType, data) {
                            console.log('onError',errorMsg, fileType, data);
                            if(errorMsg === 'FILE_SIZE_LIMIT_EXCEEDED'){
                                alert('文件大小超出3M限制，请重新上传');
                            }
                            if(errorMsg === 'Unknown Error'){
                                 $timeout(function () {
                                    var index = _.findIndex(scope.myQuery,{'fileid':fileType.queueItem[0].id});
                                    scope.myQuery[index].errorMsg = '上传超时，请重新选择上传';
                                }, 0);
                            }
                        },
                        'onCancel': function () {
                            if(GUID-- === 1){
                                $('#createUpload1').uploadifive('clearQueue');
                                obj.find('.disable').remove();
                                console.log('全部取消完成');
                            }
                        }
                    });
                    $list.on('click','.cancel',function(){
                        var parents = $(this).parents('.item');
                        $('#createUpload2').uploadifive('cancel',queue[parents.index()]);
                        queue.slice(parents.index(),1);
                        parents.remove();
                    });
                }else{
                    var loadDate = 0;
                    console.log(scope.myQuery.length)
                    $('#createUpload2').uploadify({
                        'auto': true, //自动上传
                        'removeTimeout': 1,
                        'swf': 'uploadify.swf',
                        'uploader': '/api/v2/web/image/upload',  //上传的api
                        'method': 'post',
                        'buttonText': '',
                        'multi': true,  //一次只能选择一个文件
                        'queueSizeLimit': 9,
                        'width': 85,
                        'height': 85,
                        'fileObjName': 'Filedata',
                        'successTimeout': 5, //
                        'fileTypeDesc': 'Image Files',
                        'fileTypeExts': '*.jpeg;*.jpg;*.png', //文件类型选择限制
                        'fileSizeLimit': '3MB',  //上传最大文件限制
                        'onSelect': function (file) {
                            if(!obj.find('.disable').size()){
                                obj.find('.pic').append('<div class="disable"></div>');
                            }
                            $timeout(function () {

                                scope.myQuery.push({
                                    fileid: file.id,
                                    filename : file.name,
                                    errorMsg : '',
                                    loading: 0,
                                    progress : '0%'
                                });
                                scope.myComplete = true;
                                scope.myLoading = true;
                                scope.mySize = 9 - scope.myQuery.length;
                            }, 0);
                        },
                        'onUploadStart': function (file) {
                            loadDate = +new Date();
                            $('.uploadify-queue').css('zIndex', '110');
                        },
                        'onUploadSuccess': function (file, data, response) {
                            callbackImg(data, file.id);
                            $('.uploadify-queue').css('zIndex', '0');
                        },
                        'onUploadError': function (file, errorCode, errorMsg, errorString) {
                            if (errorMsg === '500' && errorCode === -200) {
                                $timeout(function () {
                                    var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                                    if (index >= 0) {
                                        scope.myQuery[index].errorMsg = '上传超时，请重新选择上传';
                                    }
                                }, 0);
                            }
                        },
                        'onQueueComplete' : function(queueData){
                            $timeout(function () {
                                scope.myComplete = false;
                                scope.myLoading = false;
                            }, 0);
                            obj.find('.disable').remove();
                        },
                        'onCancel': function () {
                            $('.uploadify-queue').css('zIndex', '0');
                        },
                        'onUploadProgress': function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                             //153600
                            /*if((+new Date() - loadDate) >= 10000){
                                $('#createUpload2').uploadify('stop');
                                console.log('上传超时，请重新上传');
                                loadDate = 0;
                                $timeout(function () {
                                    if (findIndex(scope.myQuery, file.id, 'uploadid') >= 0) {
                                        scope.myQuery[findIndex(scope.myQuery, file.id, 'uploadid')].error = true;
                                    }
                                }, 0);
                                return ;
                            }*/
                            $timeout(function () {
                                var index = _.findIndex(scope.myQuery,{'fileid':file.id});
                                if (index >= 0) {
                                    scope.myQuery[index].loading = parseInt(bytesUploaded / bytesTotal * 100, 10);
                                    scope.myQuery[index].progress = scope.myQuery[index].loading+'%';
                                }
                            }, 0);
                        }
                    });
                }
                function callbackImg(arr, id) {
                    var data = $.parseJSON(arr);
                    var img = new Image();
                    img.onload = function () {
                        var _this = this;
                        this.onload = this.error = null;
                        if(_.findIndex(diary.images,data.data) == -1){
                            var item = $('#queue_upload_'+id);
                            item.find('.queue-item').addClass('hide');
                            item.find('.queue-img').removeClass('hide')
                            item.find('.img img').attr('src','/api/v2/web/thumbnail2/85/85/'+data.data);
                            diary.images.push({
                                "width": _this.width,
                                "imageid": data.data,
                                "height": _this.height
                            })
                        }else{
                            alert('已经上传过了');
                            item.remove();
                        }
                    }
                    img.onerror = function () {
                        alert("图片加载错误");
                        obj.find('.pic').find('.disable').remove();
                    };
                    img.src = '/api/v2/web/image/' + data.data;
                }
                // scope.cancel = function (file,fileid) {
                //     if(checkSupport() === 'html5'){
                //          $('#createUpload2').uploadifive('cancel',file);
                //     }else{
                //         $('#createUpload2').uploadify('cancel', fileid);
                //     }
                //     $timeout(function () {
                //         scope.myQuery = _.remove(scope.myQuery, function(n) {
                //             return n.fileid != fileid;
                //         });
                //     }, 0);
                // }
                $list.on('click','.close',function(){
                    if (confirm("您确定要删除吗？删除不能恢复")) {
                        var parents = $(this).parents('.item');
                        diary.images.slice(parents.index(),1);
                        parents.remove();
                    }
                });
            }
        },
        setDefault : function(defaultData){     //设置url参数默认值
            var self = this,
                urlJson = this.strToJson(defaultData);
                current = urlJson.page != undefined ? parseInt(urlJson.page)-1 : 0;
            this.toFrom = current*this.limit;  //设置分页初始化
            this.loadList();    //加载数据
            this.favorite();    //点赞
        },
        loadList : function(time){
            var _this = this;
            this.list.empty();
            page.destroy();
            this.loading.removeClass('hide');
            var query = {
                    "create_at" : {
                        "$gt" : time
                    }
                };
            var oldData = {"from":this.toFrom,"limit":this.limit}
            $.ajax({
                url: '/api/v2/web/search_diary',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify(oldData),
                processData : false
            })
            .done(function(res) {
                _this.loading.addClass('hide');
                if(!!res.data.total){
                    _this.page(res.data)
                }
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        page : function(arr){
            var self = this,
                maxElem =  Math.ceil(arr.total/5),
                current = !History.getState ? !this.winHash ? 0 : (parseInt(this.strToJson(this.winHash).page) - 1) : !History.getState().url.split("?")[1] ? 0 : parseInt(this.strToJson(History.getState().url.split("?")[1]).page) - 1;
                if(current+1 > maxElem){
                    History.pushState({state:1}, "装修日志--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?page=1");
                    this.toFrom = 0;
                    self.loadList();
                    return false;
                }
            page.init({
                allNumPage : arr.total,
                itemPage : 10,
                showPageNum : 6,
                endPageNum : 1,
                currentPage : current,
                prevText:"上一页",
                nextText:"下一页",
                linkTo : '__id__',
                showUbwz : true,
                callback : function(num,obj){
                    self.list.html('');
                    var dataArr = [];
                    for(var i=0,len = arr.diaries.length;i<len;i++){
                        dataArr.push(self.createList(arr.diaries[i]));
                    }
                    self.list.html(dataArr);
                    obj.find('.btns').on('click',function(ev){
                        ev.preventDefault();
                        if($(this).hasClass('current')){
                            return ;
                        }
                        var index = $(this).attr("href").match(/\d+(\.\d+)?/g)[0];
                        self.toFrom = (index-1)*self.limit;
                        History.pushState({state:index}, "装修日志--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第 "+index+" 页", "?page="+index);
                        $('html,body').animate({scrollTop: self.top}, 500);
                        self.loadList();
                        return false;
                    });
                }
            });
        },
        suolve : function ( str ){
            var sub_length = 242;
            var temp1 = str.replace(/[^\x00-\xff]/g,"**");//精髓
            var temp2 = temp1.substring(0,sub_length);//找出有多少个*
            var x_length = temp2.split("\*").length - 1 ;
            var hanzi_num = x_length /2 ;
            sub_length = sub_length - hanzi_num ;//实际需要sub的长度是总长度-汉字长度
            var res = str.substring(0,sub_length);
            if(sub_length < str.length ){
            var end =res+"…" ;
            }else{
            var end = res ;
            }
            return end ;
        },
        favorite : function(){
            var _this = this;
            this.list.on('click','.click-favorite',function(){
                if(!$(this).hasClass('click-favorite')){
                    return ;
                }
                if(_this.cookie === undefined){
                    _this.myConfirm('您还没有登录，请登录后再点赞',function(choose){
                        if(choose == 'yes') {
                            window.location.href = '/tpl/user/login.html?/tpl/diary/index.html';
                        }
                    });
                    return false;
                }
                $(this).removeClass('click-favorite');
                var $this = $(this);
                var diaryid = $(this).data('diaryid');
                var count = parseInt($(this).data('count'),10) + 1;
                $(this).append('<strong>+1</strong>');
                var strong = $(this).find('strong');
                strong.fadeIn(function(){
                    $this.html(count+'<strong>+1</strong>').addClass('active');
                });
                $.ajax({
                    url: '/api/v2/web/favorite/diary/add',
                    type: 'POST',
                    dataType: 'json',
                    contentType : 'application/json; charset=utf-8',
                    data : JSON.stringify({
                        "diaryid" : diaryid
                    }),
                    processData : false
                })
                .done(function(res) {
                    if(res.msg === "success"){
                        strong.fadeOut();
                        $this.html(count);
                    }
                })
                .fail(function(error) {
                    console.log(error);
                });
            });
        },
        myConfirm : function(msg,callback){
            var modat = '<div class="modal-dialog">\
                      <div class="modal-content">\
                        <div class="modal-body">\
                           <p class="text">'+msg+'</p>\
                        </div>\
                        <div class="modal-footer">\
                          <button type="button" class="u-btns u-btns-revise cancel">看看再说</button>\
                          <button type="button" class="u-btns define">我要点赞</button>\
                        </div>\
                      </div>\
                    </div>\
                  </div>';
            var _this = this;
            var $modal = $('<div class="k-modal dialog" id="j-modal"></div>'),
                $backdrop = $('<div class="k-modal-backdrop" id="j-modal-backdrop"></div>');
                $modal.html(modat)
            this.body.append($backdrop);
            $backdrop.fadeIn();
            this.body.append($modal);
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
        createList  : function(data){      //创建列表
            var imgBox = '',title,img;
            if(!!data.images.length){
                var img = '';
                var imgLen = data.images.length > 5 ? 5 : data.images.length;
                for (var i = 0; i < imgLen; i++) {
                    img += '<img src="/api/v2/web/thumbnail2/160/160/'+data.images[i].imageid+'" alt="">'
                }
                var imgTips = !data.images.length ? '' : '<span class="tag">共'+data.images.length+'张</span>';
                imgBox = '<div class="img">'+imgTips+img+'</div>';
            }
            try{
                title = data.diarySet.title;
                username = data.author.username || '简繁家业主';
                if(data.author.imageid != undefined){
                    img = '<a href="/tpl/diary/book/'+data.diarySetid+'" class="u-head u-head-radius"><img src="/api/v2/web/thumbnail2/34/34/'+data.author.imageid+'" alt="'+username+'"></a>';
                }else{
                    img = '<a href="/tpl/diary/book/'+data.diarySetid+'" class="u-head u-head-radius"></a>';
                }
            }catch(e){
                img = '<a href="/tpl/diary/book/'+data.diarySetid+'" class="u-head u-head-w40 u-head-radius"></a>';
            }
            var favorite;
            if(data.is_my_favorite){
                favorite = '<span class="span favorite active">'+data.favorite_count+'</span>';
            }else{
                favorite = '<span data-diaryid="'+data._id+'" data-count="'+data.favorite_count+'" class="span favorite click-favorite">'+data.favorite_count+'</span>';
            }
            var arr = [
                '<section class="m-list">',
                    '<header class="m-header f-cb">',
                        '<div class="info f-fl">',
                            '<h4><a href="/tpl/diary/book/'+data.diarySetid+'">'+title+'</a></h4>',
                        '</div>',
                        '<div class="label f-fr"><a href="/tpl/diary/book/'+data.diarySetid+'?diaryid='+data._id+'">'+data.section_label+'阶段</a></div>',
                    '</header>',
                    '<section class="m-body">',
                        '<p class="text">'+this.suolve(data.content)+'</p>',
                        imgBox,
                    '</section>',
                    '<footer class="m-footer f-cb">',
                        '<div class="f-fl author">',
                            img,
                            '<strong>'+username+'</strong>',
                            '<span>发布于</span>',
                            '<time>'+this.format(data.create_at,'yyyy年MM月dd日 hh:mm')+'</time>',
                        '</div>',
                        '<div class="f-fr count">',
                            favorite,
                            '<a href="/tpl/diary/book/'+data.diarySetid+'?diaryid='+data._id+'" class="span comment">'+data.comment_count+'</a>',
                        '</div>',
                    '</footer>',
                '</section>',
            ];
            return arr.join('');
        },
        hot : function(num){
            var oUl = this.diary.find('.m-diary-hot ul');
            $.ajax({
                url: '/api/v2/web/top_diary_set',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify({
                    "limit" : num
                }),
                processData : false
            })
            .done(function(res) {
                if(!!res.data.length){
                    create(res.data);
                }
            })
            .fail(function(error) {
                console.log(error);
            });
            function create(data){
                var str = '';
                _.forEach(data,function(v, k){
                    var img = v.cover_imageid !== undefined ? '/api/v2/web/thumbnail2/220/85/'+v.cover_imageid : '/static/img/diary/covers-default.jpg';
                    str += '<li>\
                    <h4 class="title"><a href="/tpl/diary/book/'+v._id+'">'+v.title+'</a></h4>\
                    <p class="tag">\
                        <span>'+v.house_area+'m&sup2;</span><i>|</i>\
                        <span>'+globalData.house_type(v.house_type)+'</span><i>|</i>\
                        <span>'+globalData.dec_style(v.dec_style)+'</span><i>|</i>\
                        <span>'+globalData.work_type(v.work_type)+'</span>\
                    </p>\
                    <a href="/tpl/diary/book/'+v._id+'" class="img">\
                        <img src="'+img+'" />\
                    </a>\
                    <div class="count">\
                        <span class="view">'+v.view_count+'</span>\
                    </div>\
                </li>'
                });
                oUl.html(str);
            }
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
        strToJson : function(str){    // 字符串转对象
            var json = {};
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    var  temp = arr[i].split("=");
                    json[temp[0]] = temp[1]
                };
            }else{
                var  temp = str.split("=");
                json[temp[0]] = temp[1]
            }
            return json;
        },
        jsonToStr : function (json){   // 对象转字符串
            var str = '';
            for (var i in json) {
                str += '&'+i+'='+json[i]
            };
            return str;
        },
        prevent : function(){

        }
    }
    var diary = new Diary;
    diary.init();
});
