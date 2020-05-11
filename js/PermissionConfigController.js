(function() {
	app.controller("PermissionConfigCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("PermissionConfigCtrl");
		$scope.$emit('menuSelectParam', "permissionConfig");

		$scope.changeData = function (item) {
			console.log(item);
		};

		//刷新页面时
		var url = "" + location.href;
		var index = url.lastIndexOf("\/");
		var str = url.substring(index+1,url.length);
		console.log(str);
		if (str.indexOf("ac") > -1) {
			$state.go("permissionConfig.vp");
		}
		if (str.indexOf("vp") > -1) {
			$state.go("permissionConfig.vp");
		}

		/*if (str.indexOf("vp") > -1) {
			$state.go("permissionConfig.ac");
		}*/
	}]);
})();