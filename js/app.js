var app = angular.module('app', ["ui.router", "ngAnimate", "oc.lazyLoad","app.NavigationController"]);
app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
    function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
    }]);
app.config(function ($httpProvider) {

    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };

    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded; charser=UTF-8'
    };

});
app.constant('Modules_Config', [
    {
        name: 'treeControl',
        serie: true,
        files: []
    }
]);
app.config(["$ocLazyLoadProvider","Modules_Config",routeFn]);
function routeFn($ocLazyLoadProvider,Modules_Config){
    $ocLazyLoadProvider.config({
        debug:false,
        events:false,
        modules:Modules_Config
    });
}

app.factory("serverInfo",function(){
    return{
        buildId:"",
        buildName:"",
        webName: "",
        webKey: "",
        floorNos: null,
        fmapID:"",  //sdemo
        fmapTheme:"4003",   //4006,4003
        isInsertCameraDevice: false,
        cdSrc: "",
        loginServerIP: "http://" + window.location.host,
        naviMenu:[
            {name:"预约管理",id:0,linkTo:'/reservationManagement',param:'reservationManagement',selected:false,icon:"img/order_white.png",selectedIcon:"img/order_black.png",isHover:false,service:0},
            {name:"访客登记",id:1,linkTo:'/visitorRegistration',param:'visitorRegistration',selected:false,icon:"img/check_white.png",selectedIcon:"img/check_black.png",isHover:false,service:1},
            {name:"定位监控",id:2,linkTo:'/locationMonitoring',param:'locationMonitoring',selected:false,icon:"img/location_white.png",selectedIcon:"img/location_black.png",isHover:false,service:2},
            {name:"报警查看",id:3,linkTo:'/alarmView',param:'alarmView',selected:false,icon:"img/alarm_white.png",selectedIcon:"img/alarm_black.png",isHover:false,service:2}
        ],
        adminMenu: [
            {name:"权限设置",id:0,linkTo:'/permissionConfig',param:'permissionConfig',selected:false,icon:"img/permission_white.png",selectedIcon:"img/permission_black.png",isHover:false},
            {name:"区域设置",id:1,linkTo:'/railConfig',param:'railConfig',selected:false,icon:"img/rail_white.png",selectedIcon:"img/rail_black.png",isHover:false},
            {name:"访客牌",id:2,linkTo:'/visitorConfig',param:'visitorConfig',selected:false,icon:"img/visitortag_white.png",selectedIcon:"img/visitortag_black.png",isHover:false},
            {name:"统计查询",id:3,linkTo:'/statisticQuery',param:'statisticQuery',selected:false,icon:"img/statistic_white.png",selectedIcon:"img/statistic_black.png",isHover:false},
            {name:"日志查询",id:4,linkTo:'/sysLog',param:'sysLog',selected:false,icon:"img/syslog_white.png",selectedIcon:"img/syslog_black.png",isHover:false},
            {name:"系统设置",id:5,linkTo:'/setConfig',param:'setConfig',selected:false,icon:"img/set_white.png",selectedIcon:"img/set_black.png",isHover:false}
        ],
        id:0 // 进入菜单导航时，默认naviMenu第一个被选中
    };
});

