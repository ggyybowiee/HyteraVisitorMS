(function() {
	app.controller("HistoryTrackReplayCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", "$stateParams", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams) {
		console.log("HistoryTrackReplayCtrl");
		$scope.$emit('menuSelectParam', "locationMonitoring");

		console.log($stateParams.htrItem);
		
		//定义全局map变量
		var map;
		var fmapID = serverInfo.fmapID;
		var polygonMarker;
		var naviLines = []; //当前的路线
		var group = null;
		var layer = null;
        var polygonMarkerLayer = null;
		var imageLayer;
		var textLayer;
		var groupControl;
		var mapGroupNames = [];
		var polygonTms = [];
		var imageMarkers = [];
		var polygonRailArr = [];
		var buildingFieldNameList = [];

		var timeStamp = 0;
		var oTime = document.getElementById('time');
		var oCurTime = document.getElementById('cur_time');
		var timeSpans = oTime.getElementsByTagName('span');
		var currentTime = "";
		var currentTimeStamp = "";

		$scope.clickedSearch = false;


		$scope.historyTrackPlay = {
			id: "",		//查询人的身份号620503199011180311
			dateTime: "",	//2017-11-14
			startTime: "",	//10:20
			endTime: "",	//10:21
			errorMessage: ""
		};

		var startTimeString; 
		var endTimeString; 
		var currentObj = null;
		var startTimeStamp;		//开始时间戳
		var endTimeStamp;		//结束时间戳

		// 查询结果
		$scope.personPathResult = {
		    recordList: [],
		    visitorList: []
		};
		$scope.isPause = false;
		var playInterval = null;
		var setTimer = null;

		$('#dateTime').datetimepicker({
		    format: 'yyyy-mm-dd',
		    minView:'month',
		    language: 'zh-CN'
		}).on('hide', function(ev){
		    $('#startTimeHour').datetimepicker({
		      format:'hh:ii',
		      startDate: $('#dateTimeInput').val() + " 0:00",
		      endDate: $('#dateTimeInput').val() + " 23:59",
		      weekStart: 1,
		      autoclose: 1,
		      startView: 1,
		      minView: 0,
		      maxView: 1,
		      forceParse: 0,
		      language: 'zh-CN'
		    });
		    $('#endTimeHour').datetimepicker({
		      format:'hh:ii',
		      startDate: $('#dateTimeInput').val() + " 0:00",
		      endDate: $('#dateTimeInput').val() + " 23:59",
		      weekStart: 1,
		      autoclose: 1,
		      startView: 1,
		      minView: 0,
		      maxView: 1,
		      forceParse: 0,
		      language: 'zh-CN'
		    });   
		}).on('changeDate', function(ev){
		    $('#startTimeHourInput').val('');
		    $('#startTimeHour').datetimepicker('remove'); 
		    $('#endTimeHourInput').val('');
		    $('#endTimeHour').datetimepicker('remove'); 
		});

		//人员信息列表
		function getHistoryVisitorList() {
			serviceHttp.getHistoryVisitorList(
			    function (successData) {
			        console.log(successData);
			        $scope.personPathResult.visitorList = successData;
			    },
			    function (errorData) {
			        swal('警告',errorData,'error');
			    }
			);
		}
		getHistoryVisitorList();

		//暂停
		$scope.stop = function () {
			// console.log("stop");
			$scope.isPause = false;

			if (playInterval != null) {
				clearInterval(playInterval);
				playInterval = null;
			}
			
			if (setTimer != null) {
				clearInterval(setTimer);
				setTimer = null;
			}
		};

		var m = 0, n = 0;
		var isEnd = false;
		//播放
		$scope.play = function () {
			console.log("play");

			if ($scope.personPathResult.recordList.length == 0) {
				return;
			}

			$scope.isPause = true;

			if (isEnd) {
				//结束播放后，再次点击开始播放
				timeSpans[0].style.width = 0;
				timeSpans[1].style.left = 0;
				timeStamp = 0;
				timeSpans[2].innerHTML = startTimeString;
				timeSpans[3].innerHTML = endTimeString;
				currentObj = $scope.personPathResult.recordList[0].points[0];
				$scope.setFloorMap($scope.personPathResult.recordList[0]);
				setPoints(currentObj);
				clearPoints($scope.personPathResult.recordList[0]);
				m = 0;
				n = 0;
				isEnd = false;
			}
			/*
			m = 0;
			n = 1;*/

			playInterval = setInterval(function () {
				var len = $scope.personPathResult.recordList.length;

				if (len > 1) {
					if ($scope.personPathResult.recordList[m].points && $scope.personPathResult.recordList[m].points.length > 0) {
						// console.log($scope.personPathResult.recordList[m].points[n].time);
						/*var day = moment.unix($scope.personPathResult.recordList[m].points[n].time / 1000);
						var eventTimeShow = moment(day).format('YYYY-MM-DD HH:mm:ss');
						console.log(eventTimeShow);*/
						clearPoints($scope.personPathResult.recordList[m]);
						setPoints($scope.personPathResult.recordList[m].points[n]);
						currentObj = $scope.personPathResult.recordList[m].points[n];
						n = n + 1;
						if (n == $scope.personPathResult.recordList[m].points.length) {
							m = m + 1;
							if (m != len) {
								$scope.setFloorMap($scope.personPathResult.recordList[m]);
								if (m == len - 1) {
									$scope.personPathResult.recordList[m].points[$scope.personPathResult.recordList[m].points.length-1].time = endTimeStamp;
									
								}
							}
							else{
								clearInterval(playInterval);
								playInterval = null;
								m = 0;
							}
							n = 0;
						}
					}
				}
				else if(len == 1){
					var day = moment.unix($scope.personPathResult.recordList[0].points[n].time / 1000);
					var eventTimeShow = moment(day).format('YYYY-MM-DD HH:mm:ss');
					console.log(eventTimeShow);
					clearPoints($scope.personPathResult.recordList[0]);
					setPoints($scope.personPathResult.recordList[0].points[n]);
					currentObj = $scope.personPathResult.recordList[0].points[n];
					n = n + 1;
					if (n == $scope.personPathResult.recordList[0].points.length) {
						$scope.personPathResult.recordList[0].points[n-1].time = endTimeStamp;
						
						// $timeout(function () {
							clearInterval(playInterval);
							playInterval = null;
							n = 0;
						// },1000);
					}
				}
			},1000);

			setTimeout(function () {
				startToPaly();
			},1100);
		};

		//快退
		$scope.playPrevious = function () {
			if (timeSpans[2].innerHTML == startTimeString || timeSpans[2].innerHTML == endTimeString) {
				return;
			}
			if (playInterval != null) {
				clearInterval(playInterval);
				playInterval = null;
			}
			
			if (setTimer != null) {
				clearInterval(setTimer);
				setTimer = null;
			}

			var clickPosition = event.offsetX;
			var currentPosition = parseInt(timeSpans[1].style.left.replace("px",""));
			var len = $scope.personPathResult.recordList.length;

			if (timeStamp !=0) {
				if (len > 1) {
					if (m > 0) {
						if (n == 0) {
							m--;
							$scope.setFloorMap($scope.personPathResult.recordList[m]);
							n = $scope.personPathResult.recordList[m].points.length - 1;
						}
						else{
							n--;
						}
					}
					else{
						n--;
					}
				}
				else if(len == 1){
					if (n > 0) {
						n--;
					}
				}
			}

		    setTimeout(function () {
    	    	clearPoints($scope.personPathResult.recordList[m]);
    		    setPoints($scope.personPathResult.recordList[m].points[n]);	
		    },300);
	    	
		    currentObj = $scope.personPathResult.recordList[m].points[n];

		    var time = new Date(currentObj.time);
		    var transformedTime = time.getFullYear() + "-" + getZero((time.getMonth() + 1)) + "-" + getZero(time.getDate()) + " " + getZero(time.getHours()) + ":" + getZero(time.getMinutes()) + ":" + getZero(time.getSeconds());
		    timeStamp = endTimeStamp - startTimeStamp;
		    currentTimeStamp = currentObj.time - startTimeStamp;  
		    setTime(currentTimeStamp / timeStamp * 500 + 'px', currentTimeStamp / timeStamp * 500 - 5 + 'px',transformedTime);

		    if ($scope.isPause) {
		    	$scope.play();
		    }
		};

		//快进
		$scope.playNext = function () {
			if (currentObj != null && currentObj.time == $scope.personPathResult.recordList[$scope.personPathResult.recordList.length-1].points[$scope.personPathResult.recordList[$scope.personPathResult.recordList.length-1].points.length-2].time) {
				return;
			}
			if (playInterval != null) {
				clearInterval(playInterval);
				playInterval = null;
			}
			
			if (setTimer != null) {
				clearInterval(setTimer);
				setTimer = null;
			}

			var clickPosition = event.offsetX;
			var currentPosition = parseInt(timeSpans[1].style.left.replace("px",""));
			var len = $scope.personPathResult.recordList.length;
			if (timeStamp !=0) {
				if (len > 1) {
		    		n = n + 1;
		    		if (n == $scope.personPathResult.recordList[m].points.length-1) {
		    			m++;
		    			if (m != len) {
		    				$scope.setFloorMap($scope.personPathResult.recordList[m]);
		    				if (m == len - 1) {
		    					$scope.personPathResult.recordList[m].points[$scope.personPathResult.recordList[m].points.length-1].time = endTimeStamp;
		    				}
		    			}
		    			else{
		    				m = 0;
		    			}
		    			n = 0;
		    		}
		    	}
		    	else if(len == 1){
		    		if (n != $scope.personPathResult.recordList[m].points.length-1) {
		    			n++;
		    		}
		    		else{
		    			$scope.personPathResult.recordList[m].points[n].time = endTimeStamp;
		    		}
		    	}
			}

		    setTimeout(function () {
    	    	clearPoints($scope.personPathResult.recordList[m]);
    		    setPoints($scope.personPathResult.recordList[m].points[n]);	
		    },300);
	    	
		    currentObj = $scope.personPathResult.recordList[m].points[n];
		    var time = new Date(currentObj.time);
		    var transformedTime = time.getFullYear() + "-" + getZero((time.getMonth() + 1)) + "-" + getZero(time.getDate()) + " " + getZero(time.getHours()) + ":" + getZero(time.getMinutes()) + ":" + getZero(time.getSeconds());
		    timeStamp = endTimeStamp - startTimeStamp;
		    currentTimeStamp = currentObj.time - startTimeStamp;  
		    setTime(currentTimeStamp / timeStamp * 500 + 'px', currentTimeStamp / timeStamp * 500 - 5 + 'px',transformedTime);

		    if ($scope.isPause) {
		    	$scope.play();
		    }
		};
		
		//鼠标点击进度条，快进/快退进度
		oCurTime.onclick = function(event){
			if (playInterval != null) {
				clearInterval(playInterval);
				playInterval = null;
			}
			
			if (setTimer != null) {
				clearInterval(setTimer);
				setTimer = null;
			}

		    var clickPosition = event.offsetX;
		    var currentPosition = parseInt(timeSpans[1].style.left.replace("px",""));
		    var len = $scope.personPathResult.recordList.length;
		    // if (clickPosition > currentPosition && n != $scope.personPathResult.recordList[m].points.length-1 && timeStamp != 0) {
		    if (clickPosition > currentPosition && timeStamp != 0) {
		    	if (len > 1) {
		    		if (currentObj != null && currentObj.time == $scope.personPathResult.recordList[$scope.personPathResult.recordList.length-1].points[$scope.personPathResult.recordList[$scope.personPathResult.recordList.length-1].points.length-2].time) {
		    			return;
		    		}
		    		n = n + 1;
		    		if (n == $scope.personPathResult.recordList[m].points.length-1) {
		    			m++;
		    			if (m != len) {
		    				$scope.setFloorMap($scope.personPathResult.recordList[m]);
		    				if (m == len - 1) {
		    					$scope.personPathResult.recordList[m].points[$scope.personPathResult.recordList[m].points.length-1].time = endTimeStamp;
		    				}
		    			}
		    			else{
		    				m = 0;
		    			}
		    			n = 0;
		    		}
		    	}
		    	else if(len == 1){
		    		if (n != $scope.personPathResult.recordList[m].points.length-1) {
		    			n++;
		    		}
		    		else{
		    			$scope.personPathResult.recordList[m].points[n].time = endTimeStamp;
		    		}
		    	}
		    	// n++;
		    }
		    else if (clickPosition < currentPosition) {
		    	if (timeSpans[2].innerHTML == startTimeString || timeSpans[2].innerHTML == endTimeString) {
		    		return;
		    	}
		    	if (len > 1) {
		    		if (m > 0) {
		    			if (n == 0) {
		    				m--;
		    				$scope.setFloorMap($scope.personPathResult.recordList[m]);
		    				n = $scope.personPathResult.recordList[m].points.length - 1;
		    			}
		    			else{
		    				n--;
		    			}
		    		}
		    		else{
		    			n--;
		    		}
		    	}
		    	else if(len == 1){
		    		if (n > 0) {
		    			n--;
		    		}
		    	}
		    	// n--;
		    }
		    setTimeout(function () {
    	    	clearPoints($scope.personPathResult.recordList[m]);
    		    setPoints($scope.personPathResult.recordList[m].points[n]);	
		    },300);
	    	
		    currentObj = $scope.personPathResult.recordList[m].points[n];
		    var time = new Date(currentObj.time);
		    var transformedTime = time.getFullYear() + "-" + getZero((time.getMonth() + 1)) + "-" + getZero(time.getDate()) + " " + getZero(time.getHours()) + ":" + getZero(time.getMinutes()) + ":" + getZero(time.getSeconds());
		    timeStamp = endTimeStamp - startTimeStamp;
		    currentTimeStamp = currentObj.time - startTimeStamp;  
		    setTime(currentTimeStamp / timeStamp * 500 + 'px', currentTimeStamp / timeStamp * 500 - 5 + 'px',transformedTime);

		    if ($scope.isPause) {
		    	$scope.play();
		    }
		};

		function setTime(w,l,iHTML){
		    timeSpans[0].style.width = w;
		    timeSpans[1].style.left = l;
		    timeSpans[2].innerHTML = iHTML;
		}

		function startToPaly() {
		    setTimer = setInterval(function(){
		        //播放进度
		        var transformedTime = "";
		        timeStamp = endTimeStamp - startTimeStamp;

		        currentTime = currentObj.time;	//当前点的时间戳
		        if (currentTime) {
		            currentTimeStamp = currentTime - startTimeStamp;
		            var time = new Date(currentTime);
		            transformedTime = time.getFullYear() + "-" + getZero((time.getMonth() + 1)) + "-" + getZero(time.getDate()) + " " + getZero(time.getHours()) + ":" + getZero(time.getMinutes()) + ":" + getZero(time.getSeconds());
		        }
		        

		        if (currentTimeStamp >= timeStamp) {
		            /*$scope.stop();
		            $scope.$apply();*/
		            clearInterval(setTimer);
		            setTimer = null;
		            $scope.isPause = false;
		            isEnd = true;
		            $scope.$apply();
		            setTimeout(function () {
		            	clearPoints($scope.personPathResult.recordList[$scope.personPathResult.recordList.length-1]);
		            },1000);
		        }

		        if (currentTimeStamp > 0) {
		            setTime(currentTimeStamp / timeStamp * 500 + 'px', currentTimeStamp / timeStamp * 500 - 5 + 'px',transformedTime);
		        }

		    },1);
		}

		function getZero(num) {
		    if (parseInt(num) < 10) {
		        num = '0' + num;
		    }
		    return num;
		}

		//将时间戳转换为年月日 时分秒格式
		function transTime(timeStamp) {
		    var day =  moment.unix(timeStamp/1000);
		    var time = moment(day).format('YYYY-MM-DD HH:mm');
		    return time;
		}

		function setCameraDuration(){
		    var timer = setInterval(function(){
		        // $('#time span').eq(3).html(timeStamp > 0 ? initEndTime : '00:00');
		        timeSpans[3].innerHTML = timeStamp >= 0 ? endTimeString : '00:00';
		        if(timeStamp > 0){
		            clearInterval(timer);
		        }
		    },1);
		}

		//搜索
		$scope.historyTrackPlaySearch = function () {
			console.log("historyTrackPlaySearch");
			map.clearLineMark();
			removeImgMarkers();
			$scope.stop();
			m = 0;
			n = 0;

		    $scope.historyTrackPlay.errorMessage = "";
		    if ($scope.historyTrackPlay.id == "") {
		        $scope.historyTrackPlay.errorMessage = "请选择姓名";
		        return;
		    }

		    if ($scope.historyTrackPlay.dateTime == "") {
		        $scope.historyTrackPlay.errorMessage = "请选择日期";
		        return;
		    }

		    if($scope.historyTrackPlay.startTime == ""){
		        $scope.historyTrackPlay.errorMessage = "请选择开始时间";
		        return;
		    }
		    startTimeString = $scope.historyTrackPlay.dateTime + " " + $scope.historyTrackPlay.startTime + ":00";

		    if($scope.historyTrackPlay.endTime == ""){
		        $scope.historyTrackPlay.errorMessage = "请选择结束时间";
		        return;
		    }
		    endTimeString = $scope.historyTrackPlay.dateTime + " " + $scope.historyTrackPlay.endTime + ":00";

		   	startTimeStamp = moment(startTimeString).format('X')*1000;
		  	endTimeStamp = moment(endTimeString).format('X')*1000;
		    if (startTimeStamp - endTimeStamp > 0) {
		        $scope.historyTrackPlay.errorMessage = "开始时间不能大于结束时间";
		        return;
		    }
		    if (endTimeStamp - startTimeStamp > 2*60*60*1000) {
		    	$scope.historyTrackPlay.errorMessage = "开始时间与结束时间的间隔不能超过2个小时！";
		    	return;
		    }
		    $scope.personPathResult.recordList = [];
		    /*$scope.personPathResult.recordList = [
		    	{
		    		t0: 1508763600493,
		    		t1: 1508763671732,
		    		floorId: 3,
		    		points: [{x:40144,y:8303,time:1508763600493},{x:40129,y:12665,time:1508763604497}]
		    	},
		    	{
		    		t0: 1508763600493,
		    		t1: 1508763671732,
		    		floorId: 2,
		    		points: [{x:28314,y:17375,time:1508763674735},{x:23709,y:16515,time:1508763675737}]
		    	}
		    ];
		    var floorNoObj = $scope.personPathResult.recordList[0];
		    $scope.setFloorMap(floorNoObj);*/

		    timeSpans[0].style.width = 0;
		    timeSpans[1].style.left = 0;
		    timeStamp = 0;
		    timeSpans[2].innerHTML = startTimeString;
		    timeSpans[3].innerHTML = endTimeString;

		    setCameraDuration();
	        serviceHttp.personHistoryMapPath(
	            $scope.historyTrackPlay.id,
	            startTimeStamp,
	            endTimeStamp,
	            function (successData) {
	                console.log(successData);
	                $scope.personPathResult.recordList = successData;
	                if ($scope.personPathResult.recordList.length == 0) {
	                	swal("提示", "未查询到数据", "info");
	                    $scope.clickedSearch = false;
	                    return;
	                }else if($scope.personPathResult.recordList.length > 0){
	                    $scope.clickedSearch = true;
	                }

	                var floorNoObj = $scope.personPathResult.recordList[0];
	                $scope.setFloorMap(floorNoObj);
	                $scope.$apply();
	            },
	            function (errorData) {
	                swal('警告',errorData,'error');
	            }
	        );
		};

		$('#loading').modal({backdrop: 'static', keyboard: false});
		$('#loading').modal('show');

		$timeout(function () {
			map = new fengmap.FMMap({
			    //渲染dom
			    container: document.getElementById('historyFengMap'),
			    //地图数据位置
			    mapServerURL: "/map/fmap/" + serverInfo.buildId,
			    //主题数据位置
			    mapThemeURL: './data/theme',
			    //设置主题
			    defaultThemeName: serverInfo.fmapTheme,
			    // 默认比例尺级别设置为20级
			    defaultMapScaleLevel: 20,
			    viewModeAnimateMode: true,
			    defaultViewMode: fengmap.FMViewMode.MODE_2D,
			    modelSelectedEffect: false,
			    //开发者申请应用下web服务的key
			    key: serverInfo.webKey,
			    //开发者申请应用名称
			    appName: serverInfo.webName
			});

			//打开Fengmap服务器的地图数据和主题
			map.openMapById(fmapID, function(error){
			    //打印错误信息
			    console.log(error);
			});

			//楼层控制控件配置参数
			var ctlOpt = new fengmap.controlOptions({
			    //默认在右下角
			    position: fengmap.controlPositon.RIGHT_TOP,
			    //默认显示楼层的个数
			    showBtnCount: 4,
			    //位置x,y的偏移量
			    offset: {
			        x: 20,
			        y: 200
			    }
			});

			//地图加载完成回掉方法
			map.on('loadComplete',function() {
				
			    // console.log("------- 拥有楼层:");
			    // console.log(map.groupIDs);

			    //创建楼层(按钮型)，创建时请在地图加载后(loadComplete回调)创建。
			    //不带单/双层楼层控制按钮,初始时只有1个按钮,点击后可弹出其他楼层按钮
			    // groupControl = new fengmap.buttonGroupsControl(map, ctlOpt);
			    groupControl = new fengmap.scrollGroupsControl(map, ctlOpt);
			    //楼层控件是否可点击，默认为true
			    groupControl.enableExpand=true;
			    //保持多层和楼层切换一致
			    groupControl.onChange(function(groups, allLayer) {
			        //groups 表示当前要切换的楼层ID数组,
			        //allLayer表示当前楼层是单层状态还是多层状态。
			        group = map.getFMGroup(map.focusGroupID);
			        // 返回当前层中第一个polygonMarker,如果没有，则自动创建
			        polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');
			    });

			    // 转换 groupIDs 为 "f1,f2"这样的数组
			    for (var i = 0; i < map.groupIDs.length; i++) {
			        var floorName = map.getFMGroup(map.groupIDs[i]).groupName;
			        mapGroupNames.push(floorName.toLowerCase());
			    }

			    var toolControl = new fengmap.toolControl(map, {
			        //初始化2D模式
			        init2D: true,
			        //设置为false表示只显示2D,3D切换按钮
			        groupsButtonNeeded: false,
			        //默认在右下角
			        position: fengmap.controlPositon.RIGHT_TOP,
			        //位置x,y的偏移量
			        offset: {
			            x: 20,
			            y: 20
			        },
			        //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
			        clickCallBack: function(type, value) {
			            // console.log(type,value);
			        }
			    });

			    map.visibleGroupIDs = [map.groupIDs[0]];
			    map.focusGroupID = map.groupIDs[0];

			    //添加标注的当前楼层，方便移除的时候查找
			    group = map.getFMGroup(map.groupIDs[0]);
			    // 返回当前层中第一个polygonMarker,如果没有，则自动创建
			    polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');

			    //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
			    textLayer = group.getOrCreateLayer('textMarker');

			    getFieldList();

		        if ($stateParams.htrItem) {
	    	    	$scope.historyTrackPlay.id = $stateParams.htrItem.certificateId;

	    	    	var startTimeString = $stateParams.htrItem.arrivalTime + ":00";
	    	    	var endTimeString = $stateParams.htrItem.leaveTime + ":00";

	    	    	var startStamp = moment(startTimeString).format('X')*1000;
	    	    	var endStamp = moment(endTimeString).format('X')*1000;

	    	    	if (endStamp - startStamp > 2*60*60*1000) {
	    	    		var aa = $stateParams.htrItem.arrivalTime.split(" ");
	    	    		$scope.historyTrackPlay.dateTime = aa[0];
	    	    		$scope.historyTrackPlay.startTime = aa[1];

	    	    		var bb = transTime(startStamp + 2*60*60*1000).split(" ");	//最多查询2个小时
	    	    		$scope.historyTrackPlay.endTime = bb[1];
	    	    	}
	    	    	else{
	    	    		var arr = $stateParams.htrItem.arrivalTime.split(" ");	
	    	    		$scope.historyTrackPlay.dateTime = arr[0];
	    	    		$scope.historyTrackPlay.startTime = arr[1];

	    	    		var brr = $stateParams.htrItem.leaveTime.split(" ");
	    	    		$scope.historyTrackPlay.endTime = brr[1];
	    	    	}
	    	    	
	    	    	$timeout(function () {
	    	    		$scope.historyTrackPlaySearch();
	    	    		$scope.play();
	    	    		$stateParams.htrItem = null;
	    	    	},300);
		        }

		        $('#loading').modal('hide');
			});

			//点击事件
			map.on('mapClickNode',function(event) {
			    // console.log("点击坐标：x:"+convertX(event.eventInfo.coord.x)+" ---- y:"+convertY(event.eventInfo.coord.y));
			});
		},500);

		$scope.isShowRail = false;
		//电子围栏切换
		$scope.elecRailToggle = function () {
		    $scope.isShowRail = !$scope.isShowRail;
		    if ($scope.isShowRail) {
		        for(var i = 0; i < buildingFieldNameList.length; i++){
		            var obj = buildingFieldNameList[i];
		            var floorNo = findFengMapFloorIndexWithJoysuchFloorID(obj.floorNo);
		            var points = [];
		            group = map.getFMGroup(floorNo);
		            polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');
		            textLayer = group.getOrCreateLayer('textMarker');
		        }

		        for(var ii = 0; ii < polygonTms.length; ii++){
		            textLayer.removeMarker(polygonTms[ii]);
		        }
		        for(var iii = 0; iii < polygonRailArr.length; iii++){
		            polygonMarkerLayer.remove(polygonRailArr[iii]);
		        }

		    }else{
		        getFieldList();

		    }
		};

		$scope.$on("$destroy", function(){
			console.log("destory");
		    clearInterval(playInterval);
		    playInterval = null;
		    clearInterval(setTimer);
		    setTimer = null;
		});

		//加载围栏list
		function getFieldList() {
		    serviceHttp.getFieldNameList(
		        function (successData) {
		            // console.log(successData);
		            buildingFieldNameList = successData;
		            for(var i = 0; i < successData.length; i++){
		                var obj = successData[i];
		                var floorNo = findFengMapFloorIndexWithJoysuchFloorID(obj.floorNo);
		                var points = [];
		                for(var j=0;j<obj.railPoints.length;j++){
		                    points.push({
		                        x:convertFmapX(obj.railPoints[j].x),
		                        y:convertFmapY(obj.railPoints[j].y),
		                        z:obj.railPoints[j].z
		                    });
		                }
		                //添加标注的当前楼层，方便移除的时候查找
		                group = map.getFMGroup(floorNo);

		                //返回当前层中第一个polygonMarker,如果没有，则自动创建
		                polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');

		                //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
		                textLayer = group.getOrCreateLayer('textMarker');

		                createPolygonMaker(points,obj.railName);
		            }
		            //$scope.$apply();
		        },
		        function (errorData) {
		            console.log(errorData);
		        }
		    );
		}

		// 创建电子围栏
		function createPolygonMaker(coords,txt) {
		    polygonMarker = new fengmap.FMPolygonMarker({
		        //设置颜色
		        color:'#aaa',
		        //设置透明度
		        alpha: 0.5,
		        //设置边框线的宽度
		        lineWidth: 0,
		        //设置高度
		        height: 1,
		        //设置多边形坐标点
		        points: coords
		    });

		    polygonMarkerLayer.addMarker(polygonMarker);

		    //添加文字标注
		    var tm = new fengmap.FMTextMarker({
		        x: coords[0].x,
		        y: coords[0].y,
		        z: 2,
		        name: txt,
		        height: 2,
		        //填充色
		        fillcolor: "255,0,0",
		        //字体大小
		        fontsize: 14,
		        //边框色
		        strokecolor: "255,255,0",
		        callback: function() {
		            // 在载入完成后，设置 "一直可见"
		            tm.alwaysShow();
		        }
		    });
		    polygonTms.push(tm);
		    polygonRailArr.push(polygonMarker);
		    textLayer.addMarker(tm);
		}

		function convertX(x) {
		    return parseInt((x - map.minX)*1000);
		}

		function convertY(y) {
		    return parseInt((map.maxY - y)*1000);
		}

		function convertFmapX(x) {
		    return (x/1000 + map.minX);
		}
		function convertFmapY(y) {
		    return (map.maxY - y/1000);
		}

		// 把定位结果楼层id转换成fmap楼层,如Floor1 -> f1
		function findFengMapFloorIndexWithJoysuchFloorID(joysuchFloorID) {
		    var fmapGroupID = -1;
		    var floorName = "";

		    var pattern_floor = /^(Floor[1-9]\d*)$/;
		    var pattern_floorB = /^(FloorB[1-9]\d*)$/;

		    if (pattern_floor.test(joysuchFloorID) && !pattern_floorB.test(joysuchFloorID)) {
		        joysuchFloorID = joysuchFloorID.replace("Floor","");
		    }else if (pattern_floorB.test(joysuchFloorID)) {
		        joysuchFloorID = joysuchFloorID.replace("FloorB","-");
		    }

		    if (joysuchFloorID > 0) {
		        floorName = "f" + joysuchFloorID;
		    }
		    else if (joysuchFloorID < 0) {
		        floorName = "b" + Math.abs(joysuchFloorID);
		    }
		    else {
		        console.log("楼层错误");
		    }

		    for (var i = 0; i < mapGroupNames.length; i++) {

		        if (floorName == mapGroupNames[i]) {
		            fmapGroupID = map.groupIDs[i];
		            break;
		        }
		    }

		    return fmapGroupID;
		}


		// 将蜂鸟地图转换为楼层id,如1 -> Floor1
		function convertFengMapGroupIDToJoysuchFloorID(fmapGroupID) {
		    //console.log(fmapGroupID);
		    var joysuchFloorID = 0;

		    var floorName = map.getFMGroup(fmapGroupID).groupName;
		    floorName = floorName.toLowerCase();
		    var floorNumber = floorName.substr(1,floorName.length - 1);
		    // 楼层是负数
		    if(floorName.substr(0,1) == "b" ){
		        joysuchFloorID = "FloorB" + (parseInt(floorNumber));
		    }
		    // 楼层是正数
		    else{
		        joysuchFloorID = "Floor" + parseInt(floorNumber);
		    }

		    return joysuchFloorID;
		}

		var opacity = new Image();  //透明图片
		opacity.src = 'img/opacity.png';

		var redPoint = new Image();  //点位图片
		redPoint.src = 'img/redPoint.png';

		//清除点
		function clearPoints(list) {
			for(var i = 0; i < list.points.length; i++){
				var im = list.points[i].im;
				if (im == undefined) {
					// break;
				}
				else{
					im.image = opacity;
				}
			}
		}

		//设置点
		function setPoints(point) {
		    var im = point.im;
		    if (im == undefined) {

		    }
		    else{
		    	im.image = redPoint;
		    }
		}

		//删除Marker
		function removeImgMarkers() {
		    //获取多楼层Marker
		    map.callAllLayersByAlias('imageMarker',function(layer) {
		        layer.removeAll();
		    });
		}
		//切换楼层
		$scope.setFloorMap = function(floor) {
			map.clearLineMark();
			removeImgMarkers();
		    for(var i = 0; i < $scope.personPathResult.recordList.length; i++){
		        var d = $scope.personPathResult.recordList[i];

		        if(floor == d){
		            continue;
		        }
		        d.showPoints = false;
		    }
		    loadPointWithData(floor);
		};

		function addStratPoint(gid,coord) {
		    var group = map.getFMGroup(gid);

		    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
		    var layer = group.getOrCreateLayer('imageMarker');

		    var im = new fengmap.FMImageMarker({
		        x: coord.x,
		        y: coord.y,
		        z: coord.z,
		        url: 'img/start.png',
		        size: 32,
		        callback: function() {
		            im.alwaysShow();
		        }
		    });
		    layer.addMarker(im);
		}

		function addEndPoint(gid,coord) {
		    var group = map.getFMGroup(gid);

		    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
		    var layer = group.getOrCreateLayer('imageMarker');
		    var im = new fengmap.FMImageMarker({
		        x: coord.x,
		        y: coord.y,
		        z: coord.z,
		        url: 'img/end.png',
		        size: 32,
		        callback: function() {
		            im.alwaysShow();
		        }
		    });
		    layer.addMarker(im);
		}

		function loadPointWithData(floorNoObj) {
		    var floorNo_zeroIndex = "";
		    if(floorNoObj.floorId > 0){
		        floorNo_zeroIndex = "Floor" + floorNoObj.floorId;
		    }
		    else{
		        floorNo_zeroIndex = "FloorB" + Math.abs(floorNoObj.floorId);
		    }
		    var gid_zeroIndex = findFengMapFloorIndexWithJoysuchFloorID(floorNo_zeroIndex);

		    var group_tem = map.getFMGroup(gid_zeroIndex);
		    var imageLayer = group_tem.getOrCreateLayer('imageMarker');
		    // 清除线
		    map.clearLineMark();
		    // 清除点
		    imageLayer.removeAll();

		    // 切换楼层
	    	map.visibleGroupIDs = [gid_zeroIndex];
	    	map.focusGroupID = gid_zeroIndex;
		    

		    var points = [];
		    for(var k=0;k<floorNoObj.points.length;k++){
		        var obj1 = floorNoObj.points[k];
		        points.push({
		            x:convertFmapX(obj1.x),
		            y:convertFmapY(obj1.y),
		            z:0
		        });

		        if (k == 0) {
		            addStratPoint(gid_zeroIndex,points[k]);
		        }
		        if (k == floorNoObj.points.length-1) {
		            addEndPoint(gid_zeroIndex,points[k]);
		        }

		        // 画历史点
		        var im = addHistoryMarkers(gid_zeroIndex,convertFmapX(obj1.x),convertFmapY(obj1.y));
		        obj1.im = im;
		    }

		    var naviResults = [{
		        groupId: gid_zeroIndex,
		        points: points
		    }];

		    //配置线型、线宽、透明度等
		    var lineStyle = {
		        //设置线的宽度
		        lineWidth: 2,
		        //设置线的透明度
		        alpha: 0.8,

		        // offsetHeight 默认的高度为 1, (离楼板1米的高度)
		        offsetHeight: 1,

		        //设置线的类型为导航线
		        lineType: fengmap.FMLineType.FMARROW,
		        //设置线动画,false为动画
		        noAnimate: false,
		    };
		    //绘制线
		    drawLines(naviResults, lineStyle);
		}

		//绘制线图层
		function drawLines(results, lineStyle) {
		    //绘制部分
		    var line = new fengmap.FMLineMarker();
		    for (var i = 0; i < results.length; i++) {
		        var result = results[i];
		        var gid = result.groupId;
		        var points = result.points;
		        var seg = new fengmap.FMSegment();
		        seg.groupId = gid;
		        seg.points = points;
		        line.addSegment(seg);
		        var lineObject = map.drawLineMark(line, lineStyle);
		        naviLines.push(lineObject);
		    }
		}

		//添加Marker
		function addHistoryMarkers(gid,x,y) {
		    var group = map.getFMGroup(gid);

		    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
		    var layer = group.getOrCreateLayer('imageMarker');

		    //图标标注对象，默认位置为该楼层中心点
		    var im = new fengmap.FMImageMarker({
		        id: gid+"_"+x+"_"+y,
		        x: x,
		        y:y,
		        //设置图片路径
		        url: 'img/opacity.png', // img/bluePoint.png
		        //设置图片显示尺寸
		        size: 15,
		        callback: function() {
		            // 在图片载入完成后，设置 "一直可见"
		            im.alwaysShow();
		        }
		    });

		    layer.addMarker(im);
		    return im;
		}
	}]);
})();