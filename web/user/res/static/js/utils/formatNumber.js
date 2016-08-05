define(function(){
    function formatNumber(num){
        var num = parseFloat(num);
        if(isNaN(num)){
            throw "这不是一个数字，不能被格式化";
        }
        if(num < 1000){
            return num;
        }else if(num >= 1000 && num < 10000){
            return Math.floor(num / 1000)+'千';
        }else if(num >= 10000 && num < 100000000){
            return Math.floor(num / 10000)+'万';
        }else if(num >= 100000000){
            return Math.floor(num / 100000000)+'亿'
        }
    }
    return formatNumber;
})
