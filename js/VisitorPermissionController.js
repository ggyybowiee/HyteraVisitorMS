(function() {
	app.controller("VisitorPermissionCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("VisitorPermissionCtrl");
		$scope.$emit('menuSelectParam', "permissionConfig");

		$scope.perssionManager = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			list: null
		};
		$scope.isLoading = true;

		//新建
		$scope.permissionAddPress = function () {
			$state.go("permissionConfig.vp-add");
		};

		//删除
		$scope.permissionDeletePress = function (item, index) {
			console.log("permissionDeletePress" + index);

			if (confirm("确认删除权限【" + item.name + "】吗？")) {
			    serviceHttp.permissionDelete(
			        item.id,
			        function (successData) {
			            $scope.perssionManager.pageNum = 1;
			            swal("操作成功", "", "success");
			            getPermissionList();
			        },
			        function (errorData) {
			            swal("操作失败", errorData, "error");
			        }
			    );
			}
		};

		//编辑
		$scope.permissionEditPress = function (item, index) {
			// console.log("permissionEditPress" + index);
			$state.go("permissionConfig.vp-edit",{vpEditItem:item});
		};

		//访客权限-列表
		function getPermissionList() {
			$scope.perssionManager.list = [];
			$scope.perssionManager.serverPageCount = -1;
			$scope.isLoading = true;
			serviceHttp.getPermissionList(
				$scope.perssionManager.numPerPage,
				$scope.perssionManager.pageNum,
			    function (successData) {
			        console.log(successData);
			        $timeout(function () {
			        	$scope.isLoading = false;
			            $scope.perssionManager.list = successData.recordList;
			            $scope.perssionManager.serverPageCount = successData.pageCount;
			            setPermissionListPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
		        	},500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getPermissionList();

		//访客权限-分页
		function setPermissionListPaginator(currentPage,numberOfPages,totalPages) {

		    var options = {
		        bootstrapMajorVersion:3,
		        currentPage: currentPage,
		        numberOfPages: numberOfPages,
		        totalPages: totalPages,
		        itemTexts: function (type, page, current) {
		            switch (type) {
		                case "first":
		                    return "第一页";
		                case "prev":
		                    return "上一页";
		                case "next":
		                    return "下一页";
		                case "last":
		                    return "最后一页";
		                case "page":
		                    return page;
		            }
		        },
		        onPageClicked: function(e,originalEvent,type,page){
		            switch (type) {
		                case "first":
		                    $scope.perssionManager.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.perssionManager.pageNum --;
		                    break;
		                case "next":
		                    $scope.perssionManager.pageNum ++;
		                    break;
		                case "last":
		                    $scope.perssionManager.pageNum = $scope.perssionManager.serverPageCount;
		                    break;
		                case "page":
		                    $scope.perssionManager.pageNum = page;
		                    break;
		            }
		            getPermissionList();
		        }
		    };
		    $('#permissionList-paginator').bootstrapPaginator(options);
		}
	}]);
})();