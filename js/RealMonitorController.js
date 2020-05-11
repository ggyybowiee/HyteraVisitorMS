(function() {
	app.controller("RealMonitorCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo","$stateParams", "$interval", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams, $interval) {
		console.log("RealMonitorCtrl");
		$scope.$emit('menuSelectParam', "locationMonitoring");

		var tempTrackData = null;	//访客记录跟踪的数据
		var locationSummaryInterval;
		var railEventLogInterval;
		var map = null;
		var fmapID = serverInfo.fmapID;
		var polygonMarker = null;
		var group = null;
		var layer = null;
        var polygonMarkerLayer = null;
		var imageLayer = null;
		var textLayer = null;
		var groupControl = null;
		var mapGroupNames = [];
		var polygonTms = [];
		var imageMarkers = [];
		var allowImageMarker = null;
		var polygonRailArr = [];
		$scope.locationSummaryData = [];
		var buildingFieldNameList = []; //加载的围栏集合
		$scope.realMonitor = {
			pageNum: 1,
			numPerPage: 3,
			serverPageCount: -1,
			employeeName: "",
			name: "",
			mobileNumber: "",
			certificateId: "",
			reason: "",
			gender: "",
			errorMessage: "",
			list: null
		};
		$scope.reasonList = [{reason:"业务洽谈"},{reason:"来访参观"},{reason:"面试"},{reason:"其他"}];
		$scope.sexType = [{binded: 1,sex:"男"},{binded: 0,sex:"女"},{binded: 2,sex:"两性"}];
		$scope.isShowRealMonitorSearchPart = true;	//是否展示查询列表
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

		//追踪
		$scope.toTrack = function (item) {
			// console.log(item);
			for(var i=0,len = $scope.locationSummaryData.length;i<len;i++){
			    var obj = $scope.locationSummaryData[i];
			    if (obj.status == 0) {
			    	return;
			    }
			    if (item.id == obj.id) {
			    	var floorNo = findFengMapFloorIndexWithJoysuchFloorID(obj.floorNo);
			    	map.visibleGroupIDs = [map.groupIDs[floorNo-1]]; //切换楼层
			        obj.seeked = true;
			        addMarkers(obj);
			    }
			}
			item.isTrack = false;
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

			                if (($stateParams.rmItem) && (obj.id == $stateParams.rmItem.certificateId)){
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
		getRealMonitorList();

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

		$('#loading').modal({backdrop: 'static', keyboard: false});
		$('#loading').modal('show');

		$timeout(function () {
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
			        y: 160
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
			    groupControl.enableExpand = true;
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
			   	// $("#realMonitorFengMap").after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是错误的。</div>");
			   	// $(".realMonitorAlert").slideDown(800);
			    if ($stateParams.rmItem) {
			    	$timeout(function () {
				    	$scope.realMonitor.employeeName = $stateParams.rmItem.employeeName;
				    	$scope.realMonitor.name = $stateParams.rmItem.name;
				    	$scope.realMonitor.mobileNumber = $stateParams.rmItem.visitorMobileNumber;
				    	$scope.realMonitor.certificateId = $stateParams.rmItem.certificateId;
				    	$scope.realMonitor.gender = $stateParams.rmItem.gender + "";
				    	$scope.realMonitor.reason = $stateParams.rmItem.reason;
				    	$scope.realMonitor.pageNum = 1;
				    	$stateParams.rmItem.isTrack = true;
				    	getRealMonitorList();
				    	
				    	$timeout(function () {
				    		$scope.toTrack(tempTrackData);
				    		$stateParams.rmItem = null;
				    	},800);
			    	},1000);
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

		function readyForMap() {
			$timeout(function () {
			    $scope.getLocationSummary();
			    
			    if(locationSummaryInterval == null){
			        locationSummaryInterval = $interval($scope.getLocationSummary,2000);
			        railEventLogInterval = $interval($scope.getRailAlarmEvent,2000);
			    }
			},1000);
		}

		$scope.$on("$destroy", function(){
			console.log("destory");
		    $interval.cancel(locationSummaryInterval);
		    $interval.cancel(railEventLogInterval);
		    locationSummaryInterval = null;
		    railEventLogInterval = null;
		});

		// var num = 1;
		$scope.getLocationSummary = function () {
			/*var count = $(".realMonitorAlert").length;
			console.log(count);
			if ($(".realMonitorAlert")) {
				$(".realMonitorAlert").eq(count-1).after("<div class='realMonitorAlert alert alert-success fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>结果是" + num +"</div>");
				$(".realMonitorAlert").eq(count - 1).slideDown(800);
			}
			num ++;*/
			serviceHttp.location_summary(
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

			});
		};

		function getAllUnhandleAlarmInfo() {
		    serviceHttp.getAllUnhandleAlarmInfo(
		        function (successData) {
		            if (successData != null && successData.length > 0) {
						for (var i = 0; i < successData.length; i++) {
							var obj = successData[i];
							obj.detail = JSON.parse(obj.detail);
							var day = moment.unix(obj.time / 1000);
							obj.eventTimeShow = moment(day).format('YYYY-MM-DD HH:mm:ss');

							if (obj.type == 'overBoundaryAlarm') {
								if (obj.detail.railType == 1) {
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了【越界报警】,进入了【' + obj.detail.railName + '】';
								}
								if (obj.detail.railType == 2) {
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了【越界报警】,离开了【' + obj.detail.railName + '】';
								}
							} else if (obj.type == 'stayAlarm') {
								obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】在【' + obj.detail.railName + '】发生了【滞留报警】';
							}

							if ($(".realMonitorAlert").length > 0) {
								var count = $(".realMonitorAlert").length;
								$(".realMonitorAlert").eq(count-1).after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>" + obj.eventDesc +"</div>");
								$(".realMonitorAlert").eq(count - 1).slideDown(800);
							}else{
								$("#realMonitorFengMap").after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>" + obj.eventDesc + "</div>");
								$(".realMonitorAlert").slideDown(800);
							}
						}
		                $scope.$apply();
		            }
		        },
		        function (errorData) {
		            console.log(errorData);
		        }
		    );
		}
		// getAllUnhandleAlarmInfo();

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
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了【越界报警】,进入了【' + obj.detail.railName + '】';
								}
								if (obj.detail.railType == 2) {
									obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】发生了【越界报警】,离开了【' + obj.detail.railName + '】';
								}
							} else if (obj.type == 'stayAlarm') {
								obj.eventDesc = obj.eventTimeShow + ',【' + obj.name + '】在【' + obj.detail.railName + '】发生了【滞留报警】';
							}

							if ($(".realMonitorAlert").length > 0) {
								var count = $(".realMonitorAlert").length;
								$(".realMonitorAlert").eq(count-1).after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>" + obj.eventDesc +"</div>");
								$(".realMonitorAlert").eq(count - 1).slideDown(800);
							}else{
								$("#realMonitorFengMap").after("<div class='realMonitorAlert alert alert-danger fade in'><a href='#'' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>" + obj.eventDesc + "</div>");
								$(".realMonitorAlert").slideDown(800);
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

		var personOnMap = new Image();  //正常图片
		personOnMap.src = 'img/personOnMap.png';

		var personOnMapRed = new Image();  //报警图片
		personOnMapRed.src = 'img/personOnMapRed.png';

		var personOnMap_offline = new Image();  //离线图片
		personOnMap_offline.src = 'img/personOnMap_offline.png';
		
		//添加图片标注
		function addMarkers(obj) {
			if(obj.status == 0){
				return;
			}
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

	}]);
})();