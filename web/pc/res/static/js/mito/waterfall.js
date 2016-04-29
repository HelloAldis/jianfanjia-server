define(['jquery','lodash','lib/jquery.cookie'],function($,_){
    var createCellLoader = function(){};
    createCellLoader.prototype.init = function(josn , page, fn, tpl,query) {
        if(!josn){
          $.error("没有配置请求参数")
          return ;
        }
        if(!_.isFunction(fn)){
          $.error("没有配置返回数据函数")
          return ;
        }
        if(!tpl){
          $.error("没有配置显示模板")
          return ;
        }
        if(!query){
          $.error("没有配置搜索提示选择器")
          return ;
        }
        function a(d) {
            var compiled = tpl && _.template(tpl.template);
            return compiled({ 'data': d });
        }
        function schmsg(input,size){    //显示搜索消息
          var str = '<strong>搜索内容</strong><i class="f-st">&gt;</i><span class="tags">'+input+'<i>X</i></span><span class="result">共<i>'+size+'</i>结果</span>'+(!size ? '<span class="tips">以下是根据您搜索的装修美图</span>' : '');
          query.info.html(str).removeClass('hide');
        }
        var off = false, o = false, u = [];
        var l = 0, c = {};
        return function(h, p) {
            if (off){
              return;
            }
            off = true;
            var d = _.last(h.cells), v = d ? d.seq : null;
            h.showIndicator(), _.isNumber(page) && page++,
            page ? (c.page = page-1, c.per_page = josn.data.limit) : (c.max = v, c.limit = josn.data.limit),
            tpl.max_loads && n && (c.page_loads = c.page, delete c.page),
            c.wfl = 1,
            tpl && tpl.snapshot && (c.snapshot = app.page.snapshot),
            tpl.time && (c.time = tpl.time),
            tpl.maxs && l == 0 && (c.maxs = tpl.maxs);
            function m() {
                l++;
                josn.data.from = (c.page-1)*josn.data.limit;
                $.ajax({
                  url:josn.url,
                  type: josn.type,
                  contentType : josn.contentType,
                  dataType: josn.dataType,
                  data : JSON.stringify(josn.data),
                  processData : josn.processData
                })
                .done(function(req) {
                  var data;
                  h.hideIndicator();
                  data = fn ? fn(req) : {'data': req.data.beautiful_images};
                  josn.data.search_word && schmsg(josn.data.search_word,data.data.length);
                  data.data.length && _.forEach(data.data, function(n,k){
                    n.dec_style = n.dec_style ? globalData.dec_style(n.dec_style) : '';
                    n.house_type = n.house_type ? globalData.house_type(n.house_type) : '';
                    n.seq = (c.page)+"-"+k;
                    n.imgW = 291;
                    n.imgWD = n.images[0].width;
                    n.imgHD = n.images[0].height;
                    n.imgH = n.imgHD * (n.imgW / n.imgWD);
                    h.append(a(n));
                  }),
                  data.page && (page = data.page),
                  page ? (data.data.length == 0 && h.stopLoader(tpl.max_loads ? false : true,josn.data.from),
                  tpl.max_loads && l >= tpl.max_loads && h.stopLoader(false,josn.data.from)) : d.data.length < t && h.stopLoader(tpl.max_loads ? false : true,josn.data.from);
                })
                .fail(function() {
                  //console.log("error");
                })
                .always(function(req) {
                    off = false;
                });
            }
            m();
        }
    };
    var Waterfall = function(){};
    Waterfall.prototype = {
      init : function(id,settings){  //初始化
          var options  = {     //配置文件
              container: null,    //容器id
              cellWidth: 291,      //单元格宽度
              cellSpace: 12,       //单元格间距
              minCols: 4,         //最小列数
              maxCols: 4,        //最大列数
              cellSelector: ".wfc",   //单元格选择器
              sideSpace: 0,
              preservedCols: 0,     //保存下来列数
              hibernate: 5000,
              viewportExtend: 500,
              containerSelector: "div.wrapper",  //父容器选择器
              loadOffset: 100,
              paddingBottom: false,
              loader: null,    //加载数据
              fetcher: false,   //读取
              autoResize: true,  //自动调整
              scrollEl: window,    //滚动对象
              transitionClass: "wft",   //过度class
              containerSelectorOffset: 50,   //父容器偏移
              endEl: null   //结束对象
        };
        _this = this;
        this.element = $(id);
        this.options = $.extend(true, options, settings);
        this.container = this.options.container ? $(this.options.container) : this.element.parent();
        this.cols = 0;
        this.width = 0;
        this.height = 0;
        this.cells = [];
        this._visibleCells = [];   //可见列表
        this._top = this.container.offset().top;
        this.options.loader && (this._indicator = this._createIndicator());
        this.options.fetcher && (this._newIndicator = this._createNewIndicator());
        this._pending = [];   //待定列表
        this.options.cellSelector && this.element.find(this.options.cellSelector).each(function(e) {
            _this.cells.push(_this.newCell(e));
        });
        $.cookie("wft") && ($.removeCookie("wft"),
        this.options.transitionClass && $.map( _this.cells , function(n){return n.addClass(_this.options.transitionClass);}));
        this.reposition(true);
        this.attach();
        return this;
      },
      toElement : function(){   //获取元素
        return this.element;
      },
      clear : function(id){
        $(id).html('').css({
          'height': 0,
          'min-height': 0
        }).siblings().remove();
      },
      newCell :function(e, t){     //新的单元
          try {
              $(e).find(".img img").on("load", function() {
                  try {
                      $(this).parent(".img").addClass("loaded")
                  } catch (e) {
                  }
              })
          } catch (n) {
          }
          var r = (new Waterfall.Cell).init(this, e);
          return $(this.options.cellSelector).hasClass("right") && (r.fixed = "topright"), t && (r = this._position(r)), r
      },
      destroy :function(){     //销毁
        this.detach(),
        this._indicator && this._indicator.remove();
      },
      _createIndicator : function(){    //创建loading加载提示
        var str = '<div class="k-loading"><div class="spinner">'+
    '<div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>'+
    '<div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>'+
    '<div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>'+
    '</div><p>正在加载中...</p></div>'
        var oDiv = $('<div />');
            oDiv.attr("class", "loading");
            oDiv.html(str);
            this.element.after(oDiv);
            oDiv.hide();
        return oDiv;
      },
      showIndicator: function() {    //显示加载提示
          this._indicator && this._indicator.show();
      },
      hideIndicator: function() {    //隐藏加载提示
          this._indicator && this._indicator.hide();
      },
      attach : function(){    //连接
          var _this = this;
          this.options.autoResize && $(window).on("resize.waterfall", function(){
            _this.throttle(function(){
              _this.resize();
            },{context : _this});
          });
          this.options.scrollEl && $(this.options.scrollEl).on("scroll.waterfall", function(){
            _this.throttle(function(){
              _this.scroll();
            },{context : _this});
          });
      },
      detach : function(){    //分离
          var _this = this;
          this.options.autoResize && $(window).off("resize.waterfall");
          this.options.scrollEl && $(this.options.scrollEl).off("scroll.waterfall");
      },
      resize : function(){   //调整事件
          return this.reposition()
      },
      scroll : function(){   //滚动事件
        this._updateViewport();
        if (!this.options.loader || this._stopLoading || this._pending.length){
          return;
        }
        var e = $(this.options.scrollEl).height(), t = $(this.options.scrollEl).scrollTop(), n = this._hs[this._minCol || 0] + this._top;
        if (t + e < n - this.options.loadOffset){
            return;
        }
        this.options.loader(this);
      },
      stopLoader: function(e,p) {   //停止加载
        console.log(e,p)
        var str = this.options.endEl || p === 0 ? '<div class="k-notData search" id="k-notData"><h4><i class="iconfont">&#xe626;</i></h4><p>很抱歉您匹配的内容暂时无法提供，请更改匹配。</p></div>' : '<div class="k-notData k-notData2" id="k-notData2"><p>更多内容正在装修中...</p></div>';
        return this._stopLoading = true, e && this._indicator && this._indicator.html(str).show(), this.options.paddingBottom && this._equalise(), this
      },
      startLoader: function() {   //开始加载
          return this._stopLoading = false, this._indicator && (this._indicator.destroy(), this._indicator = this._createIndicator()), this
      },
      getColsHeight: function() {    //获取单列高度
          return this._hs
      },
      getLast: function() {    //获取最后一个
          var _this = this;
          return _.last(_this.cells)
      },
      getFirst : function(e) {    //获取第一个
        var t = this.cells;
        for (var n = 0; n < t.length; n++)
            if (t[n].seq)
                return e ? {cell: t[n],index: n} : t[n];
        return null
      },
      getFirstSeq : function(e) {   //得到第一序列
          var t = this.getFirst();
          return t ? t.seq : -1
      },
      reposition : function(e){  //复位
          if (this._layout(e)) {
              var t = this.cells;
              for (var n = 0, r = t.length; n < r; n++){
                  this._position(t[n]);
              }
              this._updateViewport(true);
              this.options.paddingBottom && this._equalise();
              this.scroll();
          }
          return this
      },
      update : function(e){   //更新
          e = typeOf(e) === "element" ? e.retrieve("wf:cell") : e;
        var t = e.col, n = e.getElementHeight(), r = n - e.height, i = this.cells, s = i.indexOf(e), o = [];
        for (var u = s + 1, a = i.length; u < a; u++) {
            var f = i[u];
            f.col === t && f.position(f.left, f.top + r, t)
        }
        return e.updateHeight(), this._hs[t] += r, this.options.paddingBottom && this._equalise(), f = this.porscheSubCell, f && f.col == e.col && e.top < f.top && (f.position(f.left, f.top + r, t), this._adjustPorscheCell()), this
      },
      remove : function(e){  //删除
          e = $(e), e.each(function(e) {
              var t = e.dispose().retrieve("wf:cell");
              t.attached && this._visibleCells.erase(t), this.cells.erase(t)
          }.bind(this)), this.reposition(true)
      },
      insert : function(e){   //添加最前面
          e = $$(e);
          var t = this.getFirst(true);
          !t && this.cells.length === 1 && (t = {index: 1});
          var n = t ? t.index : 0, r = e.map(function(e) {
              return this.newCell(e)
          }, this);
          r.unshift(n, 0), Array.prototype.splice.apply(this.cells, r), docScroller.toTop(), this.reposition(true)
      },
      append : function(e){   //添加在后面
          var t = this.newCell(e, true);
          return this.cells.push(t), this
      },
      _position : function(e){
          var t = this.cols - this.options.preservedCols, n = 0, r = this._hs;
        if (e.fixed === "topright"){
          n = t - 1;
        }else{
          for (var i = 0; i < t; i++){
            r[i] < r[n] && (n = i);
          }
        }
        var s = n * (this.options.cellWidth + this.options.cellSpace), o = r[n];
        e.position(s, o, n), r[n] += e.height + this.options.cellSpace;
        var u = min = 0;
        for (var i = 0; i < t; i++)
            r[i] < r[min] && (min = i), r[i] > r[u] && (u = i);
        return this._maxCol = u, this._minCol = min, this._height = r[u] + this.options.containerSelectorOffset, this.element.css("height", this._height), e
      },
      _equalise : function(){  //均衡器
          var e = this.cols - this.options.preservedCols;
        this._snaps = this._snaps || $();
        console.log(this._snaps.length < e)
        if (this._snaps.length < e) {
            var t = e - this._snaps.length;
            console.log(t)
            for (var i = 0; i < t; i++) {
              this._snaps.push($("<div />").addClass("padding-block"))
            };
        }
        //this._snaps.dispose();
        var n = this._hs, r = n[this._maxCol], i = 0;
        for (var s = 0; s < e; s++){
          i = r - n[s] - this.options.cellSpace;
          this._snaps[s].css({height: r === n[s] || i < 0 ? 0 : i,left: s * (this.options.cellWidth + this.options.cellSpace),top: n[s],width: this.options.cellWidth,paddingBottom: r === n[s] ? 40 : 60}).appendTo(this.element)
        }

      },
      getVisibleCells : function(){   //获取可见单元格
          var e = this._visibleCells, t = e.length, n = new Array(t);
          while (t--)
              n[t] = e[t];
          return n
      },
      _updateViewport : function(e){    //更新视图
          if (!this.options.hibernate || this._height < this.options.hibernate)
            return;
        var t = this.cells.length;
        if (t == 0)
            return;
        var n = $(window).scrollTop();
        this._lastScroll = this._lastScroll || 0;
        var r = Math.abs(n - this._lastScroll);
        if (!e && r < 50)
            return;
        var i = $(window).height(), s = this.element.position().top, o = n > s ? n - s : 0, u = o + i + this.options.viewportExtend;
        o -= this.options.viewportExtend, o < 0 && (o = 0), this._viewport = [o, u], this._updateCells(), this._lastScroll = n
      },
      cellVisible : function(e){  //单元格可见
        var t = this._viewport[0],
        n = this._viewport[1];
        return !(e.bottom < t || e.top > n)
      },
      _updateCells : function(){   //更新单元格
        var e = this._viewport[0],
        t = this._viewport[1],
        cells = this.cells,
        r = cells.length,
        i = r - 1,
        s = 0,
        o = 0,
        arr = [];
        while (i > s) {
            o = Math.floor((s + i) / 2);
            var a = cells[o];
            if (a.bottom < e || a.top > t) {
                if (a.top > t) {
                    i = o - 1;
                    continue
                }
                s = o + 1;
                continue
            }
            break
        }
        arr.push(cells[o]);
        for (var f = o + 1, l = 10; f < r && l > 0; f++) {
            var a = cells[f];
            a.bottom < e || a.top > t ? l-- : arr.push(a)
        }
        for (var f = o - 1, l = 10; f >= 0 && l > 0; f--) {
            var a = cells[f];
            a.bottom < e || a.top > t ? l-- : arr.unshift(a)
        }
        var arr2 = _.filter(this.getVisibleCells(),function(val) {
            return !_.indexOf(arr,val) && (val.bottom < e || val.top > t)
        });
        _.map(arr, function(val) {
          return val["attach"].call(val, "attach")
        });
        _.map(arr2, function(val) {
          return val["detach"].call(val, "detach")
        })
      },
      _layout: function(e) {  //布局
          var t = this.options.cellWidth + this.options.cellSpace,
        n = Math.floor((this.container.width() - this.options.sideSpace * 2) / t);
        n > this.options.maxCols && (n = this.options.maxCols),
         n < this.options.minCols && (n = this.options.minCols);
        if (!e && this.cols === n)
            return !1;
        var r = [];
        for (var i = 0; i < n; i++)
            r.push(0);
        return this.width = n * t - this.options.cellSpace, this.cols = n, this._hs = r, $(this.options.containerSelector).css("width", this.width), true
      },
      throttle  : function(){
          var isClear = arguments[0],fn;
          if(_.isBoolean(isClear)){
              fn = arguments[1];
              fn._throttleID && clearTimeout(fn._throttleID)
          }else{
              fn = isClear;
              param = arguments[1];
              var oP = _.assign({
                  context : null,
                  args : [],
                  time : 300
              },param);
              arguments.callee(true,fn);
              fn._throttleID = setTimeout(function(){
                  fn.apply(oP.context , oP.args)
              }, oP.time)
          }
      }
    }
    Waterfall.Cell = function(){};  //单元格
    Waterfall.Cell.prototype = {
        init: function(e, t) {    //初始化
            this.waterfall = e;
            this.element = $(t);
            //this.element.appendTo(this.waterfall.toElement());
            this.fixed = this.element.hasClass("topright") ? "topright" : this.element.hasClass("topleft") ? "topleft" : false, this.updateHeight();
            this.seq = this.element.data("seq");
            this.col = 0;
            this.left = this.top = this.bottom = -1;
            this.html = null;
            this.attached = !!this.element.parentNode;
            this._register();
            return this;
        },
        toElement: function() {    //获取元素
            return this.element;
        },
        updateHeight: function() {     //更新高度
            this.element.parentNode ? this.height = this.element.height() : (this.element.css("top", -1000).appendTo(this.waterfall.toElement()),this.height = this.element.height(),this.element.css("top", this.top));
        },
        getElementHeight: function() {     //获取元素高度
            return this.element.height();
        },
        position: function(e, t, n) {      //位置
          this.left = e;
          this.top = t;
          this.bottom = this.top + this.height;
          this.col = n;
          this.element.css({left: this.left,top: this.top})
        },
        _register: function() {      //寄存器
            var e = this.toElement();
            this.height = e.height() > 0 ? e.height() : this.height;
            this.attached ? this.waterfall._visibleCells.push(this) : _.remove(this.waterfall._visibleCells,this);
        },
        attach: function(e) {   //连接
            if (this.attached){
              return ;
            }
            var t = this.toElement();
            this.html && t.html(this.html);
            this.html = null;
            t.appendTo(this.waterfall.toElement(), e || "bottom");
            t.css("opacity", 1);
            this.attached = true;
            this._register();
        },
        detach: function() {    //分离
            if (!this.attached){
                return ;
            }
            var e = this.toElement();
            this.html = e.html();
            e.html();
            e.css("opacity", 0);
            this.attached = false;
            this._register();
        }
    }
    return {
      Waterfall : Waterfall,
      createCellLoader : createCellLoader
    };
})
