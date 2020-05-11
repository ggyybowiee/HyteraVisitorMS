(function() {
	app.controller("VisitorConfigCard-AddCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("VisitorConfigCard-AddCtrl");

		$scope.snList = [{
            sn:''
        }];
        $scope.errorMessage = "";
        //添加SN
        $scope.addSn = function () {
            var newSn = {
                sn:""
            };  
            $scope.snList.push(newSn);
            // console.log($scope.snList);
        };

        /*//扫描新建
        $scope.scanPress = function () {
            console.log("scanPress");
        };*/

        //删除SN
        $scope.deleteSn = function (i) {
            $scope.snList.splice(i,1);  
        };

        // 保存
        $scope.savePress = function () {
            $scope.errorMessage = "";

            if ($scope.snList.length == 0) {
                $scope.errorMessage = "请添加SN";
                return;
            }

            var snReg = /^[a-fA-F0-9]{12}$/;
            for(var m = 0 ; m < $scope.snList.length; m ++){
                var objSn = $scope.snList[m];
                if (objSn.sn == "") {
                    $scope.errorMessage = "请输入SN" + (m+1);
                    return;
                }
                if (!snReg.test(objSn.sn)) {
                    $scope.errorMessage = "SN" + (m+1) + "的格式不正确";
                    return;
                }
            }

            var hash = {},len = $scope.snList.length;     
            while(len){  
                len--;   
                if(hash[$scope.snList[len].sn]){   
                    $scope.errorMessage = "不能添加重复标签：" + $scope.snList[len].sn;
                    return true;  
                }else{   
                    hash[$scope.snList[len].sn] = $scope.snList[len].sn;   
                }  
            }

            var snArr = [];
            for(var ii = 0; ii < $scope.snList.length; ii++){
                var obj = $scope.snList[ii];
                snArr.push(obj.sn);
            }
            // console.log(snArr);

            serviceHttp.snAdd(
                snArr,
                function (successData) {
                    console.log(successData);
                    if(successData.failedCount > 0){
                        swal("操作失败", successData.errorMsgs.join(","), "error");
                    }else{
                        swal("操作成功", "", "success");
                        $timeout(function () {
                            $scope.canclePress();
                        },800);
                    }
                },
                function (errorData) {
                    swal("操作失败", errorData, "error");
                }
            );
        };

        // 取消
        $scope.canclePress = function () {
            window.history.go(-1);
        };

        //回退
        $scope.navBackPress = function () {
            window.history.go(-1);
        };
	}]);
})();