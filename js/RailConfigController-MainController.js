(function() {
	app.controller("RailConfigController-MainCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("RailConfigController-MainCtrl");
		$scope.$emit('menuSelectParam', "railConfig");
		$scope.railSearchContent = "";
		// 围栏搜索
		$scope.railSearchPress = function (content) {
			$scope.railConfig.pageNum = 1;
			getRailList();
		};

		$scope.railConfig = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			errorMessage: "",
			floorNo: "",
			floorList: serverInfo.floorNos,
			list: null
		};
		$scope.isLoading = true;

		//按下enter
		$scope.enterEvent = function(e) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	            $scope.railSearchPress();
	        }
	    };
		//获取区域列表
		function getRailList() {
			$scope.isLoading = true;
			$scope.railConfig.list = [];
			$scope.railConfig.serverPageCount = -1;
			serviceHttp.getFieldList(
				$scope.railSearchContent,
				$scope.railConfig.floorNo,
			    $scope.railConfig.numPerPage,
			    $scope.railConfig.pageNum,
			    function (successData) {
			        console.log(successData);
			        $timeout(function () {
			        	$scope.isLoading = false;
			            $scope.railConfig.list = successData.recordList;
			            $scope.railConfig.serverPageCount = successData.pageCount;
			            setRailPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
			        },500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getRailList();

		//删除
		$scope.railConfigDeletePress = function (item, index) {
			console.log("railConfigDeletePress" + index);
			if (confirm("确认删除围栏【" + item.railName + "】吗？")) {
			    serviceHttp.fieldDelete(
			        item.railId,
			        function (successData) {
			            $scope.railConfig.pageNum = 1;
			            swal("操作成功", "", "success");
			            getRailList();
			        },
			        function (errorData) {
			            swal("操作失败", errorData, "error");
			        }
			    );
			}
		};

		//编辑
		$scope.railConfigEditPress = function (item, index) {
			console.log("railConfigEditPress" + index);
			console.log(item);
			$state.go("railConfig.rc-add",{railConfigItem: item});
		};

		//所属楼层发生改变
		$scope.railConfigfloorNoPress = function (value) {
			console.log(value);
			getRailList();
		};

		//新建
		$scope.addPress = function () {
			console.log("addPress");
			$state.go("railConfig.rc-add");
		};

		//分页
		function setRailPaginator(currentPage,numberOfPages,totalPages) {
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
		                    $scope.railConfig.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.railConfig.pageNum --;
		                    break;
		                case "next":
		                    $scope.railConfig.pageNum ++;
		                    break;
		                case "last":
		                    $scope.railConfig.pageNum = $scope.railConfig.serverPageCount;
		                    break;
		                case "page":
		                    $scope.railConfig.pageNum = page;
		                    break;
		            }
		            getRailList();
		        }
		    };
		    $('#railConfig-paginator').bootstrapPaginator(options);
		}
	}]);
})();