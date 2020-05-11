(function() {
	app.controller("BlackListManagementCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("BlackListManagementCtrl");
		$scope.$emit('menuSelectParam', "reservationManagement");
		$scope.isLoading = true;		//查询等待圈圈

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

		/*黑名单开始*/
		$scope.blackListQuery = {				//黑名单-搜索变量
			blackListSearchContent: "",
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			list: null
		};
		//TODO:黑名单-列表
		function getBlackList() {
		    $scope.blackListQuery.list = [];
		    $scope.blackListQuery.serverPageCount = -1;
		    $scope.isLoading = true;
		    serviceHttp.appointmentBlackList(
		        $scope.blackListQuery.blackListSearchContent,
		        $scope.blackListQuery.numPerPage,
		        $scope.blackListQuery.pageNum,
		        function (successData) {
		            console.log(successData);
		            $timeout(function () {
		                $scope.isLoading = false;
		                $scope.blackListQuery.list = successData.recordList;
		                for(var i = 0,len = $scope.blackListQuery.list.length;i < len; i++){
		                    var obj = $scope.blackListQuery.list[i];
		                    obj.gender = getGender(obj.gender);
		                }
		                $scope.blackListQuery.serverPageCount = successData.pageCount;
		                setBlackListPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
		            }, 500);
		        },
		        function (errorData) {
		            console.log(errorData);
		        }
		    );
		}
		getBlackList();

		//TODO:黑名单-搜索
		$scope.blackListSearchPress = function () {
			$scope.blackListQuery.pageNum = 1;
			getBlackList();
		};

		//按下enter
		$scope.enterEvent = function(e) {
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	            $scope.blackListSearchPress();
	        }
	    };

		//TODO:黑名单-移除
		$scope.blackListHandle = function (item,index) {
			console.log(index);
			if (confirm("确认将访客【" + item.name + "】移除黑名单？")) {
                serviceHttp.blackRemove(
                    item.id,
                    function (successData) {
                        $scope.blackListQuery.pageNum = 1;
                        swal("操作成功", "", "success");
                        getBlackList();
                    },
                    function (errorData) {
                        swal("操作失败", errorData, "error");
                    }
                );
            }
		};

		//TODO:黑名单-分页
		function setBlackListPaginator(currentPage,numberOfPages,totalPages) {

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
		                    $scope.blackListQuery.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.blackListQuery.pageNum --;
		                    break;
		                case "next":
		                    $scope.blackListQuery.pageNum ++;
		                    break;
		                case "last":
		                    $scope.blackListQuery.pageNum = $scope.blackListQuery.serverPageCount;
		                    break;
		                case "page":
		                    $scope.blackListQuery.pageNum = page;
		                    break;
		            }
		            getBlackList();
		        }
		    };
		    $('#blackList-paginator').bootstrapPaginator(options);
		}

		/*黑名单结束*/
	}]);
})();