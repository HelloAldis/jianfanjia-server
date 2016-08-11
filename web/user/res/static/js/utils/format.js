define(function(){
    /*
    格式化时间
     */
    (function(){
      var e, t = /\\?([a-z])/gi, n = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], r = function(e, t) {
          return s[e] ? s[e]() : t
      }, i = function(e, t) {
          return (e += "").length < t ? (new Array(++t - e.length)).join("0") + e : e
      }, s = {d: function() {
              return i(s.j(), 2)
          },D: function() {
              return s.l().slice(0, 3)
          },j: function() {
              return e.getDate()
          },l: function() {
              return n[s.w()] + "day"
          },N: function() {
              return s.w() || 7
          },S: function() {
              var e = s.j();
              return e < 4 | e > 20 && ["st", "nd", "rd"][e % 10 - 1] || "th"
          },w: function() {
              return e.getDay()
          },z: function() {
              var e = new Date(s.Y(), s.n() - 1, s.j()), t = new Date(s.Y(), 0, 1);
              return Math.round((e - t) / 864e5) + 1
          },W: function() {
              var e = new Date(s.Y(), s.n() - 1, s.j() - s.N() + 3), t = new Date(e.getFullYear(), 0, 4);
              return i(1 + Math.round((e - t) / 864e5 / 7), 2)
          },F: function() {
              return n[6 + s.n()];
          },m: function() {
              return i(s.n(), 2)
          },M: function() {
              return s.F().slice(0, 3)
          },n: function() {
              return e.getMonth() + 1
          },t: function() {
              return (new Date(s.Y(), s.n(), 0)).getDate()
          },L: function() {
              var e = s.Y();
              return e % 4 == 0 & e % 100 != 0 | e % 400 == 0;
          },o: function() {
              var e = s.n(), t = s.W(), n = s.Y();
              return n + (e === 12 && t < 9 ? -1 : e === 1 && t > 9)
          },Y: function() {
              return e.getFullYear();
          },y: function() {
              return (s.Y() + "").slice(-2)
          },a: function() {
              return e.getHours() > 11 ? "pm" : "am"
          },A: function() {
              return s.a().toUpperCase();
          },B: function() {
              var t = e.getUTCHours() * 3600, n = e.getUTCMinutes() * 60, r = e.getUTCSeconds();
              return i(Math.floor((t + n + r + 3600) / 86.4) % 1e3, 3);
          },g: function() {
              return s.G() % 12 || 12;
          },G: function() {
              return e.getHours();
          },h: function() {
              return i(s.g(), 2);
          },H: function() {
              return i(s.G(), 2);
          },i: function() {
              return i(e.getMinutes(), 2);
          },s: function() {
              return i(e.getSeconds(), 2);
          },u: function() {
              return i(e.getMilliseconds() * 1e3, 6);
          },e: function() {
              throw "Not supported (see source code of date() for timezone on how to add support)";
          },I: function() {
              var e = new Date(s.Y(), 0), t = Date.UTC(s.Y(), 0), n = new Date(s.Y(), 6), r = Date.UTC(s.Y(), 6);
              return 0 + (e - t !== n - r);
          },O: function() {
              var t = e.getTimezoneOffset(), n = Math.abs(t);
              return (t > 0 ? "-" : "+") + i(Math.floor(n / 60) * 100 + n % 60, 4);
          },P: function() {
              var e = s.O();
              return e.substr(0, 3) + ":" + e.substr(3, 2);
          },T: function() {
              return "UTC";
          },Z: function() {
              return -e.getTimezoneOffset() * 60;
          },c: function() {
              return "Y-m-d\\Th:i:sP".replace(t, r);
          },r: function() {
              return "D, d M Y H:i:s O".replace(t, r);
          },U: function() {
              return e / 1e3 | 0;
          }};
      Date.format = function(n, i) {
          return arguments.length == 1 ? (i = n, n = "Y-m-d H:i:s") : arguments.length == 0 && (i = null, n = "Y-m-d H:i:s"), e = i == null ? new Date : i instanceof Date ? new Date(i) : new Date(i * 1e3), n.replace(t, r);
      }, Date.prototype.format = function(e) {
          return Date.format(e, this);
      }
    })();
    /*个性化时间*/
    (function(){
      var e = {lessThanMinuteAgo: "刚刚",minuteAgo: " 1 分钟前",minutesAgo: " {delta} 分钟前",hourAgo: " 1 小时前",hoursAgo: " {delta} 小时前",dayAgo: "昨天",daysAgo: " {delta} 天前",weekAgo: " 1 周前",weeksAgo: " {delta} 周前",monthAgo: " 1个月前",monthsAgo: " {delta} 个月前",yearAgo: " 1 年前",yearsAgo: " {delta} 年前",lessThanMinuteUntil: "从现在开始不到 1 分钟",minuteUntil: "从现在开始約 1 分钟",minutesUntil: "从现在开始约 {delta} 分钟",hourUntil: "从现在开始 1 小时",hoursUntil: "从现在开始约 {delta} 小时",dayUntil: "从现在开始 1 天",daysUntil: "从现在开始 {delta} 天",weekUntil: "从现在开始 1 星期",weeksUntil: "从现在开始 {delta} 星期",monthUntil: "从现在开始 1 个月",monthsUntil: "从现在开始 {delta} 个月",yearUntil: "从现在开始 1 年",yearsUntil: "从现在开始 {delta} 年"};
      Date.getTimePhrase = function(e) {
          var t = e < 0 ? "Until" : "Ago";
          e < 0 && (e *= -1);
          var n = {minute: 60,hour: 60,day: 24,week: 7,month: 52 / 12,year: 12,eon: Infinity}, r = "lessThanMinute";
          for (var i in n) {
              var s = n[i];
              if (e < 1.5 * s) {
                  e > .75 * s && (r = i);
                  break;
              }
              e /= s, r = i + "s";
          }
          return e = Math.round(e), {msg: r,delta: e,suffix: t}
      }, Date.timeAgo = function(t) {
          var n = t == null ? (new Date()).getTime() : (new Date(t)).getTime(), r = Math.round((new Date - n) / 1e3);
          if (r > 2592e3)
              return Date.format("Y-m-d H:i:s", n);
          var i = Date.getTimePhrase(r);
          return e[i.msg + i.suffix].replace("{delta}", i.delta);
      }, Date.prototype.timeAgo = function() {
          return Date.timeAgo(this);
      }
    })();
    /*格式化时间*/
    (function(){
      var e = function(e, t) {
          return e.getUTCFullYear() === t.getUTCFullYear() && e.getUTCMonth() === t.getUTCMonth() && e.getUTCDate() === t.getUTCDate()
      }, t = function(e, t) {
          return e.getUTCFullYear() === t.getUTCFullYear() && e.getUTCMonth() === t.getUTCMonth() && e.getUTCDate() === t.getUTCDate() - 1
      }, n = function(e, t) {
          return e.getUTCFullYear() === t.getUTCFullYear()
      };
      Date.formatMoment = function(r) {
          var i = r == null ? new Date : r instanceof Date ? new Date(r) : new Date(r * 1e3), s = new Date, o;
          return e(i, s) ? o = "今天 H:i" : t(i, s) ? o = "昨天 H:i" : n(i, s) ? o = "m 月 d 日 H:i" : o = "Y 年 m 月 d 日 H:i", Date.format(o, i);
      }, Date.prototype.formatMoment = function() {
          return Date.formatMoment(this);
      }
    })();
})
