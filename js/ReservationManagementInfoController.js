(function() {
	app.controller("ReservationManagementInfoCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("ReservationManagementInfoCtrl");
		$scope.$emit('menuSelectParam', "reservationManagement");

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

		$scope.isLoading = true;
		$scope.noticeQuery = {				//预约通知-搜索变量
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			visitorName: "",
			certificateId: "",
			errorMessage: "",
			status: "",
			statusList: [{binded:"",status:"所有"},{binded:"0",status:"生效"},{binded:"-1",status:"失效"}],
			list: null
		};
		//TODO:预约通知-列表
		function getNoticeList() {
		    $scope.noticeQuery.list = [];
		    $scope.noticeQuery.serverPageCount = -1;
		    $scope.isLoading = true;
		    serviceHttp.appointmentList(
		        $scope.noticeQuery.visitorName,
		        $scope.noticeQuery.certificateId,
		        $scope.noticeQuery.status,
		        $scope.noticeQuery.numPerPage,
		        $scope.noticeQuery.pageNum,
		        function (successData) {
		            console.log(successData);
		            $timeout(function () {
		                $scope.isLoading = false;
		                $scope.noticeQuery.list = successData.recordList;
		                for(var i = 0,len = $scope.noticeQuery.list.length;i < len; i++){
		                    var obj = $scope.noticeQuery.list[i];
		                    obj.gender = getGender(obj.visitorGender);
		                    if (obj.status == 0) {
		                    	obj.statusString = "生效";
		                    	obj.statusClass = "label-success";
		                    }
		                    else if (obj.status == -1){
		                    	obj.statusString = "失效";
		                    	obj.statusClass = "label-default";
		                    }
		                }
		                $scope.noticeQuery.serverPageCount = successData.pageCount;
		                setNoticeListPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
		            }, 500);
		        },
		        function (errorData) {
		            console.log(errorData);
		        }
		    );
		}
		getNoticeList();

		//TODO:预约通知-搜索
		$scope.noticeSearchPress = function () {
			$scope.noticeQuery.pageNum = 1;
			getNoticeList();
		};

		//TODO:预约通知-登记
		$scope.noticeHandle = function (item,index) {
			console.log(item);
			serviceHttp.appointmentRemind(
			    item.id,
			    function (successData) {
			    	if (successData.remind) {
			    		swal({ 
			    		    title: "提示信息", 
			    		    text: "该访客尚未到预约时间,是否继续登记?", 
			    		    type: "warning",
			    		    html:true, 
			    		    showCancelButton: true,
			    		    closeOnConfirm: false, 
			    		    confirmButtonText: "继续登记",
			    		    cancelButtonText:"取消"
			    		}, function() {
			    			swal.close();
			    			$timeout(function function_name() {
			    				$state.go("visitorRegistration", {vrItem: item});
			    			},100);
			    		});
			    	}
			    	else{
			    		$state.go("visitorRegistration", {vrItem: item});
			    	}
			    },
			    function (errorData) {
			        swal("操作失败", errorData, "error");
			    }
			);
		};

		//状态改变
		$scope.statusChangePress = function (status) {
			console.log(status);
			$scope.noticeQuery.pageNum = 1;
			getNoticeList();
		};

		//新建
		$scope.addPress = function () {
			console.log("addPress");
			$state.go("reservationManagement.rmi-add");
		};

		//TODO:预约通知-分页
		function setNoticeListPaginator(currentPage,numberOfPages,totalPages) {

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
		                    $scope.noticeQuery.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.noticeQuery.pageNum --;
		                    break;
		                case "next":
		                    $scope.noticeQuery.pageNum ++;
		                    break;
		                case "last":
		                    $scope.noticeQuery.pageNum = $scope.noticeQuery.serverPageCount;
		                    break;
		                case "page":
		                    $scope.noticeQuery.pageNum = page;
		                    break;
		            }
		            getNoticeList();
		        }
		    };
		    $('#noticeList-paginator').bootstrapPaginator(options);
		}
	}]);
})();