(function() {
	app.controller("VisitorConfigCardCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("VisitorConfigCardCtrl");
		$scope.$emit('menuSelectParam', "visitorConfig");

		$scope.visitorCardSearchContent = "";
		// 访客牌搜索
		$scope.visitorCardSearchPress = function (content) {
			console.log(content);
			$scope.visitorCard.pageNum = 1;
			getSnList();
		};

		/*//记录手动输入开始时间  
		var startTime;

		var scanGunt = false;
		var count = 0;  
		$scope.visitorCardChange = function (value) {
			if (value.length == 1) {
				startTime = new Date().getTime();
			}
		};
		$('#visitorCardSearchContent').keydown(function(e){
			if (scanGunt) {
				count ++;
				if (count == 1) {
					$("#visitorCardSearchContent").val("");
				}
			}
		    if(e.keyCode==13){  
		        //记录手动输入结束时间  
		        var endTime = new Date().getTime();  
		        if(endTime - startTime < 1000){  
		            scanGunt = true;
		            count = 0; 
		        } 
		    }  
		});*/

		$scope.visitorCard = {
			pageNum: 1,
			numPerPage: 10,
			serverPageCount: -1,
			status: "",
			binded: "",
			errorMessage: "",
			bindedList: [{binded:"",status:"全部"},{binded:"1",status:"已绑定"},{binded:"0",status:"未绑定"}],
			statusList: [{binded:"",status:"全部"},{binded:"1",status:"在线"},{binded:"0",status:"离线"}],
			list: null
		};
		$scope.isLoading = true;

		//获取访客牌列表
		function getSnList() {
			$scope.visitorCard.list = [];
			$scope.visitorCard.serverPageCount = -1;
			$scope.isLoading = true;
			serviceHttp.getSnList(
				$scope.visitorCardSearchContent,
			    $scope.visitorCard.status,
			    $scope.visitorCard.binded,
			    $scope.visitorCard.numPerPage,
			    $scope.visitorCard.pageNum,
			    function (successData) {
			    	console.log(successData);
			    	$timeout(function () {
			    		$scope.isLoading = false;
			    		$scope.visitorCard.list = successData.recordList;
			    		for(var i = 0; i < $scope.visitorCard.list.length; i++){
			    		    var obj = $scope.visitorCard.list[i];
			    		    obj.selected = false;
			    		    if (obj.battery == null) {
			    		    	obj.batteryText = "未知";
			    		    }
			    		    else if (obj.battery == 0) {
			    		    	obj.batteryText = "0~25%";
			    		    }
			    		    else if (obj.battery == 1) {
			    		    	obj.batteryText = "25~50%";
			    		    }
			    		    else if (obj.battery == 2) {
			    		    	obj.batteryText = "50~75%";
			    		    }
			    		    else if (obj.battery == 3) {
			    		    	obj.batteryText = "75~100%";
			    		    }

			    		    if (obj.status == 1) {
			    		    	obj.permString = "在线";
			    		    	obj.permClass = "label-success";
			    		    }
			    		    else if(obj.status == 0 || obj.status == null){
			    		    	obj.permString = "离线";
			    		    	obj.permClass = "label-default";
			    		    }
			    		}
			    		$scope.visitorCard.serverPageCount = successData.pageCount;
			    		setVisitorCardPaginator(successData.currentPage,successData.numPerPage,successData.pageCount);
			    	},500);
			    },
			    function (errorData) {
			        console.log(errorData);
			    }
			);
		}
		getSnList();

		//解绑
		$scope.visitorUnbind = function (item, index) {
			console.log("visitorUnbind" + index);
			if (confirm("确认解绑【" + item.bindName + "】对应的【" +item.sn + "】？")) {
                serviceHttp.snUnbind(
                    item.sn,
                    function (successData) {
                        $scope.visitorCard.pageNum = 1;
                        swal("操作成功", "", "success");
                        getSnList();
                    },
                    function (errorData) {
                        swal("操作失败", errorData, "error");
                    }
                );
            }
		};

		//状态发生改变
		$scope.visitorCardStatusPress = function (status) {
			console.log(status);
			$scope.visitorCard.pageNum = 1;
			getSnList();
		};

		//是否绑定人员
		$scope.isBindedPerson = function (status) {
			console.log(status);
			$scope.visitorCard.pageNum = 1;
			getSnList();
		};

		//全选
		$scope.selectAll = function (e) {
			var isChecked = $("#selectAll").is(':checked');
			if (isChecked) {
				for(var i = 0 ; i < $scope.visitorCard.list.length ; i++){
				    $scope.visitorCard.list[i].selected = true;
				}
			}
			else{
				for(var ii = 0 ; ii < $scope.visitorCard.list.length ; ii++){
				    $scope.visitorCard.list[ii].selected = false;
				}
			}
		};

		//批量删除
		$scope.batchDeletePress = function () {
			$scope.visitorCard.errorMessage = "";
			var num = 0;
			var build_sns = "";
			for(var i = 0 ; i < $scope.visitorCard.list.length ; i++){
			    var obj = $scope.visitorCard.list[i];
			    if(obj.selected == false){
			        num++;
			    }else{
			        build_sns += obj.sn+",";
			    }
			}
			if(num == $scope.visitorCard.list.length){
			    $scope.visitorCard.errorMessage = "请选中要删除的项";
			    return;
			}
			for(var ii = 0 ; ii < $scope.visitorCard.list.length ; ii++){
				if ($scope.visitorCard.list[ii].binded == 1 && $scope.visitorCard.list[ii].selected == true) {
					$scope.visitorCard.errorMessage = "请先解绑后再删除标签";
					return;
				}
			}
			build_sns = build_sns.substr(0,build_sns.length-1);
			var temp = build_sns.split(",");
			// console.log(temp);
			if (confirm("确认删除标签" + build_sns + "？")) {
				serviceHttp.snDelete(
				    temp,
				    function (successData) {
				        $scope.visitorCard.pageNum = 1;
				        swal("操作成功", "", "success");
				        getSnList();
				    },
				    function (errorData) {
				        swal("操作失败", errorData, "error");
				    }
				);
			}
		};

		//新建
		$scope.addPress = function () {
			console.log("addPress");
			$state.go("visitorConfig.vcc-add");
		};

		//批量导入
		$scope.batchAddPress = function () {
			$('#addBatchSn').modal({backdrop: 'static', keyboard: false});
			$('#addBatchSn').modal('show');
			$scope.errorMessage = "";
			document.getElementById('text').innerHTML = "";
			$("#file").val("");
		};

		// 上传文件
		$scope.upDownloadFile = function () {
		    $("#file").click();
		};
		// 下载模板
		$scope.downLoadTemplate = function () {
		    var url='/label/xls/model';
		    window.open(url);
		};
		//提交
		$scope.submit = function () {
			$scope.errorMessage = "";
		    var snFileSizeBoolean = checkUploadExcelFile("file",'',['.xls']);
		    if (!snFileSizeBoolean) {
		        return;
		    }
		    serviceHttp.uploadExcel(
		        "file",
		        function (successData) {
		            console.log(successData);
		            if (successData.failedCount == 0) {
		                $('#addBatchSn').modal('hide');
		                swal("上传成功", "", "success");
		                getSnList();
		            }
		            else{
		            	swal({
		            	   title:"上传失败",
		            	   html:true,
		            	   type:"error",
		            	   text:successData.errorMsgs.join('<br>')
		            	});
		            }
		            
		        },function (errorData) {
		            swal("上传失败", errorData, "error");
		        }
		    );
		};

		$scope.handleFiles = function(ev){
			var file = $("#file").val();
			var fileName = getFileName(file);
			document.getElementById('text').innerHTML = fileName;
		};

		function getFileName(o){
		    var pos=o.lastIndexOf("\\");
		    return o.substring(pos+1);  
		}

		//id : 文件控件的id，  fileMaxSize ： 允许上传的最大值  filetypesParam : 允许上传的文件的类型
		function checkUploadExcelFile(id, fileMaxSize, filetypesParam) {
		    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
		    var target = document.getElementById(id);
		    var fileSize = 0;
		    var filetypes=[".jpg",".png",".rar",".txt",".zip",".doc",".ppt",".xls",".pdf",".docx"];
		    // //默认格式
		    // var filetypes = [".bmp", ".jpg", ".png",".jpeg",".gif",".mp3",".wma",".wav",".mp4",".pdf",".ppt",".word",".excel","xls","xlsx"]; // 默认格式
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
		        var index = filepath.split(".");
		        //不允许上传类似于文件名为123.pic.jpg的这类文件
		        if(index && index != null && index.length == 2){
		          var fileend = filepath.substring(filepath.indexOf(".")); 
		            if(filetypes && filetypes.length>0){ 
		                for(var i =0; i<filetypes.length;i++){ 
		                    if(filetypes[i]==fileend){ 
		                      isnext = true; 
		                      break; 
		                    } 
		                } 
		            } 
		        } 
		        if (!isnext) {
		            $scope.errorMessage='不接受此文件类型,只支持.xls格式的文件';
		            target.value = "";
		            return false;
		        }
		    } 
		    else {
		        $scope.errorMessage='附件不存在，请重新输入！';
		        return false;
		    }
		    if (isIE && !target.files) {
		        var filePath = target.value;
		        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		        if (!fileSystem.FileExists(filePath)) {
		              $scope.errorMessage='附件不存在，请重新输入！';
		              return false;
		            // showErrorDialog("附件不存在，请重新输入！");
		            // return false;
		        }
		        var file = fileSystem.GetFile(filePath);
		        fileSize = file.Size;
		    } 
		    else {
		        fileSize = target.files[0].size;
		    }
		    var size = fileSize / 1024;
		    if (size > filemaxsize) {
		          $scope.errorMessage="附件大小不能大于" + filemaxsize / 1024 + "M！";
		          target.value = "";
		          return false;
		        /*showErrorDialog("附件大小不能大于" + filemaxsize / 1024 + "M！");
		        target.value = "";
		        return false;*/
		    }
		    if (size <= 0) {
		          $scope.errorMessage="附件大小不能为0M！";
		          target.value = "";
		          return false;
		        /*showErrorDialog("附件大小不能为0M！");
		        target.value = "";
		        return false;*/
		    }
		    return true;
		}

		//分页
		function setVisitorCardPaginator(currentPage,numberOfPages,totalPages) {
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
		                    $scope.visitorCard.pageNum = 1;
		                    break;
		                case "prev":
		                    $scope.visitorCard.pageNum --;
		                    break;
		                case "next":
		                    $scope.visitorCard.pageNum ++;
		                    break;
		                case "last":
		                    $scope.visitorCard.pageNum = $scope.visitorCard.serverPageCount;
		                    break;
		                case "page":
		                    $scope.visitorCard.pageNum = page;
		                    break;
		            }
		            getSnList();
		        }
		    };
		    $('#visitorCard-paginator').bootstrapPaginator(options);
		}
	}]);
})();