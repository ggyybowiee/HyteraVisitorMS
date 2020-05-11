(function() {
	app.controller("VisitorConfigCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("VisitorConfigCtrl");
		$scope.$emit('menuSelectParam', "visitorConfig");

		$scope.changeData = function (id) {
			console.log(id);
		};
	}]);
})();