require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common','lib/jquery.mousewheel.min'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
    var goto = new common.Goto();
    var LightBox = function(){};
    LightBox.prototype = {
        init : function(pos){
            this.doc = $(document);
            this.arr = pos.arr || [];
            this.select = pos.select || '.lightBox';
            this.parent = pos.parent || this.doc;
            if(this.arr.length){
                this.lightBoxAjax(this.arr);
            }
        },
        lightBoxAjax : function(arr){    //获取图片对象，供大图操作
            var _this = this;
            $.ajax({
                url: '/api/v2/web/imagemeta',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify({
                    _ids : arr
                }),
                processData : false
            })
            .done(function(res) {
                res.data.length && _this.lightBoxBindEvent(res.data);
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        lightBoxBindEvent : function(arr){
            var _this = this;
            var lightBox = $('<div class="m-lightBox"></div>');
            this.parent.find(this.select).css('cursor','pointer');
            this.parent.on('click',this.select,function(ev) {
                ev.preventDefault();
                _this.lightBoxShow(lightBox,arr,$(this).data('index')*1);
            });
        },
        lightBoxShow : function(obj,arr,index){
            var timer = null;
            var win = $(window).width();
            var doc = this.doc;
            var maxLen = ~~((win-200)/76);
            var len = arr.length;
            var isMove = len > maxLen;
            var _this = this;
            var i = index;
            var k = isMove ? (index > (len - maxLen) && index < len) ? (len - maxLen) : index - maxLen > 0 ? index - maxLen+1 : 0 : index;
            var close = $('<span class="close">&times;</span>');
            obj.append(close);
            var togglePrev = $('<span class="toggle prev" style="display: '+(index == 0 ? 'none' : 'block')+'"><i class="iconfont">&#xe611;</i></span>');
            var toggleNext = $('<span class="toggle next" style="display: '+(index == len-1 ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
            var imgBox = $('<div class="imgBox"><img class="imgBig" /></div>');
            imgBox.append(togglePrev);
            imgBox.append(toggleNext);
            var imgTab = $('<div class="imgTab"></div>');
            obj.append(imgBox);
            var tabPrev = $('<span class="toggle prev" style="display: '+(index == 0 ? 'none' : 'block')+'"><i class="iconfont">&#xe611;</i></span>');
            var tabNext = $('<span class="toggle next" style="display: '+(index <= len-1 && index > len-maxLen  ? 'none' : 'block')+'"><i class="iconfont">&#xe617;</i></span>');
            if(isMove){
                imgTab.append(tabPrev);
                imgTab.append(tabNext);
            }
            var tab = $('<div class="tab"></div>');
            var str = '<ul style="left:'+(isMove ? -76*k : 0)+'px;width:'+(len*76)+'px">';
            _.forEach(arr,function(k,v){
                str += '<li class="'+(v===index ? 'active' : '')+'"><span></span><img src="/api/v2/web/thumbnail2/66/66/'+k._id+'" /></li>'
            });
            str += '</div>';
            tab.html(str);
            imgTab.append(tab);
            obj.append(imgTab);
            var imgBig = obj.find('.imgBig');
            var oUl = obj.find('ul');
            var aLi = oUl.find('li');
            this.lightBoxImgBig(imgBig,arr,index);
            if(obj.css('display') === 'none'){
                obj.show();
            }else{
                $('body').append(obj);
            }
            close.on('click',function(){
                _this.lightBoxHide(obj);
                doc.off('mousewheel');
            });
            imgBox.on('click','.prev',function(){
                oUl.trigger("move:prev");
            });
            imgBox.on('click','.next',function(){
                oUl.trigger("move:next");
            });
            function thumbnailMove(){
                if(isMove){
                    oUl.stop().animate({
                        left:-76*k
                    });
                }
            }
            imgTab.on('click','li',function(){
                var n = $(this).index()*1;
                moveTo(n);
            });
            imgTab.on('click','.prev',function(){
                oUl.trigger("move:prev");
            });
            imgTab.on('click','.next',function(){
                oUl.trigger("move:next");
            });
            oUl.on('move:prev',function(){
                moveTo('prev');
            });
            oUl.on('move:next',function(){
                moveTo('next');
            });
            function moveTo(m){
                if(m === 'prev'){
                    if(i == 0){
                        i = 0
                    }else{
                        --i;
                    }
                    if(k == 0){
                        k == 0;
                    }else{
                        --k;
                    }
                }else if(m === 'next'){
                    if(i == len - 1){
                        i = len - 1;
                    }else{
                        ++i;
                    }
                    if(k == len - maxLen){
                        k == len - maxLen;
                    }else{
                        ++k;
                    }
                }else{
                    i = m;
                    k = i >= len - maxLen ? len - maxLen : m;
                }
                thumbnailMove();
                _this.lightBoxImgBig(imgBig,arr,i);
                _this.lightBoxToggle(aLi,i);
                togglePrev.toggle(i !== 0);
                toggleNext.toggle(i !== len-1);
                tabPrev.toggle(k !== 0);
                tabNext.toggle(k !== len - maxLen);

            }
            doc.on('keydown',function(event){
                switch (event.keyCode) {
                    case 37:    //左
                        oUl.trigger("move:prev");
                        break;
                    case 38:    //上
                        oUl.trigger("move:prev");
                        break;
                    case 39:    //右
                        oUl.trigger("move:next");
                        break;
                    case 40:    //下
                        oUl.trigger("move:next");
                        break;
                }
            });
            doc.one('mousewheel',mousewheelFn);
            doc.on('mousewheel',function(ev){
                ev.preventDefault();
            });
            function mousewheelFn(ev,direction){
                if( direction < 1 ){  //向下滚动
                    oUl.trigger("move:next");
                }else{  //向上滚动
                    oUl.trigger("move:prev");
                }
                clearTimeout(timer);
                timer = setTimeout(function(){
                    doc.one("mousewheel",mousewheelFn);
                },1200);
            }
        },
        lightBoxToggle : function(li,index){
            li.eq(index).addClass('active').siblings().removeClass('active');
        },
        lightBoxImgBig :function(obj,arr,index){
            obj.attr('src','').attr('src','/api/v2/web/image/'+arr[index]._id);
        },
        lightBoxHide : function(obj){
            obj.hide().html('');
        }
    };
    var lightBox = new LightBox();
    var Plans = function(){};
    Plans.prototype = {
        init : function(){
            this.plan = $('#j-plans');
            this.plans = this.plan.find('.m-plans');
            this.plansMsg = this.plan.find('.m-plansMsg');
            this.usertype = $.cookie("usertype");
            this.user = null;
            this.designer = null;
            this.limit = 10;
            this.more = null;
            var winHash = window.location.search.substring(1).split("=");
            if(winHash[0] === 'pid' && winHash[1]){
                this.loadData(winHash[1]);
            }else{
                window.location.href = '/404.html';
            }
        },
        loadData : function(id){
            var _this = this;
            $.ajax({
                url: '/api/v2/web/one_plan',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify({
                    '_id' : id
                }),
                processData : false
            })
            .done(function(res) {
                res.data && _this.render(res.data);
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        render : function(data){
            this.user = data.user;
            this.designer = data.designer;
            this.title(data);
            this.content(data);
            this.commentBox(data);
            if(data.status != 5 && data.requirement.status == 3 && this.usertype === '1'){
                this.motaiFn(data);
            }
        },
        title : function(data){
            var title = $('<div class="plans-tt f-cb"></div>');
            var h3 = $('<h3 class="f-fl"></h3>');
            if(!!data.requirement.basic_address){
                h3.append('<span><i>'+data.requirement.basic_address+'</i></span>')
            }
            if(!!data.requirement.detail_address){
                h3.append('<span><i>'+data.requirement.detail_address+'</i></span>')
            }
            if(data.status == 5){
                h3.append('<span style="color: #fe7004"><i>（已中标）</i></span>')
            }
            if(data.status == 4){
                h3.append('<span style="color: #999"><i>（未中标）</i></span>')
            }
            var btns = $('<div class="btns f-fr"></div>');
            if(this.usertype === '2'){
                btns.append('<a href="/tpl/user/designer.html#/requirement/'+data.requirementid+'/plan" class="u-btns u-btns-revise">返回方案列表</a>');
            }else{
                btns.append('<a href="/tpl/user/owner.html#/requirement/'+data.requirementid+'/plan" class="u-btns u-btns-revise">查看其它方案</a>');
            }
            if(data.status != 5 && data.requirement.status == 3 && this.usertype === '1'){
                btns.append('<a href="javascript:;" class="u-btns confirmPlans">选定方案</a>');
            }
            title.append(h3);
            title.append(btns);
            this.plans.html('').append(title);
        },
        confirmPlans : function(data,callback){
            $.ajax({
                url: '/api/v2/web/user/plan/final',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify(data),
                processData : false
            })
            .done(function(res) {
                callback && callback(res)
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        content : function(data){
            var _this = this;
            var work_type = data.requirement.work_type;
            var box = $('<div class="plans-ct"></div>');
            var tabs = $('<ul class="tabs"></ul>');
            if(work_type === '2'){
                tabs.append('<li class="active" data-id="1"><a href="javascript:;" style="cursor: default;">方案详情</a></li>');
            }else{
                var arr = [
                    {
                        id : 1,
                        name : '方案详情'
                    },
                    {
                        id : 2,
                        name : '方案报价'
                    }
                ];
                _.forEach(arr,function(k){
                    tabs.append('<li class="'+(k.id == 1 ? 'active' : '')+'" data-id="'+k.id+'"><a href="javascript:;">'+k.name+'</a></li>');
                });
            }
            box.append(tabs);
            this.detail(box,data);
            if(work_type === '0' || work_type === '1'){
                this.price(box,data);
            }
            this.plans.append(box);
            if(work_type === '0' || work_type === '1'){
                var boxs = this.plans.find('.boxs');
                this.plans.on('click','.tabs li',function(ev) {
                    ev.preventDefault();
                    $(this).addClass('active').siblings().removeClass('active');
                    boxs.hide();
                    _this.plans.find('.boxs[data-tab='+$(this).data('id')+']').show();
                    _this.plansMsg.toggle($(this).data('id') == 1);
                });
            }
        },
        detail : function(obj,data){
            var detail = $('<div class="boxs detail" data-tab="1"></div>');
            var ul = $('<ul class="info"></ul>');
            if(data.requirement.work_type != 2){
                ul.append('<li>报价：<span>'+formatNumber(data.total_price)+'元</span></li>')
            }
            if(data.requirement.work_type == 2){
                ul.append('<li>报价：<span>'+formatNumber(data.total_design_fee)+'元</span></li>')
            }
            if(data.requirement.work_type !== 2){
                ul.append('<li>工期：<i>'+data.duration+'</i>天</li>')
            }
            if(data.requirement.dec_type == 0){
                ul.append('<li>户型：<i>'+globalData.house_type(data.requirement.house_type)+'</i></li>')
            }
            if(data.requirement.house_area >= 0){
                ul.append('<li>面积：<i>'+data.requirement.house_area+'</i>m&sup2;</li>')
            }
            if(!!data.requirement.dec_style || data.requirement.dec_style === '0'){
                ul.append('<li>风格：<i>'+globalData.dec_style(data.requirement.dec_style)+'</i></li>')
            }
            detail.append(ul);
            var description = $('<div class="description f-cb"></div>');
            description.html(
                '<a href="/tpl/design/home.html?'+data.designer._id+'" class="head f-fl">' +
                (data.designer.imageid ? '<img src="/api/v2/web/thumbnail2/50/50/'+data.designer.imageid+'" alt="" />' : '')+
                '</a>' +
                '<dl class="f-fl">' +
                '<dt>' +
                '<a href="/tpl/design/home.html?'+data.designer._id+'">'+data.designer.username+'</a><span><i>v</i>认证设计师</span>' +
                '</dt>' +
                '<dd>' +
                '<span class="sub"></span>' +
                '<span class="sup"></span>' +
                '<p>'+(data.description ? data.description : '')+'</p>' +
                '</dd>' +
                '</dl>'
            );
            detail.append(description);
            var images = $('<div class="images"></div>');
            data.images.length &&  _.forEach(data.images,function(k,v){
                images.append('<img src="/api/v2/web/image/'+k+'" class="lightBox" data-index="'+v+'" />');
            });
            detail.append(images);
            obj.append(detail);
            lightBox.init({
                arr : data.images,
                select : '.lightBox',
                parent : this.plans
            });
        },
        price : function(obj,data){
            var quote = $('<div class="boxs quote f-cb" data-tab="2" style="display: none"></div>');
            var tableDiv = $('<div class="table f-fl"></div>');
            var table = $('<table></table>');
            var thead = $('<thead></thead>');
            thead.html('<tr class="title"><th class="td1"><span>项目</span></th><th class="td2"><span>备注说明</span></th><th class="td3"><span>项目总价(元)</span></th></tr>')
            table.append(thead);
            var tbody = $('<tbody></tbody>');
            data.price_detail.length && _.forEach(data.price_detail,function(k,v){
                tbody.append('<tr class="'+(v%2 == 0 ? 'even' : '')+'"><td class="td1"><span>'+k.item+'</span></td> <td class="td2"><p>'+k.description+'</p></td> <td class="td3"><span>'+commaNumber(k.price)+'</span></td></tr>');
            });
            table.append(tbody);
            tableDiv.append(table);
            var packagetype = $('<div class="package_type"></div>');
            packagetype.html('<a href="/zt/365package/index.html" target="_blank"><i class="iconfont">&#xe612;</i>点击此处了解更多关于‘简繁家365基础包’</a>')
            if(data.requirement.package_type === '1'){
                tableDiv.append(packagetype);
            }
            quote.append(tableDiv);
            var price = $('<div class="price f-fl"></div>');
            var after = !!data.project_price_after_discount ? '<li>工程折后价<span>&yen;<i>'+commaNumber(data.project_price_after_discount)+'</i></span></li>' : '';
            var costs = data.requirement.package_type === '1' && data.price_detail.length && data.price_detail[0] && data.price_detail[0].item === '365基础包';
            var costsbasis = costs ? '<li>基础费用<span>&yen;<i>'+commaNumber( data.price_detail[0].price )+'</i></span></li>' : '';
            var costsdiy = costs ? '<li>个性化费用<span>&yen;<i>'+commaNumber( data.project_price_before_discount - data.price_detail[0].price )+'</i></span></li>' : '';
            price.html(
                '<ul>' +
                costsbasis + costsdiy +
                '<li>工程总造价<span>&yen;<s class="'+(!data.project_price_after_discount ? 'notproject' : '')+'">'+commaNumber(data.project_price_before_discount)+'</s></span></li>'+
                after+
                '<li>设计费<span>&yen;<i>'+commaNumber(data.total_design_fee)+'</i></span></li>' +
                '</ul>' +
                '<dl>' +
                '<dt>合计总价</dt>' +
                '<dd>&yen;<i>'+commaNumber(data.total_price)+'</i></dd>' +
                '</dl>'
            );
            quote.append(price);
            obj.append(quote);
        },
        commentBox : function(data){
            var _this = this;
            var review = $('<div class="review"></div>');
            var head = $('<div class="head"></div>');
            if(this.usertype === '1' && data.user.imageid){   //业主
                head.html('<img src="/api/v2/web/thumbnail2/50/50/'+data.user.imageid+'" />');
            }else if(this.usertype === '2' && data.designer.imageid){  //设计师
                head.html('<img src="/api/v2/web/thumbnail2/50/50/'+data.designer.imageid+'" />');
            }
            review.append(head);
            var textBox = $('<div class="textarea"><textarea rows="10" name="content" id="contentMsg"></textarea></div>');
            var label = $('<label for="contentMsg">来说两句吧.......</label>');
            textBox.append(label);
            var btnBox = $('<div class="btns"><button type="button" class="u-btns addPlansMsg u-btns-disabled">发表评论</button></div>');
            review.append(textBox);
            review.append(btnBox);
            this.plansMsg.append(review);
            var list = $('<div class="list"><ul></ul></div>');
            this.plansMsg.append(list).show();
            var cMgs = $('#contentMsg');
            var addMsg = this.plansMsg.find('.addPlansMsg');
            var oUl = list.find('ul');
            cMgs.on('focus input propertychange',function(){
                label.hide();
                $(this).parent().addClass('focus');
            }).on('blur input propertychange',function(){
                if(_.trim($(this).val())){
                    addMsg.attr({'class':'u-btns addPlansMsg'});
                }else{
                    reset();
                }
            });
            addMsg.on('click',function(){
                if(!$(this).hasClass('u-btns-disabled')){
                    addmsgFn();
                }
            });
            loadList();
            label.on('click',function(){
                $(this).hide();
            });
            function reset(){
                label.show();
                cMgs.val('');
                cMgs.parent().removeClass('focus');
                addMsg.attr({'class':'u-btns addPlansMsg u-btns-disabled'});
            }
            $(window).keydown(function(event){
                if(event.keyCode == 13 && !addMsg.hasClass('u-btns-disabled')){
                    addmsgFn();
                }
            });
            function addmsgFn(){
                var addData = {
                    "topicid":data._id,
                    "topictype" : '0',
                    "content": _.trim(cMgs.val()),
                    "to":_this.usertype == 1 ? data.designer._id : _this.usertype == 2 ? data.user._id : undefined
                };
                reset();
                _this.commentSubmit(addData,function(res){
                    if(res.msg === "success"){
                        loadList();
                    }
                });
            }
            this.more = $('<div class="more" style="display: none"><a href="javascript:;" class="moreBtn">加载更多</a></div>');
            this.plansMsg.append(this.more);
            this.plansMsg.on('click','.moreBtn',function(ev){
                ev.stopPropagation();
                _this.more.hide();
                _this.limit += 10;
                loadList();
            });
            function loadList(){
                _this.commentList({
                    "topicid":data._id,
                    "from": 0,
                    "limit":_this.limit
                },oUl);
            }
            if(window.location.hash === '#plansMsg'){
                setTimeout(function(){
                    $('html,body').animate({
                        scrollTop : _this.plansMsg.offset().top
                    },0)
                },500)
            }
            this.plansMsg.on('click','.reply',function(ev){
                ev.stopPropagation();
                cMgs.focus();
            });
            goto.init();
        },
        commentList : function(data,obj){
            var _this = this;
            $.ajax({
                url: '/api/v2/web/topic_comments',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify(data),
                processData : false
            })
            .done(function(res) {
                res.data.total && _this.more.toggle(res.data.total - _this.limit > 0);
                obj.html(_this.comment(res.data));
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        comment : function(data){
            var str = '';
            var _this = this;
            _.forEach(data.comments,function(k,v){
                var usertypeOff = k.usertype != _this.usertype;
                str +=  '<li>'+
                        '<div class="head">'+
                        (k.byUser.imageid ? '<img src="/api/v2/web/thumbnail2/50/50/'+k.byUser.imageid+'" alt="" />' : '')+
                        '</div>'+
                        '<h4><span>'+ k.byUser.username+'</span><time>'+Date.timeAgo(k.date)+'</time></h4>'+
                        '<p>' +
                        (usertypeOff ? '<span class="find">@<i>'+(_this.usertype == 1 ? _this.user.username : _this.usertype == 2 ? _this.designer.username : '')+'</i></span>': '')+
                        '<span class="text">'+k.content+'</span>'+
                        (usertypeOff ? '<i class="iconfont2 reply">&#xe616;</i></p>' : '')+
                        '</li>'
            });
            return str;
        },
        commentSubmit : function(data,callbacks){
            $.ajax({
                url: '/api/v2/web/add_comment',
                type: 'POST',
                dataType: 'json',
                contentType : 'application/json; charset=utf-8',
                data : JSON.stringify(data),
                processData : false
            })
            .done(function(res){
                callbacks && callbacks(res);
            })
            .fail(function(error) {
                console.log(error);
            });
        },
        motaiFn : function(data){
            var _this = this;
            var motai = $('<div class="k-motai"></div>');
            var confirm = '<div class="motai done confirm">' +
                '<span class="done-icon confirm-icon"></span>' +
                '<h3>温馨提醒！</h3>' +
                '<p>您确认选定方案，选定以后不能更改</p>' +
                '<button type="button" class="u-btns u-btns-revise cancel">我再看看</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button type="button" class="u-btns define">已经确定</button>' +
                '</div>';
            var done = '<div class="motai done">' +
                '<span class="done-icon"></span>' +
                '<h3>选定成功！</h3>' +
                '<p>'+(data.requirement.work_type != 2 ? '设计师将在近期内生成第三方合同，请保持紧密沟通。' : '简繁家将在近期内与您第三方合同，请保持紧密沟通。')+'</p>' +
                '<a href="owner.html#/requirement/'+data.requirementid+'/plan" class=u-btns jumping">&nbsp;&nbsp;确定&nbsp;&nbsp;</a>'
                '</div>';
            motai.html(confirm);
            $('body').append(motai);
            this.plans.on('click','.confirmPlans',function(){
                motai.show();
            });
            motai.on('click','.cancel',function(){
                motai.hide();
            });
            motai.on('click','.define',function(){
                motai.html('<div class="motai done pending">请稍后，正在提交中。。。</div>');
                _this.confirmPlans({
                    "planid": data._id,
                    "designerid": data.designerid,
                    "requirementid":  data.requirementid
                },function(res){
                    motai.html(done);
                })
            });
        }
    };
    var plan = new Plans();
    plan.init();
});