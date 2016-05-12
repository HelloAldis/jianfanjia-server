define(function(){
    return {
        role : function(input){
            return {
                "0" : "管理员",
                "1" : "业主",
                "2" : "设计师"
            }[input]
        },
        sex : function(input){
            return {
                "0" : "男",
                "1" : "女",
                "2" : "不限"
            }[input]
        },
        dec_type : function(input){
            return {
                "0" : "家装",
                "1" : "商装",
                "2" : "软装"
            }[input]
        },
        work_type : function(input){
            return {
                "0" : "设计＋施工(半包)",
                "1" : "设计＋施工(全包)",
                "2" : "纯设计"
            }[input]
        },
        dec_style : function(input){
            return {
                "0" : "欧式",
                "1" : "中式",
                "2" : "现代",
                "3" : "地中海",
                "4" : "美式",
                "5" : "东南亚",
                "6" : "田园"
            }[input]
        },
        price_area : function(input){
            return {
                "0" : "50-100",
                "1" : "100-200",
                "2" : "200-300",
                "3" : "300以上"
            }[input]
        },
        house_type : function(input){
            return {
                "0" : "一室",
                "1" : "二室",
                "2" : "三室",
                "3" : "四室",
                "4" : "复式",
                "5" : "别墅",
                "6" : "LOFT",
                "7" : "其他"
            }[input]
        },
        business_house_type : function(input){
            return {
                "0":'餐厅',
                "1":'服装店',
                "2":'酒吧',
                "3":'美容院',
                "4":'办公室',
                "5":'美发店',
                "6":'幼儿园',
                "7":'酒店',
                "9999":'其他'
            }[input]
        },
        dec_flow : function(input){
            return {
                "0" : "量房",
                "1" : "开工",
                "2" : "拆改",
                "3" : "水电",
                "4" : "泥木",
                "5" : "油漆",
                "6" : "安装",
                "7" : "竣工"
            }[input]
        }
    }
})
