(function() {
	app.controller("VisitorRegistrationCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", "$stateParams", function($scope, $state, serviceHttp, $timeout, serverInfo, $stateParams) {
		console.log("VisitorRegistrationCtrl");
		$scope.$emit('menuSelectParam', "visitorRegistration");

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

		$scope.login = {
			id: null,
			employeeName: "",
			dept: "",
			room: "",
			extension: "",
			employeeMobilePhone: "",
			nums: 1,
			reason: "",
			personType: "",
			appointTime: "",
			stopHour: 1,
			privilegeId: "",
			errorMessage: "",
			visitorList: []
		};
		if ($stateParams.vrItem != null) {
			serviceHttp.getAppointment(
				$stateParams.vrItem.id,
			    function (successData) {
			    	console.log(successData);
			        $scope.login = successData;
			        $scope.login.errorMessage = "";
			        $scope.login.visitorList = [];
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		
		$scope.reasonList = [{reason:"业务洽谈"},{reason:"来访参观"},{reason:"面试"},{reason:"其他"}];
		$scope.sexType = [{binded: 1,sex:"男"},{binded: 0,sex:"女"},{binded: 2,sex:"两性"}];
		$scope.IDTypeList = [{"type":"二代身份证"},{"type":"驾驶证"},{"type":"护照"},{"type":"其他"}];
		$scope.visitorTypeList = [{"type":"国内客户"},{"type":"国外客户"},{"type":"政府官员"},{"type":"新闻媒体"},{"type":"认证机构"},{"type":"供应商"},{"type":"面试人员"},{"type":"其他"}];
		$scope.isListShow = true;

		//访客权限列表
		function getAllPermissionList() {
			serviceHttp.getAllPermissionList(
			    function (successData) {
			    	$scope.permissionList = successData;
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getAllPermissionList();

		//添加访客
		$scope.addVisitorPress = function () {
			var temp = {"name":"","gender":"","certificateType":"二代身份证","certificateId":"","labelMac":"","mobileNumber":"","pictureName":"","disabled": false,"scanGunt":false};
			$scope.login.visitorList.push(temp);
		};

		//删除访客
		$scope.deleteVisitorPress = function (i) {
			$scope.login.visitorList.splice(i,1);
		};

		//切换视图列表
		$scope.toggleList = function () {
			$scope.isListShow = !$scope.isListShow;
		};

		//验证手机号格式
		function isPhoneNo(phone) {
			var pattern = /^1[34578]\d{9}$/; 
			return pattern.test(phone); 
		}

		//记录手动输入开始时间  
		var startTime;
		var count = 0; 
		var idx = 0; 
		$scope.labelMacChange = function (idx,value) {
			idx = idx;
			if (value.length == 1) {
				startTime = new Date().getTime();
			}
		};

		$scope.keyDownEvent = function(idx,e) {
			if ($scope.login.visitorList[idx].scanGunt) {
				count ++;
				if (count == 1) {
					$('#labelMac'+idx).val("");
				}
			}
	        var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13){
	            //记录手动输入结束时间  
	            var endTime = new Date().getTime();  
	            if(endTime - startTime < 1000){  
	            	$scope.login.visitorList[idx].scanGunt = true;
	                count = 0; 
	            }
	        }
	    };

		//保存
		$scope.savePress = function () {
			$scope.login.errorMessage = "";

			if ($scope.login.employeeName == "" || $scope.login.employeeName.length > 32) {
				$scope.login.errorMessage = "被访人员姓名不能为空,且长度不能超过32";
				return;
			}

			if (!isPhoneNo($scope.login.employeeMobilePhone) && $scope.login.employeeMobilePhone != "") {
			    $scope.login.errorMessage = "被访人员手机号码格式不正确";
			    return;
			}

			if ($scope.login.privilegeId == "") {
				$scope.login.errorMessage = "请选择访客权限";
				return;
			}

			if ($scope.login.stopHour <= 0) {
				$scope.login.errorMessage = "停留时间必须为大于0的数";
				return;
			}

			if ($scope.login.reason == "") {
				$scope.login.errorMessage = "请选择来访事由";
				return;
			}

			if ( $scope.login.id != null && $scope.login.appointTime == "") {
				$scope.login.errorMessage = "请输入预约时间";
				return;
			}

			var dateReg = /^\d{4,}-(?:0?\d|1[12])-(?:[012]?\d|3[01]) (?:[01]?\d|2[0-4]):(?:[0-5]?\d|60)$/;
			if (!dateReg.test($scope.login.appointTime) && $scope.login.id != null ) {
				$scope.login.errorMessage = "预约时间格式不正确";
				return;
			}

			var now = new Date().getTime();
			var appointTimeStamp = moment($scope.login.appointTime).format('X')*1000;

			/*if (appointTimeStamp - now < 0 && $scope.login.id != null ) {
				$scope.login.errorMessage = "预约时间不能小于当前时间";
				return;
			}*/

			if ($scope.login.visitorList.length == 0 || $scope.login.visitorList.length != $scope.login.nums) {
				$scope.login.errorMessage = "来访人员信息不能为空,且必须与来访人数相对应";
				return;
			}

			var snReg = /^[a-fA-F0-9]{12}$/;
			var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			for(var i = 0; i < $scope.login.visitorList.length; i++){
				var obj = $scope.login.visitorList[i];
				if (obj.name == "" || obj.name.length > 32) {
					$scope.login.errorMessage = "来访人员 " + ( i + 1 ) + " 的姓名不能为空,且长度不能超过32";
					return;
				}
				if (obj.gender == "") {
					$scope.login.errorMessage = "请选择来访人员 " + ( i + 1 ) + " 的性别";
					return;
				}
				if (obj.certificateId == "") {
					$scope.login.errorMessage = "请输入来访人员 " + ( i + 1 ) + " 的证件号";
					return;
				}
				if (!regIdNo.test(obj.certificateId)) {
					$scope.login.errorMessage = "来访人员 " + ( i + 1 ) + " 的证件号格式填写错误";
					return;
				}
				if (!snReg.test(obj.labelMac)) {
					$scope.login.errorMessage = "来访人员 " + ( i + 1 ) + " 的访客牌号码格式不正确,且访客牌号码不能为空";
					return;
				}
				if (!isPhoneNo(obj.mobileNumber) && obj.mobileNumber != "") {
				    $scope.login.errorMessage = "来访人员 " + ( i + 1 ) + " 的手机号码格式不正确";
				    return;
				}
				if (obj.pictureName == "") {
					$scope.login.errorMessage = "请上传来访人员 " + ( i + 1 ) + " 的照片";
					return;
				}
			}

			var details = {
			    employeeName:$scope.login.employeeName,
			    dept:$scope.login.dept,
			    room:$scope.login.room,
			    extension:$scope.login.extension,
			    employeeMobilePhone:$scope.login.employeeMobilePhone,
			    nums: Number($scope.login.nums),
			    reason: $scope.login.reason,
			    personType: $scope.login.personType,
			    appointTime: $scope.login.appointTime,
			    stopHour: $scope.login.stopHour,
			    privilegeId: $scope.login.privilegeId
			};
			var visitors = $scope.login.visitorList;

			var visitorRegistObj = {
				details: details,
				visitors: visitors,
				appointId: $scope.login.id
			};

			console.log(visitorRegistObj);
			
			serviceHttp.visitEventAdd(
			    visitorRegistObj,
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
		};
		//取消
		$scope.canclePress = function () {
			console.log("cancle");
			window.history.go(-1);
		};

		var tempScreenInfo = null;
		var screenShotImgUrl = "";

		//拍摄身份证
		$scope.scanIDCardPress = function (item, index) {
			// console.log("scanIDCardPress" + index);
			if (item.certificateType != "二代身份证") {
				swal("警告", "证件类型请选择为【二代身份证】", "error");
				return;
			}

			var obj = byId("RoutonReader"); //Routon Card Reader

			//设置端口号，1表示串口1，2表示串口2，依此类推；1001表示USB。0表示自动选择
			var port = obj.setPortNum(1001); //changed args
			if (port == 0) {
				swal("警告", "端口初始化失败！请确认设备是否安装成功", "error");
				return;
			}
			isInit = true;


			//使用重复读卡功能
			obj.Flag = 0;
			//读卡
			var ret = obj.IDCardOn(); //0-换了身份证  1-当前身份证仍在
			if (ret == 1) //0-换了身份证  1-当前身份证仍在
			{
				swal("警告", "当前身份证已读", "error");
				return;
			}

			//if(ret == 0)  //0-换了身份证  1-当前身份证仍在
			//{
			var rst = obj.ReadCard();
			//获取各项信息
			if (rst == 0x90) {

				item.name = obj.NameL();
				if (obj.SexL() == "女") {
					item.gender = "0";
				}
				else if(obj.SexL() == "男"){
					item.gender = "1";
				}
				item.certificateId = obj.CardNo();
				item.disabled = true;

				$(".imgPic").css("background","#fff");
				$("#IDCard" + index)[0].src = 'data:image/jpeg;base64,' + obj.GetImage();
				/*form1.base64Image.value = obj.GetImage(); //获得身份证照片base64编码
				form1.base64Image.value = obj.GetCardImage(); //获得Card.jpg的base64编码

				document.all['PhotoDisplay'].src = 'data:image/jpeg;base64,' + obj.GetImage();*/
			} else {
				item.name = "";
				item.gender = "";
				item.certificateId = "";
				$("#IDCard" + index)[0].src = "";
				/*if(rst==0x02)
					alert("请重新将卡片放到读卡器上！");
					if(rst==0x41)
					alert("读取数据失败！");	*/
			}
			//}
			obj.closePort();
		};

		function byId(id) {
			return document.getElementById(id);
		}

		//拍摄照片
		$scope.scanImgPress = function (item, index) {
			console.log("scanImgPress" + index);
			console.log(item);
			$('#scanIDCard').modal({backdrop: 'static', keyboard: false});
			$("#scanIDCard").modal('show');
			tempScreenInfo = item;
			tempScreenInfo.index = index;
		};

		var cobj = document.getElementById('myCanvas').getContext('2d');
		var vobj = document.getElementById('myVideo');

		if (!serverInfo.isInsertCameraDevice) {
			getUserMedia({
			    video: true
			}, function(stream) {
			    vobj.src = stream;
			    vobj.play();
			    serverInfo.isInsertCameraDevice = true;
			    serverInfo.cdSrc = stream;
			}, function() {});
		}
		else{
			vobj.src = serverInfo.cdSrc;
			vobj.play();
		}

		//截图
		$scope.screenShotPress = function () {
			cobj.drawImage(vobj, 0, 0, 375, 281);
			screenShotImgUrl = cobj.canvas.toDataURL("image/png");
			console.log(screenShotImgUrl);
		};

		//保存
		$scope.saveScreenPress = function () {
			$("#scanImg" + tempScreenInfo.index)[0].src = screenShotImgUrl;

			//base64 转 blob  
			var $Blob= getBlobBydataURI(screenShotImgUrl,"image/png");
			var formData = new FormData();
			formData.append("files", $Blob, tempScreenInfo.index + ".png");

			var request = new XMLHttpRequest(); 
			//上传连接地址 
			request.open("POST", "/visit/picture/upload");
			request.onreadystatechange = function() {  
				if (request.readyState == 4){          
					if (request.status == 200) {
						var jsonObj = JSON.parse(request.responseText);
						console.log(jsonObj);
						$scope.login.visitorList[tempScreenInfo.index].pictureName = jsonObj.data.pictureName;
						$scope.$apply();
					}
					else {            
						console.log("上传失败,检查上传地址是否正确");          
					}   
				}      
			};      
			request.send(formData);

			$("#scanIDCard").modal('hide');
		};

		/** 
		 * 根据base64 内容 取得 bolb
		 * @param dataURI 
		 * @returns Blob 
		 */
		function getBlobBydataURI(dataURI, type) {      
			var binary = atob(dataURI.split(',')[1]);      
			var array = [];      
			for (var i = 0; i < binary.length; i++) {        
				array.push(binary.charCodeAt(i));      
			}      
			return new Blob([new Uint8Array(array)], {
				type: type
			});    
		}
		function getUserMedia(obj, success, error) {
		    if (navigator.getUserMedia) {
		        getUserMedia = function(obj, success, error) {
		            navigator.getUserMedia(obj, function(stream) {
		                success(stream);
		            }, error);
		        };
		    } else if (navigator.webkitGetUserMedia) {
		        getUserMedia = function(obj, success, error) {
		            navigator.webkitGetUserMedia(obj, function(stream) {
		                var _URL = window.URL || window.webkitURL;
		                success(_URL.createObjectURL(stream));
		            }, error);
		        };
		    } else if (navigator.mozGetUserMedia) {
		        getUserMedia = function(obj, success, error) {
		            navigator.mozGetUserMedia(obj, function(stream) {
		                success(window.URL.createObjectURL(stream));
		            }, error);
		        };
		    } else {
		        return false;
		    }
		    return getUserMedia(obj, success, error);
		}

		/*登入结束*/

		/*登出开始*/
		$scope.logout = {
			keyword: "",
			errorMessage: "",
			handleMsg: ""
		};

		$scope.logoutInfo = null;
		var certificateId = "";
		//按钮解绑
		$scope.unbindSN = function () {
			certificateId = "";
			/*$('#logoutInfo').modal({backdrop: 'static', keyboard: false});
			$("#logoutInfo").modal("show");*/
			$scope.logout.errorMessage = "";
			var snReg = /^[a-fA-F0-9]{12}$/;
			var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (!snReg.test($scope.logout.keyword) && !regIdNo.test($scope.logout.keyword)) {
				$scope.logout.errorMessage = "标签号/证件号格式不正确,且不能为空";
				return;
			}

			serviceHttp.searchLabelAlarmNum(
			    $scope.logout.keyword,
			    function (successData) {
			        console.log(successData);
			        $scope.logoutInfo = successData;
			        $scope.logout.handleMsg = "";
			        $('#logoutInfo').modal({backdrop: 'static', keyboard: false});
			        $("#logoutInfo").modal("show");
			        $("#logoutVisitorImg")[0].src = successData.pictureUrl;

			        $scope.$apply();
			    },
			    function (errorData) {
			        swal("操作失败", errorData, "error");
			    }
			);

			/*if (confirm("确认解绑标签【" + $scope.logout.keyword + "】？")) {
				serviceHttp.searchLabelAlarmNum(
				    $scope.logout.keyword,
				    function (successData) {
				        console.log(successData);
				        if (successData.times > 0) {
				        	swal({ 
				        	    title: "警告", 
				        	    text: "该访客触发了<span style='color:red;font-size: 18px;'> " + successData.times + " </span>次报警,是否处理？", 
				        	    type: "input",
				        	    html:true, 
				        	    showCancelButton: true,
				        	    closeOnConfirm: false, 
				        	    confirmButtonText: "处理",
				        	    cancelButtonText:"取消"
				        	}, function() {
				        	    serviceHttp.blackListAdd(
				        	        successData.certificateId,
				        	        successData.eventId,
				        	        function (successData) {
				        	            swal("加入黑名单成功", " ", "success");
				        	        },
				        	        function (errorData) {
				        	            swal("加入黑名单失败", errorData, "error");
				        	        }
				        	    );
				        	});
				        }
				    },
				    function (errorData) {
				        swal("加入黑名单失败", errorData, "error");
				    }
				);
                serviceHttp.visitUnbind(
                    $scope.logout.keyword,
                    function (successData) {
                    	console.log(successData);
                    	if (successData.times >= successData.limit) {
                    		swal({ 
                    		    title: "解绑成功", 
                    		    text: "该访客触发了<span style='color:red;font-size: 18px;'> " + successData.times + " </span>次报警,是否加入黑名单？", 
                    		    type: "success",
                    		    html:true, 
                    		    showCancelButton: true,
                    		    closeOnConfirm: false, 
                    		    confirmButtonText: "加入黑名单",
                    		    cancelButtonText:"取消"
                    		}, function() {
                    		    serviceHttp.blackListAdd(
                    		        successData.certificateId,
                    		        successData.eventId,
                    		        function (successData) {
                    		            swal("加入黑名单成功", " ", "success");
                    		        },
                    		        function (errorData) {
                    		            swal("加入黑名单失败", errorData, "error");
                    		        }
                    		    );
                    		});
                    	}
                    	else{
                    		swal("操作成功", "", "success");
                    	}
                    	getVisitorRecordList();
                    },
                    function (errorData) {
                        swal("操作失败", errorData, "error");
                    }
                );
            }*/
		};

		//跳转到报警详情
		$scope.gotoAlarmView = function () {
			$("#logoutInfo").modal("hide");
			$timeout(function () {
				$state.go('alarmView');
			},300);
		};

		//处理并登出
		$scope.dealAndLogout = function () {
			if (certificateId != "") {
				serviceHttp.visitUnbind(
				    certificateId,
				    $scope.logout.handleMsg,
				    function (successData) {
				    	console.log(successData);
				    	swal("操作成功", "", "success");
				    	getVisitorRecordList();
				    	$timeout(function () {
				    		$("#logoutInfo").modal("hide");
				    	},800);
				    },
				    function (errorData) {
				        swal("操作失败", errorData, "error");
				    }
				);
			}
			else{
				serviceHttp.visitUnbind(
				    $scope.logout.keyword,
				    $scope.logout.handleMsg,
				    function (successData) {
				    	console.log(successData);
				    	swal("操作成功", "", "success");
				    	getVisitorRecordList();
				    	$timeout(function () {
				    		$("#logoutInfo").modal("hide");
				    	},800);
				    },
				    function (errorData) {
				        swal("操作失败", errorData, "error");
				    }
				);
			}
		};

		
		//身份证解绑
		$scope.unbindIDCard = function () {
			console.log("unbindIDCard");
			certificateId = "";

			var obj = byId("idCardReader"); //Routon Card Reader

			//设置端口号，1表示串口1，2表示串口2，依此类推；1001表示USB。0表示自动选择
			var port = obj.setPortNum(1001); //changed args
			if (port == 0) {
				swal("警告", "端口初始化失败！请确认设备是否安装成功", "error");
				return;
			}
			isInit = true;


			//使用重复读卡功能
			obj.Flag = 0;
			//读卡
			var ret = obj.IDCardOn(); //0-换了身份证  1-当前身份证仍在
			if (ret == 1) //0-换了身份证  1-当前身份证仍在
			{
				swal("警告", "当前身份证已读", "error");
				return;
			}

			//if(ret == 0)  //0-换了身份证  1-当前身份证仍在
			//{
			var rst = obj.ReadCard();
			//获取各项信息
			if (rst == 0x90) {
				certificateId = obj.CardNo();
			} else {
				certificateId = "";
				/*if(rst==0x02)
					alert("请重新将卡片放到读卡器上！");
					if(rst==0x41)
					alert("读取数据失败！");	*/
			}
			//}
			obj.closePort();

			serviceHttp.searchLabelAlarmNum(
			    certificateId,
			    function (successData) {
			        console.log(successData);
			        $scope.logoutInfo = successData;
			        $scope.logoutInfo.dealInfo = "";
			        $('#logoutInfo').modal({backdrop: 'static', keyboard: false});
			        $("#logoutInfo").modal("show");
			        $("#logoutVisitorImg")[0].src = successData.pictureUrl;

			        $scope.$apply();
			    },
			    function (errorData) {
			        swal("操作失败", errorData, "error");
			    }
			);
			/*serviceHttp.visitUnbind(
			    certificateId,
			    function (successData) {
			    	console.log(successData);
			    	if (successData.times >= successData.limit) {
			    		swal({ 
			    		    title: "解绑成功", 
			    		    text: "该访客触发了<span style='color:red;font-size: 18px;'> " + successData.times + " </span>次报警,是否加入黑名单？", 
			    		    type: "success",
			    		    html:true, 
			    		    showCancelButton: true,
			    		    closeOnConfirm: false, 
			    		    confirmButtonText: "加入黑名单",
			    		    cancelButtonText:"取消"
			    		}, function() {

			    		    serviceHttp.blackListAdd(
			    		        successData.certificateId,
			    		        successData.eventId,
			    		        function (successData) {
			    		            swal("加入黑名单成功", " ", "success");
			    		        },
			    		        function (errorData) {
			    		            swal("加入黑名单失败", errorData, "error");
			    		        }
			    		    );
			    		});
			    	}
			    	else{
			    		swal("操作成功", "", "success");
			    	}
			    	getVisitorRecordList();
			    },
			    function (errorData) {
			        swal("操作失败", errorData, "error");
			    }
			);*/
		};

		/*//访客牌解绑
		$scope.unbindVisitorCard = function () {
			console.log("unbindVisitorCard");
		};*/


		/*登出结束*/

		/*来访记录开始*/

		//获取自定义指令的id
		$scope.changeData = function (id) {

		};
		$scope.isLoading = true;		//查询等待圈圈

		$scope.visitorRecord = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			recordName: "",
			startTime: "",
			endTime: "",
			visitedRecordName: "",
			reason: "",
			gender: null,
			status: "",
			statusList:[{binded: -1,status:"离开"},{binded: 0,status:"未离开"},{binded: 1,status:"滞留"}],
			list: null
		};

		//搜索
		$scope.recordSearch = function () {
			$scope.visitorRecord.pageNum = 1;
			getVisitorRecordList();
		};

		//追踪
		$scope.visitorRecordTrackPress = function (item, index) {
			console.log(item);
			if (item.status == -1) {
				$state.go("locationMonitoring",{locationMonitorStr:'历史轨迹回放', trackObj: item});
			}
			else{
				$state.go("locationMonitoring",{locationMonitorStr:'实时监控', trackObj: item});
			}
		};

		//详情
		$scope.visitorRecordDetailPress = function (item, index) {
			$scope.detailInfo = item;
			$scope.detailInfo.gender = item.gender + "";
			console.log($scope.detailInfo);
			$('#visitorRecordInfo').modal({backdrop: 'static', keyboard: false});
			$("#visitorRecordInfo").modal("show");
			$("#visitorImg")[0].src = item.pictureUrl;
		};

		//获取访客记录列表
		function getVisitorRecordList() {
			$scope.visitorRecord.list = [];
			$scope.visitorRecord.serverPageCount = -1;
			$scope.isLoading = true;
			serviceHttp.visitList(
			    $scope.visitorRecord,
			    function (successData) {
			        console.log(successData);
			        $timeout(function () {
			            $scope.isLoading = false;
			            $scope.visitorRecord.list = successData.recordList;
			            for(var i = 0;i < $scope.visitorRecord.list.length; i++){
			                var obj = $scope.visitorRecord.list[i];
			                obj.genderText = getGender(obj.gender);
			                if (obj.status == -1) {
			                	obj.permString = "离开";
			                	obj.permClass = "label-default";
			                }
			                else if(obj.status == 0){
			                	obj.permString = "未离开";
			                	obj.permClass = "label-primary";
			                }
			                else if(obj.status == 1){
			                	obj.permString = "滞留";
			                	obj.permClass = "label-warning";
			                }
			            }
			            $scope.visitorRecord.serverPageCount = successData.pageCount;
			            setVisitorRecordPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
			        }, 500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getVisitorRecordList();

		//分页
		function setVisitorRecordPaginator(currentPage,numberOfPages,totalPages) {
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
		                    $scope.visitorRecord.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.visitorRecord.pageNum --;
		                    break;
		                case "next":
		                    $scope.visitorRecord.pageNum ++;
		                    break;
		                case "last":
		                    $scope.visitorRecord.pageNum = $scope.visitorRecord.serverPageCount;
		                    break;
		                case "page":
		                    $scope.visitorRecord.pageNum = page;
		                    break;
		            }
		            getVisitorRecordList();
		        }
		    };
		    $('#visitorRecord-paginator').bootstrapPaginator(options);
		}

		/*来访记录结束*/
	}]);
})();