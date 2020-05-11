(function() {
	app.controller("AccountConfig-AddCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("AccountConfig-AddCtrl");
		
		$scope.accountObj = {
			username: "",
			password: "",
			list: [{index: 0, selected: false, content: "预约管理功能"},{index: 1, selected: false, content: "访客登记功能"},{index: 2, selected: false, content: "定位监控、报警查看功能"}]
		};

		$scope.buildingList = [];

		//获取建筑列表
		function getBuildingList() {
			$scope.buildingList = [];
			serviceHttp.getBuildingList(
			    function (successData) {
		            $scope.buildingList = successData;
		            for(var j = 0; j < $scope.buildingList.length; j++){
		            	var obj = $scope.buildingList[j];
		            	obj.selected = false;
		            }
		            $scope.$apply();
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getBuildingList();
		// checkbox 是否选中
		$scope.cameraChanged = function (item) {
		    item.selected = !item.selected;
		};

		// 保存
		$scope.savePress = function () {
		    $scope.errorMessage = "";

		    var pattern_user = /^[a-zA-Z0-9_@]{4,18}$/;
		    if (!pattern_user.test($scope.accountObj.username) || $scope.accountObj.username == '') {
		        $scope.errorMessage = "用户名不能为空,且只能输入数字、英文、下划线、@,长度为4-18";
		        return;
		    }
		    var pattern_pwd = /^[a-zA-Z0-9][a-zA-Z0-9.!@#$%^&*_]{3,17}$/;
		    if (!pattern_pwd.test($scope.accountObj.password) || $scope.accountObj.password == "") {
		        $scope.errorMessage = "密码不能为空,且第一个数必须为字母或数字,长度为4-18";
		        return;
		    }

		    var servicesList = [];
		    for (var i = 0; i < $scope.accountObj.list.length; i++) {
		        var obj = $scope.accountObj.list[i];

		        if (obj.selected) {
		            servicesList.push(obj.index);
		        }
		    }

		    if (servicesList.length == 0) {
		    	$scope.errorMessage = "请选择权限";
		    	return;
		    }


		    var tempList = [];
		    for (var ii = 0; ii < $scope.buildingList.length; ii++) {
		        var obj2 = $scope.buildingList[ii];

		        if (obj2.selected) {
		        	var temp = {};
		        	temp.buildId = obj2.buildId;
		        	temp.buildName = obj2.buildName;
		            tempList.push(temp);
		        }
		    }

		    if (tempList.length == 0) {
		    	$scope.errorMessage = "请选择建筑";
		    	return;
		    }

		   	var packObj = {
		   		name: $scope.accountObj.username,
		   		password: $scope.accountObj.password,
		   		services: servicesList,
		   		buildings: tempList
		   	};


		    serviceHttp.accountAdd(
		        packObj,
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