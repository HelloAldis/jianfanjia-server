function (t, e, n) {
    "use strict";
    var r = Object.prototype.toString;
    n.exports = function (t) {
        var e;
        return null == t ? e = String(t) : (e = r.call(t).toLowerCase(), e = e.substring(8, e.length - 1)), e
    }
}
function type(t) {    //检测数据类型
    "use strict";
    var r = Object.prototype.toString;
    var e;
    return null == t ? e = String(t) : (e = r.call(t).toLowerCase(), e = e.substring(8, e.length - 1)), e
}
function extend() {    //对象拷贝
    "use strict";
    function n(t) {
        var r;
        if (!t || "object" !== type(t) || t.nodeType || "setInterval" in t)return !1;
        if (t.constructor && !a.call(t, "constructor") && !a.call(t.constructor.prototype, "isPrototypeOf"))return !1;
        for (r in t);
        return void 0 === r || a.call(t, r)
    }

    var a = Object.prototype.hasOwnProperty;
    e.exports = function c() {
        var t, r, e, a, i, u, s = arguments[0] || {}, f = 1, l = arguments.length, p = !1;
        for ("boolean" == typeof s && (p = s, s = arguments[1] || {}, f = 2), "object" != typeof s && "function" !== o(s) && (s = {}), l === f && (s = this, --f); l > f; f++)if (null != (t = arguments[f]))for (r in t)e = s[r], a = t[r], s !== a && (p && a && (n(a) || (i = "array" === o(a))) ? (i ? (i = !1, u = e && "array" === o(e) ? e : []) : u = e && n(e) ? e : {}, s[r] = c(p, u, a)) : void 0 !== a && (s[r] = a));
        return s
    }
}
function (t, r, e) {
    "use strict";
    function n(t) {
        var r;
        if (!t || "object" !== o(t) || t.nodeType || "setInterval" in t)return !1;
        if (t.constructor && !a.call(t, "constructor") && !a.call(t.constructor.prototype, "isPrototypeOf"))return !1;
        for (r in t);
        return void 0 === r || a.call(t, r)
    }

    var o = t("type"), a = Object.prototype.hasOwnProperty;
    e.exports = function c() {
        var t, r, e, a, i, u, s = arguments[0] || {}, f = 1, l = arguments.length, p = !1;
        for ("boolean" == typeof s && (p = s, s = arguments[1] || {}, f = 2), "object" != typeof s && "function" !== o(s) && (s = {}), l === f && (s = this, --f); l > f; f++)if (null != (t = arguments[f]))for (r in t)e = s[r], a = t[r], s !== a && (p && a && (n(a) || (i = "array" === o(a))) ? (i ? (i = !1, u = e && "array" === o(e) ? e : []) : u = e && n(e) ? e : {}, s[r] = c(p, u, a)) : void 0 !== a && (s[r] = a));
        return s
    }
}


function (t, e, i) {
    "use strict";
    function a(t) {
        var e = Object.keys(t), i = [];
        return e.forEach(function (e) {
            i.push(e + "=" + t[e])
        }), i.join("&")
    }

    function n() {
        var t = this;
        t.statUrl = c.stat.statUrl, t.comStat = {appid: "0109b1e2e426", uuid: o.getUnUCUid()};
        var e = o.getQueryVariable("ch");
        e && (t.comStat.ch = e), window.location.hash.search("share=1") > 0 && (t.comStat.share = 1), t.pvStatInited = !1, t.lastLogTime = +new Date, t.lastPage = "", t.hided = !1, document.addEventListener("visibilitychange", t.tabHide.bind(t)), document.addEventListener("webkitvisibilitychange", t.tabHide.bind(t)), n = function () {
            return t
        }
    }

    var s = t("u/model"), o = t("u/utils"), c = t("config"), d = t("extend"), r = n.prototype;
    r.pvStat = function (t) {
        var e = this;
        if (!e.pvStatInited) {
            t || (t = {});
            var i = a(d(!0, {}, e.comStat, t, {lt: "log"}));
            s.ping(e.statUrl + i), e.pvStatInited = !0
        }
    }, r.clickStat = function (t) {
        var e = this;
        t || (t = {}), t.lt = "link", t.link = "", t.title && (t.title = t.title.slice(0, 30)), t = e.setPageTimer(t);
        var i = a(d(!0, {}, e.comStat, t));
        s.ping(e.statUrl + i)
    }, r.eventStat = function (t) {
        var e = this;
        t || (t = {}), t.lt = "event", t.title && (t.title = t.title.slice(0, 30));
        var i = a(d(!0, {}, e.comStat, t));
        s.ping(e.statUrl + i)
    }, r.updateComStat = function (t, e) {
        this.comStat[t] = e
    }, r.setPageTimer = function (t) {
        if (!this.hided && t.pg) {
            var e = +new Date;
            Math.abs(e - this.lastLogTime) < 12e5 && (t.page_time = Math.abs(e - this.lastLogTime) / 1e3)
        } else this.hided = !1;
        return t.pg !== this.lastPage && (this.lastPage = t.pg), this.lastLogTime = +new Date, t
    }, r.tabHide = function () {
        document.hidden && document.webkitHidden || (this.hided = !0)
    }, i.exports = new n
}

