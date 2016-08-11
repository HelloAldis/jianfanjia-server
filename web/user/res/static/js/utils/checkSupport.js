define(function(){
    var checkSupport = function(){
        var input = document.createElement('input');
        var fileSupport = !!(window.File && window.FileList);
        var xhr = new XMLHttpRequest();
        var fd = !!window.FormData;
        return 'multiple' in input && fileSupport && 'onprogress' in xhr && 'upload' in xhr && fd ? 'html5' : 'flash';
    };
    return checkSupport;
})
