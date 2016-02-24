/**
 * Created by Administrator on 2016/2/20.
 */
var oSlider = document.getElementById('slider');
var oList = oSlider.querySelectorAll('.list')[0];
var index = 0;
var slides = 4;
var slidePos = new Array(slides.length);
oList.addEventListener('touchstart',function(event) {

    var touches = event.touches[0];
    // measure start values
    start = {
        // 手指按下相对屏幕的位置
        x: touches.pageX,
        y: touches.pageY,
        // 手指按下的时间戳
        time: +new Date
    };
    // used for testing first move event
    isScrolling = undefined;
    // reset delta and end measurements
    delta = {};
    // attach touchmove and touchend listeners
    oList.addEventListener('touchmove', move, false);
    oList.addEventListener('touchend', end, false);
    if (event.stopPropagation) event.stopPropagation();
},false);
function move(event) {
    // ensure swiping with one touch and not pinching
    if (event.touches.length > 1 || event.scale && event.scale !== 1) return


    var touches = event.touches[0];

    // measure change in x and y
    delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
    }
    // determine if scrolling test has run - one time test
    if (typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
    }

    // if user is not trying to scroll vertically
    if (!isScrolling) {
        // prevent native scrolling
        event.preventDefault();
        // increase resistance if first or last slide
        delta.x =
            delta.x /
            ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
            ) ?
                ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                : 1 );                                 // no resistance if false

        // translate 1:1

        translate(index - 1, delta.x + slidePos[index - 1], 0);
        translate(index, delta.x + slidePos[index], 0);
        translate(index + 1, delta.x + slidePos[index + 1], 0);

    }
}
function end(event) {

    // measure duration
    var duration = +new Date - start.time;

    // determine if slide attempt is past start and end
    var isPastBounds =
        !index && delta.x > 0                            // if first slide and slide amt is greater than 0
        || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

    // determine direction of swipe (true:right, false:left)
    var direction = delta.x < 0;
    var width = '0.5%';
    var speed = 100;
    move(index-1, -width, speed);
    move(index, 0, speed);
    move(index+1, width, speed);



    // kill touchmove and touchend event listeners until touchstart called again
    oList.removeEventListener('touchmove', move, false)
    oList.removeEventListener('touchend', end, false)

}
function transitionEnd(event) {

    if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

    }

}
function translate(index, dist, speed) {

    var slide = slides[index];
    var style = oList.style;

    if (!style) return;

    style.webkitTransitionDuration =
        style.MozTransitionDuration =
            style.msTransitionDuration =
                style.OTransitionDuration =
                    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + ',0)' + 'translateZ(0)';
    style.msTransform =
        style.MozTransform =
            style.OTransform = 'translateX(' + dist + ')';

}
function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

}

!function () {
        function e() {
            var e = window.document.body.offsetWidth,
                n = window.document.body.offsetHeight;
            if (f.width != e || f.height != n) {
                f.top = 0, f.left = 0, f.width = e, f.height = n;
                try {
                    for (var t = window, o = window.parent; o.document && o != t;) {
                        for (var i = o.document.getElementsByTagName("iframe"), r = null, a = 0; a < i.length; ++a) {
                            var d = i[a];
                            if (d.contentWindow == t) {
                                r = d;
                                break
                            }
                        }
                        if (r) {
                            var c = r.getBoundingClientRect();
                            f.top += o.scrollY + c.top, f.left += o.scrollX + c.left
                        }
                        t = o, o = t.parent
                    }
                } catch (_) {}
            }
            return f
        }
        function n(e) {
            var n = "ucad-wf-" + e + "-" + l;
            return ++l, n
        }
        function t(e) {
            var n = e.head.getElementsByTagName("meta"),
                t = n.length,
                o = "";
            if (e.title && e.title.length > 0) o = e.title;
            else for (index = 0; t > index; ++index) {
                var i = n[index];
                if ("title" === i.name && i.content) {
                    o = i.content;
                    break
                }
            }
            var r = "";
            for (index = 0; t > index; ++index) {
                var i = n[index];
                if ("keyword" === i.name && i.content) {
                    r = i.content;
                    break
                }
            }
            var a = {
                title: encodeURIComponent(o),
                keyword: encodeURIComponent(r)
            };
            return a
        }
        function o() {
            if (!v) {
                var e = i(),
                    n = t(e.document);
                v = {
                    title: n.title,
                    keyword: n.keyword,
                    refer_url: encodeURIComponent(e.document.referrer),
                    page_url: encodeURIComponent(e.location.href)
                }
            }
            return v
        }
        function i() {
            if (!_) {
                _ = window;
                try {
                    window.top.document && (_ = window.top)
                } catch (e) {}
            }
            return _
        }
        function r(e) {
            if (0 == p) {
                var n = i();
                if (n.__UCJSADBridge) p = 2, n.__UCJSADBridge.configs.ia && (w = n.__UCJSADBridge.configs.ia), m = "uc", a(e);
                else if (n.ucapi && "function" == typeof n.ucapi.invoke) {
                    p = 1;
                    var t = function () {
                            p = 2, a(e)
                        },
                        o = function (n) {
                            p = 2, "success" == n.result && (w = n.ia), m = "uc", a(e)
                        },
                        d = {};
                    d.cmd = "GetInfo", d.fail = t, d.success = o, n.ucapi.invoke("promotion.handleJSAdCommand", d)
                } else p = 2, a(e)
            } else 1 == p ? (s++, s > 5 && (p = 2), setTimeout(function () {
                r(e)
            }, 50)) : a(e)
        }
        function a(e) {
            var n = o(),
                t = i().document.body,
                r = {};
            for (var a in n) n[a] && n[a].length > 0 && (r[a] = n[a]);
            r.uc_param_str = "frdnvesscpgimioslantnieijbdsudadnw", r.w = t.clientWidth, r.h = t.clientHeight, w && (r.ia = w), m && (r.adfrom = m), e(r)
        }
        function d() {
            return "http://image.uc.cn/s/uae/g/0s/u0.1.js"
        }
        function c(e) {
            return h[e] || e
        }
        if (!window.__UCJSADService) {
            var _ = null,
                u = "20160125_v1",
                s = 0,
                f = {
                    top: -1,
                    left: -1,
                    width: -1,
                    height: -1
                },
                l = 0,
                v = null,
                m = null,
                w = null,
                p = 0,
                h = {
                    web_video_index_hot_above: "9",
                    web_video_index_easy_above: "10",
                    web_video_video_detail_recommend_above: "11",
                    web_video_short_recommend_playlist_above: "12",
                    web_video_search_billboard_below: "13",
                    web_video_search_result_other_video_above: "14",
                    uc_ad_position_xss_web_news_body_below: "15",
                    uc_xss_transcoding_web_news_body_below: "16",
                    foxyserver_maxcms_hot_recommend_list: "17",
                    foxyserver_maxcms_content_list: "18",
                    foxyserver_maxcms_text_content_page_index: "19",
                    foxyserver_maxcms_image_content_page_index: "20",
                    foxyserver_maxcms_content_page_below: "21",
                    web_ucloud_detail_page_head: "24"
                };
            window.__UCJSADService = {
                getWindowOffset: e,
                generateBlankFrameId: n,
                obtainBasicParams: r,
                mapToSlotId: c,
                frameSrcWithPid: d,
                sdk_version: u
            }
        }
    }(), function () {
    function e(e) {
        var n = null;
        return e && "function" == typeof window.postMessage && (n = document.createElement("iframe"), n.src = "about:blank", n.id = window.__UCJSADService.generateBlankFrameId(e), n.scrolling = "no", n.style.cssText = "border:0;width:0px;height:0px;display:none;margin:0px;padding:0px"), n
    }
    function n(e, n) {
        var t = null;
        if (e && n) {
            var o = n.contentWindow.document;
            t = o.createElement("script"), t.type = "text/javascript", t.src = window.__UCJSADService.frameSrcWithPid(e), o.body.appendChild(t)
        }
        return t
    }
    function t(t, o, i) {
        var a = e(o);
        return a ? a.onload = function () {
            var e = a.contentWindow;
            e.ref_pid = t, e.pid = o, e.blankId = a.id, e.userinfo = i;
            var d = n(o, a);
            d ? (d.onload = d.onreadystatechange = function () {
                r = 1
            }, setTimeout(function () {
                if (0 == r) {
                    var e = document.createEvent("HTMLEvents");
                    e.initEvent("ucad-none", !1, !0), e.data = {
                        UC_REF_PID: t,
                        UC_PID: o,
                        userinfo: i,
                        errorType: 2
                    }, window.dispatchEvent(e)
                }
            }, 1e3)) : setTimeout(function () {
                var e = document.createEvent("HTMLEvents");
                e.initEvent("ucad-none", !1, !0), e.data = {
                    UC_REF_PID: t,
                    UC_PID: o,
                    userinfo: i,
                    errorType: 3
                }, window.dispatchEvent(e)
            }, 0)
        } : setTimeout(function () {
            var e = document.createEvent("HTMLEvents");
            e.initEvent("ucad-none", !1, !0), e.data = {
                UC_REF_PID: t,
                UC_PID: o,
                userinfo: i,
                errorType: 4
            }, window.dispatchEvent(e)
        }, 0), a
    }
    function o(e, n, o) {
        return t(e, n, o, null)
    }
    function i(e, n, o) {
        return t("", e, n, o)
    }
    var r = 0;
    window.UCJSADService || (window.UCJSADService = {
        createAdNode: o,
        createAdNodeWithPID: i
    })
}();


