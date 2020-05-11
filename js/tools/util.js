function showNotificationErrors($state, result) {
	// spring-security login
	if (typeof result == 'string') {
		if (result.indexOf('login_error') >= 0) {
			// if(window.location.href.indexOf('aindex') >= 0){
			// 	window.location.href = "/alogin";
			// }else{
			// 	window.location.href = "/login";
			// }
			window.location.href = "/login.html";
		}
	} else {
		if (result.errorMsg) {
			// session login
			if (result.errorMsg.length > 0) {
				var error_msg = '';
				for (var i = 0; i < result.errorMsg.length; i++) {
					error_msg += '\n';
					error_msg += result.errorMsg[i];
				}
				alert(error_msg);
			}
		} else {
			console.log(result);
		}
	}
}
function getJsObject(data) {
	var result = data;
	if (typeof data == 'string') {
		// result = eval('(' + data + ')');
		result = JSON.parse(data);
	}
	return result;
}
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
/**
 * 转换日期对象为日期字符串
 *
 * @param date
 *                日期对象
 * @param isFull
 *                是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如
 *                "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
	var pattern = "";
	if (isFull == true || isFull == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	} else {
		pattern = "yyyy-MM-dd";
	}
	return getFormatDate(date, pattern);
}
/**
 * 转换当前日期对象为日期字符串
 *
 * @param date
 *                日期对象
 * @param isFull
 *                是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如
 *                "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatNowDate(isFull) {
	return getSmpFormatDate(new Date(), isFull);
}
/**
 * 转换long值为日期字符串
 *
 * @param l
 *                long值
 * @param isFull
 *                是否为完整的日期数据, 为true时, 格式如"2000-03-05 01:05:04" 为false时, 格式如
 *                "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatDateByLong(l, isFull) {
	return getSmpFormatDate(new Date(l), isFull);
}
/**
 * 转换long值为日期字符串
 *
 * @param l
 *                long值
 * @param pattern
 *                格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */

