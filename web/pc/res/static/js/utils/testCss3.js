define(function(){
    var testCss3 = function(c){var p=['webkit','Moz','ms','o'],i,a=[],s=document.documentElement.style,t=function(r){return r.replace(/-(\w)/g,function($0,$1){return $1.toUpperCase()})};for(i in p){a.push(t(p[i]+'-'+c));a.push(t(c))}for(i in a){if(a[i]in s){return true}}return false};
    return testCss3;
})
