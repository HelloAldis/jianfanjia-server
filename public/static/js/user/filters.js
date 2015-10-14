'use strict';
// 公用自定义筛选
angular.module('filters', [])
	.filter('sexFilter', function () {   //性别筛选
        return function (input) {
            return {
                "0":"男",
                "1":"女"
            }[input];
        }
    })
    .filter('authTypeFilter', function () {    //设计师认证状态
        return function (input) {
            return {
                "0":"未提交认证",
                "1":"审核中",
                "2":"审核通过",
                "3":"审核不通过",
                "4":"违规下线"
            }[input];
        }
    })
    .filter('decTypeFilter', function () {   //装修类别
        return function (input) {
            return {
                "0":"家装",
                "1":"商装",
                "2":"软装"
            }[input];
        }
    })
    .filter('decStyleFilter', function () {   //擅长风格
        return function (input) {
            return {
                "0":"欧式",
                "1":"中式",
                "2":"现代",
                "3":"地中海",
                "4":"美式",
                "5":"东南亚",
                "6":"田园"
            }[input];
        }
    })
    .filter('decDistrictsFilter', function () {     //接单区域
        return function (input) {
            return {
                "0":"江岸区",
                "1":"江汉区",
                "2":"硚口区",
                "3":"汉阳区",
                "4":"武昌区",
                "5":"洪山区",
                "6":"青山区"
            }[input];
        }
    })
    .filter('designFeeRangeFilter', function () {     //设计费报价
        return function (input) {
            return {
                "0":"50-100",
                "1":"100-200",
                "2":"200-300",
                "3":"300以上"
            }[input];
        }
    })
    .filter('designTypeFilter', function () {     //习惯沟通方式
        return function (input) {
            return {
                "0":"不限",
                "1":"表达型",
                "2":"聆听型"
            }[input];
        }
    })
    .filter('workTypeFilter', function () {     //习惯沟通方式
        return function (input) {
            return {
                "0":"半包",
                "1":"全包"
            }[input];
        }
    })
    .filter('houseTypeFilter', function () {     //意向接单户型
        return function (input) {
            return {
                "0":"一居",
                "1":"二室",
                "2":"三室",
                "3":"四室",
                "4":"复式",
                "5":"别墅",
                "6":"LOFT",
                "7":"其他"
            }[input];
        }
    })
<<<<<<< HEAD
<<<<<<< HEAD
	
=======
=======
>>>>>>> 10bb1567a9c920511a1dfe40d1671f1315119a32
	.filter('cityFilter', function () {
        return function (data, parent) {
            var filterData = [];
            angular.forEach(data, function (obj) {
                if (obj.parent == parent) {
                    filterData.push(obj);
                }
            })

            return filterData;
        }
    })
    .filter('processFilter', function () {
        return function (input) {
             return {0:'开工',
                     1:'拆改',
                     2:'水电',
                     3:'泥木',
                     4:'油漆',
                     5:'安装',
                     6:'竣工'}[input];
        }
    })
    .filter('getTimesFilter',function(){
        return function (input) {
             return (new Date(input.replace(/-/g,'/'))).getTime();
        }
    })
    .filter('authFilter', function () {   //设计师审核状态
        return function (input) {
            return {
                "0":"未通过",
                "1":"审核通过",
                "2":"审核不通过",
                "3":"违规下线"
            }[input];
        }
    })
    .filter('requirementFilter', function () {
        return function (input) {
            return {
                "0":"未预约",
                "1":"已预约但无人响应",
                "2":"有响应但无人提交方案",
                "3":"提交方案但无选定方案",
                "4":"选定方案无配置工地",
                "5":"配置工地"
            }[input];
        }
    })
    .filter('planFilter', function () {      //方案状态
        return function (input) {
            return {
                "0":"已预约无响应",
                "1":"已拒绝业主",
                "2":"有响应无方案",
                "3":"已提交方案",
                "4":"方案被拒绝",
                "5":"方案被选中"
            }[input];
        }
    })
    .filter('userStatusTipsFilter', function () {     //业主需求状态进度当前提示文字    
        return function (input) {
            return {
                "0":"需要预约设计师",
                "1":"设计师正在响应中",
                "2":"设计师正在响应中",
                "3":"设计师提交方案中",
                "4":"选择装修方案",
                "5":"生成三方合同",
                "6":"设计师提交方案中",
                "7":"生成三方合同"
            }[input];
        }
    })
    .filter('userRequiremtnesTipsFilter', function () {   //业主需求状态当前提示文字   
        return function (input) {
            return {
                "0":"已预约无响应",
                "1":"已拒绝业主",
                "2":"有响应无方案",
                "3":"已提交方案",
                "4":"方案被拒绝",
                "5":"方案被选中"
            }[input];
        }
    })
    .filter('userRequiremtnesBtnFilter', function () {    //业主需求状态当前提示按钮
        return function (input) {
            return {
                "0":"前往预约量房",
                "1":"前往确认设计师上门量房",
                "2":"查看并选择装修方案",
                "3":"前往生成三方合同"
            }[input];
        }
<<<<<<< HEAD
    })
>>>>>>> d4aa26a3f267cb3169f6a57749440d26a4564c3d
=======
    })
>>>>>>> 10bb1567a9c920511a1dfe40d1671f1315119a32