function getFormatDateByLong(l, pattern) {
	return getFormatDate(new Date(l), pattern);
}
/**
 * 转换日期对象为日期字符串
 *
 * @param l
 *                long值
 * @param pattern
 *                格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern) {
	if (date == undefined) {
		date = new Date();
	}
	if (pattern == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return date.format(pattern);
}

// 弹出成功提示框
function showSuccessDialog(message) {
	swal("提示", message, "success");
}

// 弹出error提示框
function showErrorDialog(message) {
	swal("警告", message, "error");
}

// 获取URL上的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function getWXUserSourceNameWithCode(code) {
	var name = "";

	switch (code) {
		case 0:
			name = "其他合计";
			break;
		case 1:
			name = "公众号搜索";
			break;
		case 17:
			name = "名片分享";
			break;
		case 30:
			name = "扫描二维码";
			break;
		case 43:
			name = "图文页右上角菜单";
			break;
		case 51:
			name = "支付后关注";
			break;
		case 57:
			name = "图文页内公众号名称 ";
			break;
		case 75:
			name = "公众号文章广告 ";
			break;
		case 78:
			name = "朋友圈广告 ";
			break;
	}

	return name;

}

function checkUploadFile(id, fileMaxSize, filetypesParam) {
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var target = document.getElementById(id);
	var fileSize = 0;
	// var filetypes
	// =[".jpg",".png",".rar",".txt",".zip",".doc",".ppt",".xls",".pdf",".docx",".xlsx"];
	// //默认格式
	var filetypes = [".bmp", ".jpg", ".png",".jpeg",".gif",".mp3",".wma",".wav",".mp4",".pdf",".ppt",".word",".excel",".xml"]; // 默认格式
	if (filetypesParam != null && filetypesParam != '' && filetypesParam.length > 0) {
		filetypes = filetypesParam;
	}
	var filepath = target.value;
	var filemaxsize = 1024 * 10;// 默认10M
	if (fileMaxSize != null && fileMaxSize != '') {
		filemaxsize = fileMaxSize;
	}
	if (filepath) {
		var isnext = false;
		var fileend = filepath.substring(filepath.indexOf("."));
		if (filetypes && filetypes.length > 0) {
			for (var i = 0; i < filetypes.length; i++) {
				if (filetypes[i] == fileend) {
					isnext = true;
					break;
				}
			}
		}
		if (!isnext) {
			alert("不接受此文件类型！");
			target.value = "";
			return false;
		}
	} else {
		return false;
	}
	if (isIE && !target.files) {
		var filePath = target.value;
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		if (!fileSystem.FileExists(filePath)) {
			alert("附件不存在，请重新输入！");
			return false;
		}
		var file = fileSystem.GetFile(filePath);
		fileSize = file.Size;
	} else {
		fileSize = target.files[0].size;
	}

	var size = fileSize / 1024;
	if (size > filemaxsize) {
		alert("附件大小不能大于" + filemaxsize / 1024 + "M！");
		target.value = "";
		return false;
	}
	if (size <= 0) {
		alert("附件大小不能为0M！");
		target.value = "";
		return false;
	}
	return true;
}

function convertFmapGroupIDToFloorNo(groupID) {
	var floorNo = "";

	if(groupID == 1){
		floorNo = "Floor1";
	}
    else if(groupID == 2){
        floorNo = "Floor2";
    }
    else if(groupID == 3){
        floorNo = "Floor3";
    }
    else if(groupID == 4){
        floorNo = "Floor4";
    }
    else if(groupID == 5){
        floorNo = "Floor5";
    }
    else if(groupID == 6){
        floorNo = "Floor6";
    }

	return floorNo;
}


//地图自动添加围栏 --相当于编辑围栏
//定义全局map变量
var map;
var textMarker;
var textLayer = null;
var polygonMarker;
var polygonMarkerLayer = null;
var mapGroupNames = [];
var group;
var groupControl;

function initMap(item,serverInfo) {
    if (map != null) {
        drawPolygon(item);
    }else{
        map = new fengmap.FMMap({
            //渲染dom
            container: document.getElementById('railFengMap'),
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
	    map.openMapById(serverInfo.fmapID, function(error){
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
	        // console.log("------- 拥有楼层:");
	        // console.log(map.groupIDs);
	        mapGroupNames = [];

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
	        
	        drawPolygon(item);
	        
	    });

	    map.on('mapClickNode',function(event) {

	    });
    }
}

function drawPolygon(item) {
	if (polygonMarker != null) {
	    polygonMarkerLayer.remove(polygonMarker);
	    polygonMarkerLayer = null;
	}
	if (textMarker != null) {
	    textLayer.removeMarker(textMarker);
	    textLayer = null;
	}

    //添加标注的当前楼层，方便移除的时候查找
    group = map.getFMGroup(findFengMapFloorIndexWithJoysuchFloorID(item.floorNo));

    //返回当前层中第一个polygonMarker,如果没有，则自动创建
    polygonMarkerLayer = group.getOrCreateLayer('polygonMarker');

    //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
    textLayer = group.getOrCreateLayer('textMarker');

    var points = [];
    for(var k=0;k<item.railPoints.length;k++){
        var temp = {};
        var obj = item.railPoints[k];
        temp.x = convertFmapX(obj.x);
        temp.y = convertFmapY(obj.y);
        temp.z = 56;
        
        points.push(temp);
    }
    // console.log(points);

    var floorNo = findFengMapFloorIndexWithJoysuchFloorID(item.floorNo);

    map.visibleGroupIDs = [floorNo];
    map.focusGroupID = floorNo;

    createPolygonMaker(points,item.railName); 
}        

// 创建电子围栏
function createPolygonMaker(coords,railName) {
    polygonMarker = new fengmap.FMPolygonMarker({
        //设置透明度
        alpha: 0.5,
        //设置边框线的宽度
        lineWidth: 0,
        //设置高度
        height: 6,
        //设置多边形坐标点
        points: coords
    });

    polygonMarkerLayer.addMarker(polygonMarker);

    //添加文字标注
    textMarker = new fengmap.FMTextMarker({
        x: coords[0].x,
        y: coords[0].y,
        z: 2,
        name: railName,
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


function getCookie(c_name)
{
	var c_start,c_end;
	if (document.cookie.length > 0){
		c_start=document.cookie.indexOf(c_name + "=");

		if (c_start!=-1){
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);

			if (c_end==-1) {
				c_end=document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

function setCookie(c_name,value,time){
	// new Date().toLocaleString()
	var exdateOld = new Date().getTime();
	var exdate = new Date(exdateOld + time); // getDate() 2*60*60 8*60*60*1000
	document.cookie = c_name+ "=" + escape(value) + ";expires=" + exdate.toGMTString();
}