//定义tab指令
app.directive('tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                changeId: '&changeId'
            },
            controller: ["$scope", "$state", "$timeout", function($scope,$state,$timeout) {
                var panes = $scope.panes = [];
                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                    $scope.change();
                    if (pane.content == "账户设置") {
                        $state.go("permissionConfig.ac");
                    }
                    if (pane.content == "访客权限管理") {
                        $state.go("permissionConfig.vp");
                    }
                    if (pane.content == "预约通知") {
                        $state.go("reservationManagement.rmi");
                    }
                    if (pane.content == "黑名单管理") {
                        $state.go("reservationManagement.blm");
                    }
                    if (pane.content == "实时监控") {
                        $state.go("locationMonitoring.rm");
                    }
                    if (pane.content == "历史轨迹回放") {
                        $state.go("locationMonitoring.htr");
                    }
                };

                this.addPane = function(pane) {
                    // if (panes.length == 0) $scope.select(pane);
                    panes.push(pane);
                };
            }],
            link: function(scope, element, attrs) {
                scope.change = function () {
                    var oDivs = element[0].getElementsByClassName("paginatorDiv");
                    angular.forEach(oDivs, function(oDiv) {
                        var uls = oDiv.getElementsByTagName("ul");
                        angular.forEach(uls, function(ul) {
                            var temp = {};
                            temp.panes = scope.panes;
                            temp.id = ul.id;
                            scope.changeId({changeId:temp});
                        });
                    });
                };
                scope.change();
            },
            template: '<div class="tabbable">' +
                '<ul class="nav nav-tabs">' +
                '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                '<a href="" ng-click="select(pane)">{{pane.content}}</a>' +
                '</li>' +
                '</ul>' +
                '<div class="tab-content" ng-transclude></div>' +
                '</div>',
            replace: true
        };
    })
    .directive('pane', function() {
        return {
            require: '^tabs',
            restrict: 'AE',
            transclude: true,
            scope: {
                content: '@',
                active: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                // console.log(scope.active);
                if(scope.active == scope.content){
                    scope.selected = true;
                }
                else if (scope.active == "false") {
                    scope.selected = false;
                }
                else if(scope.active == "true"){
                    scope.selected = true;
                }else{
                    scope.selected = false;
                }
                tabsCtrl.addPane(scope);
                // console.log(scope);
                $('#reservationTime').datetimepicker({language: 'zh-CN'});
                $('#arriveTime').datetimepicker({language: 'zh-CN'});
                $('#startTime').datetimepicker({language: 'zh-CN'});
                // $('#alarmEventStartTime').datetimepicker({language: 'zh-CN'});
                // $('#visitorEventStartTime').datetimepicker({language: 'zh-CN'});
                $('#endTime').datetimepicker({language: 'zh-CN'});
                // $('#alarmEventEndTime').datetimepicker({language: 'zh-CN'});
                // $('#visitorEventEndTime').datetimepicker({language: 'zh-CN'});
            },
            template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
                '</div>',
            replace: true
        };
    });
