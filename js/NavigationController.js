angular.module('app.NavigationController', [])

    .controller("NavigationCtrl", ["$scope", "$state", "$timeout", "serverInfo", "$http", "serviceHttp", function($scope, $state, $timeout, serverInfo, $http, serviceHttp) {
        console.log("NavigationCtrl");

        UrlParm = function() { // url参数
            var data, index;
            (function init() {
                data = [];
                index = {};
                var u = window.location.search.substr(1);
                if (u != '') {
                    var parms = decodeURIComponent(u).split('&');
                    for (var i = 0, len = parms.length; i < len; i++) {
                        if (parms[i] != '') {
                            var p = parms[i].split("=");
                            if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
                                data.push(['']);
                                index[p[0]] = data.length - 1;
                            } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
                                data[0] = [p[1]];
                            } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
                                data.push([p[1]]);
                                index[p[0]] = data.length - 1;
                            } else {// c=aaa
                                data[index[p[0]]].push(p[1]);
                            }
                        }
                    }
                }
            })();
            return {
                // 获得参数,类似request.getParameter()
                parm : function(o) { // o: 参数名或者参数次序
                    try {
                        return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);
                    } catch (e) {
                    }
                },
                //获得参数组, 类似request.getParameterValues()
                parmValues : function(o) { //  o: 参数名或者参数次序
                    try {
                        return (typeof(o) == 'number' ? data[o] : data[index[o]]);
                    } catch (e) {}
                },
                //是否含有parmName参数
                hasParm : function(parmName) {
                    return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;
                },
                // 获得参数Map ,类似request.getParameterMap()
                parmMap : function() {
                    var map = {};
                    try {
                        for (var p in index) {  map[p] = data[index[p]];  }
                    } catch (e) {}
                    return map;
                }
            };
        }();

        $scope.menu = [];
        function getUserInfo() {
            serviceHttp.getUserInfo(
                function (successData) {
                    var url = "" + location.href;
                    var index = url.lastIndexOf("\/");
                    var str = url.substring(index+1,url.length);    //从右往左，一级路由

                    var bbb = url.substr(url.lastIndexOf('/', url.lastIndexOf('/') - 1) + 1);
                    var ccc = bbb.substr(0, bbb.lastIndexOf('/'));      //从右往左，二级路由
                    console.log(ccc);

                    // console.log(successData);
                    $scope.userName = successData.name;
                    $scope.buildName = successData.buildingName;
                    serverInfo.buildName = successData.buildingName;
                    serverInfo.buildId = successData.buildId;
                    if (successData.type == 0) {
                        $scope.isAdmin = true;
                        $scope.menu = serverInfo.adminMenu;
                        if (str.indexOf("index.html") > -1) {
                            $state.go("permissionConfig.vp");
                        }
                    }
                    else {
                        $scope.isAdmin = false;
                        if (successData.services.length > 0) {
                            for(var i in successData.services){
                                for(var ii = 0; ii < serverInfo.naviMenu.length; ii++){
                                    var obj = serverInfo.naviMenu[ii];
                                    if (obj.service == successData.services[i]) {
                                        $scope.menu.push(obj);
                                    }
                                }
                            }
                        }
                        if (str.indexOf("index.html") > -1) {
                            $state.go("reservationManagement.rmi");
                        }
                    }

                },function (errorData) {
                    showErrorDialog(errorData);
                }
            );
        }
        getUserInfo();


        $scope.buildingList = [];

        //获取建筑列表
        function getBuildingList() {
            $scope.buildingList = [];
            serviceHttp.getBuildingList(
                function (successData) {
                    $scope.buildingList = successData;
                },
                function (errorData) {
                    console.log(errorData);
                }
            );
        }
        getBuildingList();

        //获取建筑信息
        function getBuildingInfo() {
            serverInfo.floorNos = [];
            serviceHttp.getBuildingInfo(
                function (successData) {
                    console.log(successData);
                    serverInfo.fmapID = successData.fengMapId;
                    serverInfo.webName = successData.webName;
                    serverInfo.webKey = successData.webKey;
                    if (successData.themeName != null) {
                        serverInfo.fmapTheme = successData.themeName;
                    }
                    for(var i = successData.floorNos.length - 1; i >= 0; i--){
                        serverInfo.floorNos.push(successData.floorNos[i]);
                    }
                },
                function (errorData) {
                    swal("警告", errorData, "error");
                }
            );
        }
        getBuildingInfo();

        //切换建筑
        $scope.toggleBuilding = function (item) {
            // console.log("toggleBuilding：" + item.buildName);
            if (serverInfo.buildId != item.buildId) {
                $.ajax({
                    url : "/choose/build",
                    async : false,
                    type : 'GET',
                    data:{
                        buildId:item.buildId
                    },
                    success : function(data,status,headers){
                        location.reload();
                    },
                    error : function(err) {
                       
                    }
                });
            }
        };

        // 主菜单点击
        $scope.leftSideMenuClick = function (m) {
            // console.log("主菜单点击");
            // console.log(m);
            for(var i = 0; i < $scope.menu.length ; i ++){
                var obj  = $scope.menu[i];
                if(m.name == obj.name){
                    if (obj.selected == true) {
                        return;
                    }
                    else{
                        obj.selected = true;
                        if ($scope.isAdmin) {
                            goAdminPage(obj.id);
                        }
                        else{
                            goPage(obj.id);
                        }
                    }
                }
                else{
                    obj.selected = false;
                }
            }
        };

        //鼠标移入
        $scope.mouseoverImg = function (m) {
            m.isHover = true;
        };
        //鼠标移出
        $scope.mouseoutImg = function (m) {
            m.isHover = false;
        };

        //admin页面跳转
        function  goAdminPage (page){

            switch (page){
                case 0:
                    $state.go('permissionConfig.vp');
                    $('.collapse').collapse('hide');
                    break;
                case 1:
                    $state.go('railConfig.rc');
                    $('.collapse').collapse('hide');
                    break;
                case 2:
                    $state.go('visitorConfig.vcc');
                    $('.collapse').collapse('hide');
                    break;
                case 3:
                    $state.go('statisticQuery');
                    $('.collapse').collapse('hide');
                    break;
                case 4:
                    $state.go('sysLog');
                    $('.collapse').collapse('hide');
                    break;
                case 5:
                    $state.go('setConfig');
                    $('.collapse').collapse('hide');
                    break;
            }
        }

        // 页面跳转
        function  goPage (page){

            switch (page){
                case 0:
                    $state.go('reservationManagement.rmi');
                    $('.collapse').collapse('hide');
                    break;
                case 1:
                    $state.go('visitorRegistration');
                    $('.collapse').collapse('hide');
                    break;
                case 2:
                    $state.go('locationMonitoring');
                    $('.collapse').collapse('hide');
                    break;
                case 3:
                    $state.go('alarmView');
                    $('.collapse').collapse('hide');
                    break;
            }
        }

        //退出登录
        $scope.logoutPress = function () {
            console.log('logout');  
            serviceHttp.logoutSys(
                function (successData) {
                    console.log(successData);
                    if (successData) {
                        window.location.href = serverInfo.loginServerIP + "/login.html?type=logout";
                    }
                },function (errorData) {
                    console.log(errorData);     
                }
            );
        };


        // 监听菜单栏
        $scope.$on('menuSelectParam', function(event, param) {
            for(var ii=0;ii<$scope.menu.length;ii++){
                var obj = $scope.menu[ii];
                if (param == obj.param) {
                    obj.selected = true;
                }
                else{
                    obj.selected = false;
                }
            }
        });
    }]);