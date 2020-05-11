(function() {
	app.controller("VisitorPermission-AddCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("VisitorPermission-AddCtrl");

		$scope.addVisitorPermission = {
			name: ""
		};

	    $scope.fieldsList = [];   //区域列表
	    $scope.overBoundaryAlarmList = [];	//越界报警
	    $scope.stopAlarmList = [];	//滞留报警
	    $scope.errorMessage = "";

	    //报警围栏所有
	    function getAlarmAreaList() {
	        serviceHttp.getFieldNameList(
	            function (successData) {
	                // console.log(successData);
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
	                $scope.$apply();
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
	        if($scope.addVisitorPermission.name == "" || $scope.addVisitorPermission.name.length > 8){
	            $scope.errorMessage = "权限名称不能为空,且长度不能超过8";
	            return;
	        }

	        var privInfo = {
	            name:$scope.addVisitorPermission.name,
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

	        serviceHttp.permissionAdd(
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

	    //后退
	    $scope.navBackPress = function () {
	        window.history.go(-1);
	    };
	}]);
})();