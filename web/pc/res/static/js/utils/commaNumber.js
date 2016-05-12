define(function(){
    function commaNumber(num){
        if(num > 100000000){
            throw "超出范围";
        }
        if(num < 1000){
            return num;
        }
        var source = String(num).split(".");//按小数点分成2部分
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
        return source.join(".");//再将小数部分合并进来
    }
    return commaNumber;
})