require.config({
    "cache": true,
    "urlPattern": "/c/%s",
    "comboPattern": "/co??%s",
    "alias": {
        "vue": "vue/vue.min.js",
        "appConfig": "appConfig",
        "config": "qiqu/2.10.1/u/conf/conf.js",
        "inlineData": "inlineData",
        "ucparams": "qiqu/2.10.1/u/ucparams/ucparams.js",
        "wxConfig": "wxConfig",
        "jsdk": "jsdk/jsdk-1.2.4.js",
        "router": "router/index.js",
        "each": "each/index.js",
        "extend": "extend/index.js",
        "type": "type/index.js",
        "network": "network/index.js",
        "event": "event/index.js",
        "tap": "qiqu/2.10.1/u/tap/tap.js",
        "jump": "qiqu/2.10.1/u/jump/jump.js",
        "boot": "qiqu/2.10.1/boot/boot.js",
        "c/appendMsg": "qiqu/2.10.1/c/appendMsg/appendMsg.js",
        "c/back2top": "qiqu/2.10.1/c/back2top/back2top.js",
        "c/banner": "qiqu/2.10.1/c/banner/banner.js",
        "c/bs": "qiqu/2.10.1/c/bs/bs.js",
        "c/c-fb": "qiqu/2.10.1/c/c-fb/c-fb.js",
        "c/c-plus": "qiqu/2.10.1/c/c-plus/c-plus.js",
        "c/c-toast": "qiqu/2.10.1/c/c-toast/c-toast.js",
        "c/comment-sendbox": "qiqu/2.10.1/c/comment-sendbox/comment-sendbox.js",
        "c/comment": "qiqu/2.10.1/c/comment/comment.js",
        "c/detail-header": "qiqu/2.10.1/c/detail-header/detail-header.js",
        "c/dialog": "qiqu/2.10.1/c/dialog/dialog.js",
        "c/discovery-list": "qiqu/2.10.1/c/discovery-list/discovery-list.js",
        "c/errorMsg": "qiqu/2.10.1/c/errorMsg/errorMsg.js",
        "c/footer": "qiqu/2.10.1/c/footer/footer.js",
        "c/header": "qiqu/2.10.1/c/header/header.js",
        "c/hot-op": "qiqu/2.10.1/c/hot-op/hot-op.js",
        "c/i-ad": "qiqu/2.10.1/c/i-ad/i-ad.js",
        "c/i-changwen": "qiqu/2.10.1/c/i-changwen/i-changwen.js",
        "c/i-com": "qiqu/2.10.1/c/i-com/i-com.js",
        "c/i-date": "qiqu/2.10.1/c/i-date/i-date.js",
        "c/i-joke": "qiqu/2.10.1/c/i-joke/i-joke.js",
        "c/i-new": "qiqu/2.10.1/c/i-new/i-new.js",
        "c/i-promotion": "qiqu/2.10.1/c/i-promotion/i-promotion.js",
        "c/i-tuwen": "qiqu/2.10.1/c/i-tuwen/i-tuwen.js",
        "c/list": "qiqu/2.10.1/c/list/list.js",
        "c/loading": "qiqu/2.10.1/c/loading/loading.js",
        "c/reflash-banner": "qiqu/2.10.1/c/reflash-banner/reflash-banner.js",
        "c/spinner": "qiqu/2.10.1/c/spinner/spinner.js",
        "c/sprite": "qiqu/2.10.1/c/sprite/sprite.js",
        "c/teachMask": "qiqu/2.10.1/c/teachMask/teachMask.js",
        "c/ucBanner": "qiqu/2.10.1/c/ucBanner/ucBanner.js",
        "c/upd-banner": "qiqu/2.10.1/c/upd-banner/upd-banner.js",
        "p/alltlist": "qiqu/2.10.1/p/alltlist/alltlist.js",
        "p/changwen": "qiqu/2.10.1/p/changwen/changwen.js",
        "p/check": "qiqu/2.10.1/p/check/check.js",
        "p/dailyList": "qiqu/2.10.1/p/dailyList/dailyList.js",
        "p/detail": "qiqu/2.10.1/p/detail/detail.js",
        "p/duijiang": "qiqu/2.10.1/p/duijiang/duijiang.js",
        "p/index": "qiqu/2.10.1/p/index/index.js",
        "p/list": "qiqu/2.10.1/p/list/list.js",
        "p/mcomm": "qiqu/2.10.1/p/mcomm/mcomm.js",
        "p/mpost": "qiqu/2.10.1/p/mpost/mpost.js",
        "p/msg": "qiqu/2.10.1/p/msg/msg.js",
        "p/profile": "qiqu/2.10.1/p/profile/profile.js",
        "p/submit": "qiqu/2.10.1/p/submit/submit.js",
        "p/tlist": "qiqu/2.10.1/p/tlist/tlist.js",
        "u/checkProfileUpd": "qiqu/2.10.1/u/checkProfileUpd/checkProfileUpd.js",
        "u/conf": "qiqu/2.10.1/u/conf/conf.js",
        "u/cookie": "qiqu/2.10.1/u/cookie/cookie.js",
        "u/emo": "qiqu/2.10.1/u/emo/emo.js",
        "u/envi": "qiqu/2.10.1/u/envi/envi.js",
        "u/iscroll": "qiqu/2.10.1/u/iscroll/iscroll.js",
        "u/jump": "qiqu/2.10.1/u/jump/jump.js",
        "u/lazyload": "qiqu/2.10.1/u/lazyload/lazyload.js",
        "u/meta": "qiqu/2.10.1/u/meta/meta.js",
        "u/model": "qiqu/2.10.1/u/model/model.js",
        "u/pfm": "qiqu/2.10.1/u/pfm/pfm.js",
        "u/scrollManager": "qiqu/2.10.1/u/scrollManager/scrollManager.js",
        "u/share": "qiqu/2.10.1/u/share/share.js",
        "u/stat": "qiqu/2.10.1/u/stat/stat.js",
        "u/statTimer": "qiqu/2.10.1/u/statTimer/statTimer.js",
        "u/store": "qiqu/2.10.1/u/store/store.js",
        "u/storejs": "qiqu/2.10.1/u/storejs/storejs.js",
        "u/tap": "qiqu/2.10.1/u/tap/tap.js",
        "u/ucparams": "qiqu/2.10.1/u/ucparams/ucparams.js",
        "u/user": "qiqu/2.10.1/u/user/user.js",
        "u/utils": "qiqu/2.10.1/u/utils/utils.js",
        "u/weixin": "qiqu/2.10.1/u/weixin/weixin.js"
    },
    "version": "2.10.1",
    "name": "qiqu",
    "combo": true,
    "hash": "27762c3",
    "deps": {
        "each/index.js": ["type"],
        "event/index.js": ["type", "each", "extend"],
        "extend/index.js": ["type"],
        "network/index.js": ["type", "each", "extend", "event"],
        "router/index.js": ["type", "each", "extend"],
        "qiqu/2.10.1/boot/boot.js": ["router", "u/statTimer", "qiqu/2.10.1/boot/error.js", "u/utils", "config", "ucparams", "qiqu/2.10.1/boot/view-manager.js", "u/envi", "u/pfm", "qiqu/2.10.1/directives/jump.js", "qiqu/2.10.1/directives/share.js", "qiqu/2.10.1/directives/stat.js", "qiqu/2.10.1/directives/feedback.js", "qiqu/2.10.1/directives/downloadUC.js", "qiqu/2.10.1/directives/feeb.js", "qiqu/2.10.1/boot/filter/vl.js", "c/loading", "c/back2top", "c/footer", "c/errorMsg", "c/i-com", "c/sprite", "qiqu/2.10.1/boot/boot.css"],
        "qiqu/2.10.1/boot/error.js": ["u/stat", "u/utils"],
        "qiqu/2.10.1/boot/view-manager.js": ["qiqu/2.10.1/boot/page-manager.js"],
        "qiqu/2.10.1/c/appendMsg/appendMsg.js": ["qiqu/2.10.1/c/appendMsg/appendMsg.css"],
        "qiqu/2.10.1/c/back2top/back2top.js": ["qiqu/2.10.1/c/back2top/back2top.css"],
        "qiqu/2.10.1/c/banner/banner.js": ["qiqu/2.10.1/c/banner/banner.css"],
        "qiqu/2.10.1/c/bs/bs.js": ["qiqu/2.10.1/c/bs/bulletscreen.js", "u/emo", "qiqu/2.10.1/c/bs/bs.css"],
        "qiqu/2.10.1/c/bs/bulletscreen.js": ["u/utils", "u/model", "u/emo", "u/stat"],
        "qiqu/2.10.1/c/c-fb/c-fb.js": ["c/c-toast", "qiqu/2.10.1/c/c-fb/c-fb.css"],
        "qiqu/2.10.1/c/c-plus/c-plus.js": ["qiqu/2.10.1/c/c-plus/c-plus.css"],
        "qiqu/2.10.1/c/c-toast/c-toast.js": ["qiqu/2.10.1/c/c-toast/c-toast.css"],
        "qiqu/2.10.1/c/comment-sendbox/comment-sendbox.js": ["u/envi", "u/utils", "u/emo", "config", "extend", "u/stat", "qiqu/2.10.1/c/comment-sendbox/comment-sendbox.css"],
        "qiqu/2.10.1/c/comment/comment.js": ["c/comment-sendbox", "u/envi", "u/utils", "u/emo", "config", "extend", "u/stat", "qiqu/2.10.1/c/comment/comment.css"],
        "qiqu/2.10.1/c/detail-header/detail-header.js": ["u/utils", "router", "qiqu/2.10.1/c/detail-header/detail-header.css"],
        "qiqu/2.10.1/c/dialog/dialog.js": ["qiqu/2.10.1/c/dialog/dialog.css"],
        "qiqu/2.10.1/c/discovery-list/discovery-list.js": ["u/jump", "qiqu/2.10.1/c/discovery-list/discovery-list.css"],
        "qiqu/2.10.1/c/errorMsg/errorMsg.js": ["qiqu/2.10.1/c/errorMsg/errorMsg.css"],
        "qiqu/2.10.1/c/footer/footer.js": ["qiqu/2.10.1/c/footer/footer.css"],
        "qiqu/2.10.1/c/header/header.js": ["u/jump", "router", "qiqu/2.10.1/c/header/header.css"],
        "qiqu/2.10.1/c/hot-op/hot-op.js": ["u/model", "u/utils", "u/stat", "qiqu/2.10.1/c/hot-op/hot-op.css"],
        "qiqu/2.10.1/c/i-ad/i-ad.js": ["config", "u/utils", "u/stat", "qiqu/2.10.1/c/i-ad/i-ad.css"],
        "qiqu/2.10.1/c/i-changwen/i-changwen.js": ["qiqu/2.10.1/c/i-changwen/i-changwen.css"],
        "qiqu/2.10.1/c/i-com/i-com.js": ["qiqu/2.10.1/c/i-com/i-com.css"],
        "qiqu/2.10.1/c/i-date/i-date.js": ["qiqu/2.10.1/c/i-date/i-date.css"],
        "qiqu/2.10.1/c/i-joke/i-joke.js": ["u/meta", "u/emo", "qiqu/2.10.1/mixins/feedback.js"],
        "qiqu/2.10.1/c/i-new/i-new.js": ["router", "qiqu/2.10.1/c/i-new/i-new.css"],
        "qiqu/2.10.1/c/i-promotion/i-promotion.js": ["qiqu/2.10.1/c/i-promotion/i-promotion.css"],
        "qiqu/2.10.1/c/i-tuwen/i-tuwen.js": ["u/meta", "u/emo", "u/utils", "qiqu/2.10.1/mixins/feedback.js"],
        "qiqu/2.10.1/c/list/list.js": ["c/i-tuwen", "c/i-joke", "c/i-changwen", "c/i-promotion", "c/i-new", "c/i-date", "c/i-ad", "c/appendMsg", "u/stat", "extend", "u/jump", "qiqu/2.10.1/mixins/commonTapEvent.js", "qiqu/2.10.1/mixins/video.js", "each", "u/store", "qiqu/2.10.1/c/list/list.css"],
        "qiqu/2.10.1/c/loading/loading.js": ["qiqu/2.10.1/c/loading/loading.css"],
        "qiqu/2.10.1/c/reflash-banner/reflash-banner.js": ["qiqu/2.10.1/c/reflash-banner/reflash-banner.css"],
        "qiqu/2.10.1/c/spinner/spinner.js": ["qiqu/2.10.1/c/spinner/spinner.css"],
        "qiqu/2.10.1/c/sprite/sprite.js": ["qiqu/2.10.1/c/sprite/sprite.css"],
        "qiqu/2.10.1/c/teachMask/teachMask.js": ["u/store", "config", "qiqu/2.10.1/c/teachMask/teachMask.css"],
        "qiqu/2.10.1/c/ucBanner/ucBanner.js": ["qiqu/2.10.1/c/ucBanner/ucBanner.css"],
        "qiqu/2.10.1/c/upd-banner/upd-banner.js": ["qiqu/2.10.1/c/upd-banner/upd-banner.css"],
        "qiqu/2.10.1/directives/downloadUC.js": ["config", "u/utils"],
        "qiqu/2.10.1/directives/feedback.js": ["jump", "config", "u/model", "u/utils", "u/store"],
        "qiqu/2.10.1/directives/jump.js": ["jump"],
        "qiqu/2.10.1/directives/share.js": ["u/utils", "config", "u/share"],
        "qiqu/2.10.1/directives/stat.js": ["u/stat", "extend", "u/store"],
        "qiqu/2.10.1/directives/tap.js": ["tap"],
        "qiqu/2.10.1/mixins/checkIndexUpd.js": ["u/model", "u/utils", "config", "u/store"],
        "qiqu/2.10.1/mixins/commonTapEvent.js": ["u/utils", "u/model", "u/stat", "extend", "u/store", "u/share", "config"],
        "qiqu/2.10.1/mixins/detail-comment.js": ["u/model", "u/utils", "config", "u/user", "extend", "u/store", "u/envi"],
        "qiqu/2.10.1/mixins/detail-page-init.js": ["c/c-fb", "u/utils", "config", "u/stat", "u/weixin", "extend", "u/envi", "qiqu/2.10.1/mixins/feedback.js"],
        "qiqu/2.10.1/mixins/feedback.js": ["u/model", "config"],
        "qiqu/2.10.1/mixins/iscroll.js": ["u/stat", "extend", "u/store"],
        "qiqu/2.10.1/mixins/page-init.js": ["u/utils", "config", "u/statTimer", "u/stat", "u/envi", "ucparams", "extend", "u/store", "u/pfm"],
        "qiqu/2.10.1/mixins/video.js": ["config", "u/stat", "extend", "u/model"],
        "qiqu/2.10.1/p/alltlist/alltlist.js": ["c/detail-header", "c/appendMsg", "c/errorMsg", "config", "u/model", "u/utils", "extend", "u/stat", "u/scrollManager", "u/jump", "u/store", "qiqu/2.10.1/p/alltlist/alltlist.css"],
        "qiqu/2.10.1/p/changwen/changwen.js": ["c/detail-header", "c/comment", "c/i-ad", "c/teachMask", "u/utils", "u/model", "config", "u/weixin", "extend", "u/store", "qiqu/2.10.1/mixins/detail-page-init.js", "qiqu/2.10.1/mixins/detail-comment.js", "qiqu/2.10.1/mixins/video.js", "qiqu/2.10.1/mixins/page-init.js", "u/stat", "u/envi", "u/jump", "qiqu/2.10.1/boot/filter/vl.js", "qiqu/2.10.1/p/changwen/changwen.css"],
        "qiqu/2.10.1/p/check/check.js": ["u/utils", "u/model", "config", "router", "u/jump", "u/store", "u/stat", "extend", "c/detail-header", "qiqu/2.10.1/p/check/check.css"],
        "qiqu/2.10.1/p/dailyList/dailyList.js": ["c/detail-header", "c/list", "qiqu/2.10.1/mixins/page-init.js", "qiqu/2.10.1/mixins/processList.js", "config", "u/model", "u/utils", "extend", "u/stat", "u/scrollManager", "u/store"],
        "qiqu/2.10.1/p/detail/detail.js": ["c/comment", "c/detail-header", "c/c-plus", "c/upd-banner", "c/teachMask", "u/utils", "extend", "network", "jump", "u/model", "config", "u/store", "u/envi", "u/meta", "u/stat", "u/weixin", "qiqu/2.10.1/mixins/detail-page-init.js", "qiqu/2.10.1/mixins/detail-comment.js", "qiqu/2.10.1/mixins/page-init.js", "qiqu/2.10.1/mixins/commonTapEvent.js", "qiqu/2.10.1/p/detail/detail.css"],
        "qiqu/2.10.1/p/duijiang/duijiang.js": ["c/detail-header", "u/utils", "u/store", "qiqu/2.10.1/p/duijiang/duijiang.css"],
        "qiqu/2.10.1/p/index/index.js": ["c/header", "c/discovery-list", "c/list", "c/banner", "c/c-plus", "c/c-fb", "c/reflash-banner", "c/upd-banner", "c/teachMask", "qiqu/2.10.1/mixins/page-init.js", "qiqu/2.10.1/mixins/checkIndexUpd.js", "qiqu/2.10.1/mixins/processList.js", "qiqu/2.10.1/mixins/feedback.js", "config", "u/model", "extend", "each", "u/stat", "u/statTimer", "qiqu/2.10.1/p/index/tab-index.js", "qiqu/2.10.1/p/index/tab-norm.js", "qiqu/2.10.1/p/index/tab-discovery.js", "qiqu/2.10.1/p/index/tab-daily.js", "qiqu/2.10.1/mixins/iscroll.js", "u/store", "u/user", "u/checkProfileUpd", "qiqu/2.10.1/p/index/index.css"],
        "qiqu/2.10.1/p/index/tab-daily.js": ["u/model", "u/utils", "u/store", "config", "u/scrollManager", "inlineData"],
        "qiqu/2.10.1/p/index/tab-discovery.js": ["u/model", "u/utils", "u/store", "config"],
        "qiqu/2.10.1/p/index/tab-index.js": ["u/model", "u/utils", "config", "u/scrollManager", "inlineData"],
        "qiqu/2.10.1/p/index/tab-norm.js": ["u/model", "u/utils", "config", "u/scrollManager", "inlineData"],
        "qiqu/2.10.1/p/list/list.js": ["c/detail-header", "c/list", "c/c-plus", "c/reflash-banner", "c/c-fb", "c/upd-banner", "qiqu/2.10.1/mixins/page-init.js", "qiqu/2.10.1/mixins/processList.js", "config", "u/model", "u/utils", "extend", "u/stat", "u/scrollManager", "u/jump", "u/storejs", "qiqu/2.10.1/mixins/iscroll.js", "qiqu/2.10.1/mixins/feedback.js", "qiqu/2.10.1/p/list/list.css"],
        "qiqu/2.10.1/p/mcomm/mcomm.js": ["c/detail-header", "c/appendMsg", "c/comment-sendbox", "u/model", "u/utils", "u/emo", "u/user", "config", "router", "each", "extend", "u/stat", "u/scrollManager", "u/envi", "u/store", "qiqu/2.10.1/p/mcomm/mcomm.css"],
        "qiqu/2.10.1/p/mpost/mpost.js": ["c/detail-header", "c/appendMsg", "c/c-toast", "network", "each", "u/user", "u/model", "router", "u/utils", "extend", "config", "u/stat", "u/jump", "u/store", "qiqu/2.10.1/p/mpost/mpost.css"],
        "qiqu/2.10.1/p/msg/msg.js": ["c/detail-header", "u/user", "u/model", "u/utils", "u/jump", "extend", "u/stat", "config", "u/store", "qiqu/2.10.1/p/msg/msg.css"],
        "qiqu/2.10.1/p/profile/profile.js": ["c/detail-header", "c/c-toast", "c/upd-banner", "u/utils", "u/model", "config", "ucparams", "u/user", "jump", "u/store", "u/checkProfileUpd", "qiqu/2.10.1/p/profile/profile.css"],
        "qiqu/2.10.1/p/submit/submit.js": ["c/detail-header", "c/c-toast", "extend", "config", "network", "u/user", "router", "u/store", "u/stat", "u/envi", "qiqu/2.10.1/p/submit/submit.css"],
        "qiqu/2.10.1/p/tlist/tlist.js": ["c/detail-header", "c/list", "c/c-plus", "c/c-fb", "u/model", "u/utils", "config", "qiqu/2.10.1/mixins/page-init.js", "router", "jump", "u/scrollManager", "qiqu/2.10.1/mixins/processList.js", "each", "extend", "u/stat", "u/store", "qiqu/2.10.1/mixins/feedback.js", "qiqu/2.10.1/p/tlist/tlist.css"],
        "qiqu/2.10.1/u/checkProfileUpd/checkProfileUpd.js": ["u/model", "u/utils", "event", "u/storejs"],
        "qiqu/2.10.1/u/conf/conf.js": ["extend", "appConfig"],
        "qiqu/2.10.1/u/emo/emo.js": ["qiqu/2.10.1/u/emo/emo.css"],
        "qiqu/2.10.1/u/envi/envi.js": ["each", "ucparams"],
        "qiqu/2.10.1/u/jump/jump.js": ["router", "u/utils"],
        "qiqu/2.10.1/u/meta/meta.js": ["config", "u/store"],
        "qiqu/2.10.1/u/model/model.js": ["network", "event", "extend", "u/utils"],
        "qiqu/2.10.1/u/pfm/pfm.js": ["network", "extend", "u/stat"],
        "qiqu/2.10.1/u/share/share.js": ["u/envi", "config", "u/utils"],
        "qiqu/2.10.1/u/stat/stat.js": ["u/model", "u/utils", "config", "extend"],
        "qiqu/2.10.1/u/statTimer/statTimer.js": ["u/stat", "extend", "u/store"],
        "qiqu/2.10.1/u/store/store.js": ["u/storejs", "config"],
        "qiqu/2.10.1/u/ucparams/ucparams.js": ["u/cookie"],
        "qiqu/2.10.1/u/user/user.js": ["u/envi", "u/utils", "config", "u/stat"],
        "qiqu/2.10.1/u/utils/utils.js": ["config", "u/envi"],
        "qiqu/2.10.1/u/weixin/weixin.js": ["wxConfig"]
    }
});
define('appConfig', function (require, exports, module) {
    module.exports = {
        "tagDict": {},
        "dailyConfig": {},
        "nav": [],
        "downloadUCUrl": {},
        "comment": {
            "like": 20
        },
        "vps": {},
        "check_config": {
            "display_list_count": 200
        },
        "statPgTable": "",
        "submit": {},
        "ugc": true,
        "imageFailed": false,
        "enable_comment": {
            "enable": true,
            "img": "http://image.uc.cn/s/uae/g/0q/product/2016_disable_comm.png"
        },
        "enable_submit": {
            "enable": true
        }
    }
}, false);

