require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash'
    },
    shim   : {
        'jquery.cookie': {
            deps: ['jquery']
        },
        'jquery.history': {
            deps: ['jquery']
        }
    }
});
require(['jquery','lodash','lib/jquery.cookie','utils/common'],function($,_,cookie,common){
    var user = new common.User();
    user.init();
    var search = new common.Search();
    search.init({
        defaults : 1
    });
})
require(['jquery','lodash','lib/jquery.cookie','lib/jquery.history','utils/common','mito/waterfall'],function($,_,cookie,history,common,water){
  var History = window.History;
  var goto = new common.Goto();
  var createCellLoader = new water.createCellLoader();
  var waterfall = new water.Waterfall();
  var Mito = function(){};
  Mito.prototype = {
    init : function(){
            this.win = window;
            this.doc = document;
            this.limit = 20;  //获取列表条数
            this.toFrom = 0;  //初始化分页起始位置
            this.total = 0;  //总页数
      this.winHash = this.win.location.search.split("?")[1];
            this.cacheDataIndex = 0; //取数据的起始位置
            this.cachePageData = {}; //分页数据缓存
            this.iCells = 4;
            this.page = 1;
            this.iWidth = 291;
            this.iSpace = 12;
            this.iOuterWidth = this.iWidth + this.iSpace;
            this.arrT = [];
            this.arrL = [];
            this.iBtn = true;
            this.isRenderView = false;
              this.mito = $("#j-mito");
              this.schInfo = this.mito.find('.m-sch-info');
              this.list = this.mito.find('.m-list');
              this.filter = this.mito.find('.m-filter');
              this.sort = this.mito.find('.m-sort');
            this.content = this.mito.find('.m-content');
            this.notData = this.mito.find('.k-notData');    //获取无数据展示元素
            this.search = $('#j-sch');
            this.toQuery = {};
            this.toSort = {};
            this.toFrom = 0;
            this.searchWord = "";
            if(!!this.winHash){
                this.setDefault(this.winHash);
            }else{
                this.loadList();
            }
            goto.init();
            this.toggle();
            this.sortfn();
            this.defaultSort();
            this.filterfn();
            this.submitBtn();
        },
        submitBtn : function(){     //搜索按钮
            var submitBtn = this.search.find('form'),
                downSelect = this.search.find('.u-sch-ds'),
                oInput = this.search.find('.input'),
                oSapn = downSelect.find('.u-sch-ds-txt span'),
                self = this;
            submitBtn.on('submit',function(){
                if(!!oInput.val() && oInput.val() != '搜索'+oSapn.html()){
                    self.searchWord = oInput.val();
                    self.setQueryMin();
                    self.setQuery();
                    History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?query="+encodeURI(self.searchWord));
                    self.notData.addClass('hide');
                    this.toFrom = 0;
                    waterfall.clear('#waterfall');
                    self.loadList();
                }
                return false;
            })
            this.clearTags();
        },
    loadList : function(){   //渲染生成列表
      var self = this;
            this.toSort = _.isEmpty(this.toSort) ? undefined : this.toSort;
            this.toQuery = this.toQuery;
            var oldData = {"query":this.toQuery,"sort":this.toSort,"search_word":this.searchWord,"from":this.toFrom,"limit":this.limit};
            var arr = [
                '<div class="wfc" data-id="<%= data._id %>" data-seq="<%= data.seq %>">',
                '<div class="box">',
                    '<a href="/tpl/mito/detail.html?pid=<%= data._id %>&imgid=<%= data.images[0].imageid %>&imgw=<%= data.imgWD %>&imgh=<%= data.imgHD %>" target="_blank" class="img">',
                        '<img src="/api/v2/web/thumbnail2/<%= data.imgW %>/<%= data.imgH %>/<%= data.images[0].imageid %>" width="<%= data.imgW %>" height="<%= data.imgH %>" alt="">',
                    '</a>',
                    '<div class="txt">',
                        '<h4><a href="/tpl/mito/detail.html?pid=<%= data._id %>&imgid=<%= data.images[0].imageid %>&imgw=<%= data.imgWD %>&imgh=<%= data.imgHD %>" target="_blank"><%= data.title %></a></h4>',
                        '<p><span><%= data.dec_style %></span><span><%= data.house_type %></span><span><%= data.section %></span></p>',
                    '</div>',
                '</div>',
                '<div class="shadow"><div class="noe"></div><div class="two"></div></div></div>'
            ];
            (new water.Waterfall()).init('#waterfall',
            {
                container : '#j-waterfall',
                loader:createCellLoader.init({
                        url:RootUrl+'api/v2/web/search_beautiful_image',
                        type: 'POST',
                        contentType : 'application/json; charset=utf-8',
                        dataType: 'json',
                        data : oldData,
                        processData : false
                    },1,function(res){
                        return {data:res.data.beautiful_images}
                    },{template:arr.join('')},{info : self.schInfo, not : self.notData})
            }).reposition();
        },
        setDefault : function(defaultData){     //设置url参数默认值
            var self = this,
                oQuery = {},
                oSort = {},
                urlJson = this.strToJson(defaultData);
                this.toFrom = 0;  //设置分页初始化
                this.searchWord = $.trim(decodeURI(urlJson.query));   //获取搜索值
                if(!!this.searchWord){   //如果有参数就设置输入框
                    this.search.find('.input').val(this.searchWord);
                    this.search.find('.u-sch-inp').addClass('u-sch-inp-focus');
                }
                for(var i in urlJson){
                    if( i == 'lastupdate' || i == 'view_count' ){
                            oSort[i] = urlJson[i];
                    }else if( i == 'house_type' ||  i == 'dec_style' ){
                        oQuery[i] = urlJson[i];
                    }else if(i == 'section'){
                        oQuery[i] = decodeURI(urlJson[i]);
                    }
                }
            this.toQuery = oQuery;
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = oSort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
            this.toFrom = 0;
            waterfall.clear('#waterfall');
            self.loadList();
        },
        setQuery : function(query){     //设置筛选当前状态
          var list = this.filter.find('.list');
            list.find('a').removeClass();
            if(query == undefined){
                list.find('dl').each(function(index, el) {
                    $(el).find('a').eq(0).addClass('current');
                });
                return ;
            }
            list.find('dl').each(function(index, el) {
                $.each(query,function(i){
                    if($(el).data('type') == i){
                        $(el).find('a').each(function(index, el1) {
                            $(el1).removeClass();
                            if($(el1).data('query') == query[i]){
                                $(el1).addClass('current');
                            }
                        })
                        return false;
                    }else{
                        $(el).find('a').eq(0).addClass('current');
                    }
                })
            });
        },
        setQueryMin : function(query){
            var arr = [
                '<dl>',
                    '<dt>空&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间</dt>',
                    '<dd>'+(query == undefined　||　query.section == undefined ? '不限' : query.section)+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>装修户型</dt>',
                    '<dd>'+(query == undefined　||　query.house_type == undefined ? '不限' : globalData.house_type(query.house_type))+'</dd>',
                '</dl>',
                '<dl>',
                    '<dt>擅长风格</dt>',
                    '<dd>'+(query == undefined　||　query.dec_style == undefined ? '不限' : globalData.dec_style(query.dec_style))+'</dd>',
                '</dl>',
                '<div class="minbtns">',
                    '<span href="javascript:;" class="more-btn"><span></span><i></i></span>',
                '</div>'
            ];
            this.filter.find('.min').html(arr.join(''))
        },
        setSort  : function(sort){    //设置排序当前状态
            this.sort.find('strong').attr('class', '');
            this.sort.find('a').removeClass();
            if(sort == undefined){
                this.sort.find('strong').attr('class', 'current');
                return ;
            }
          this.sort.find('a').each(function(index, el) {
            $.each(sort,function(i){
              if($(el).data('sort') == i){
                if(sort[i] == 1){
                  $(el).attr('class', 'current sort');
                }else{
                  $(el).attr('class', 'current');
                }
              }else{
                $(el).removeClass();
              }
            });
          })
        },
        filterSort :   function(off){      //筛选排序处理函数
          var self = this,
                filter = {},
                sort = {};
                this.sort.find('a').each(function(index, el) {
                    if($(el).hasClass('current')){
                        if($(el).hasClass('sort')){
                            sort[$(el).data('sort')] = 1
                        }else{
                            sort[$(el).data('sort')] = -1
                        }
                    }
                });
                this.filter.find('a').each(function(index, el) {
                    var oDl = $(this).closest('dl');
                    if($(this).hasClass('current') && $(this).data('query') != -1){
                        filter[oDl.data('type')] = $(this).data('query');
                    }
                });
            this.toQuery = filter;
            _.isEmpty(self.toQuery) || this.setQueryMin(self.toQuery);
            _.isEmpty(self.toQuery) || this.setQuery(self.toQuery);
            self.toSort = sort;
            _.isEmpty(self.toSort) || this.setSort(self.toSort);
            this.toFrom = 0;
            History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?query="+encodeURI(self.searchWord)+self.jsonToStr(self.toQuery)+self.jsonToStr(self.toSort));
            this.notData.addClass('hide');
            waterfall.clear('#waterfall');
            this.loadList();
        },
        sortfn : function(){   //排序
          var self = this;
        this.sort.delegate('a','click',function(ev){
          if($(this).hasClass('current') && $(this).hasClass('sort')){
            $(this).removeClass('sort');
          }else if($(this).hasClass('current')){
            $(this).addClass('sort');
          }
          $(this).addClass('current').siblings().removeClass('current');
          self.filterSort();
          return false;
        });
        },
        defaultSort : function(){     //默认排序
          var self = this;
          this.sort.delegate('strong','click',function(ev){
            if($(this).hasClass('current')){
              return ;
            }else{
              $(this).addClass('current').siblings().removeClass('current');
            }
            self.filterSort(true);
            return false;
          });
        },
        filterfn    : function(){   //筛选
          var self = this;
          this.filter.find('.list').delegate('a','click',function(ev){
            if($(this).hasClass('current')){
              return false;
            }
            $(this).attr('class','current').siblings().attr('class', '');
            self.filterSort();
            return false;
          });
        },
        toggle   : function(){    //更新筛选
          var self = this;
            this.filter.delegate('.min','click',function(ev){
                ev.preventDefault();
                self.filter.addClass('toggle');
            }).delegate('.btns','click',function(ev){
                ev.preventDefault();
                self.filter.removeClass('toggle');
            });
        },
        clearTags : function(){
            var self = this;
            this.schInfo.delegate('.tags','click',function(ev){
                ev.preventDefault();
                self.searchWord = "";
                History.pushState({state:1}, "装修美图--互联网设计师专单平台|装修效果图|装修流程|施工监理_简繁家 第1页", "?");
                self.notData.addClass('hide');
                self.setQueryMin();
                self.setQuery();
                self.setSort();
                self.search.find('.input').val('搜索装修美图');
                self.search.find('.u-sch-inp').removeClass('u-sch-inp-focus');
                self.schInfo.html('').addClass('hide');
                self.toFrom = 0;
                waterfall.clear('#waterfall');
                self.loadList();
            });
        },
        strToJson : function(str){    // 字符串转对象
            var json = {},temp;
            if(str.indexOf("&") != -1){
                var arr = str.split("&");
                for (var i = 0,len = arr.length; i < len; i++) {
                    temp = arr[i].split("=");
                    json[temp[0]] = temp[1];
                }
            }else{
                temp = str.split("=");
                json[temp[0]] = temp[1];
            }
            return json;
        },
        jsonToStr : function (json){   // 对象转字符串
            var str = '';
            for (var i in json) {
                str += '&'+i+'='+json[i];
            }
            return str;
        }
  };
  var mito = new Mito();
  mito.init();
});


