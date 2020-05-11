(function() {
	app.controller("RailConfigCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("RailConfigCtrl");
		$scope.$emit('menuSelectParam', "railConfig");

		$scope.changeData = function (item) {
			console.log(item);
		};
	}]);
})();