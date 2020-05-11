(function() {
	app.controller("RailConfigController-AddCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", "$stateParams", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams) {
		console.log("RailConfigController-AddCtrl");
        $scope.$emit('menuSelectParam', "railConfig");
        console.log($stateParams.railConfigItem);
        var isEdit = $stateParams.railConfigItem == null ? false : true;

        if(isEdit){
            $scope.title = "编辑区域";
        }
        else{
            $scope.title = "新建区域";
        }

        $scope.errorMessage = "";
        var drawState = false; //画的状态
        var isDrawFinished = false; //是否画完
        var coord;  //存放点击坐标
        var coordConverted;  //存放转换过的点击坐标
        var linePoints = [];  //存放两点坐标
        var naviLines = []; //当前的路线

        if(isEdit){
            $scope.field = $stateParams.railConfigItem;
            $scope.field.overBoundaryAlarm = Boolean($scope.field.overBoundaryAlarm);
            $scope.field.stopAlarm = Boolean($scope.field.stopAlarm);
            $scope.timePeriods = [];
          
            var tempArr = JSON.parse($scope.field.activePeriod);

            if (tempArr != null && tempArr.length > 0) {
                $scope.timePeriods = []; 
                for(var i = 0;i<tempArr.length;i++){
                    var obj = tempArr[i];

                    var timesArr = obj.times.split("-");
                    var weekArr = obj.weekdays.split(",");

                    var temp = {};

                    temp.begin = timesArr[0];
                    temp.end = timesArr[1];
                    temp.week = [{"name":"星期一","index":1,"selected":false},{"name":"星期二","index":2,"selected":false},{"name":"星期三","index":3,"selected":false},{"name":"星期四","index":4,"selected":false},{"name":"星期五","index":5,"selected":false},{"name":"星期六","index":6,"selected":false},{"name":"星期日","index":0,"selected":false}];

                    $scope.timePeriods.push(temp);

                    for(var k = 0;k < weekArr.length;k++){
                        for(var j = 0;j<$scope.timePeriods[i].week.length;j++){
                            var subObj = $scope.timePeriods[i].week[j];
                            if (weekArr[k] == subObj.index) {
                                subObj.selected = true;
                            }
                        }
                    }
                }  
            }
            // console.log($scope.timePeriods);
        }
        else{
            $scope.field = {
                railName:'',
                overBoundaryAlarm: false, // 越界报警 checkbox
                stopAlarm: false,  // 滞留报警 checkbox
                stopLimitSeconds: 0
            };
            $scope.timePeriods = [];         
        }
        $scope.points = []; //画出的围栏点集合
        $scope.pointsConverted = []; //转换了坐标的点集合
        $scope.chooseCameraList = [];

        var now = new Date();
        var str = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

        // checkbox 是否选中
        $scope.cameraChanged = function (item) {
            item.selected = !item.selected;
        };

        //添加时间段
        $scope.addTimePeriod = function (index) {
            var newTimePeroid = {
                begin:"",
                end:"",
                week:[
                    {
                        name:'星期一',
                        index:1,
                        selected:false
                    },
                    {
                        name:'星期二',
                        index:2,
                        selected:false
                    },
                    {
                        name:'星期三',
                        index:3,
                        selected:false
                    },
                    {
                        name:'星期四',
                        index:4,
                        selected:false
                    },
                    {
                        name:'星期五',
                        index:5,
                        selected:false
                    },
                    {
                        name:'星期六',
                        index:6,
                        selected:false
                    },
                    {
                        name:'星期日',
                        index:0,
                        selected:false
                    }
                ]
            };  
            $scope.timePeriods.push(newTimePeroid);
            // console.log($scope.timePeriods);
            
            $timeout(function () {
               for(var ii=0;ii<$scope.timePeriods.length;ii++){

                    $('#startTime' + ii).datetimepicker({
                      format:'hh:ii',
                      startDate: str + " 0:00",
                      endDate: str + " 23:59",
                      weekStart: 1,
                      autoclose: 1,
                      startView: 1,
                      minView: 0,
                      maxView: 1,
                      forceParse: 0,
                      language: 'zh-CN'
                    });

                    $('#endTime' + ii).datetimepicker({
                      format:'hh:ii',
                      startDate: str + " 0:00",
                      endDate: str + " 23:59",
                      weekStart: 1,
                      autoclose: 1,
                      startView: 1,
                      minView: 0,
                      maxView: 1,
                      forceParse: 0,
                      language: 'zh-CN'
                    });
               }
            },300);
        };

        //删除时间段
        $scope.deleteTimePeriod = function (index) {
            $scope.timePeriods.splice(index,1);
        };

        // 加载待编辑数据
        function loadEditData(){
            serviceHttp.loadFieldData(
                $scope.field.railId,
                function (successData) {
                    // console.log(successData);

                    $scope.field = successData;
                    $scope.field.overBoundaryAlarm = Boolean($scope.field.overBoundaryAlarm);
                    $scope.field.stopAlarm = Boolean($scope.field.stopAlarm);

                    for(var k=0;k<successData.railPoints.length;k++){
                        var temp = {};
                        var obj = successData.railPoints[k];
                        temp.x = convertFmapX(obj.x);
                        temp.y = convertFmapY(obj.y);
                        temp.z = 56;

                        $scope.points.push(temp);
                        $scope.pointsConverted.push({
                            x:obj.x,
                            y:obj.y,
                            z:56
                        });
                    }
                    // console.log($scope.points);

                    var floorNo = findFengMapFloorIndexWithJoysuchFloorID(successData.floorNo);

                    map.visibleGroupIDs = [floorNo];
                    map.focusGroupID = floorNo;

                    if ($scope.points.length >= 3) {
                        group = map.getFMGroup(floorNo);
                        polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');
                        existPolygonMarkerLayer = group.getOrCreateLayer('polygonMarker');
                        textLayer = group.getOrCreateLayer('textMarker');
                        // createPolygonMaker($scope.points);
                        createExistPolygonMaker($scope.points,$scope.field.railName);

                        isDrawFinished = true;
                        drawState = false;
                    }
                },
                function (errorData) {
                    $scope.errorMessage = errorData;
                }
            );
        }


        //开始画
        $scope.startDraw = function () {
            // console.log('startDraw');
            $scope.points = [];
            $scope.pointsConverted = [];
            linePoints = [];
            naviLines = []; 
            drawState = true;
            isDrawFinished = false;

            if (polygonMarker != null) {
                polygonMarkerLayer.remove(polygonMarker);
            }

            if (existPolygonMarker != null) {
                existPolygonMarkerLayer.remove(existPolygonMarker);
            }
            if (textMarker != null) {
                textLayer.removeMarker(textMarker);
            }

            if (isEdit) {
                if (existPolygonMarker != null) {
                    existPolygonMarkerLayer.remove(existPolygonMarker);
                }
                if (textMarker != null) {
                    textLayer.removeMarker(textMarker);
                }
            }

            map.clearLineMark();
            removeImgMarkers();
        };

        //结束画
        $scope.endDraw = function () {
            // console.log('endDraw');
            if($scope.points.length <= 2){
                $scope.errorMessage = "画的点至少为3个";
                return;
            }
            map.clearLineMark();
            createPolygonMaker($scope.points);
            isDrawFinished = true;
            drawState = false;  
        };


        var state = true;
        $scope.$on('$destroy', function() {
            state = false;
            // map.dispose();
        });

        //定义全局map变量
        var map;
        var fmapID = serverInfo.fmapID;
        var polygonMarker;
        var existPolygonMarker;
        var group = null;
        var polygonMarkerLayer = null;
        var existPolygonMarkerLayer = null;
        var groupControl;
        var textLayer;
        var textMarker;
        var mapGroupNames = [];
        var mapServerURL = null;   

        $('#loading').modal({backdrop: 'static', keyboard: false});
        $('#loading').modal('show');

        $timeout(function () {
            if (state) {
                map = new fengmap.FMMap({
                    //渲染dom
                    container: document.getElementById('addFieldfengMap'),
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
                    position: fengmap.controlPositon.RIGHT_BOTTOM,
                    //默认显示楼层的个数
                    showBtnCount: 4,
                    //位置x,y的偏移量
                    offset: {
                        x: 20,
                        y: 10
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

                    if(isEdit){
                        loadEditData();
                    }
                });

                //点击事件
                map.on('mapClickNode',function(event) {
                    if (!drawState) {
                        return;
                    }
                    if (event.nodeType == fengmap.FMNodeType.NONE) {
                        return;
                    }
                    if (event.nodeType == fengmap.FMNodeType.LABEL) {
                        return;
                    }
                    // console.log("点击坐标：x:"+convertX(event.eventInfo.coord.x)+" ---- y:"+convertY(event.eventInfo.coord.y));
                    //获取坐标信息
                    var eventInfo = event.eventInfo.coord; 
                    //获取焦点层
                    var currentGid = map.focusGroupID; 
                    if (eventInfo) { //pc端
                        coord = {
                            x: event.eventInfo.coord.x,
                            y: event.eventInfo.coord.y,
                            z: map.getFMGroup(currentGid).groupHeight + map.layerLocalHeight
                        };
                        coordConverted = {
                            x: convertX(event.eventInfo.coord.x),
                            y: convertY(event.eventInfo.coord.y),
                            z: map.getFMGroup(currentGid).groupHeight + map.layerLocalHeight
                        };

                    } else { //移动端
                        coord = {
                            x: event.mapCoord.x,
                            y: event.mapCoord.y,
                            z: map.getFMGroup(currentGid).groupHeight + map.layerLocalHeight
                        };
                        coordConverted = {
                            x: convertX(event.mapCoord.x),
                            y: convertY(event.mapCoord.y),
                            z: map.getFMGroup(currentGid).groupHeight + map.layerLocalHeight
                        };
                    }
                    $scope.points.push(coord);
                    $scope.pointsConverted.push(coordConverted);
                    //添加Marker
                    addMarker(currentGid, coord); 
                    if ($scope.points.length > 1) {
                        linePoints = [];
                        for(var i=$scope.points.length-1;i>0;--i){
                            linePoints.push($scope.points[i-1]);
                            linePoints.push($scope.points[i]);
                            break;
                        }

                        //添加导航线线坐标点
                        var naviResults = [{
                            groupId: map.focusGroupID,
                            points: linePoints
                        }];

                        //配置线型、线宽、透明度等
                        var lineStyle = {
                            //设置线的宽度
                            lineWidth: 4,
                            //设置线的透明度
                            alpha: 0.8,

                            // offsetHeight 默认的高度为 1, (离楼板1米的高度)
                            offsetHeight: 1,
                            
                            //设置线的类型为导航线
                            lineType: fengmap.FMLineType.FMARROW,
                            //设置线动画,false为动画
                            noAnimate: true,
                        };
                        //绘制线
                        drawLines(naviResults, lineStyle);
                    }

                     
                });
            }
        },500);

        // 创建电子围栏
        function createPolygonMaker(coords) {
            polygonMarker = new fengmap.FMPolygonMarker({
                color:'#3CF9DF',
                //设置透明度
                alpha: 0.5,
                //设置边框线的宽度
                lineWidth: 0,
                //设置高度
                height: 3,
                //设置多边形坐标点
                points: coords
            });

            polygonMarkerLayer.addMarker(polygonMarker);
        }

        // 创建存在的电子围栏
        function createExistPolygonMaker(coords,txt) {
            existPolygonMarker = new fengmap.FMPolygonMarker({
                //设置颜色
                color:'#aaa',
                //设置透明度
                alpha: 0.5,
                //设置边框线的宽度
                lineWidth: 0,
                //设置高度
                height: 6,
                //设置多边形坐标点
                points: coords
            });

            existPolygonMarkerLayer.addMarker(existPolygonMarker);
            //添加文字标注
            textMarker = new fengmap.FMTextMarker({
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
                    textMarker.alwaysShow();
                }
            });
            textLayer.addMarker(textMarker);
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

        // 把定位结果楼层id转换成fmap楼层
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
                swal("警告", "楼层错误", "error");
            }

            for (var i = 0; i < mapGroupNames.length; i++) {

                if (floorName == mapGroupNames[i]) {
                    fmapGroupID = map.groupIDs[i];
                    break;
                }
            }

            return fmapGroupID;
        }
        

        function convertFengMapGroupIDToJoysuchFloorID(fmapGroupID) {
            // console.log(fmapGroupID);
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
            
        //在点击的位置添加图片标注
        function addMarker(gid, coord) {
            var group = map.getFMGroup(gid);

            //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
            var layer = group.getOrCreateLayer('imageMarker');

            var im = new fengmap.FMImageMarker({
                x: coord.x,
                y: coord.y,
                url: 'img/bluePoint.png',
                size: 20,
                callback: function() {
                    im.alwaysShow();
                }
            });
            layer.addMarker(im);
        }

        //删除Marker
        function removeImgMarkers() {
            //获取多楼层Marker
            map.callAllLayersByAlias('imageMarker',function(layer) {
                layer.removeAll();
            });
        }

        // 保存
        $scope.savePress = function () {
            $scope.errorMessage = "";

            if($scope.field.railName == ""){
                $scope.errorMessage = "请输入区域名称";
                return;
            }

            if($scope.field.railName.length > 32){
                $scope.errorMessage = "区域名称长度不能大于32";
                return;
            }

            if ($scope.field.stopAlarm && $scope.field.stopLimitSeconds < 0) {
                $scope.errorMessage = "滞留时间不能小于0";
                return;
            }

            if ($scope.timePeriods.length == 0) {
                $scope.errorMessage = "请添加生效时间段";
                return;
            }
            var activePeriodArr = [];
            for(var i = 0; i < $scope.timePeriods.length; i++){
                var obj = $scope.timePeriods[i];

                if (obj.begin == "" || obj.end == "") {
                    $scope.errorMessage = "请输入生效时间段的开始时间和结束时间";
                    return;
                }

                var temp = {};
                var tempArr = [];
                temp.times = obj.begin + "-" + obj.end;

                for(var j = 0; j < obj.week.length; j++){
                    var subObj = obj.week[j];
                    if(subObj.selected){
                        tempArr.push(subObj.index);
                    }
                }

                if (tempArr.length == 0) {
                    $scope.errorMessage = "请勾选生效时间段星期";
                    return;
                }

                temp.weekdays = tempArr.join(",");
                activePeriodArr.push(temp);
            }

            // console.log(activePeriodArr);

            if($scope.pointsConverted.length <= 2){
                $scope.errorMessage = "请开始画围栏,并且画的点至少为3个";
                return;
            }
            if(!isDrawFinished){
                $scope.errorMessage = "请结束画围栏";
                return;
            }

            // console.log($scope.field);

            if(isEdit){
                serviceHttp.fieldEdit(
                    $scope.field.railId,
                    $scope.field.railName,
                    convertFengMapGroupIDToJoysuchFloorID(map.focusGroupID),
                    JSON.stringify(activePeriodArr),
                    JSON.stringify($scope.pointsConverted),
                    Number($scope.field.overBoundaryAlarm),
                    Number($scope.field.stopAlarm),
                    $scope.field.stopLimitSeconds,
                    function (successData) {
                        swal("编辑成功", "", "success");
                        $timeout(function () {
                            $scope.canclePress();
                        },800);
                    },
                    function (errorData) {
                        swal("操作失败", errorData, "error");
                    }
                );
            }
            else{

                serviceHttp.fieldAdd(
                    $scope.field.railName,
                    convertFengMapGroupIDToJoysuchFloorID(map.focusGroupID),
                    JSON.stringify(activePeriodArr),
                    JSON.stringify($scope.pointsConverted),
                    Number($scope.field.overBoundaryAlarm),
                    Number($scope.field.stopAlarm),
                    $scope.field.stopLimitSeconds,
                    function (successData) {
                        swal("操作成功", "", "success");
                        $timeout(function () {
                            $scope.canclePress();
                        },800);
                    },
                    function (errorData) {
                        swal("操作失败", errorData, "error");
                    }
                );
            }

        };


        // 取消
        $scope.canclePress = function () {
            window.history.go(-1);
        };

        $scope.navBackPress = function () {
            window.history.go(-1);
        };
	}]);
})();