(function() {
	app.controller("SysLogCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("SysLogCtrl");
		$scope.$emit('menuSelectParam', "sysLog");

		$scope.changeData = function (id) {
			console.log(id);
		};
		
		$scope.isLoading = true;
		$scope.sysLogQuery = {
			searchListName: "",
			logType: ""
		};
		$scope.logTypeList = [{type: "",text:"全部"},{type: 0,text:"删除"},{type: 1,text: "创建"},{type: 2,text: "修改"}];

		$scope.systemLogCondition = {
		    page:1,
		    rows:10
		};

		// 查询结果
		$scope.systemLogResult = {
		    recordList:[],
		    totalCount: -1
		};

		//按下enter
		$scope.enterEvent = function(e) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	            $scope.searchPress();
	        }
	    };

		//获取系统日志列表
		function getSystemLogList() {
			$scope.systemLogResult.recordList = [];
			$scope.systemLogResult.totalCount = -1;
			$scope.isLoading = true;
		    serviceHttp.systemLog_list(
		        $scope.sysLogQuery.logType,
		        $scope.sysLogQuery.searchListName,
		        $scope.systemLogCondition.rows,
		        $scope.systemLogCondition.page,
		        function (successData) {
		            // console.log(successData);
		            $timeout(function () {
		            	$scope.isLoading = false;
		            	$scope.systemLogResult.recordList = successData.recordList;
		            	$scope.systemLogResult.totalCount = successData.totalCount;
		            },500);
		        },
		        function (errorData) {
		            swal("出错啦", errorData, "error");
		        }
		    );
		}
		getSystemLogList();

		// 查询
		$scope.searchPress = function () {
		    $scope.systemLogResult.recordList = [];
		    $scope.systemLogCondition.page = 1;
		    getSystemLogList();
		};

		// 上一页
		$scope.systemLogListPreviousPress = function () {
		    if($scope.systemLogCondition.page == 1){
		        return;
		    }
		    $scope.systemLogCondition.page --;
		    getSystemLogList();
		};

		// 下一页
		$scope.systemLogListNextPress = function () {
		    if($scope.systemLogResult.totalCount < $scope.systemLogCondition.page*$scope.systemLogCondition.rows){
		        return;
		    }
		    $scope.systemLogCondition.page ++;
		    getSystemLogList();
		};

		//类型
		$scope.logTypeChangePress = function () {
		    $scope.systemLogCondition.page = 1;
		    getSystemLogList();
		};
	}]);
})();