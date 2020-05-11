(function() {
	app.controller("AlarmViewCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("AlarmViewCtrl");
		$scope.$emit('menuSelectParam', "alarmView");
		$scope.changeData = function (id) {
			// console.log(id);
		};
		$scope.isLoading = true;		//查询等待圈圈
		$scope.alarmView = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			errorMessage: "",
			name: "",
			railId: "",
			startTime: "",
			endTime: "",
			alarmType: "",
			alarmTypeList: [{bind:"", type:"全部"},{bind:"overBoundaryAlarm", type:"越界报警"},{bind:"stayAlarm", type:"滞留报警"}],
			list: null
		};

		//搜索
		$scope.alarmSearch = function () {
			// console.log("alarmSearch");
			var startTime = moment($scope.alarmView.startTime).format('X')*1000;
			var endTime = moment($scope.alarmView.endTime).format('X')*1000;
			if (startTime - endTime > 0) {
				$scope.alarmView.errorMessage = "开始时间不能大于结束时间";
				return;
			}
			$scope.alarmView.pageNum = 1;
			getAlarmViewList();
		};

		$scope.alarmRailList = [];
		//获取区域列表
		function getFieldList() {
			serviceHttp.getFieldNameList(
			    function (successData) {
			        $scope.alarmRailList = successData;
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getFieldList();

		//摄像头查看
		/*$scope.CameraLook = function (monitor,item) {
		    console.log(monitor);  
		    if (item.handleTimeShow != null) {
		    	$state.go('locationMonitoring',{monitor:monitor,isHistory:true,time:item.time});
		    }else{
		    	$state.go('locationMonitoring',{monitor:monitor,isHistory:false,time:item.time});
		    }
		};*/

		/*//视频联动
		$scope.CameraLook = function (item) {
			$state.go('locationMonitoring',{monitor:monitor,isHistory:false,time:item.time});
		};
		//视频回放
		$scope.CameraPlay = function (item) {
			$state.go('locationMonitoring',{monitor:monitor,isHistory:true,time:item.time});
		};*/

		//处理
		$scope.dealWith = function (item) {
			swal({
                title: "提示！",
                text: "",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "确定",
                cancelButtonText:"取消",
                animation: "slide-from-top",
                inputPlaceholder: "请输入处理意见"
            }, function(inputValue) {
            	if (inputValue === false) {
            		return;
            	}
                if (inputValue === "") {
                    inputValue = "忽略";
                }

                serviceHttp.deal_with(
                    item.uuid,
                    inputValue,
                    function (successData) {
                        swal("", "操作成功", "success");
                        $timeout(function () {
                            getAlarmViewList();
                        },800);
                    },
                    function (errorData) {
                        console.log(errorData);
                    }
                );
            });
		};

		//获取报警列表
		function getAlarmViewList() {
			$scope.alarmView.list = [];
			$scope.alarmView.serverPageCount = -1;
			$scope.isLoading = true;

			var startTimeStamp = "";
			var endTimeStamp = "";
			if ($scope.alarmView.startTime != "" && $scope.alarmView.endTime != "") {
				startTimeStamp = moment($scope.alarmView.startTime).format('X')*1000;
				endTimeStamp = moment($scope.alarmView.endTime).format('X')*1000;
			}
			serviceHttp.getAlarmViewList(
			    $scope.alarmView,
			    startTimeStamp,
			    endTimeStamp,
			    function (successData) {
			        // console.log(successData);
			        $timeout(function () {
			            $scope.isLoading = false;
			            $scope.alarmView.list = successData.recordList;
			            for(var i = 0; i < $scope.alarmView.list.length; i++){
			                var obj = $scope.alarmView.list[i];

			                for(var ii in $scope.alarmView.alarmTypeList){
			                	if (obj.type == $scope.alarmView.alarmTypeList[ii].bind) {
			                		obj.alarmType = $scope.alarmView.alarmTypeList[ii].type;
			                	}
			                }

			                if(obj.handleTime != null){
			                    obj.permString = "已处理";
			                    obj.permClass = "label-success";
			                }
			                else if(obj.handleTime == null){
			                    obj.permString = "报警中";
			                    obj.permClass = "label-danger";
			                }
			            }
			            $scope.alarmView.serverPageCount = successData.pageCount;
			            setAlarmPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
			        }, 500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getAlarmViewList();

		/*var getAlarmListTimer = setInterval(function () {
		    // getAlarmViewList();
		},3000);

		//controller销毁时
		$scope.$on('$destroy', function() {
		    clearInterval(getAlarmListTimer);
		});*/

		//分页
		function setAlarmPaginator(currentPage,numberOfPages,totalPages) {
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
		                    $scope.alarmView.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.alarmView.pageNum --;
		                    break;
		                case "next":
		                    $scope.alarmView.pageNum ++;
		                    break;
		                case "last":
		                    $scope.alarmView.pageNum = $scope.alarmView.serverPageCount;
		                    break;
		                case "page":
		                    $scope.alarmView.pageNum = page;
		                    break;
		            }
		            getAlarmViewList();
		        }
		    };
		    $('#alarmView-paginator').bootstrapPaginator(options);
		}
	}]);
})();