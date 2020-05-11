(function() {
	app.controller("LocationMonitoringCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", "$stateParams", "$interval", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams, $interval) {
		console.log("LocationMonitoringCtrl");
		$scope.$emit('menuSelectParam', "locationMonitoring");
		console.log($stateParams.locationMonitorStr);
		console.log($stateParams.trackObj);
		$scope.selectPane = "实时监控";
		// $scope.isShowSearchPart = false;
		if ($stateParams.locationMonitorStr != "") {
			$scope.selectPane = $stateParams.locationMonitorStr;
		}

		/*var tempTrackData = null;	//访客记录跟踪的数据
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
		var allowImageMarker;

		var locationSummaryInterval;
		var railEventLogInterval;
		$scope.locationSummaryData = [];

		var timeStamp = 0;
		var oTime;
		var timeSpans;
		var currentTime = "";
		var currentTimeStamp = "";

		$scope.clickedSearch = false;


		if($scope.selectPane == "实时监控"){

			$state.go("locationMonitoring.rm");
		}
		else if($scope.selectPane == "历史轨迹回放"){
			$state.go("locationMonitoring.htr");
		}
*/
		//执行mapUI
		$scope.changeData = function (item) {
			// console.log(item);

			if($scope.selectPane == "实时监控"){
				$state.go("locationMonitoring.rm",{rmItem: $stateParams.trackObj});
			}
			else if($scope.selectPane == "历史轨迹回放"){
				$state.go("locationMonitoring.htr",{htrItem: $stateParams.trackObj});
			}

			/*oTime = document.getElementById('time');
			timeSpans = oTime.getElementsByTagName('span');

			// $("#realMonitorFengMap").after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是错误的。</div>");

			for(var i = 0; i < item.panes.length; i++){
				if (item.panes[i].selected) {
					$scope.selectPane = item.panes[i].content;
				}
			}
			map = null;
			polygonMarker = null;
			naviLines = []; //当前的路线
			group = null;
			layer = null;
	        polygonMarkerLayer = null;
			imageLayer = null;
			textLayer = null;
			groupControl = null;
			mapGroupNames = [];
			polygonTms = [];
			imageMarkers = [];
			allowImageMarker = null;
			$scope.locationSummaryData = [];

			$('#realMonitorFengMap').empty();
			$('#historyFengMap').empty();

			$('#loading').modal({backdrop: 'static', keyboard: false});
			$('#loading').modal('show');

			if($scope.selectPane == "实时监控"){
				$('#realMonitorFengMap').hide();
				$('#realMonitorLoader').show();
				$timeout(function () {
					$('#realMonitorLoader').hide();
					$('#realMonitorFengMap').show();
					map = null;
					map = new fengmap.FMMap({
					    //渲染dom
					    container: document.getElementById('realMonitorFengMap'),
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
					        y: 100
					    }
					});

					//地图加载完成回掉方法
					map.on('loadComplete',function() {
						$('#loading').modal('hide');
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

					    if(imageLayer == null){
					        //添加标注的当前楼层，方便移除的时候查找
					        group = map.getFMGroup(map.groupIDs[0]);
					        layer = new fengmap.FMImageMarkerLayer();
					        group.addLayer(layer);
					        //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
					        imageLayer = group.getOrCreateLayer('imageMarker');

					        //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
					        textLayer = group.getOrCreateLayer('textMarker');

					        //返回当前层中第一个polygonMarker,如果没有，则自动创建
					        polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');
					    }
					    getFieldList();
					    readyForMap();

					   
						    if ($stateParams.trackObj) {
						    	// $scope.isShowSearchPart = true;
						    	$scope.isShowRealMonitorSearchPart = true;
						    	$timeout(function () {
							    	$scope.realMonitor.name = $stateParams.trackObj.name;
							    	$scope.realMonitor.gender = $stateParams.trackObj.gender + "";
							    	$scope.realMonitor.arrivalTime = $stateParams.trackObj.arrivalTime;
							    	$scope.realMonitor.reason = $stateParams.trackObj.reason;
							    	$scope.realMonitor.pageNum = 1;
							    	$stateParams.trackObj.id = $stateParams.trackObj.certificateId;
							    	$stateParams.trackObj.isTrack = true;
							    	getRealMonitorList();

							    	
							    	$timeout(function () {
							    		$scope.toTrack(tempTrackData);
							    		$stateParams.trackObj = null;
							    	},800);
						    	},1000);
						    }
					});

					//点击事件
					map.on('mapClickNode',function(event) {
					    // console.log("点击坐标：x:"+convertX(event.eventInfo.coord.x)+" ---- y:"+convertY(event.eventInfo.coord.y));
					});
				},500);
			}
			else if ($scope.selectPane == "历史轨迹回放") {
				$interval.cancel(locationSummaryInterval);
				locationSummaryInterval = null;
				$('#historyFengMap').hide();
				$('#historyLoader').show();
				$timeout(function () {
					$('#historyLoader').hide();
					$('#historyFengMap').show();
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
					        y: 100
					    }
					});

					//地图加载完成回掉方法
					map.on('loadComplete',function() {
						$('#loading').modal('hide');
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
					});

					//点击事件
					map.on('mapClickNode',function(event) {
					    // console.log("点击坐标：x:"+convertX(event.eventInfo.coord.x)+" ---- y:"+convertY(event.eventInfo.coord.y));
					});
				},500);
			}*/
			
		};

		/*function readyForMap() {
			$timeout(function () {
			    $scope.getLocationSummary();
			    
			    if(locationSummaryInterval == null){
			        locationSummaryInterval = $interval($scope.getLocationSummary,2000);
			        // railEventLogInterval = $interval($scope.getRailAlarmEvent,2000);
			    }
			},1000);
		}

		$scope.$on("$destroy", function(){
		    $interval.cancel(locationSummaryInterval);
		    // $interval.cancel(railEventLogInterval);
		    locationSummaryInterval = null;
		    // railEventLogInterval = null;
		});*/

		// var num = 1;
		$scope.getLocationSummary = function () {
			/*var count = $(".realMonitorAlert").length;
			console.log(count);
			if ($(".realMonitorAlert")) {
				$(".realMonitorAlert").eq(count-1).after("<div class='realMonitorAlert alert alert-success fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是" + num +"</div>");
			}
			num ++;*/
			/*serviceHttp.location_summary(
				function (successData) {
					if (successData != null && successData.length > 0) {
						var has = false;
						var hasIndex = -1;
						var i, ii;
						for (i = 0, len = successData.length; i < len; i++) {
							var successDataObj = successData[i];

							for (ii = 0, max = $scope.locationSummaryData.length; ii < max; ii++) {
								var val = $scope.locationSummaryData[ii];
								if (successDataObj.sn == val.sn) {
									has = true;
									hasIndex = ii;
									break;
								} else {
									has = false;
									hasIndex = -1;
								}
							}
							if (has) {
								$scope.locationSummaryData[hasIndex].id = successDataObj.id;
								$scope.locationSummaryData[hasIndex].name = successDataObj.name;
								$scope.locationSummaryData[hasIndex].floorNo = successDataObj.floorNo;
								$scope.locationSummaryData[hasIndex].sn = successDataObj.sn;
								$scope.locationSummaryData[hasIndex].x = successDataObj.x;
								$scope.locationSummaryData[hasIndex].y = successDataObj.y;

								$scope.locationSummaryData[hasIndex].hasPerm = successDataObj.hasPerm;
								$scope.locationSummaryData[hasIndex].status = successDataObj.status;
								addMarkers($scope.locationSummaryData[hasIndex]);
							} else {
								successDataObj.seeked = false;
								successDataObj.online = true;
								addMarkers(successDataObj);
								$scope.locationSummaryData.push(successDataObj);
							}
						}
					}
			    //$scope.$apply();
			},function (errorData) {

			});*/
		};

		//获取围栏报警事件
		$scope.getRailAlarmEvent = function () {
		    serviceHttp.getRailAlarmEvent(
		        function (successData) {
		            if (successData != null && successData.length > 0) {
						for (var i = 0; i < successData.length; i++) {
							var obj = successData[i];
							obj.detail = JSON.parse(obj.detail);
							var day = moment.unix(obj.time / 1000);
							obj.eventTimeShow = moment(day).format('YYYY-MM-DD HH:mm:ss');

							if (obj.type == 'overBoundaryAlarm') {
								if (obj.detail.railType == 1) {
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了越界报警,进入了【' + obj.detail.railName + '】';
								}
								if (obj.detail.railType == 2) {
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了越界报警,离开了【' + obj.detail.railName + '】';
								}
							} else if (obj.type == 'stayAlarm') {
								obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】在【' + obj.detail.railName + '】发生了滞留报警';
							}

							if ($("realMonitorAlert")) {
								var count = $(".realMonitorAlert").length;
								$(".realMonitorAlert").eq(count-1).after("<div class='realMonitorAlert alert alert-success fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是" + obj.eventDesc +"</div>");
							}else{
								$("#realMonitorFengMap").after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是" + obj.eventDesc + "</div>");
							}
						}
		                $scope.$apply();
		            }
		        },
		        function (errorData) {
		            console.log(errorData);
		        }
		    );
		};

		$scope.isLoading = false;		//查询等待圈圈
		
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
		/*实时监控开始*/
		$scope.realMonitor = {
			pageNum: 1,
			numPerPage: 3,
			serverPageCount: -1,
			name: "",
			reason: "",
			arrivalTime: "",
			gender: "",
			errorMessage: "",
			list: null
		};
		$scope.reasonList = [{reason:"业务洽谈"},{reason:"来访参观"},{reason:"面试"},{reason:"其他"}];
		$scope.sexType = [{binded: 1,sex:"男"},{binded: 0,sex:"女"},{binded: 2,sex:"两性"}];
		$scope.isShowRealMonitorSearchPart = true;	//是否展示查询列表
		

		//追踪
		$scope.toTrack = function (item) {
			console.log(item);
			item.isTrack = false;

			for(var i=0,len = $scope.locationSummaryData.length;i<len;i++){
			    var obj = $scope.locationSummaryData[i];
			    if (item.id == obj.id) {
			    	var floorNo = findFengMapFloorIndexWithJoysuchFloorID(obj.floorNo);
			    	map.visibleGroupIDs = [map.groupIDs[floorNo-1]]; //切换楼层
			        obj.seeked = true;
			        addMarkers(obj);
			    }
			}
		};

		//取消追踪
		$scope.cancleTrack = function (item) {
			item.isTrack = true;

		    for(var i=0,len = $scope.locationSummaryData.length;i<len;i++){
		        var obj = $scope.locationSummaryData[i];
		        if (item.id == obj.id) {
		            obj.seeked = false;
		            addMarkers(obj);
		        }
		    }

		    if(allowImageMarker != null){
		        imageLayer.removeMarker(allowImageMarker.im);
		        allowImageMarker = null;
		    }
		};

		$scope.expand = function () {
			$scope.isShowRealMonitorSearchPart = !$scope.isShowRealMonitorSearchPart;
		};

		//获取实时监控数据列表
		function getRealMonitorList() {
			$scope.realMonitor.list = [];
			$scope.realMonitor.serverPageCount = -1;
			$scope.isLoading = true;
			serviceHttp.getRealMonitorList(
			    $scope.realMonitor,
			    function (successData) {
			        console.log(successData);
			        $timeout(function () {
			            $scope.isLoading = false;
			            $scope.realMonitor.list = successData.recordList;
			            for(var i = 0,len = $scope.realMonitor.list.length;i < len; i++){
			                var obj = $scope.realMonitor.list[i];
			                obj.gender = getGender(obj.gender);
			                obj.isTrack = true;

			                if (($stateParams.trackObj) && (obj.id == $stateParams.trackObj.certificateId)){
			                	tempTrackData = obj;
			                }
			            }
			            $scope.realMonitor.serverPageCount = successData.pageCount;
			            setRealMonitorPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);

			            
			        }, 500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		// getRealMonitorList();

		//搜索
		$scope.realMonitorSearch = function () {
			$scope.realMonitor.pageNum = 1;
			getRealMonitorList();
		};

		//分页
		function setRealMonitorPaginator(currentPage,numberOfPages,totalPages) {
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
		                    $scope.realMonitor.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.realMonitor.pageNum --;
		                    break;
		                case "next":
		                    $scope.realMonitor.pageNum ++;
		                    break;
		                case "last":
		                    $scope.realMonitor.pageNum = $scope.realMonitor.serverPageCount;
		                    break;
		                case "page":
		                    $scope.realMonitor.pageNum = page;
		                    break;
		            }
		            getRealMonitorList();
		        }
		    };
		    $('#realMonitor-paginator').bootstrapPaginator(options);
		}

		var buildingFieldNameList = []; //加载的围栏集合
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

		var polygonRailArr = [];
		
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

		var personOnMap = new Image();  //正常图片
		personOnMap.src = 'img/personOnMap.png';

		var personOnMapRed = new Image();  //报警图片
		personOnMapRed.src = 'img/personOnMapRed.png';

		var personOnMap_offline = new Image();  //离线图片
		personOnMap_offline.src = 'img/personOnMap_offline.png';
		
		//添加图片标注
		function addMarkers(obj) {
		    var xx = map.minX + (obj.x/1000);
		    var yy = map.maxY - (obj.y/1000);

		    var hasIndex = -1;
		    for(var i = 0; i < imageMarkers.length; i++){
		        var img = imageMarkers[i].im;

		        if(img.id_ == obj.id){
		            hasIndex = i;
		            break;
		        }
		    }
		    var groupID = findFengMapFloorIndexWithJoysuchFloorID(obj.floorNo);
		    // console.log("groupID: "+ groupID);
		    if(hasIndex == -1 && obj.seeked == false){ // 没有添加过，现在添加
		    	if(obj.status == 0){
		    		return;
		    	    // imm.image =  personOnMap_offline;
		    	    // imm.url =  'img/personOnMap_offline.png';
		    	}

		        //图标标注对象，默认位置为该楼层中心点

		        group = map.getFMGroup(groupID);
		        imageLayer = group.getOrCreateLayer('imageMarker');

		        var imm = new fengmap.FMImageMarker({
		            id: obj.id,
		            x: xx,
		            y: yy,
		            z: 1,
		            //设置图片路径
		            url:  obj.hasPerm ? 'img/personOnMap.png' : 'img/personOnMapRed.png',
		            // url: 'img/personOnMap.png',
		            //设置图片显示尺寸
		            size: 20,
		            height:1,
		            callback: function() {
		                // 在图片载入完成后，设置 "一直可见"
		                imm.alwaysShow();
		            }
		        });
		        imageLayer.addMarker(imm);

		        //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
		        textLayer = group.getOrCreateLayer('textMarker');

		        var tmm = new fengmap.FMTextMarker({
		            id: 'textMaker_' + obj.id,
		            x: xx,
		            y: yy,
		            z: 2,
		            name: obj.name,  //text
		            height: 2,
		            //填充色
		            fillcolor: "255,0,0",
		            //字体大小
		            fontsize: 14,
		            //边框色
		            strokecolor: "0,255,0",
		            callback: function() {
		                // 在载入完成后，设置 "一直可见"
		                tmm.alwaysShow();
		            }
		        });
		        textLayer.addMarker(tmm);
		        imageMarkers.push({im:imm,tm:tmm});

		    }
		    else{ // 更新坐标
		        // console.log("--- 更新坐标 ---");

		        var im = imageMarkers[hasIndex].im;
		        var tm3 = imageMarkers[hasIndex].tm;

		        if(im.groupID != groupID && im.groupID != null){
		            group = map.getFMGroup(im.groupID);
		            imageLayer = group.getOrCreateLayer('imageMarker');
		            imageLayer.removeMarker(im);
		            textLayer = group.getOrCreateLayer('textMarker');
		            var tm1 = imageMarkers[hasIndex].tm;
		            textLayer.removeMarker(tm1);

		            group = map.getFMGroup(groupID);
		            imageLayer = group.getOrCreateLayer('imageMarker');
		            im = new fengmap.FMImageMarker({
		                id:obj.id,
		                x: xx,
		                y: yy,
		                z: 1,
		                //设置图片路径
		                url:  obj.hasPerm ? 'img/personOnMap.png' : 'img/personOnMapRed.png',
		                //设置图片显示尺寸
		                size: 20,
		                height:1,
		                callback: function() {
		                    // 在图片载入完成后，设置 "一直可见"
		                    im.alwaysShow();
		                }
		            });
		            imageLayer.addMarker(im);
		            imageMarkers[hasIndex].im = im;
		            textLayer = group.getOrCreateLayer('textMarker');
		            var tm2 = addTextMarker(xx,yy,obj.name,obj.id);
		            textLayer.addMarker(tm2);
		            imageMarkers[hasIndex].tm = tm2;

		            if (obj.seeked == true) {
		                if(allowImageMarker!= null && allowImageMarker.im != null){
		                    var group_tem = map.getFMGroup(allowImageMarker.groupID);
		                    var imageLayer_tem = group_tem.getOrCreateLayer('imageMarker');
		                    imageLayer_tem.removeMarker(allowImageMarker.im);
		                    allowImageMarker = null;
		                    seekedForAllowImageMarker(obj,xx,yy,groupID);
		                }
		            }
		        }else{
		            im.x = xx;
		            im.y = yy;
		            im.image = obj.hasPerm ? personOnMap : personOnMapRed;
		            /*var image = obj.hasPerm ? personOnMap : personOnMapRed;
		            // var image = obj.hasPerm ? 'img/personOnMap.png' : 'img/personOnMapRed.png';
		            if (im.image != image) {
		                im.image = image;
		            }*/
		            setLabelX(tm3,xx);
		            setLabelY(tm3,yy);

		            if (obj.seeked == true) {
		                if(map.focusGroupID != groupID){
		                    map.focusGroupID = groupID;

		                    if (!$scope.mulFloorFlag) {
		                        map.visibleGroupIDs = [groupID];
		                    }
		                }
		                map.moveToCenter({x:xx,y:yy,groupID:groupID});
		                seekedForAllowImageMarker(obj,xx,yy,groupID);
		            }
		            if(obj.status == 0){
		            	imageMarkers.splice(hasIndex,1);
		            	textLayer.removeMarker(tm3);
		            	imageLayer.removeMarker(im);
		            	return;
		                // im.image =  personOnMap_offline;
		                // im.url =  'img/personOnMap_offline.png';
		            }
		        }
		    }
		}

		function seekedForAllowImageMarker(obj,xx,yy,groupID) {
		    if(allowImageMarker == null || allowImageMarker.im == null){
		        allowImageMarker = {im:null,groupID:groupID,allowSN:obj.sn};
		        allowImageMarker.im = new fengmap.FMImageMarker({
		            id:obj.id,
		            x: xx ,//- map.mapScale/400,
		            y: yy,//,+ map.mapScale/120
		            z: 1,
		            //设置图片路径
		            url: 'img/allow_1.png',
		            // url: 'img/personOnMap.png',
		            //设置图片显示尺寸
		            size: 30,
		            height:2,
		            callback: function() {
		                // 在图片载入完成后，设置 "一直可见"
		                allowImageMarker.im.alwaysShow();
		            }
		        });
		        imageLayer.addMarker(allowImageMarker.im);
		    }
		    else{
		        allowImageMarker.im.x = xx;
		        allowImageMarker.im.y = yy ;
		    }
		}


		//添加文字标签 addTextMarker
		function addTextMarker(x,y,text,fid) {
		    var tm = new fengmap.FMTextMarker({
		        id: 'textMaker_' + fid,
		        x: x,
		        y: y + map.mapScale/190,
		        z: 2,
		        name: text,  //text
		        height: 2,
		        //填充色
		        fillcolor: "255,0,0",
		        //字体大小
		        fontsize: 14,
		        //边框色
		        strokecolor: "0,255,0",
		        callback: function() {
		            // 在载入完成后，设置 "一直可见"
		            tm.alwaysShow();
		        }
		    });
		    return tm;
		}

		function setLabelX (label, v) {
		    label.o3d_.position.x = -v - map.mapScene.sceneX_;
		}

		function setLabelY (label, v) {
		    label.o3d_.position.z = v - map.mapScene.sceneZ_;
		}

		function addImageMarkers(gid,x,y,imgUrl,size,uuid,txt,str) {
		    var group = map.getFMGroup(gid);
		    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
		    var layerr = group.getOrCreateLayer('imageMarker');
		    //图标标注对象，默认位置为该楼层中心点
		    var im = new fengmap.FMImageMarker({
		        id:'imageMaker_'+ uuid + "_" + str,
		        x:x,
		        y:y,
		        //设置图片路径
		        url: imgUrl,
		        //设置图片显示尺寸
		        size: size,
		        height: 2,
		        callback: function() {
		            // 在图片载入完成后，设置 "一直可见"
		            im.alwaysShow();
		        }
		    });

		    //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
		    var textLayerr = group.getOrCreateLayer('textMarker');
		    //添加文字标注
		    var tmm = new fengmap.FMTextMarker({
		        id: 'textMaker_'+ uuid + "_" + str,
		        x:x,
		        y: y + map.mapScale/190,
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
		            tmm.alwaysShow();
		        }
		    });
		    textLayerr.addMarker(tmm);

		    layerr.addMarker(im);
		    return im;
		}


		/*实时监控结束*/


		/*历史轨迹回放开始*/
		$scope.historyTrackPlay = {
			id: "",		//查询人的身份号
			dateTime: "",
			startTime: "",
			endTime: "",
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
		var playInterval;

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
		// getHistoryVisitorList();

		//暂停
		$scope.stop = function () {
			console.log("stop");
			$scope.isPause = false;

			clearInterval(playInterval);
			playInterval = null;
			clearInterval(setTimer);
			setTimer = null;
		};

		//播放
		$scope.play = function () {
			console.log("play");
			$scope.isPause = true;

			//再次点击开始播放
			timeSpans[0].style.width = 0;
			timeSpans[1].style.left = 0;
			timeStamp = 0;
			timeSpans[2].innerHTML = timeStamp == 0 ? startTimeString : '00:00';
			timeSpans[3].innerHTML = timeStamp == 0 ? endTimeString : '00:00';
			currentObj = $scope.personPathResult.recordList[0].points[0];
			$scope.setFloorMap($scope.personPathResult.recordList[0]);
			setPoints(currentObj);

			var m = 0;
			var n = 1;

			playInterval = setInterval(function () {
				var len = $scope.personPathResult.recordList.length;

				if (len > 1) {
					if ($scope.personPathResult.recordList[m].points && $scope.personPathResult.recordList[m].points.length > 0) {
						// console.log($scope.personPathResult.recordList[m].points[n].time);
						clearPoints($scope.personPathResult.recordList[m]);
						setPoints($scope.personPathResult.recordList[m].points[n]);
						currentObj = $scope.personPathResult.recordList[m].points[n];
						n = n + 1;
						if (n == $scope.personPathResult.recordList[m].points.length) {
							m = m + 1;
							if (m != len) {
								$scope.setFloorMap($scope.personPathResult.recordList[m]);
								if (m == len - 1) {
									$scope.personPathResult.recordList[m].points[n-1].time = endTimeStamp;
								}
							}
							else{
								clearInterval(playInterval);
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
						$timeout(function () {
							clearInterval(playInterval);
							n = 0;
						},1000);
					}
				}
			},1000);
			startToPaly();
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
		            var time = new Date(currentTime + 970);
		            transformedTime = time.getFullYear() + "-" + getZero((time.getMonth() + 1)) + "-" + getZero(time.getDate()) + " " + getZero(time.getHours()) + ":" + getZero(time.getMinutes()) + ":" + getZero(time.getSeconds());
		        }
		        

		        if (currentTimeStamp >= timeStamp) {
		            /*clearInterval(setTimer);
		            setTimer = null;*/
		            $scope.stop();
		            $scope.$apply();
		        }

		        if (currentTimeStamp > 0) {
		            setTime(currentTimeStamp / timeStamp * 500 + 'px', currentTimeStamp / timeStamp * 500 - 5 + 'px',transformedTime);
		        }

		    },30);
		}

		function getZero(num) {
		    if (parseInt(num) < 10) {
		        num = '0' + num;
		    }
		    return num;
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
			$scope.isPause = false;

		    $scope.historyTrackPlay.errorMessage = "";
		    if ($scope.historyTrackPlay.id == "") {
		        $scope.historyTrackPlay.errorMessage = "请输入姓名";
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
		    $scope.clickedSearch = true;
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
		    timeSpans[2].innerHTML = timeStamp == 0 ? startTimeString : '00:00';
		    timeSpans[3].innerHTML = timeStamp == 0 ? endTimeString : '00:00';

		    setCameraDuration();
	        serviceHttp.personHistoryMapPath(
	            $scope.historyTrackPlay.id,
	            startTimeStamp,
	            endTimeStamp,
	            function (successData) {
	                console.log(successData);
	                $scope.personPathResult.recordList = successData;
	                if ($scope.personPathResult.recordList.length == 0) {
	                	swal("警告", "未查询到数据", "error");
	                    $scope.clickedSearch = false;
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
		//清除点
		function clearPoints(list) {
			for(var i = 0; i < list.points.length; i++){
				var im = list.points[i].im;
				im.url ='img/opacity.png';
			}
		}

		//设置点
		function setPoints(point) {
		    var im = point.im;
		    im.url = 'img/redPoint.png';
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
		/*历史轨迹回放结束*/
	}]);
})();