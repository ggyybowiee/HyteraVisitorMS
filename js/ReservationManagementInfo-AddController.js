(function() {
	app.controller("ReservationManagementInfo-AddCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("ReservationManagementInfo-AddCtrl");

		$('#appointmentTime').datetimepicker({language: 'zh-CN'});
		//TODO:获取性别
		function getGender(numStr) {
		    var gender = "";
		    switch(numStr) {
		        case 0:
		            gender = "女";
		            break;
		        case 1:
		            gender = "男";
		            break;
		        case 2:
		            gender = "两性";
		            break;
		    }
		    return gender;
		}
		
		$scope.createReservation = {
			employeeName: "",
			dept: "",
			room: "",
			extension: "",
			employeeMobilePhone: "",
			nums: 1,
			reason: "",
			personType: "",
			appointTime: "",
			stopHour: 1,
			permissionId: "",
			visitorName: "",
			visitorSex: "",
			certificateType: "",
			certificateId: "",
			visitorMobilePhone:""
		};
		$scope.errorMessage = "";
		$scope.reasonList = [{reason:"业务洽谈"},{reason:"来访参观"},{reason:"面试"},{reason:"其他"}];
		$scope.sexType = [{binded: 1,sex:"男"},{binded: 0,sex:"女"},{binded: 2,sex:"两性"}];
		$scope.IDTypeList = [{"type":"二代身份证"},{"type":"驾驶证"},{"type":"护照"},{"type":"其他"}];
		$scope.visitorTypeList = [{"type":"国内客户"},{"type":"国外客户"},{"type":"政府官员"},{"type":"新闻媒体"},{"type":"认证机构"},{"type":"供应商"},{"type":"面试人员"},{"type":"其他"}];

		//访客权限列表
		function getAllPermissionList() {
			serviceHttp.getAllPermissionList(
			    function (successData) {
			    	$scope.permissionList = successData;
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getAllPermissionList();

		//保存
		$scope.savePress = function () {
			$scope.errorMessage = "";
			if ($scope.createReservation.employeeName == "" || $scope.createReservation.employeeName.length > 32) {
				$scope.errorMessage = "被访人员姓名不能为空,且长度不能超过32";
				return;
			}

			if (!isPhoneNo($scope.createReservation.employeeMobilePhone) && $scope.createReservation.employeeMobilePhone != "") {
			    $scope.errorMessage = "被访人员手机号码格式不正确";
			    return;
			}

			if ($scope.createReservation.permissionId == "") {
				$scope.errorMessage = "请选择访客权限";
				return;
			}
			
			var numReg = /^[1-9]\d*$/;
			if (!numReg.test($scope.createReservation.nums)) {
				$scope.errorMessage = "来访人数为大于0的整数";
				return;
			}

			if ($scope.createReservation.reason == "") {
				$scope.errorMessage = "请选择来访事由";
				return;
			}

			if ($scope.createReservation.appointTime == "") {
				$scope.errorMessage = "请输入预约时间";
				return;
			}

			var dateReg = /^\d{4,}-(?:0?\d|1[12])-(?:[012]?\d|3[01]) (?:[01]?\d|2[0-4]):(?:[0-5]?\d|60)$/;
			if (!dateReg.test($scope.createReservation.appointTime)) {
				$scope.errorMessage = "预约时间格式不正确";
				return;
			}

			var now = new Date().getTime();
			var appointTimeStamp = moment($scope.createReservation.appointTime).format('X')*1000;
			if (appointTimeStamp - now < 0) {
				$scope.errorMessage = "预约时间不能小于当前时间";
				return;
			}


			if ($scope.createReservation.stopHour <= 0 || $scope.createReservation.stopHour > 8) {
				$scope.errorMessage = "停留时间必须为大于0的数,且不能超过8小时";
				return;
			}

			if ($scope.createReservation.visitorName == "" || $scope.createReservation.visitorName.length > 32) {
				$scope.errorMessage = "来访人员姓名不能为空,且长度不能超过32";
				return;
			}

			if (!isPhoneNo($scope.createReservation.visitorMobilePhone) && $scope.createReservation.visitorMobilePhone != "") {
			    $scope.errorMessage = "来访人员手机号码格式不正确";
			    return;
			}

			var appointmentObj = {
			    employeeName:$scope.createReservation.employeeName,
			    dept:$scope.createReservation.dept,
			    room:$scope.createReservation.room,
			    extension:$scope.createReservation.extension,
			    employeeMobilePhone:$scope.createReservation.employeeMobilePhone,
			    nums: Number($scope.createReservation.nums),
			    reason: $scope.createReservation.reason,
			    personType: $scope.createReservation.personType,
			    appointTime: $scope.createReservation.appointTime,
			    stopHour: $scope.createReservation.stopHour,
			    privilegeId: $scope.createReservation.permissionId,
			    certificateId: $scope.createReservation.certificateId,
			    certificateType: $scope.createReservation.certificateType,
			    visitorName: $scope.createReservation.visitorName,
			    visitorGender: Number($scope.createReservation.visitorSex),
			    visitorMobilePhone: $scope.createReservation.visitorMobilePhone
			};

			console.log(appointmentObj);

			serviceHttp.appointmentAdd(
			    appointmentObj,
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
		//取消
		$scope.canclePress = function () {
			window.history.go(-1);
		};

		//验证手机号格式
		function isPhoneNo(phone) {
			var pattern = /^1[34578]\d{9}$/; 
			return pattern.test(phone); 
		}
	}]);
})();