define('wxConfig', function (require, exports, module) {
    module.exports = {}
}, false);

define('inlineData', function (require, exports, module) {
    module.exports = {
        "indexData": {
            "index_top": [{
                "title": "起床大作战! 要设定几个闹钟时间才够?",
                "forum": "anyelse",
                "url": "http://www.qianqu.cc/life/43076.html",
                "post_type": "changwen",
                "tag": "长文",
                "cover": "http://image.uc.cn/n/nav/16/40a1c3dd8d1740a5825190fe576bcbd7f.jpeg",
                "imgUrl": "http://image.uc.cn/n/nav/16/40a1c3dd8d1740a5825190fe576bcbd7f.jpeg",
                "desc": "奇趣专栏 · 2016-02-19",
                "media_data": [{
                    "share_img_url": "http://image.uc.cn/n/nav/16/5d3f5adf4c7bb648eb5c92103e2961adf.jpeg"
                }],
                "link": "http://qiqu.uc.cn/?uc_param_str=frpfvedncpssntnwbi&ch=tg_zxzxqq#!/changwen?tag=qqdsj!!id=e24cdb6ce6b4692c100183af7fe94a85",
                "list_name": "qqdsj",
                "hot_comment": {},
                "comment_total": 41,
                "_id": "e24cdb6ce6b4692c100183af7fe94a85",
                "_incrs": {
                    "fb_seqing": 1,
                    "fb_wuliao": 1,
                    "share": 105,
                    "ai": 57,
                    "diao": 111,
                    "jian": 74,
                    "keng": 48
                }
            }],
            "index_banner": [{
                "title": "23岁女大学生产下三胞胎，男朋友不是孩子爹……",
                "url": "http://qiqu.uc.cn/?uc_param_str=frpfvedncpssntnwbi&ch=tg_zxzxqq#!/changwen?id=1ff1a7e9bb13cae4607de6080c5a7052!!tag=xjrb",
                "media_data": [{
                    "wifi_img_url": "http://image.uc.cn/s/uae/g/view/d37e25b0d72b078b61b6bbef2e7f9937"
                }]
            }],
            "jingxuan": [{
                "hot_comment": {
                    "author": "纯属虚构 ",
                    "author_id": "616542447",
                    "message": "进来看评论看老司机爆代码的右上[praise]",
                    "like": 69,
                    "dislike": 0,
                    "_id": "31616164",
                    "extra": {
                        "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1511281951448ff1f008c83ac22903f6ebca22e74d.jpg;3,160",
                        "post_title": "求大神科普。",
                        "post_type": "detail",
                        "post_tag": "index",
                        "user_ip": "223.73.10.20",
                        "user_port": "50086"
                    }
                },
                "tag": "图文",
                "like_start": 0,
                "_pos": 1455962405743,
                "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1zrL6HG2k-4Pb3988A.jpg;3,160",
                "dislike_start": 0,
                "list_info": {},
                "content": "",
                "user_name": "过去实在是不懂",
                "share_start": 0,
                "title": "求大神科普。",
                "_id": "7247c084966add6ea6d3fa4161de7a9e",
                "_incrs": {
                    "readed": 2,
                    "share": 37,
                    "fb_pianzan": 1,
                    "fb_other": 23,
                    "fb_seqing": 11,
                    "fb_zhengzhi": 1,
                    "dislike": 191,
                    "like": 385
                },
                "media_data": [{
                    "wifi_img_url": "http://image.uc.cn/n/nav/16/3d466c0c9b1c1bdf0445a343ece2a58ff.jpeg",
                    "mobile_img_url": "http://image.uc.cn/n/nav/16/857d87d3ceca7215ad3d8816d394cf50f.jpeg",
                    "is_origin": 1,
                    "format": "PNG",
                    "share_img_url": "http://image.uc.cn/n/nav/16/31a32a0c3d583c1341bf34adeea3f588f.jpeg",
                    "origin_img_url": {
                        "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/bb6cecd8f326e79e9e348b661253d366",
                        "resolution": "888x500"
                    }
                }],
                "comment_total": 36
            },
                {
                    "tag": "图文",
                    "like_start": 0,
                    "_pos": 1455962405721,
                    "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1zssRz0sc-2z03788A.jpg;3,160",
                    "dislike_start": 0,
                    "list_info": {},
                    "content": "",
                    "user_name": "` 凌轩懿雨 .°",
                    "share_start": 0,
                    "title": "一进游戏就感觉哪里不对。。。",
                    "_id": "3154c487579ebcb9d8c7bb083c888a37",
                    "_incrs": {
                        "dislike": 35,
                        "like": 50,
                        "readed": 3
                    },
                    "media_data": [{
                        "wifi_img_url": "http://image.uc.cn/n/nav/16/5759eb676d62b9e8d4d105094b211a37f.jpeg",
                        "mobile_img_url": "http://image.uc.cn/n/nav/16/3c75a82dbbe0b619714bf0ff9a398488f.jpeg",
                        "is_origin": 1,
                        "format": "JPEG",
                        "share_img_url": "http://image.uc.cn/n/nav/16/88a31a5a8c564e18736c73b274cfc648f.jpeg",
                        "origin_img_url": {
                            "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/181853672fc4cae0285e2cd72cbe7978",
                            "resolution": "157x229"
                        }
                    }]
                },
                {
                    "hot_comment": {},
                    "tag": "图文",
                    "like_start": 0,
                    "_pos": 1455961803202,
                    "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1zxOBNVEq-7w82788A.jpg;3,160",
                    "dislike_start": 0,
                    "list_info": {},
                    "content": "",
                    "user_name": "qinjey",
                    "share_start": 0,
                    "title": "库里赢球之后！😂这里就是分享快乐的地方嘛！",
                    "_id": "fccb86126b6abe47cb33a2163bb1eefe",
                    "_incrs": {
                        "dislike": 40,
                        "like": 57,
                        "fb_pianzan": 1
                    },
                    "original": true,
                    "media_data": [{
                        "wifi_img_url": "http://image.uc.cn/n/nav/16/92410d243eba7f820b46bfae4819ea1df.jpeg",
                        "mobile_img_url": "http://image.uc.cn/n/nav/16/0a82cbae95fcf01e3c7ac6607d9ac6d5f.jpeg",
                        "is_origin": 1,
                        "format": "JPEG",
                        "share_img_url": "http://image.uc.cn/n/nav/16/b73a2e0bfbd279c51446181e07be2ec6f.jpeg",
                        "origin_img_url": {
                            "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/8d3d7f9c2b9295d1fa32b8afea94b26d",
                            "resolution": "500x888"
                        }
                    }],
                    "comment_total": 1
                }]
        },
        "joke": [{
            "hot_comment": {},
            "tag": "段子",
            "like_start": 0,
            "_pos": 1455961801619,
            "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1602020724d5a78adb2b5f8863208459e920fdfd95.jpg;3,160",
            "dislike_start": 0,
            "list_info": {},
            "content": "有一女同事蛮漂亮的。因办公需求，每次都要从妹子旁边经过，一次无意之间发现妹子座位旁边的地板砖有一块是松的，为了吸引妹子的注意力，我每次经过都会用力踩一下地板砖，就会发一下响声，妹子就会看我一眼，然后羞涩的低下头，屡试不爽，终于有一次妹子叫住了我，楼主心里非常激动，妹子小声的跟我说，你能不能每次经过这的时候不要放屁啊！我",
            "user_name": "厕所里数苍蝇",
            "share_start": 0,
            "title": "",
            "_id": "9d7d1f3374555a1799b444657065cee3",
            "_incrs": {
                "share": 6,
                "readed": 1,
                "fb_zhengzhi": 1,
                "dislike": 32,
                "like": 53
            },
            "original": true,
            "comment_total": 1
        },
            {
                "hot_comment": {},
                "tag": "段子",
                "like_start": 0,
                "_pos": 1455961801550,
                "avatar": "http://image.uc.cn/s/uae/g/0q/product/anonymous1.png",
                "dislike_start": 0,
                "list_info": {},
                "content": "这几天住院，房间里还有一女的，骨折了不能动，一个实习护士负责她，给她插尿袋时，那女的叫起来了，你你你！插哪里了！瞬间我们在风中凌乱……",
                "user_name": "852508870",
                "share_start": 0,
                "title": "",
                "_id": "a7a0e50e88b578836de841f55501f142",
                "_incrs": {
                    "share": 1,
                    "readed": 4,
                    "like": 50,
                    "dislike": 25
                },
                "comment_total": 0
            },
            {
                "hot_comment": {},
                "tag": "段子",
                "like_start": 0,
                "_pos": 1455961201459,
                "avatar": "http://image.uc.cn/o/uop/1Ht08/;;0,uop/g/uop/avatar/1zsDTYJxn-2Bv3788A.jpg;3,160",
                "dislike_start": 0,
                "list_info": {},
                "content": "一孩再也不用担心爸妈想生二孩了。小侄女今年两岁，嫂子想生个二孩问她想要一个弟弟还是一个妹妹，她说都不要，叫爸爸再给她找个妈妈就好了。。。这才真是爸爸的贴心小棉袄啊",
                "user_name": "纳尼",
                "share_start": 0,
                "title": "",
                "_id": "f416b38ab6d7e9fefdbb612c1a190d4b",
                "_incrs": {
                    "share": 9,
                    "readed": 8,
                    "dislike": 86,
                    "like": 131
                },
                "comment_total": 0
            },
            {
                "hot_comment": {},
                "tag": "段子",
                "like_start": 23,
                "_pos": 1455957903515,
                "avatar": "http://image.uc.cn/s/uae/g/0q/avatar/30.png",
                "dislike_start": 4,
                "content": "小时候经常去工厂倒垃圾的地方找废铁。卖了买糖吃。一次我去那里发现好大一个铁疙瘩。跟根本搬不动。于是叫了几个小伙伴一起给弄回家了（真是费了九牛二虎之力啊。）结果收废品的说是铁粑粑（炼铁的废渣），根本没要。",
                "user_name": "心被挖空",
                "share_start": 20,
                "_id": "2d4a3f84e5e9269190947b4f8c949610",
                "_incrs": {
                    "share": 12,
                    "fb_wuliao": 2,
                    "fb_pianzan": 1,
                    "fb_other": 2,
                    "fb_seqing": 1,
                    "fb_zhengzhi": 1,
                    "like": 79,
                    "dislike": 33
                },
                "media_data": [],
                "comment_total": 4
            },
            {
                "hot_comment": {},
                "tag": "段子",
                "like_start": 34,
                "_pos": 1455957903471,
                "avatar": "http://image.uc.cn/s/uae/g/0q/avatar/4.png",
                "dislike_start": 6,
                "content": "我小时候就在想，中国13亿的人，每人不要多给，给我1毛钱就可以了！我就是亿万富翁了呀！你们想过吗？",
                "user_name": "吻破了唇",
                "share_start": 27,
                "_id": "fbefc9180e8d6fd97a7ef358dda8b0ff",
                "_incrs": {
                    "fb_seqing": 1,
                    "share": 12,
                    "fb_other": 1,
                    "like": 126,
                    "dislike": 41
                },
                "media_data": [],
                "comment_total": 20
            }],
        "newDaily": [{
            "desc": "男子交不出20万彩礼，女友被其父拉去“人流”",
            "tag": "长文",
            "_pos": 7897836,
            "active_time": "2016-02-20 07:00:00",
            "incrs_flag": 2500,
            "cover": "http://image.uc.cn/s/uae/g/view/441334acdd40ed9e6df1ae1afecfb568",
            "title": "小贱日报 · 每日十则 (2月20日)",
            "_id": "f4e8704f7652a57dab3b08333614dc5d",
            "_incrs": {
                "fb_wuliao": 3,
                "share": 299,
                "ai": 590,
                "fb_pianzan": 1,
                "fb_other": 1,
                "jian": 700,
                "fb_kanguo": 1,
                "keng": 738,
                "fb_seqing": 1,
                "diao": 2647,
                "fb_zhengzhi": 2
            },
            "list_name": "xjrb",
            "comment_total": 334
        },
            {
                "desc": "奇趣专栏 · 2016-02-20",
                "tag": "长文",
                "_pos": 7950968,
                "active_time": "2016-02-20 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/4babcb50632a43a50bb4dfc5490532a3f.jpeg",
                "title": "岛国家长最近都喜欢拍家中小孩的扑街瞬间, 这是没电了吗?",
                "_id": "1e280a74d6aa2af938d7589f09f99e13",
                "_incrs": {
                    "ai": 316,
                    "share": 263,
                    "fb_pianzan": 1,
                    "jian": 239,
                    "keng": 200,
                    "fb_seqing": 2,
                    "diao": 892,
                    "fb_zhengzhi": 1
                },
                "list_name": "qqdsj",
                "comment_total": 48
            },
            {
                "desc": "奇趣专栏 · 2016-02-20",
                "tag": "长文",
                "_pos": 7838276,
                "active_time": "2016-02-20 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/af2733d8991b8f1d6bae13d3723e7542f.jpeg",
                "title": "剑桥大学生大尺度走秀, 看不下去了!",
                "_id": "fb33bdbd20ca1d2470e2a631811838ad",
                "_incrs": {
                    "share": 170,
                    "ai": 125,
                    "diao": 433,
                    "jian": 152,
                    "fb_kanguo": 1,
                    "keng": 167
                },
                "list_name": "qqdsj",
                "comment_total": 34
            },
            {
                "desc": "奇趣专栏 · 2016-02-20",
                "tag": "长文",
                "_pos": 7897836,
                "active_time": "2016-02-20 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/bfa357a574c786846085971a7d3cdeaef.png",
                "title": "涨姿势 · 比男人蛋疼还疼的是哪种疼",
                "_id": "f0cf1c8e554f30c316c82fa9f65a2f9a",
                "_incrs": {
                    "share": 190,
                    "ai": 351,
                    "diao": 1271,
                    "jian": 435,
                    "keng": 531
                },
                "list_name": "zzs",
                "comment_total": 76
            },
            {
                "desc": "奇趣专栏 · 2016-02-20",
                "tag": "长文",
                "_pos": 7562231,
                "active_time": "2016-02-20 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/521a3ca58ba16a166bbf5f2f4ab1e070f.jpeg",
                "title": "奇趣怪谈 · 《病人档案》都是精神病",
                "_id": "9bf2ce4d86a7a036dce0ffd2a60bd00a",
                "_incrs": {
                    "fb_seqing": 2,
                    "share": 236,
                    "ai": 327,
                    "diao": 2353,
                    "jian": 256,
                    "keng": 294
                },
                "list_name": "qqgt",
                "comment_total": 208
            },
            {
                "desc": "奇趣专栏 · 2016-02-20",
                "tag": "长文",
                "_pos": 7838276,
                "active_time": "2016-02-20 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/542bbb2a07310aef245d195c9e4576d5f.jpeg",
                "title": "湿妹颜究所 · 女神校花秀好身材闺房照写真",
                "_id": "d2265e610e35b883cda33ecb21a7fabc",
                "_incrs": {
                    "fb_seqing": 2,
                    "share": 131,
                    "ai": 258,
                    "diao": 346,
                    "fb_pianzan": 1,
                    "jian": 183,
                    "fb_kanguo": 2,
                    "keng": 276
                },
                "list_name": "smyjs",
                "comment_total": 156
            },
            {
                "desc": "23岁女大学生产下三胞胎，男朋友不是孩子爹……",
                "tag": "长文",
                "_pos": 7838276,
                "active_time": "2016-02-19 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/s/uae/g/view/201f2726cd01a1871174556db046b39b",
                "title": "小贱日报 · 每日十则 (2月19日)",
                "_id": "1ff1a7e9bb13cae4607de6080c5a7052",
                "_incrs": {
                    "fb_wuliao": 8,
                    "share": 775,
                    "ai": 1553,
                    "fb_pianzan": 8,
                    "fb_other": 7,
                    "jian": 1682,
                    "fb_kanguo": 6,
                    "keng": 1716,
                    "fb_seqing": 17,
                    "diao": 6466,
                    "fb_zhengzhi": 12,
                    "fb_laji": 4
                },
                "list_name": "xjrb",
                "comment_total": 609
            },
            {
                "desc": "除了星爷那张电影票，我们还欠汪峰一个头条！",
                "tag": "长文",
                "_pos": 7562231,
                "active_time": "2016-02-19 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/s/uae/g/view/96f24723b3fcb388a9f50a0ea302f223",
                "title": "汪峰很心塞，这周的头条被一对鹅和两条鱼莫名其妙抢走了……",
                "_id": "772dac6479fd996553e49e33fbf53d74",
                "_incrs": {
                    "share": 338,
                    "ai": 256,
                    "diao": 1509,
                    "jian": 309,
                    "fb_kanguo": 2,
                    "keng": 330
                },
                "list_name": "qqdsj",
                "comment_total": 55
            },
            {
                "desc": "奇趣专栏 · 2016-02-19",
                "tag": "长文",
                "_pos": 7562231,
                "active_time": "2016-02-19 07:00:00",
                "incrs_flag": 2500,
                "cover": "http://image.uc.cn/n/nav/16/3e14fe8720d315976507e39007565fe0f.jpeg",
                "title": "奇趣怪谈 · 《Bone Dice》决定命运的骨骰子",
                "_id": "36a40493aeff30b045199601b0f7fc16",
                "_incrs": {
                    "fb_wuliao": 2,
                    "share": 476,
                    "ai": 457,
                    "fb_pianzan": 3,
                    "fb_other": 1,
                    "jian": 444,
                    "fb_kanguo": 7,
                    "keng": 664,
                    "fb_seqing": 1,
                    "diao": 2955,
                    "fb_zhengzhi": 12,
                    "fb_laji": 1
                },
                "list_name": "qqgt",
                "comment_total": 97
            },
            {
                "active_time": "2016-02-19 07:00:00",
                "incrs_flag": 2500,
                "title": "每日烧脑 · 数学还是错觉？",
                "cover": "http://image.uc.cn/s/uae/g/view/9760bd796d40f43a303b527422dab5c7",
                "desc": "奇趣专栏 · 2016-02-19",
                "_id": "df469ca55826d9735789e187486156a9",
                "tag": "长文",
                "_incrs": {
                    "fb_wuliao": 3,
                    "share": 206,
                    "ai": 846,
                    "fb_pianzan": 1,
                    "fb_other": 2,
                    "jian": 1064,
                    "fb_kanguo": 2,
                    "keng": 1825,
                    "fb_seqing": 3,
                    "diao": 1213,
                    "fb_zhengzhi": 1,
                    "fb_laji": 1
                },
                "_pos": 7838276,
                "comment_total": 988
            }],
        "video": [{
            "tv_duration": 63,
            "hot_comment": {},
            "tag": "视频",
            "like_start": 24,
            "_pos": 1452150687924,
            "avatar": "http://image.uc.cn/s/uae/g/0q/product/q-v-a.jpg",
            "dislike_start": 4,
            "user_name": "奇趣视频",
            "share_start": 15,
            "title": "这样借钱你敢借吗？",
            "_id": "a780f7ab6417465d76e09cac0a3fdb83",
            "_incrs": {
                "fb_wuliao": 3,
                "share": 670,
                "fb_other": 16,
                "fb_kanguo": 1,
                "fb_seqing": 8,
                "play": 214376,
                "fb_zhengzhi": 2,
                "fb_laji": 1,
                "dislike": 231,
                "like": 953
            },
            "media_data": [{
                "is_origin": 1,
                "format": "PNG",
                "origin_img_url": {
                    "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/2c858c17fc14baa56ee0f04c059d790f",
                    "resolution": "429x429"
                }
            }],
            "comment_total": 10
        },
            {
                "tv_duration": 61,
                "hot_comment": {},
                "tag": "视频",
                "like_start": 23,
                "_pos": 1452150655943,
                "avatar": "http://image.uc.cn/s/uae/g/0q/product/q-v-a.jpg",
                "dislike_start": 4,
                "user_name": "奇趣视频",
                "share_start": 25,
                "title": "吐槽《九层妖塔》",
                "_id": "d566f7583bcbc665937e4461b52952f5",
                "_incrs": {
                    "share": 218,
                    "fb_wuliao": 2,
                    "fb_other": 17,
                    "play": 161924,
                    "fb_seqing": 7,
                    "fb_zhengzhi": 2,
                    "dislike": 410,
                    "like": 864
                },
                "media_data": [{
                    "is_origin": 1,
                    "format": "JPEG",
                    "origin_img_url": {
                        "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/97f70154ab28abffeb675f69915e16c8",
                        "resolution": "480x480"
                    }
                }],
                "comment_total": 14
            },
            {
                "tv_duration": 55,
                "hot_comment": {},
                "tag": "视频",
                "like_start": 34,
                "_pos": 1452150640587,
                "avatar": "http://image.uc.cn/s/uae/g/0q/product/q-v-a.jpg",
                "dislike_start": 6,
                "user_name": "奇趣视频",
                "share_start": 18,
                "title": "歌词梗",
                "_id": "23345e3c041e1f96c0fab1d4a73de714",
                "_incrs": {
                    "share": 970,
                    "fb_wuliao": 4,
                    "fb_other": 22,
                    "fb_seqing": 7,
                    "play": 107061,
                    "like": 1510,
                    "dislike": 317
                },
                "media_data": [{
                    "is_origin": 1,
                    "format": "JPEG",
                    "origin_img_url": {
                        "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/97f9ee6a53b72f1b5a1c3c9ba02ba2b8",
                        "resolution": "480x480"
                    }
                }],
                "comment_total": 24
            },
            {
                "tv_duration": 108,
                "hot_comment": {},
                "tag": "视频",
                "like_start": 27,
                "_pos": 1452150636591,
                "avatar": "http://image.uc.cn/s/uae/g/0q/product/q-v-a.jpg",
                "dislike_start": 5,
                "user_name": "奇趣视频",
                "share_start": 21,
                "title": "拔河比赛",
                "_id": "029d568dd980321b8d557149d027f250",
                "_incrs": {
                    "share": 241,
                    "fb_other": 25,
                    "fb_kanguo": 2,
                    "fb_seqing": 4,
                    "play": 74877,
                    "dislike": 169,
                    "like": 603
                },
                "media_data": [{
                    "is_origin": 1,
                    "format": "JPEG",
                    "origin_img_url": {
                        "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/fc944a6be5b8dad71e8aca31d717b4b9",
                        "resolution": "426x426"
                    }
                }],
                "comment_total": 27
            },
            {
                "tv_duration": 18,
                "hot_comment": {},
                "tag": "视频",
                "like_start": 32,
                "_pos": 1452150633245,
                "avatar": "http://image.uc.cn/s/uae/g/0q/product/q-v-a.jpg",
                "dislike_start": 6,
                "user_name": "奇趣视频",
                "share_start": 16,
                "title": "中枪的点赞",
                "_id": "f212ac312f7da19fee4fb594a27477ed",
                "_incrs": {
                    "fb_wuliao": 2,
                    "share": 393,
                    "fb_pianzan": 3,
                    "fb_other": 27,
                    "fb_kanguo": 1,
                    "fb_seqing": 4,
                    "play": 192811,
                    "fb_zhengzhi": 2,
                    "fb_laji": 1,
                    "dislike": 324,
                    "like": 3214
                },
                "media_data": [{
                    "is_origin": 1,
                    "format": "PNG",
                    "origin_img_url": {
                        "origin_pic_url": "http://image.uc.cn/s/nav/g/qiqu/2015/afa4110e33f4e3e4375cc25366724b12",
                        "resolution": "570x570"
                    }
                }],
                "comment_total": 41
            }]
    } // 首屏数据
}, false)