app.config(["$stateProvider","$urlRouterProvider",routeFnn]);
function routeFnn($stateProvider,$urlRouterProvider){
    // $urlRouterProvider.otherwise("/reservationManagement");
    $stateProvider
        //预约管理
        .state("reservationManagement",{
            url:"/reservationManagement",
            templateUrl:"./templates/ReservationManagement.html",
            controller:"ReservationManagementCtrl",
            controllerAs:"ReservationManagement",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/ReservationManagementController.js");
                }]
            }
        })
        //预约管理-预约通知
        .state("reservationManagement.rmi",{
            url:"/rmi",
            views: {
                'reservationView': {
                    templateUrl: './templates/ReservationManagementInfo.html',
                    controller: 'ReservationManagementInfoCtrl',
                    controllerAs:"ReservationManagementInfo",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/ReservationManagementInfoController.js");
                        }]
                    }
                }
            }
        })
        //预约管理-预约通知-添加
        .state("reservationManagement.rmi-add",{
            url:"/rmi-add",
            views: {
                'reservationView': {
                    templateUrl: './templates/ReservationManagementInfo-Add.html',
                    controller: 'ReservationManagementInfo-AddCtrl',
                    controllerAs:"ReservationManagementInfo-Add",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/ReservationManagementInfo-AddController.js");
                        }]
                    }
                }
            }
        })
        //预约管理-黑名单管理
        .state("reservationManagement.blm",{
            url:"/blm",
            views: {
                'blackListView': {
                    templateUrl: './templates/BlackListManagement.html',
                    controller: 'BlackListManagementCtrl',
                    controllerAs:"BlackListManagement",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/BlackListManagementController.js");
                        }]
                    }
                }
            }
        })
        //访客登记
        .state("visitorRegistration",{
            url:"/visitorRegistration",
            templateUrl:"./templates/VisitorRegistration.html",
            controller:"VisitorRegistrationCtrl",
            controllerAs:"VisitorRegistration",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/VisitorRegistrationController.js");
                }]
            },
            params: {vrItem: null}
        })
        //定位监控
        .state("locationMonitoring",{
            url:"/locationMonitoring",
            templateUrl:"./templates/LocationMonitoring.html",
            controller:"LocationMonitoringCtrl",
            controllerAs:"LocationMonitoring",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/LocationMonitoringController.js");
                }]
            },
            params: {monitor: null,isHistory: null,time: null,locationMonitorStr: "",trackObj: null}
        })
        //定位监控-实时监控
        .state("locationMonitoring.rm",{
            url:"/rm",
            views: {
                'realMonitorView': {
                    templateUrl: './templates/RealMonitor.html',
                    controller: 'RealMonitorCtrl',
                    controllerAs:"RealMonitor",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/RealMonitorController.js");
                        }]
                    }
                }
            },
            params: {rmItem: null}
        })
        //定位监控-历史轨迹回放
        .state("locationMonitoring.htr",{
            url:"/htr",
            views: {
                'historyView': {
                    templateUrl: './templates/HistoryTrackReplay.html',
                    controller: 'HistoryTrackReplayCtrl',
                    controllerAs:"HistoryTrackReplay",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/HistoryTrackReplayController.js");
                        }]
                    }
                }
            },
            params: {htrItem: null}
        })
        //报警查看
        .state("alarmView",{
            url:"/alarmView",
            templateUrl:"./templates/AlarmView.html",
            controller:"AlarmViewCtrl",
            controllerAs:"AlarmView",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/AlarmViewController.js");
                }]
            }
        })
        //权限设置
        .state("permissionConfig",{
            url:"/permissionConfig",
            templateUrl:"./templates/PermissionConfig.html",
            controller:"PermissionConfigCtrl",
            controllerAs:"PermissionConfig",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/PermissionConfigController.js");
                }]
            }
        })
        //权限设置-访客权限管理
        .state("permissionConfig.vp",{
            url:"/vp",
            views: {
                'permissionBody': {
                    templateUrl: './templates/VisitorPermission.html',
                    controller: 'VisitorPermissionCtrl',
                    controllerAs:"VisitorPermission",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/VisitorPermissionController.js");
                        }]
                    }
                }
            }
        })
        //权限设置-访客权限管理-添加
        .state("permissionConfig.vp-add",{
            url:"/vp-add",
            views: {
                'permissionBody': {
                    templateUrl: './templates/VisitorPermission-Add.html',
                    controller: 'VisitorPermission-AddCtrl',
                    controllerAs:"VisitorPermission-Add",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/VisitorPermission-AddController.js");
                        }]
                    }
                }
            }
        })
        //权限设置-访客权限管理-编辑
        .state("permissionConfig.vp-edit",{
            url:"/vp-edit",
            views: {
                'permissionBody': {
                    templateUrl: './templates/VisitorPermission-Edit.html',
                    controller: 'VisitorPermission-EditCtrl',
                    controllerAs:"VisitorPermission-Edit",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/VisitorPermission-EditController.js");
                        }]
                    }
                }
            },
            params: {vpEditItem: null}
        })
        //权限设置-账户设置
        .state("permissionConfig.ac",{
            url:"/ac",
            views: {
                'permissionBody2': {
                    templateUrl: './templates/AccountConfig.html',
                    controller: 'AccountConfigCtrl',
                    controllerAs:"AccountConfig",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/AccountConfigController.js");
                        }]
                    }
                }
            }
        })
        //权限设置-账户设置-添加
        .state("permissionConfig.ac-add",{
            url:"/ac-add",
            views: {
                'permissionBody2': {
                    templateUrl: './templates/AccountConfig-Add.html',
                    controller: 'AccountConfig-AddCtrl',
                    controllerAs:"AccountConfig-Add",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/AccountConfig-AddController.js");
                        }]
                    }
                }
            }
        })
        //权限设置-账户设置-编辑
        .state("permissionConfig.ac-edit",{
            url:"/ac-edit",
            views: {
                'permissionBody2': {
                    templateUrl: './templates/AccountConfig-Edit.html',
                    controller: 'AccountConfig-EditCtrl',
                    controllerAs:"AccountConfig-Edit",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/AccountConfig-EditController.js");
                        }]
                    }
                }
            },
            params: {acEditItem: null}
        })
        //访客牌设置
        .state("visitorConfig",{
            url:"/visitorConfig",
            templateUrl:"./templates/VisitorConfig.html",
            controller:"VisitorConfigCtrl",
            controllerAs:"VisitorConfig",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/VisitorConfigController.js");
                }]
            },
            params: {setItem: null}
        })
        //访客牌设置
        .state("visitorConfig.vcc",{
            url:"/vcc",
            views: {
                'visitorCard': {
                    templateUrl: './templates/VisitorConfigCard.html',
                    controller: 'VisitorConfigCardCtrl',
                    controllerAs:"VisitorConfigCard",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/VisitorConfigCardController.js");
                        }]
                    }
                }
            }
        })
        //访客牌设置-添加
        .state("visitorConfig.vcc-add",{
            url:"/vcc-add",
            views: {
                'visitorCard': {
                    templateUrl: './templates/VisitorConfigCard-Add.html',
                    controller: 'VisitorConfigCard-AddCtrl',
                    controllerAs:"VisitorConfigCard-Add",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/VisitorConfigCard-AddController.js");
                        }]
                    }
                }
            }
        })
        //围栏设置
        .state("railConfig",{
            url:"/railConfig",
            templateUrl:"./templates/RailConfig.html",
            controller:"RailConfigCtrl",
            controllerAs:"RailConfig",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/RailConfigController.js");
                }]
            }
        })
        //围栏设置
        .state("railConfig.rc",{
            url:"/rc",
            views: {
                'railConfig': {
                    templateUrl: './templates/RailConfig-Main.html',
                    controller: 'RailConfigController-MainCtrl',
                    controllerAs:"RailConfigController-Main",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/RailConfigController-MainController.js");
                        }]
                    }
                }
            }
        })
        //围栏设置-添加
        .state("railConfig.rc-add",{
            url:"/rc-add",
            views: {
                'railConfig': {
                    templateUrl: './templates/RailConfigController-Add.html',
                    controller: 'RailConfigController-AddCtrl',
                    controllerAs:"RailConfigController-Add",
                    resolve:{
                        deps:["$ocLazyLoad",function($ocLazyLoad){
                            return $ocLazyLoad.load("./js/RailConfigController-AddController.js");
                        }]
                    }
                }
            },
            params: {railConfigItem: null}
        })
        //统计查询
        .state("statisticQuery",{
            url:"/statisticQuery",
            templateUrl:"./templates/StatisticQuery.html",
            controller:"StatisticQueryCtrl",
            controllerAs:"StatisticQuery",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/StatisticQueryController.js");
                }]
            },
            params: {setItem: null}
        })
        //系统设置
        .state("setConfig",{
            url:"/setConfig",
            templateUrl:"./templates/SetConfig.html",
            controller:"SetConfigCtrl",
            controllerAs:"SetConfig",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/SetConfigController.js");
                }]
            },
            params: {setItem: null}
        })
        //系统日志
        .state("sysLog",{
            url:"/sysLog",
            templateUrl:"./templates/SysLog.html",
            controller:"SysLogCtrl",
            controllerAs:"SysLog",
            resolve:{
                deps:["$ocLazyLoad",function($ocLazyLoad){
                    return $ocLazyLoad.load("./js/SysLogController.js");
                }]
            },
            params: {setItem: null}
        });
}