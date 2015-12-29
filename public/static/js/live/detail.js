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
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init();
})
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
        var goto = new common.Goto();
        var Detail = function(){};
        Detail.prototype = {
            init  : function(){
                this.cacheData = {}; //全局数据缓存
                this.winHash = window.location.search.substring(1);
                this.detail = $("#j-detail");
                this.info = this.detail.find('.m-info');
                this.step = this.detail.find('.m-step');
                this.loading = this.detail.find('.k-loading');
                this.loadList();
            },
            loadList : function(){
                var self = this;
                $.ajax({
                    url:RootUrl+'api/v2/web/search_share',
                    type: 'POST',
                    contentType : 'application/json; charset=utf-8',
                    dataType: 'json',
                    data : JSON.stringify({
                        "query":{
                            "_id": self.winHash
                        },
                        "from":0,
                        "limit":1
                    }),
                    processData : false
                })
                .done(function(res) {
                    self.loading.addClass('hide');
                    if(res.data.total == 1){
                        self.createInfo(res.data.shares[0]);
                    }
                })
                .fail(function() {
                   window.location.href = '/404.html';
                });
            },
            createInfo  :  function(data){
                var process = data.process[data.process.length-1].name,
                    arr = [
                        '<div class="covers f-fl">',
                            '<img src="/api/v2/web/thumbnail/320/'+data.cover_imageid+'" alt="'+data.cell+'">',
                        '</div>',
                        '<div class="info f-fl">',
                            ''+(process == 7 && data.progress == 1 ? '<span class="end-icon"></span>' : "")+'',
                            '<h3>'+data.cell+'</h3>',
                            '<p><span>参考造价：'+data.total_price+'万元</span><span>包工类型：'+globalData.work_type(data.work_type)+'</span><span>户型：'+globalData.house_type(data.house_type)+'</span><span>面积：'+data.house_area+'m&sup2;</span></p>',
                            '<div class="step step'+process+'">',
                                '<div class="line"><div class="in"></div></div>',
                                '<ul class="status">'
                    ];
                    for (var i = 0; i < 8; i++) {
                        if(i < process){
                            arr.push('<li class="active"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else if(i == process && data.progress == 0){
                            arr.push('<li class="current"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else if(i == 7 && data.progress == 1){
                            arr.push('<li class="active"><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }else{
                            arr.push('<li><div class="dot"></div><p>'+globalData.dec_flow(i)+'</p></li>');
                        }
                    }
                    arr.push('</ul></div></div>');
                    arr.push('<dl class="people f-fr"><dt>设计师</dt><dd><a href="/tpl/design/home.html?'+data.designer._id+'"><img src="/api/v2/web/thumbnail/40/'+data.designer.imageid+'" alt="'+data.designer.username+'"><strong>'+data.designer.username+'</strong></a></dd>');
                    arr.push('<dt>项目经理</dt><dd><span><i class="iconfont">&#xe602;</i><strong>'+data.manager+'</strong></span></dd></dl>');
                    this.info.html(arr.join('')).removeClass('hide');
                    this.createStep(data.process,process,data.progress);
            },
            createStep : function(data,process,progress){
                var arr = ['<ul class="list '+(process == 7 && progress == 1 ? 'end' : '')+'">'],
                    li ;
                    for (var i = 0 , len = data.length; i < len; i++) {
                        var img = '';
                        li = '<li class="'+(i == process ? 'current' : 'active')+'"><dl><dt>'+globalData.dec_flow(data[i].name)+'</dt><dd>'+this.format(data[i].date , 'yyyy年MM月dd日')+'</dd></dl><div class="step"><span class="arrow"><i></i></span><ul class="img f-cb">';
                        for (var j = 0 , len2 = data[i].images.length; j < len2; j++) {
                            img += '<li class="'+(j%5 === 0 ? 'first' : '')+'"><img src="/api/v2/web/thumbnail/185/'+data[i].images[j]+'" alt=""></li>';
                        }
                        li += img + '</ul>';
                        if(data[i].description){
                           li += '<p class="txt">'+data[i].description+'</p>';
                        }
                        li += '</div></li>';
                         arr.push(li);
                    }
                    arr.push('</ul>');
                    this.step.html(arr.join('')).removeClass('hide');
                    goto.init();
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
        };
        var detail = new Detail();
        detail.init();
});
