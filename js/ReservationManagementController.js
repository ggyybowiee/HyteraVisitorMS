(function() {
	app.controller("ReservationManagementCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("ReservationManagementCtrl");
		$scope.$emit('menuSelectParam', "reservationManagement");
		
		//获取自定义指令的id,用于分页
		$scope.changeData = function (id) {
			// console.log(id);
		};

		//刷新页面时
		var url = "" + location.href;
		var index = url.lastIndexOf("\/");
		var str = url.substring(index+1,url.length);
		console.log(str);
		if (str.indexOf("blm") > -1) {
			$state.go("reservationManagement.rmi");
		}
		if (str.indexOf("rmi") > -1) {
			$state.go("reservationManagement.rmi");
		}
	}]);
})();