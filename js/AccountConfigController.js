(function() {
	app.controller("AccountConfigCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("AccountConfigCtrl");
		$scope.$emit('menuSelectParam', "permissionConfig");

		/*账户设置开始*/
		$scope.accountConfig = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			list: null
		};
		$scope.isLoading = true;

		//新建
		$scope.accountConfigAddPress = function () {
			$state.go("permissionConfig.ac-add");
		};

		//删除
		$scope.accountConfigDeletePress = function (item, index) {
			console.log("accountConfigDeletePress" + index);

			if (confirm("确认删除账户【" + item.name + "】吗？")) {
			    serviceHttp.accountDelete(
			        item.id,
			        function (successData) {
			            $scope.accountConfig.pageNum = 1;
			            swal("操作成功", "", "success");
			            getAccountList();
			        },
			        function (errorData) {
			            swal("操作失败", errorData, "error");
			        }
			    );
			}
		};

		//编辑
		$scope.accountConfigEditPress = function (item, index) {
			console.log("accountConfigEditPress" + index);	
			$state.go("permissionConfig.ac-edit",{acEditItem: item});
		};

		//账户设置-列表
		function getAccountList() {
			$scope.accountConfig.list = [];
			$scope.accountConfig.serverPageCount = -1;
			$scope.isLoading = true;
			serviceHttp.getAccountList(
				$scope.accountConfig.numPerPage,
				$scope.accountConfig.pageNum,
			    function (successData) {
			        console.log(successData);
			        $timeout(function () {
			        	$scope.isLoading = false;
			        	$scope.accountConfig.list = successData.recordList;
			        	$scope.accountConfig.serverPageCount = successData.pageCount;
			        	setAccountListPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
			        },500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getAccountList();

		//账户设置-分页
		function setAccountListPaginator(currentPage,numberOfPages,totalPages) {

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
		                    $scope.accountConfig.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.accountConfig.pageNum --;
		                    break;
		                case "next":
		                    $scope.accountConfig.pageNum ++;
		                    break;
		                case "last":
		                    $scope.accountConfig.pageNum = $scope.accountConfig.serverPageCount;
		                    break;
		                case "page":
		                    $scope.accountConfig.pageNum = page;
		                    break;
		            }
		            getAccountList();
		        }
		    };
		    $('#accountList-paginator').bootstrapPaginator(options);
		}
		/*账户设置结束*/
		
	}]);
})();