function (t, e, i) {
    "use strict";
    var n = t("u/storejs"), u = t("config"), _ = new n({session: !0}), o = new n({local: !0}), r = {}, c = _.get("__qiqu__likeStore") || [], s = o.get("__qiqu__ckStore") || [], f = o.get("__qiqu__pLikeStore") || [], g = _.get("__qiqu__voteStore") || {}, q = !1;
    i.exports = {
        prop: r,
        nextPost: [],
        listName: "",
        back: "",
        checkDailyUpd: {},
        checkDiscUpd: {},
        teachPost: !1,
        likeStore: {
            get: function (t) {
                return c.indexOf(t) > -1 ? !0 : !1
            }, set: function (t, e) {
                e && -1 === c.indexOf(t) ? (c.push(t), _.set("__qiqu__likeStore", c)) : e || (c.$remove(t), _.set("__qiqu__likeStore", c))
            }
        },
        ckStore: {
            get: function (t) {
                return s.indexOf(t) > -1 ? !0 : !1
            }, set: function (t) {
                if (!this.get(t)) {
                    var e = u.check_config.display_list_count || 30;
                    s.length >= e && s.shift(), s.push(t), o.set("__qiqu__ckStore", s)
                }
            }
        },
        pLikeStore: {
            genKey: function (t, e) {
                return t + "_" + e
            }, get: function (t, e) {
                return f.indexOf(this.genKey(t, e)) > -1 ? !0 : !1
            }, set: function (t, e) {
                if (!this.get(t, e)) {
                    var i = 300;
                    f.length >= i && f.shift(), f.push(this.genKey(t, e)), o.set("__qiqu__pLikeStore", f)
                }
            }
        },
        voteStore: {
            get: function (t) {
                return g[t]
            }, set: function (t, e) {
                g[t] = {val: e}, _.set("__qiqu__voteStore", g)
            }
        }
    };
    var a = !1, h = {}, k = {};
    Object.defineProperties(r, {
        autoPlay: {
            get: function () {
                var t = a;
                return a = !1, t
            }, set: function (t) {
                a = t
            }
        }, teachTouch: {
            get: function () {
                return o.get("__qiqu__teach2016Spring") || !1
            }, set: function (t) {
                o.set("__qiqu__teach2016Spring", t)
            }
        }, fromXinxiliu: {
            get: function () {
                return q
            }, set: function (t) {
                q = t
            }
        }, ckList: {
            get: function () {
                return h
            }, set: function (t) {
                h = t
            }
        }, tagDict: {
            get: function () {
                return o.get("__qiqu__tagDict") || !1
            }, set: function (t) {
                o.set("__qiqu__tagDict", t)
            }
        }, statPageParams: {
            get: function () {
                return k
            }, set: function (t) {
                k = t
            }
        }
    })
}


function (t, e, i) {
    "use strict";
    var a = t("u/stat"), r = t("extend"), s = t("u/store");
    i.exports = Vue.directive("stat", {
        priority: 1, bind: function () {
            this.handler = function () {
                if (this.el) {
                    var t = this.el, e = t.getAttribute("data-ckrg"), i = t.getAttribute("data-ckpo"), d = t.getAttribute("data-id") || "", u = t.getAttribute("data-itemtag") || "", c = t.getAttribute("data-title") || "", n = t.getAttribute("data-tag") || "", g = s.prop.statPageParams, b = r(!0, {
                        ck_rg: e,
                        ck_po: i,
                        id: d,
                        title: c.substr(0, 30),
                        tag: n,
                        it_tag: u
                    }, g);
                    a.clickStat(b)
                }
            }.bind(this), this.el.addEventListener("click", this.handler)
        }
    })
}