_uca_time('_s')
_uca_time('_l1')
_uca_time('_b')
require.async(['vue', 'boot'], function (Vue, boot) {
    _uca_time('_l1')
    window.Vue = Vue
    boot({})
})

!function (e) {
        "use strict";

        function t(e) {
            return e = e.slice(), function (t) {
                t && s(t), a(e, function (e) {
                    for (t || (e.loaded = !0); e.onload && e.onload.length;) {
                        var n = e.onload.shift();
                        n.call(e)
                    }
                })
            }
        }
        function n(e) {
            var t = h.alias(e),
                o = h.get(t);
            if ("js" === i(t)) {
                if (!o) return s(new Error('failed to require "' + e + '"')), null;
                if (!o.exports) {
                    if ("function" !== r(o.factory)) throw new Error('failed to require "' + e + '"');
                    try {
                        o.factory.call(h, n, o.exports = {}, o)
                    } catch (a) {
                        throw a.id = t, h.traceback = a
                    }
                    delete o.factory, l("require", "[" + t + "] factory called")
                }
                return o.exports
            }
        }
        function o(e) {
            var t = h.alias(e),
                n = h.get(t);
            if ("css" === i(t)) {
                if (!n) throw new Error('failed to require "' + e + '"');
                if (!n.parsed) {
                    if ("string" !== r(n.rawCSS)) throw new Error('failed to require "' + e + '"');
                    var o = document.createElement("style");
                    document.head.appendChild(o), o.appendChild(document.createTextNode(n.rawCSS)), delete n.rawCSS, n.parsed = !0
                }
            }
        }
        function r(e) {
            var t;
            return null == e ? t = String(e) : (t = Object.prototype.toString.call(e).toLowerCase(), t = t.substring(8, t.length - 1)), t
        }
        function a(e, t, n) {
            if ("object" == typeof e) {
                var o, a, c = r(e);
                if (n = n || e, "array" === c || "arguments" === c || "nodelist" === c) {
                    for (o = 0, a = e.length; a > o; o++) if (t.call(n, e[o], o, e) === !1) return
                } else for (o in e) if (e.hasOwnProperty(o) && t.call(n, e[o], o, e) === !1) return
            }
        }
        function c(e) {
            function t() {}
            return t.prototype = e, new t
        }
        function i(e) {
            var t = "js";
            return e.replace(m, function (e, n) {
                t = n
            }), "js" !== t && "css" !== t && (t = "unknown"), t
        }
        function l() {
            var t = (e.localStorage || {}).debug,
                n = u.call(arguments),
                o = "color: #bada55",
                a = n.shift(),
                c = new RegExp(a.replace(/[.\/\\]/g, function (e) {
                    return "\\" + e
                }));
            a = "%c" + a, (t && "*" === t || c.test(t)) && (g !== a && (console.groupEnd(g, o), console.group(g = a, o)), /string|number|boolean/.test(r(n[0])) && (n[0] = "%c" + n[0], n.splice(1, 0, o)), console.log.apply(console, n))
        }
        function s() {
            console && "function" === r(console.error) && console.error.apply(console, arguments)
        }
        var u = Array.prototype.slice,
            d = e.localStorage,
            f = {},
            h = c(f);
        h.version = "0.3.10", h.options = {
            prefix: "__SCRAT__",
            cache: !1,
            hash: "",
            timeout: 15,
            alias: {},
            deps: {},
            urlPattern: null,
            comboPattern: null,
            combo: !1,
            maxUrlLength: 2e3
        }, h.cache = {}, h.traceback = null, h.loadArr = [], f.config = function (e) {
            var t = h.options;
            l("scrat.config", e), a(e, function (e, n) {
                var o = t[n],
                    c = r(o);
                "object" === c ? a(e, function (e, t) {
                    o[t] = e
                }) : ("array" === c && (e = o.concat(e)), t[n] = e)
            });
            try {
                t.hash !== d.getItem("__SCRAT_HASH__") && (h.clean(), d.setItem("__SCRAT_HASH__", t.hash)), t.cache = t.cache && !! t.hash
            } catch (n) {
                t.cache = !1
            }
            return /\bscrat=([\w,]+)\b/.test(location.search) && a(RegExp.$1.split(","), function (e) {
                switch (e) {
                    case "nocache":
                        h.clean(), t.cache = !1;
                        break;
                    case "nocombo":
                        t.combo = !1
                }
            }), t
        }, f.async = function (e, t) {
            "string" === r(e) && (e = [e]), l("scrat.async", "require [" + e.join(", ") + "]");
            var o = new h.Reactor(e, function () {
                var o = [];
                a(e, function (e) {
                    o.push(n(e))
                }), t && t.apply(h, o), l("scrat.async", "[" + e.join(", ") + "] callback called")
            });
            o.run()
        }, f.define = function (e, t, n) {
            l("scrat.define", "[" + e + "]");
            var o = h.options,
                r = h.cache[e];
            if (r ? r.factory = t : h.cache[e] = {
                    id: e,
                    loaded: !0,
                    factory: t
                }, o.cache && n !== !1) try {
                d.setItem(o.prefix + e, t.toString())
            } catch (a) {
                o.cache = !1
            }
        }, f.defineCSS = function (e, t, n) {
            l("scrat.defineCSS", "[" + e + "]");
            var r = h.options;
            if (h.cache[e] = {
                    id: e,
                    loaded: !0,
                    rawCSS: t
                }, n !== !1 && o(e), r.cache) try {
                d.setItem(r.prefix + e, t)
            } catch (a) {
                r.cache = !1
            }
        }, f.get = function (e) {
            l("scrat.get", "[" + e + "]");
            var t, n = h.options,
                o = i(e),
                r = h.cache[e];
            if (r) return r;
            if (n.cache && (t = d.getItem(n.prefix + e))) {
                if ("js" === o) {
                    var a = document.createElement("script");
                    a.appendChild(document.createTextNode('define("' + e + '",' + t + ")")), document.head.appendChild(a)
                } else "css" === o && h.defineCSS(e, t, !1);
                return h.cache[e].loaded = !1, h.cache[e]
            }
            return null
        }, f.clean = function () {
            l("scrat.clean");
            try {
                a(d, function (e, t) {~t.indexOf(h.options.prefix) && d.removeItem(t)
                }), d.removeItem("__SCRAT_HASH__")
            } catch (e) {}
        }, f.alias = function (e, t) {
            var n = h.options.alias;
            if (arguments.length > 1) return n[e] = t, h.alias(e);
            for (; n[e] && e !== n[e];) switch (r(n[e])) {
                case "function":
                    e = n[e](e);
                    break;
                case "string":
                    e = n[e]
            }
            return e
        }, f.load = function (e, t) {
            function n(n) {
                if (clearTimeout(m), clearInterval(o), n = (n || {}).error || new Error("load url timeout"), n.message = "Error loading url: " + e + ". " + n.message, !t.onerror) throw n;
                t.onerror.call(h, n)
            }
            "function" === r(t) && (t = {
                onload: t
            }, "function" === r(arguments[2]) && (t.onerror = arguments[2]));
            var o, a, c = t.type || i(e),
                s = "js" === c,
                u = "css" === c,
                d = +navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536,
                f = document.head,
                p = document.createElement(s ? "script" : "link"),
                g = "onload" in p,
                m = setTimeout(n, 1e3 * (t.timeout || 15));
            s ? (p.type = "text/javascript", p.async = "async", p.src = e) : (u && (p.type = "text/css", p.rel = "stylesheet"), p.href = e), p.onload = p.onreadystatechange = function () {
                h.loadArr.push(e), !p || p.readyState && !/loaded|complete/.test(p.readyState) || (clearTimeout(m), clearInterval(o), p.onload = p.onreadystatechange = null, s && f && p.parentNode && f.removeChild(p), t.onload && t.onload.call(h), p = null)
            }, p.onerror = n, l("scrat.load", "[" + e + "]"), f.appendChild(p), u ? (d || !g) && (l("scrat.load", "check css's loading status for compatible"), a = 0, o = setInterval(function () {
                return (a += 20) > t.timeout || !p ? (clearTimeout(m), void clearInterval(o)) : void(p.sheet && (clearTimeout(m), clearInterval(o), t.onload && t.onload.call(h), p = null))
            }, 20)) : s || t.onload && t.onload.call(h)
        }, f.Reactor = function (e, t) {
            this.length = 0, this.depends = {}, this.depended = {}, this.push.apply(this, e), this.callback = t
        };
        var p = h.Reactor.prototype;
        p.push = function () {
            function e() {
                0 === --t.length && t.callback()
            }
            var t = this,
                n = u.call(arguments);
            a(n, function (n) {
                var r = h.alias(n),
                    a = i(r),
                    c = h.get(r);
                if (c) {
                    if (t.depended[r] || c.loaded) return
                } else c = h.cache[r] = {
                    id: r,
                    loaded: !1
                };
                c.onload || (c.onload = []), t.depended[r] = 1, t.push.apply(t, h.options.deps[r]), "css" === a && !c.rawCSS && !c.parsed || "js" === a && !c.factory && !c.exports ? ((t.depends[a] || (t.depends[a] = [])).push(c), ++t.length, c.onload.push(e)) : c.rawCSS && o(r)
            })
        }, p.run = function () {
            function e(e) {
                var r = 0,
                    c = [],
                    i = [];
                a(e, function (a, l) {
                    var s;
                    r + a.id.length < o.maxUrlLength ? (r += a.id.length, c.push(a.id), i.push(a)) : (s = t(i), h.load(n.genUrl(c), s, s), r = a.id.length, c = [a.id], i = [a]), l === e.length - 1 && (s = t(i), h.load(n.genUrl(c), s, s))
                })
            }
            var n = this,
                o = h.options,
                r = o.combo,
                c = o.cache,
                i = this.depends;
            return 0 === this.length ? this.callback() : (l("reactor.run", i), a(i.unknown, function (e) {
                h.load(n.genUrl(e.id), function () {
                    e.loaded = !0
                })
            }), l("reactor.run", "combo: " + r), void(r ? c ? e((i.css || []).concat(i.js || [])) : (e(i.css || []), e(i.js || [])) : a((i.css || []).concat(i.js || []), function (e) {
                var o = t([e]);
                h.load(n.genUrl(e.id), o)
            })))
        }, p.genUrl = function (e) {
            "string" === r(e) && (e = [e]);
            var t = h.options,
                n = t.combo && t.comboPattern || t.urlPattern;
            switch (t.cache && a(e, function (t, n) {
                "css" === i(t) && (e[n] = t + ".js")
            }), r(n)) {
                case "string":
                    n = n.replace("%s", e.join(","));
                    break;
                case "function":
                    n = n(e);
                    break;
                default:
                    n = e.join(",")
            }
            return n + (~n.indexOf("?") ? "&" : "?") + "_hash=" + t.hash
        }, a(f, function (e, t) {
            n[t] = e
        });
        var g, m = /\.(js|css)(?=[?&,]|$)/i;
        e.require = h, e.define = h.define, e.defineCSS = h.defineCSS, "object" == typeof module && "object" == typeof module.exports && (module.exports = h)
    }(this);



