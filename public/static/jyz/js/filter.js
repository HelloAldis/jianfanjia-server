(function(){
    'use strict';
    angular.module('filters', [])
        .filter('sexFilter', function () {   //性别筛选
            return function (input) {
                return {
                    "0":"男",
                    "1":"女",
                    "2":"不限"
                }[input];
            };
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
            };
        })
        .filter('decTypeFilter', function () {   //装修类别
            return function (input) {
                return {
                    "0":"家装",
                    "1":"商装",
                    "2":"软装"
                }[input];
            };
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
            };
        })
        .filter('designFeeRangeFilter', function () {     //设计费报价
            return function (input) {
                return {
                    "0":"50-100",
                    "1":"100-200",
                    "2":"200-300",
                    "3":"300以上"
                }[input];
            };
        })
        .filter('designTypeFilter', function () {     //习惯沟通方式
            return function (input) {
                return {
                    "0":"不限",
                    "1":"表达型",
                    "2":"聆听型"
                }[input];
            };
        })
        .filter('workTypeFilter', function () {     //习惯沟通方式
            return function (input) {
                return {
                    "0":"设计＋施工(半包)",
                    "1":"设计＋施工(全包)",
                    "2":"纯设计"
                }[input];
            };
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
            };
        })
        .filter('userFilter', function () {   //用户类型
            return function (input) {
                return {
                    "0":"管理员",
                    "1":"业主",
                    "2":"设计师"
                }[input];
            };
        })
        .filter('platformFilter', function () {   //手机类型
            return function (input) {
                return {
                    "0":"Android",
                    "1":"iOS"
                }[input];
            };
        })
        .filter('processFilter', function () {
            return function (input) {
                 return {
                    "0" : "量房",
                    "1" : "开工",
                    "2" : "拆改",
                    "3" : "水电",
                    "4" : "泥木",
                    "5" : "油漆",
                    "6" : "安装",
                    "7" : "竣工"
                }[input];
            };
        })
        .filter('authFilter', function () {
            return function (input) {
                return {
                    "0":"未通过",
                    "1":"审核通过",
                    "2":"审核不通过",
                    "3":"违规下线"
                }[input];
            };
        })
        .filter('requirementFilter', function () {
            return function (input) {
                return {
                    "0":"未预约",
                    "1":"已预约无人响应",
                    "2":"有响应无人量房",
                    "6":"已量房无方案",
                    "3":"提交方案但无选定方案",
                    "4":"选定方案无配置合同",
                    "7":"已配置合同",
                    "5":"配置工地"
                }[input];
            };
        })
        .filter('planFilter', function () {
            return function (input) {
                return {
                    "0":"已预约无响应",
                    "1":"已拒绝业主",
                    "7":"无响应过期",
                    "2":"有响应未量房",
                    "6":"已量房无方案",
                    "8":"无方案过期",
                    "3":"已提交方案",
                    "4":"方案被拒绝",
                    "5":"方案被选中"
                }[input];
            };
        })
        .filter('displayStateFilter', function () {
            return function (input) {
                return {
                    "0":"页面隐藏",
                    "1":"页面显示"
                }[input];
            };
        })
        .filter('articletypeFilter', function () {
            return function (input) {
                return {
                    "0":"大百科",
                    "1":"小贴士"
                }[input];
            };
        });
})();