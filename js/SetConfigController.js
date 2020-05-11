(function() {
	app.controller("SetConfigCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("SetConfigCtrl");
		$scope.$emit('menuSelectParam', "setConfig");

		$scope.setConfig = {
			aheadTime: "",
			lateTime: "",
			alarmNum: "",
			battery: "0",
			batteryList: [{type: "0", text: "0-25%"},{type: "1", text: "25-50%"},{type: "2", text: "50-75%"}]
		};
		$scope.errorMessage = "";

		function getSysConfig() {
			serviceHttp.getSysConfig(
			    function (successData) {
			        $scope.setConfig.aheadTime = successData.earlyTime;
			        $scope.setConfig.lateTime = successData.laterTime;
			        $scope.setConfig.alarmNum = successData.blackAlarmTimes;
			        $scope.setConfig.battery = successData.battery + "";
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getSysConfig();

		// 取消
		$scope.canclePress = function () {
		    window.history.go(-1);
		};

		//保存
		$scope.savePress = function () {
			// console.log("savePress");
			$scope.errorMessage = "";
			
			if ($scope.setConfig.aheadTime < 0 || $scope.setConfig.lateTime < 0) {
				$scope.errorMessage = "提前时间和迟到时间不能为负数";
				return;
			}
			if ($scope.setConfig.alarmNum <= 0) {
				$scope.errorMessage = "报警次数必须为大于0的数";
				return;
			}
            serviceHttp.sysConfig(
                $scope.setConfig.aheadTime,
                $scope.setConfig.lateTime,
                $scope.setConfig.alarmNum,
                $scope.setConfig.battery,
                function (successData) {
                    swal("操作成功", "", "success");
                },
                function (errorData) {
                    swal("操作失败", errorData, "error");
                }
            );
		};
	}]);
})();