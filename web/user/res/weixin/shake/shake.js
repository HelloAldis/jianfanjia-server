/**
 * Created by Administrator on 2016/1/25.
 */

function getRandom(){
    return Math.ceil(Math.random()*100)
}
var text = ['让','装','修','变','简','单'];
var range = [1,3,5,10,30,50];

function compute(num){
    var arr = [];
    for(var i=0; i < num; i++){
        arr.push(getRandom())
    };
    return arr;
}
function merge(){
    var arr = [];
    for(var i=0; i < range.length; i++){
        arr.push(compute(range[i]))
    };
    return arr;
}
function result(num,arr){
    for(var i =0; i < arr.length; i++){
        for(var j =0; j < arr[i].length; j++){
            if(num == arr[i][j]){
                return i;
            }
        }
    }
    //console.log(getRandom(),arr)
    return result(getRandom(),arr);
}
//console.log(num,arr)
var arr = [];
for(var i = 0 ; i < 1000; i++){
    arr.push(result(getRandom(),merge()))
}
document.body.innerHTML = arr


var $ = {
    query : function(selectName){
        if(selectName.indexOf("#")!=-1){
            return document.getElementById(selectName.replace('#',''));
        }else if(selectName.indexOf(".")!=-1){
            return document.getElementsByClassName(selectName.replace('.',''));
        }else{
            return document.getElementsByTagName(selectName);
        }
    },
    find : function(oParent,child){
        return document.querySelectorAll(oParent+' '+child);
    },
    addClass : function(ele,cls){
        if (!this.hasClass(ele,cls)) {
            ele.className += " "+cls;
        }
    },
    removeClass : function(ele,cls){
        if (this.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    },
    hasClass : function(ele,cls){
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }
};
function selectfrom (lowValue,highValue){
    var choice=highValue-lowValue+1;
    return Math.floor(Math.random()*choice+lowValue);
}
function Shake(){}
Shake.prototype.init = function(){
    var _this = this;
    this.canShake = 1;
    this.SHAKE_THRESHOLD = 1000;
    this.last_update = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.last_x = 0;
    this.last_y = 0;
    this.last_z = 0;
    this.query();
    this.createStar(20);
    this.imgLoad();
    this.againEvent();
    this.InitMotion();
}
Shake.prototype.query = function(){
    this.oPage = $.query('#page');
    this.oMusic = $.query('#music');
    this.oResult = $.find('#page','.result')[0];
    this.oRenwu = $.find('#page','.renwu')[0];
    this.oAgain = $.find('#page','.again')[0];
    this.oImg = $.find('#page','.result .img')[0];
    this.oStar = $.find('#page','.star')[0];
    this.oTransition = $.find('#page','.transition')[0];
}
Shake.prototype.InitMotion = function(){
    var _this = this;

    //监听手机摇动事件
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', _this.deviceMotionHandler, false);
    } else {
        alert('你的设备不支持DeviceMotion事件');
    }
    this.last_update = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.last_x = 0;
    this.last_y = 0;
    this.last_z = 0;
    this.canShake = 1;
}
Shake.prototype.deviceMotionHandler = function(event){
    var _this = this;
    var acceleration = event.accelerationIncludingGravity;
    console.log(acceleration)
    var curTime = +new Date();
    //100ms监听一次，拒绝重复监听
    if ((curTime - this.last_update) > 100 && this.canShake == 1) {
        document.title = 1;
        var diffTime = curTime - this.last_update;
        this.last_update = curTime;
        this.x = acceleration.x;
        this.y = acceleration.y;
        this.z = acceleration.z;
        var speed = Math.abs(_this.x + _this.y + _this.z - _this.last_x - _this.last_y - _this.last_z) / diffTime * 10000;
        if (speed > this.SHAKE_THRESHOLD) {
            _this.canShake = 0;
            _this.oMusic.play();
            _this.transitionIn();
            setTimeout(_this.showDecode, 3000);
        }
        this.last_x = this.x;
        this.last_y = this.y;
        this.last_z = this.z;
    }
}
Shake.prototype.showDecode = function(){
    var _this = this;
    var resultData = ['result0.png','result1.png','result2.png','result3.png','result4.png','result5.png'];
    _this.oImg.src = resultData[_this.getRandomNumber(100)];
    _this.transitionOut();
    _this.resultShow();
    setTimeout(_this.jumpToDecode, 1000);
}
Shake.prototype.jumpToDecode = function(){
    var _this = this;
    this.canShake = 1;
    window.removeEventListener('devicemotion', _this.deviceMotionHandler, false);
}
Shake.prototype.bindEvent = function(){
    var _this = this;
    _this.InitMotion();
    //setTimeout(_this.InitMotion,1000);
}
Shake.prototype.againEvent = function(){
    var _this = this;
    this.oAgain.addEventListener('touchstart', function(){
        _this.resultHide();
        _this.InitMotion();
    }, false)
}
Shake.prototype.musicEvent = function(){
    var _this = this;
    this.oTransition.addEventListener('touchstart', function(){

    }, false)
}
Shake.prototype.createStar = function(num){   //随机星星位置摆放
    var docW = document.body.clientWidth,
        docH = document.body.clientHeight;
    var sDiv = '';
    for(var i=0; i<num; i++){
        sDiv += '<div style="left:'+selectfrom (0,docW)+'px;top:'+selectfrom (0,docH)+'px"></div>';
    }
    this.oStar.innerHTML = sDiv;
}
Shake.prototype.transitionIn = function(){
    var _this =this;
    $.removeClass(this.oTransition,'hide');
    this.transitionMove();
}
Shake.prototype.transitionOut = function(){
    $.addClass(this.oTransition,'hide');
}
Shake.prototype.transitionMove = function(){   //摇晃显示动画
    var _this = this;
    var imgArr = ['monkey0.png','monkey1.png','monkey2.png','monkey3.png','monkey4.png'];
    var txtArr = ['让我们一起摇摆~','让我们一起摇摆~','让我们一起摇摆~','让我们一起摇摆~','休息一下<br />出字只需<span>3</span>秒'];
    var i = 0;
    var timer = null;
    timer = setInterval(function(){
        i++;
        _this.oTransition.innerHTML = '<img src="'+imgArr[i]+'" alt=""> <p>'+txtArr[i]+'</p>';
        if(i==imgArr.length-1){
            clearInterval(timer);
        }
    },500);
}
Shake.prototype.getRandomNumber = function(number){ //计算随机概率
    var range = [1,3,5,10,30,50];
    function getRandom(num){
        return Math.ceil(Math.random()*num)
    }
    function compute(num){
        var arr = [];
        for(var i=0; i < num; i++){
            arr.push(getRandom(100))
        };
        return arr;
    }
    function merge(){
        var arr = [];
        for(var i= 0,len = range.length; i < len; i++){
            arr.push(compute(range[i]))
        };
        return arr;
    }
    function result(num,arr){
        for(var i = 0,len1 = arr.length; i < len1; i++){
            for(var j = 0,len2 = arr[i].length; j < len2; j++){
                if(num == arr[i][j]){
                    return i;
                }
            }
        }
        return result(getRandom(number),arr);
    }
    return result(getRandom(number),merge())
}
Shake.prototype.resultShow = function(){
    var oLantern = $.find('#page','.lantern')[0];
    $.addClass(oLantern,'hide');
    $.addClass(this.oRenwu,'hide');
    $.addClass($.query('figure')[0],'hide');
    $.removeClass(this.oResult,'hide');
}
Shake.prototype.resultHide = function(){
    var oLantern = $.find('#page','.lantern')[0];
    $.addClass(this.oResult,'hide');
    $.removeClass(oLantern,'hide');
    $.removeClass(this.oRenwu,'hide');
    $.removeClass($.query('figure')[0],'hide');
    this.oTransition.innerHTML = '';
}
Shake.prototype.imgLoad = function(){
    var _this = this;
    var c = ['lantern0.png', 'lantern1.png', 'monkey0.png', 'monkey1.png', 'monkey2.png', 'monkey3.png', 'monkey4.png', 'renwu.png', 'result0.png', 'result1.png', 'result2.png', 'result3.png', 'result4.png', 'result5.png'];
    var d = 0;
    c.forEach(function(i, a){
        var b = new Image();
        b.src = i;
        b.onload = function () {
            d++;
            if (d == c.length){
                _this.bindEvent();
            }
        };
        b.error = function () {
            _this.bindEvent();
        }
    })
}
var shake = new Shake();
shake.init();
/*var arr = [];
 for(var i = 0 ; i < 100; i++){
 arr.push(result(getRandom(100),merge()))
 }
 var a = count(arr);
 for(var i=0; i< a.length; i++){
 console.log('文字'+text[a[i][0]]+',出现了'+a[i][1]+'次')
 }
 function count(list){
 var res = [];
 list.sort();
 for(var i = 0;i<list.length;)
 {
 var count = 0;
 for(var j=i;j<list.length;j++)
 {

 if(list[i] == list[j])
 {
 count++;
 }

 }
 res.push([list[i],count]);
 i+=count;
 }
 return res;
 }*/