function iscroll() {
    "use strict";
    function r(unit) {
        return "transform: translate(0, " + unit + "px)translateZ(0);-webkit-transform: translate(0, " + unit + "px)translateZ(0);"
    }

    var n = t("u/stat"),
        a = t("extend"),
        i = t("u/store"),
        h = {
            NONE: 0,
            NOOP: 1,
            UP: 2,
            RIGHT: 3,
            DOWN: 4,
            LEFT: 5,
            LEFT_RIGHT: 6
        },
        o = 4;
    return {
        data: function () {
            return {refreshBanner: {show: false, style: "", status: "down", txt: ""}}
        },
        methods: {
            onStart: function (t) {
                var e = t.targetTouches[0], s = t.currentTarget;
                s.addEventListener("touchmove", this._move, !1),
                    s.addEventListener("touchend", this._end, !1),
                    this._startScrollY = window.scrollY,
                    this._startX = e.pageX,
                    this._startY = e.pageY,
                    this._dr = h.NONE,
                    this._hasTouch = !0,
                    this._isPull = !1
            },
            _move: function () {
                var t = event.targetTouches[0];
                if (this._dr !== h.UP) {
                    if (this._dr === h.NONE) {
                        var e = t.pageX - this._startX, s = t.pageY - this._startY, r = Math.abs(s), n = Math.abs(e);
                        n + r > o && (this._dr = n > 1.73 * r ? h.LEFT_RIGHT : r > 1.73 * n ? 0 > s ? h.UP : h.DOWN : h.NOOP, this._startScrollY < 10 && s > 0 && (this._dr = h.DOWN)), this._startScrollY < 10 && this._dr === h.DOWN && s > o && (this._isPull = !0, console.log("start move"))
                    }
                    this._dr === h.DOWN && this._isPull && "loading" !== this.refreshBanner.status && (s = t.pageY - this._startY, this._loadingFunc(s), event.preventDefault())
                }
            },
            _end: function (t) {
                var e = t.currentTarget;
                this._dr === h.DOWN && this._isPull && "loading" !== this.refreshBanner.status && (event.preventDefault(), this._endloadFunc()), this._hasTouch = !1, this._isPull = !1, e.removeEventListener("touchmove", this._move, !1), e.removeEventListener("touchend", this._end, !1)
            },
            _loadingFunc: function (t) {
                this.updBanner.show = !1, 80 > t ? (this.refreshBanner.style = r(t / 2), this.refreshBanner.show = !0, this.refreshBanner.status = "down", this.refreshBanner.txt = "下拉刷新", this.canloading = !1) : (this.refreshBanner.style = r(40), this.refreshBanner.status = "up", this.refreshBanner.txt = "松开刷新", this.canloading = !0)
            },
            _endloadFunc: function () {
                if (this.refreshing || !this.canloading)return void(this.refreshBanner.show = !1);
                this.refreshBanner.txt = "加载中...", this.refreshBanner.status = "loading";
                var t = this;
                this.refresh(function (e, s) {
                    e ? (t.refreshBanner.status = "done", t.refreshDone(s)) : (t.loading.show = !1, t.refreshBanner.status = "error", t.refreshDone("加载失败"))
                }), n.clickStat(a({ck_rg: "通用", ck_po: "刷新"}, i.prop.statPageParams))
            },
            refreshDone: function (t) {
                this.refreshBanner.txt = t;
                var e = this, s = e.refreshBanner.status;
                this._refreshTimer = setTimeout(function () {
                    ("done" === s || "error" === s) && (e.refreshBanner.show = !1)
                }, 1500)
            }
        }
    }
}
iscroll()