define("qiqu/2.10.1/mixins/iscroll.js", function (t, e, s) {
    "use strict";

    function r(t) {
        return "transform: translate(0, " + t + "px)translateZ(0);-webkit-transform: translate(0, " + t + "px)translateZ(0);"
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
    s.exports = {
        data: function () {
            return {
                refreshBanner: {
                    show: !1,
                    style: "",
                    status: "down",
                    txt: ""
                }
            }
        },
        methods: {
            onStart: function (t) {
                var e = t.targetTouches[0],
                    s = t.currentTarget;
                s.addEventListener("touchmove", this._move, !1), s.addEventListener("touchend", this._end, !1), this._startScrollY = window.scrollY, this._startX = e.pageX, this._startY = e.pageY, this._dr = h.NONE, this._hasTouch = !0, this._isPull = !1
            },
            _move: function () {
                var t = event.targetTouches[0];
                if (this._dr !== h.UP) {
                    if (this._dr === h.NONE) {
                        var e = t.pageX - this._startX,
                            s = t.pageY - this._startY,
                            r = Math.abs(s),
                            n = Math.abs(e);
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
                if (this.refreshing || !this.canloading) return void(this.refreshBanner.show = !1);
                this.refreshBanner.txt = "加载中...", this.refreshBanner.status = "loading";
                var t = this;
                this.refresh(function (e, s) {
                    e ? (t.refreshBanner.status = "done", t.refreshDone(s)) : (t.loading.show = !1, t.refreshBanner.status = "error", t.refreshDone("加载失败"))
                }), n.clickStat(a({
                    ck_rg: "通用",
                    ck_po: "刷新"
                }, i.prop.statPageParams))
            },
            refreshDone: function (t) {
                this.refreshBanner.txt = t;
                var e = this,
                    s = e.refreshBanner.status;
                this._refreshTimer = setTimeout(function () {
                    ("done" === s || "error" === s) && (e.refreshBanner.show = !1)
                }, 1500)
            }
        }
    }
})