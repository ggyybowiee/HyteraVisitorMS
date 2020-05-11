(function() {
	app.controller("VisitorPermission-EditCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", "$stateParams", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams) {
		console.log("VisitorPermission-EditCtrl");
        var vpEditItem = $stateParams.vpEditItem;
        console.log(vpEditItem);

        $scope.fieldsList = [];   //区域列表
        $scope.overBoundaryAlarmList = [];  //越界报警
        $scope.stopAlarmList = [];  //滞留报警
        $scope.errorMessage = "";
        $scope.editVisitorPermission = {
            name: ""
        };

        //报警围栏所有
        function getAlarmAreaList() {
            serviceHttp.getFieldNameList(
                function (successData) {
                    console.log(successData);
                    $scope.fieldsList = successData;
                    for(var i = 0; i < $scope.fieldsList.length; i++){
                        var field = $scope.fieldsList[i];
                        field.inAlarm = false;
                        field.outAlarm = false;
                        field.choose = false;
                        if (field.overBoundaryAlarm == 1) {
                            $scope.overBoundaryAlarmList.push(field);
                        }
                        if (field.stopAlarm == 1) {
                            $scope.stopAlarmList.push(field);
                        }
                    }

                    serviceHttp.getPermissionInfo(
                        vpEditItem.id,
                        function (successData) {
                            console.log(successData);
                            $scope.editVisitorPermission.name = successData.name;
                            if (successData != null) {

                                if (successData.overBoundaryRails != null && successData.overBoundaryRails.length > 0) {
                                    for(var j = 0; j < successData.overBoundaryRails.length; j++){
                                        var obj = successData.overBoundaryRails[j];
                                        for(var i = 0; i < $scope.fieldsList.length; i++){
                                            var field = $scope.fieldsList[i];
                                            if(obj.railId == field.railId){
                                                field.inAlarm = obj.inAlarm;
                                                field.outAlarm = obj.outAlarm;
                                            }
                                        }
                                    }
                                }

                                if (successData.stopAlarmRails != null && successData.stopAlarmRails.length > 0) {
                                    for(var m = 0; m < successData.stopAlarmRails.length; m++){
                                        var obj2 = successData.stopAlarmRails[m];
                                        for(var n = 0; n < $scope.fieldsList.length; n++){
                                            var field2 = $scope.fieldsList[n];
                                            if(obj2 == field2.railId){
                                                field2.choose = true;
                                            }
                                        }
                                    }
                                }
                            }

                            $scope.$apply();
                        },
                        function (errorData) {
                            
                        }
                    );
                },
                function (errorData) {
                    console.log(errorData);
                }
            );
        }
        getAlarmAreaList();

        //滞留是否选中
        $scope.chooseChanged = function (item) {
            item.choose = !item.choose;
        };

        //是否进入报警
        $scope.inAlarmChanged = function (item) {
            item.inAlarm = !item.inAlarm;
        };

        //是否离开报警
        $scope.outAlarmChanged = function (item) {
            item.outAlarm = !item.outAlarm;
        };

        //查看围栏位置
        $scope.checkRailPosition = function (item) {
            $('#railPositionModal').modal('show');
            initMap(item,serverInfo);
        };

        // 保存
        $scope.savePress = function () {
            $scope.errorMessage = "";
            if($scope.editVisitorPermission.name == ""){
                $scope.errorMessage = "请输入权限名称";
                return;
            }

            var privInfo = {
                id: vpEditItem.id,
                name:$scope.editVisitorPermission.name,
                overBoundaryRails:[],
                stopAlarmRails:[]
            };

            for(var i in $scope.overBoundaryAlarmList){
                var obj = $scope.overBoundaryAlarmList[i];
                if (obj.inAlarm == true || obj.outAlarm == true) {
                    privInfo.overBoundaryRails.push({
                        'railId':obj.railId,
                        'inAlarm':obj.inAlarm,
                        'outAlarm':obj.outAlarm
                    });
                }
            }

            for(var j in $scope.stopAlarmList){
                var obj2 = $scope.stopAlarmList[j];
                if (obj2.choose == true) {
                    privInfo.stopAlarmRails.push(obj2.railId);
                }
            }
            console.log(privInfo);

            serviceHttp.permissionEdit(
                privInfo,
                function (successData) {
                    swal("操作成功", "", "success");
                    $timeout(function () {
                        $scope.canclePress();
                    },800);
                },
                function (errorData) {
                    swal("操作失败", errorData, "error");
                }
            );
        };

        // 取消
        $scope.canclePress = function () {
            window.history.go(-1);
        };

        //回退
        $scope.navBackPress = function () {
            window.history.go(-1);
        };
	}]);
})();