function (t, i, s) {
    "use strict";
    t("c/header"), t("c/discovery-list"), t("c/list"), t("c/banner"), t("c/c-plus"), t("c/c-fb"), t("c/reflash-banner"), t("c/upd-banner"), t("c/teachMask");
    var e = t("qiqu/2.10.1/mixins/page-init.js"), n = t("qiqu/2.10.1/mixins/checkIndexUpd.js"), a = t("qiqu/2.10.1/mixins/processList.js"), o = t("qiqu/2.10.1/mixins/feedback.js").p, d = t("config"), r = t("u/model"), h = t("extend"), l = t("each"), c = t("u/stat"), p = t("u/statTimer"), u = t("qiqu/2.10.1/p/index/tab-index.js"), f = t("qiqu/2.10.1/p/index/tab-norm.js"), g = t("qiqu/2.10.1/p/index/tab-discovery.js"), v = t("qiqu/2.10.1/p/index/tab-daily.js"), w = t("qiqu/2.10.1/mixins/iscroll.js"), m = t("u/store"), b = t("u/user"), x = t("u/checkProfileUpd"), y = {
        index: {
            init: "indexInit",
            append: "indexAppendRender",
            upd: "normUpd",
            fetchList: "normFetchList"
        },
        video: {init: "videoInit", append: "videoAppendRender", upd: "normUpd", fetchList: "normFetchList"},
        joke: {init: "jokeInit", append: "jokeAppendRender", upd: "normUpd", fetchList: "normFetchList"},
        discovery: {init: "discoveryInit", upd: "discoveryUpd"},
        daily: {init: "dailyInit", append: "dailyAppendRender", upd: "dailyUpd", fetchList: "dailyFetchList"}
    }, M = d.constant, _ = M.APPEND_MSG, k = M.PLUS;
    s.exports = Vue.extend({
        data: function () {
            return {
                header: {showIndexMenu: !0, indexMenu: !1, showBack: !1, profUpd: !1, profCkpo: "点击个人中心"},
                nav: {items: d.nav, active: "", dailyUpd: !1, discUpd: !1},
                updBanner: {show: !1, txt: ""},
                loading: {show: !0},
                appendMsg: {show: !1, txt: _.loading, success: !0, finish: !1},
                list: {
                    index: {
                        data: [],
                        show: !1,
                        minPos: 1438680304575,
                        el: "indexlist",
                        inited: !1,
                        scrollTimes: 1,
                        banner: [],
                        current: 0,
                        scrollTop: 0,
                        scrollBase: 0,
                        position: 0
                    },
                    video: {
                        data: [],
                        show: !1,
                        minPos: 1450355990610,
                        el: "videolist",
                        inited: !1,
                        scrollTimes: 1,
                        current: 0,
                        scrollTop: 0,
                        scrollBase: 0,
                        position: 0
                    },
                    joke: {
                        data: [],
                        show: !1,
                        minPos: 1438531995156,
                        el: "jokelist",
                        inited: !1,
                        scrollTimes: 1,
                        current: 0,
                        scrollTop: 0,
                        scrollBase: 0,
                        position: 0
                    },
                    discovery: {data: [], banner: null, topics: [], show: !1, el: "discoverylist", inited: !1},
                    daily: {data: [], show: !1, el: "dailylist", inited: !1, scrollTimes: 1, current: 0, scrollTop: 0}
                },
                back2top: {show: !1},
                footer: h(!0, {show: !1}, d.footer),
                errorMsg: {show: !1},
                share: {show: !0, targetPage: "detail"},
                statParams: {},
                plus: {show: !1, txt: k.like},
                scrollManagerSet: {}
            }
        },
        mixins: [e, f, u, g, v, n, a, w, o],
        created: function () {
            this.isYZ && (this.header.showIndexMenu = !1), this.ch === d.zixun.ch && (this.header.showBack = !0, this.header.backUrl = d.zixun.href)
        },
        attached: function () {
            this.update(), this.$on("append-refresh", this.appendErrHdl), this.$on("hideIndexMenu", this.hideIndexMenu), this.$on("toggleIndexMenu", this.toggleIndexMenu), this.$on("viewall", this.viewallHdl), this.$on("cancel-profilUpd", this._cancelProfileUpd), this.headerContClasses = this.$els.header.classList
        },
        ready: function () {
            var i = this, s = new RegExp(d.opChReg);
            s.test(this.ch) && t.async("c/hot-op", function (t) {
                t.show(i.$els.hotWrap)
            }), _uca_time("_r"), i._checkProfileUpd()
        },
        methods: {
            scrollHdl: function () {
                var t = window.scrollY, i = this, s = this.list[this.tab], e = s.scrollTop, n = s.scrollBase || 0, a = this.$els[this.list[this.tab].el];
                if (t >= 500 ? this.headerContClasses.add("headerCont_noHead") : this.headerContClasses.remove("headerCont_noHead"), e > t && this.scrollManager.scrollUp(t, this.windowH, a), t > e && this.scrollManager.scrollDown(t, a), Math.abs(t - e) > 100 && c.clickStat(h(!0, {
                        ck_rg: "通用",
                        ck_po: "滚动补充时长"
                    }, this.statParams)), !this.appendLoading && !s.finishLoading && t >= n + 300) {
                    var o = h(!0, {ck_rg: "通用"}, this.statParams);
                    s.scrollTimes > 30 ? (this.appendMsg.txt = _.finish, this.appendMsg.finish = !0, s.finishLoading = !0, this.footer.show = !0, o.ck_po = "加载到最底部") : (this.appendLoading = !0, this.append(), o.ck_po = "加载更多"), c.clickStat(o)
                }
                i.back2top.show = t >= 500 ? !0 : !1, this.appendMsg.show = !s.finishLoading && t >= this.bodyH - this.windowH - 100 && this.bodyH - this.windowH - 100 > 0 ? !0 : s.finishLoading ? !0 : !1, this.hideIndexMenu(), t > e && i.$broadcast("stopVideoPlaying"), s.scrollTop = t
            }, append: function () {
                var t = this, i = t.list[this.tab], s = t.$els[t.list[t.tab].el], e = this.tab, n = t.$get(y[t.tab].fetchList);
                return n ? void n(e).done(function (n) {
                    if (t.tab === e) {
                        t.appendLoading = !1, i.scrollTimes++, i.scrollBase = s.clientHeight, t.appendMsg.success = !0, Vue.nextTick(function () {
                            t.bodyH = document.body.clientHeight
                        });
                        var a = t.$get(y[t.tab].append);
                        n.length > 0 && a && a(n), n.length < 10 && (t.appendMsg.txt = _.finish, t.appendMsg.finish = !0, i.finishLoading = !0, t.footer.show = !0)
                    }
                }).fail(function () {
                    t.appendErr()
                }) : void t.appendErr()
            }, appendErr: function () {
                this.appendMsg.txt = _.failed, this.appendMsg.success = !1
            }, appendErrHdl: function () {
                this.appendMsg.txt = _.loading, this.appendMsg.success = !0, this.append()
            }, refresh: function (t) {
                var i = this, s = this.tab, e = this.list[s], n = e.minPos, a = e.firstMaxPos, o = parseInt(Math.random() * (a - n + 1) + n), d = e.data;
                i.appendMsg.show = !1, e.finishLoading = !1, e.scrollTimes = 1, e.scrollBase = 0, e.current = 0, i.appendMsg.txt = _.loading, i.appendMsg.success = !0, window.scrollTo(0, 0);
                var r = i.$get(y[i.tab].fetchList);
                return r && o ? (e.maxPos = o, void r(s).done(function (n) {
                    if (i.tab !== s)return e.data = d;
                    e.data = [], Vue.nextTick(function () {
                        i.bodyH = document.body.clientHeight
                    });
                    var a = i.scrollManager.encapsule(i._processData(n));
                    e.data = [a], e.maxPos = n[n.length - 1]._pos, t && t(1, M.UPDBANNER.refresh)
                }).fail(function () {
                    t && t(0)
                })) : t && t(0)
            }, checkNShowUpdBanner: function (t) {
                var i, s = this, e = M.FIRST_POST_POS_STORAGE, n = d.tagDict[s.tab].list_id, a = r.storageGet(e);
                i = a && a[s.tab], i && Number(t) > Number(i) ? r.fetchUpdNum(n).done(function (n) {
                    for (var o = 0, d = 0, h = n.length; h > d; d++)n[d]._pos > i && o++;
                    s.newNum = o, s.insertDiscoveryLink(), o >= 200 ? (o += "+", s.showUpdBanner(M.UPDBANNER.lastest)) : s.showUpdBanner("已更新" + o + "条内容"), a[s.tab] = t, r.storageSet(e, a)
                }) : i && s.showUpdBanner(M.UPDBANNER.noUpd), i || (s.showUpdBanner(M.UPDBANNER.lastest), a = a || {}, a[s.tab] = t, r.storageSet(e, a))
            }, showUpdBanner: function (t) {
                var i = this;
                i.updBanner.txt = t, setTimeout(function () {
                    i.updBanner.show = !0, setTimeout(function () {
                        i.updBanner.show = !1
                    }, 1500)
                }, 200)
            }, insertDiscoveryLink: function () {
                var t = this.list[this.tab].data;
                if (this.newNum && 0 !== this.newNum) {
                    var i = parseInt(this.newNum / 10);
                    if (t.length > i) {
                        var s = this.newNum % 10;
                        t[i].items = [], t[i].data[0]._data.item.isTop && (s += 1), t[i].data.splice(s, 0, {
                            _type: "i-new",
                            _id: Date.parse(new Date),
                            _data: {}
                        }), t[i].items = t[i].data, this.newNum = 0
                    }
                }
            }, _checkProfileUpd: function () {
                var t = this;
                b.getUserInfo(function (i) {
                    if (i && "uc" === i.infoFlag) {
                        var s = i.uid;
                        new x(s).getIndexUpd().done(function (i) {
                            i && t.enable_comment && t.enable_submit && (t.header.profUpd = !0, t.header.profCkpo = "红点个人中心")
                        })
                    }
                })
            }, _cancelProfileUpd: function () {
                b.getUserInfo(function (t) {
                    t && "uc" === t.infoFlag && new x(t.uid).cancelIndexDot()
                })
            }, enter: function () {
                window.addEventListener("scroll", this.scrollThr), this.showDailyUpdFlag(), this.showDiscUpdFlag(), document.body.classList.remove("noscroll"), document.body.removeAttribute("style"), this.setBrowserShare({}), m.prop.statPageParams = this.statParams
            }, leave: function () {
                window.removeEventListener("scroll", this.scrollThr)
            }, update: function (t) {
                this.refreshBanner.show = !1, t && this.list[t] && (this.list[t].position = document.body.scrollTop), l(this.list, function (t) {
                    t.show = !1
                }), this.loading.show = !0, this.errorMsg.show = !1;
                var i = this.$data._params.replace(/(?:\!\!)?\??\w+=[\w\+\-\_]+/g, "");
                if (this.nav.active = this.tab = i || "index", this.list[this.tab].show = !0, this.windowH = window.innerHeight, this.appendLoading = !1, this.appendMsg.show = !1, this.appendMsg.txt = _.loading, this.appendMsg.finish = !1, this.appendMsg.success = !0, this.footer.show = !1, this.updBanner.show = !1, this.bodyH = document.body.clientHeight, this.list[this.tab].finishLoading && (this.appendMsg.txt = _.finish, this.appendMsg.finish = !0, this.footer.show = !1), this.list[this.tab].inited)this.loading.show = !1, "discovery" === this.tab && (this.footer.show = !0); else {
                    var s = this.$get(y[this.tab].init);
                    s && s()
                }
                var e = this.$get(y[this.tab].upd);
                e && e(this.tab), window.scrollTo(0, this.list[this.tab].position || 0), this.$broadcast("stopVideoPlaying", !0);
                var n = this.tab, a = d.tagDict[n] ? d.tagDict[n].stat_name : "";
                this.statParams = {
                    page: this.$data._stat.page,
                    pg: a + this.$data._stat.pgType,
                    tag: a
                }, this.pg = this.statParams.pg, this.tag = n, m.prop.statPageParams = this.statParams, p.setStatParams({pg: a + this.$data._stat.pgType}), this.setBrowserShare({})
            }, hideIndexMenu: function () {
                this.header.indexMenu = !1
            }, toggleIndexMenu: function () {
                this.header.indexMenu = !this.header.indexMenu
            }, viewallHdl: function (t, i) {
                for (var s = this.list[this.tab].data, e = this.$els[this.list[this.tab].el], n = e.children, a = Number(t.getAttribute("data-group")), o = 0, d = 0, r = n.length; r > d; d++)if (o += n[d].offsetTop - s[d].offsetTop, s[d].offsetTop = n[d].offsetTop, d === a)for (var h = s[d].data, l = 0, c = h.length; c > l; l++)h[l]._id === i && (h[l]._data.viewall = !0);
                this.bodyH = document.body.clientHeight, this.list[this.tab].scrollBase += o
            }
        },
        el: function () {
            return document.createElement("div")
        },
        template: '<div class="index">\n\n <c-header :nav="nav" :header="header" :nologin="nologin" :huawei="huawei" :enable-submit="enable_submit" :imagefailed="imageFailed" v-el:header></c-header>\n\n <p class="imagefailed-txt" v-if="imageFailed">来寻开心的人太多啦! 服务器君受不了啦! <br> 先看看段子吧! 稍后再回来哦~</p>\n\n <upd-banner :data="updBanner"></upd-banner>\n\n <reflash-banner :data="refreshBanner"></reflash-banner>\n\n <error-msg v-if="errorMsg.show"></error-msg>\n <loading v-show="loading.show"></loading>\n\n <!-- 精选 -->\n <div v-show="list.index.show" class="list_fixedHead" @touchstart="onStart">\n <c-banner :items="list.index.banner"></c-banner>\n <list :groups="list.index.data" v-if="list.index.data.length > 0" v-el:indexList></list>\n </div>\n\n <!-- 视频 -->\n <div v-show="list.video.show" class="list_fixedHead" @touchstart="onStart">\n <list :groups="list.video.data" v-if="list.video.data.length > 0" v-el:videoList></list>\n </div>\n\n <!-- 段子 -->\n <div v-show="list.joke.show" class="list_fixedHead" @touchstart="onStart">\n <list :groups="list.joke.data" v-if="list.joke.data.length > 0" v-el:jokeList></list>\n </div>\n\n <!-- 发现 -->\n <discovery-list\n v-show="list.discovery.show"\n v-if="list.discovery.data"\n :list="list.discovery.data"\n :banner="list.discovery.banner"\n :topics="list.discovery.topics"\n :enable-submit="enable_submit"\n >\n </discovery-list>\n\n <!-- 小贱日报 -->\n <div v-show="list.daily.show" v-if="list.daily.data" class="list_fixedHead">\n <list :groups="list.daily.data" v-el:dailyList></list>\n </div>\n\n <append-msg :data="appendMsg"></append-msg>\n\n <partial name="c-plus" v-show="plus.show"></partial>\n\n <back2top v-show="back2top.show"></back2top>\n\n <c-footer v-if="footer.show && !huawei"></c-footer>\n\n <div class="hot-wrap" v-el:hotWrap></div>\n\n <!-- 举报弹窗 -->\n <c-fb :fb="fb"></c-fb>\n <partial name="c-toast" v-if="toast.tips.length > 0"></partial>\n\n <!-- 教育图 -->\n <teachmask></teachmask>\n\n</div>\n',
        replace: !0
    })
}


function (t, e, i) {
    "use strict";
    t("c/i-tuwen"), t("c/i-joke"), t("c/i-changwen"), t("c/i-promotion"), t("c/i-new"), t("c/i-date"), t("c/i-ad"), t("c/appendMsg");
    var a = t("u/stat"), s = t("extend"), n = t("u/jump"), r = t("qiqu/2.10.1/mixins/commonTapEvent.js"), o = t("qiqu/2.10.1/mixins/video.js"), c = t("each"), d = t("u/store");
    i.exports = {}, Vue.component("list", {props: ["groups"],
        attached: function () {
            this.$el.addEventListener("click", function (t) {
                var e = d.prop.statPageParams;
                this._viewAll(t, e), this._jBiaotai(t, e), this._jFenlei(t, e), this._jDetail(t, e), this._pGif(t, e), this._pVideo(t, s(!0, {ck_rg: "短内容"}, e))
            }.bind(this)), this.$on("stopVideoPlaying", this._stopVideo)
        },
        methods: {
            _viewAll: function (t, e) {
                var i = t.target;
                if (i.classList.contains("js-viewall")) {
                    i.classList.contains("js-viewall-root") || (i = i.parentNode);
                    var r = i.getAttribute("data-url");
                    if (!i.getAttribute("style"))return void n(r);
                    i.setAttribute("style", "");
                    var o = i.querySelector(".js-viewLongImg"), c = i.querySelector(".js-longImg");
                    o.innerHTML = "正在加载中...", c.addEventListener("load", function u() {
                        o.classList.add("hide"), c.removeEventListener("load", u)
                    }), c.setAttribute("src", c.getAttribute("data-long"));
                    var d = i.getAttribute("data-title"), l = i.getAttribute("data-id"), g = s(!0, {
                        ck_rg: "短内容",
                        ck_po: "查看全图",
                        title: d,
                        id: l
                    }, e);
                    a.clickStat(g), this.$dispatch("viewall", i.parentNode.parentNode, l)
                }
            }, _jBiaotai: function (t, e) {
                var i = t.target;
                if (i.classList.contains("js-biaotai")) {
                    i.classList.contains("js-biaotai-root") || (i = i.parentNode);
                    var r = i.getAttribute("data-url"), o = i.getAttribute("data-title"), c = i.getAttribute("data-tag"), d = i.getAttribute("data-id");
                    n(r);
                    var l = s(!0, {ck_rg: "长内容", ck_po: "表态", title: o, id: d, tag: c}, e);
                    a.clickStat(l)
                }
            }, _jFenlei: function (t, e) {
                var i = t.target;
                if (i.classList.contains("js-enterTagList")) {
                    var r = i.getAttribute("data-url"), o = i.getAttribute("data-ckpo"), c = i.getAttribute("data-ckrg");
                    n(r);
                    var d = s(!0, {ck_rg: c, ck_po: o}, e);
                    a.clickStat(d)
                }
            }, _jDetail: function (t, e) {
                var i = t.target, r = i.classList;
                if (!(r.contains("js-noenter") || r.contains("js-incrs") || r.contains("js-share") || r.contains("js-gif") || r.contains("js-viewall") || r.contains("js-biaotai") || r.contains("js-enterTagList") || r.contains("list") || r.contains("afterNew-btn") || r.contains("js-video"))) {
                    for (var o = i, c = 5; o.classList && !o.classList.contains("js-enter") && c >= 0;)o = o.parentNode, c--;
                    var l = o.getAttribute("data-url"), g = o.getAttribute("data-ckpo"), u = o.getAttribute("data-ckrg"), p = o.getAttribute("data-title"), v = o.getAttribute("data-tag") || "", m = o.getAttribute("data-id");
                    r.contains("js-cm") ? (l += "!!position=cm", u = "评论", g = r.contains("js-hot") ? "神吐槽" : "列表页评论入口") : (o.classList.add("it_active"), setTimeout(function () {
                        o.classList.remove("it_active")
                    }, 1e3)), "视频" === v && (d.prop.autoPlay = !0, this._stopVideo()), o.classList.add("it_read"), setTimeout(function () {
                        n(l)
                    }, 50);
                    var f = s(!0, {ck_rg: u, ck_po: g, title: p, id: m, tag: v, it_tag: v}, e);
                    a.clickStat(f)
                }
            }, _pGif: function (t, e) {
                {
                    var i = t.target;
                    +new Date
                }
                if (i.classList.contains("js-gif")) {
                    i.classList.contains("js-gif-root") || (i = i.parentNode);
                    var r = i.querySelector(".lI-img"), o = i.querySelector(".gifBtn"), d = i.querySelector(".spin-box"), l = i.getAttribute("data-url");
                    if (!r || i.classList.contains("js-gif-loaded"))return void n(l);
                    o.classList.add("hide"), d.style.display = "block", c(document.querySelectorAll(".js-gif-loaded"), function (t) {
                        var e = t.querySelector(".lI-img"), i = t.querySelector(".gifBtn");
                        e.setAttribute("src", e.getAttribute("data-origin")), i.classList.remove("hide"), t.classList.remove("js-gif-loaded")
                    }), r.addEventListener("load", function m() {
                        d.style.display = "none", r.removeEventListener("load", m)
                    });
                    var g = r.getAttribute("data-gif");
                    r.setAttribute("data-origin", r.getAttribute("src")), r.setAttribute("src", g), i.classList.add("js-gif-loaded");
                    var u = i.getAttribute("data-title"), p = i.getAttribute("data-id"), v = s(!0, {
                        ck_rg: "短内容",
                        ck_po: "播放GIF",
                        title: u,
                        id: p
                    }, e);
                    return a.clickStat(v), !1
                }
            }
        },
        mixins: [r, o],
        template: '<div class="list">\n <div data-group="{{$index}}" :style="{\'min-height\': group.offHeight}" data-show="{{group.show}}" v-for="group in groups">\n <template v-for="item in group.items">\n <component\n track-by="item._id"\n :is="item._type"\n :item="item._data.item"\n :nt="item._data.nt"\n :notpreloadgif="item._data.notpreloadgif"\n :pagetag="item._data.pagetag"\n :huawei="item._data.huawei"\n :share="item._data.share"\n :enable-comment="item._data.enableComment"\n :type="item._data.type"\n :date="item._data.date">\n </component>\n </template>\n </div>\n</div>',
        replace: !0
    })
}