app.factory('serviceHttp', [ '$state','serverInfo','$http', function($state,serverInfo,$http) {
	var initService = {};

    //获取用户信息
    initService.getUserInfo = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/userInfo";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //退出登录
    initService.logoutSys = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/doLogout";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取账户信息列表
    initService.getAccountList = function(numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/user/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //添加账户
    initService.accountAdd = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/user/add";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //编辑账户
    initService.accountEdit = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/user/edit";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取单个账户信息
    initService.getAccountInfo = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/user/get";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id: id
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //删除账户
    initService.accountDelete = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/user/delete";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id: id
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取建筑列表
    initService.getBuildingList = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/buildings";
        $.ajax({
            url : url,
            type : 'GET',
            data : {},
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取建筑信息
    initService.getBuildingInfo = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/buildInfo";
        $.ajax({
            url : url,
            type : 'GET',
            data : {},
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取权限列表待查询
    initService.getPermissionList = function(numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取权限列表
    initService.getAllPermissionList = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/all";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //添加权限
    initService.permissionAdd = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/add";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //编辑权限
    initService.permissionEdit = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/edit";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //删除权限
    initService.permissionDelete = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/delete";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id: id
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取单个权限信息
    initService.getPermissionInfo = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/privilege/get";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id: id
            },
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取监控区域列表-带查询
    initService.getFieldList = function(keyword,floorNo,numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/list";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                railName:keyword,
                floorNo:floorNo,
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //报警围栏(所有)
    initService.getFieldNameList = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/all";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //添加区域
    initService.fieldAdd = function(railName,floorName,activePeriodArr,points,overBoundaryAlarm,stopAlarm,stopLimitSeconds,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/add";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                railName: railName,
                buildId: serverInfo.buildId,
                floorNo: floorName,
                activePeriodArr:activePeriodArr,
                points: points,
                overBoundaryAlarm: overBoundaryAlarm,
                stopAlarm: stopAlarm,
                stopLimitSeconds: stopLimitSeconds
            },
            success : function(data) {
                //console.log(data);

                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //预加载编辑区域
    initService.loadFieldData = function(uuid,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/get";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                railId:uuid
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //编辑区域
    initService.fieldEdit = function(uuid,railName,floorName,activePeriodArr,points,overBoundaryAlarm,stopAlarm,stopLimitSeconds,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/edit";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                railId:uuid,
                railName:railName,
                buildId:serverInfo.buildId,
                floorNo:floorName,
                activePeriodArr:activePeriodArr,
                points:points,
                overBoundaryAlarm: overBoundaryAlarm,
                stopAlarm: stopAlarm,
                stopLimitSeconds: stopLimitSeconds,
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //删除区域
    initService.fieldDelete = function(uuid,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmArea/delete";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                railId:uuid
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //标签(所有)
    initService.getAllSn = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/label/all";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                buildId:serverInfo.buildId
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };


    //获取标签列表-带查询
    initService.getSnList = function(sn,status,binded,numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/label/list";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                buildId:serverInfo.buildId,
                sn:sn,
                status:status,
                binded:binded,
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //删除标签
    initService.snDelete = function(snArr,successCallBack,errorCallBack) {
        var result = true;
        var temp = "buildId="+serverInfo.buildId;
        for(var i=0; i<snArr.length; i++){
            temp += "&snArr=" + snArr[i];
        }
        var url = "/label/delete";
        $.ajax({
            url : url,
            type : 'GET',
            data : temp,
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //添加标签
    initService.snAdd = function(snArr,successCallBack,errorCallBack) {
        var result = true;
        var temp = "buildId="+serverInfo.buildId;
        for(var i=0; i<snArr.length; i++){
            temp += "&snArr=" + snArr[i];
        }
        var url = "/label/add";
        $.ajax({
            url : url,
            type : 'POST',
            data : temp,
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //解绑SN
    initService.snUnbind = function(sn,successCallBack,errorCallBack) {
        var result = true;
        var url = "/label/unbind";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                sn:sn
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //预约是否提前
    initService.appointmentRemind = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/remind";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id:id
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //获取系统设置数据
    initService.getSysConfig = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/sysconfig/get";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //系统设置
    initService.sysConfig = function(earlyTime,laterTime,blackAlarmTimes,battery,successCallBack,errorCallBack) {
        var result = true;
        var url = "/sysconfig/edit";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                earlyTime:earlyTime,
                laterTime:laterTime,
                blackAlarmTimes:blackAlarmTimes,
                battery:battery
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //日志查询-列表
    initService.systemLog_list = function(type,keyword,numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = [];
        var url = "/sysLog/findByParams";
        $.ajax({
            url : url,
            async : false,
            type : 'GET',
            data: {
                type:type,
                keyword: keyword,
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                //console.log(data);
                if(data.errorCode == 0){
                    successCallBack(data.data);
                }
                else{
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });

        return result;
    };

    //新建预约
    initService.appointmentAdd = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/add";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //预约列表
    initService.appointmentList = function(visitorName,certificateId,status,numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                visitorName:visitorName,
                certificateId:certificateId,
                status:status,
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //单个查询预约
    initService.getAppointment = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/get";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id:id
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //访客登记
    initService.visitorRegist = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/add";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };
    
    // 黑名单列表
    initService.appointmentBlackList = function(key,numPerPage,pageNum,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/black/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                key:key,
                numPerPage: numPerPage,
                pageNum: pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //移除黑名单
    initService.blackRemove = function(id,successCallBack,errorCallBack) {
        var result = true;
        var url = "/appointment/black/delete";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                id:id
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //添加黑名单
    initService.blackListAdd = function(certificateId,eventId,successCallBack,errorCallBack) {
        var result = true;
        var url = "/visit/blacklist/add";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                certificateId:certificateId,
                eventId:eventId
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //登记来访信息
    initService.visitEventAdd = function(obj,successCallBack,errorCallBack) {
        var result = true;  
        var url = "/visit/event/add";
        $.ajax({
            url : url,
            type : 'POST',
            contentType: "application/json",
            data : JSON.stringify(obj),
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //解绑标签
    initService.visitUnbind = function(number,handleMsg,successCallBack,errorCallBack) {
        var result = true;
        var url = "/visit/label/unbind";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                number:number,
                handleMsg:handleMsg
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //查询标签报警次数
    initService.searchLabelAlarmNum = function(number,successCallBack,errorCallBack) {
        var result = true;
        var url = "/visit/unbind/alarmInfo";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                number:number
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //访客记录列表
    initService.visitList = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/visit/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                name:obj.recordName,
                gender:obj.gender,
                arrvialTime:obj.startTime,
                leaveTime:obj.endTime,
                reason:obj.reason,
                employeeName:obj.visitedRecordName,
                status:obj.status,
                numPerPage: obj.numPerPage,
                pageNum: obj.pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    // 实时获取围栏报警事件
    initService.getRailAlarmEvent = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmevent/realTimeAlarmEvent";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                buildId: serverInfo.buildId
            },
            cache:false,
            success : function(data) {
                // //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    // 获取所有未处理的报警信息
    initService.getAllUnhandleAlarmInfo = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmevent/realTimeAlarmEvent";
        $.ajax({
            url : url,
            type : 'GET',
            data : {
                buildId: serverInfo.buildId
            },
            cache:false,
            success : function(data) {
                // //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //主页面总人数
    initService.location_summary = function(successCallBack,errorCallBack) {
        var result = true;

        var url = "/location/query";
        $.ajax({
            url : url,
            type : 'POST',
            data : {},
            cache:false,
            success : function(data) {
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //定位监控的访客列表
    initService.getRealMonitorList = function(obj,successCallBack,errorCallBack) {
        var result = true;
        var url = "/location/visitor/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                employeeName:obj.employeeName,
                name:obj.name,
                gender:obj.gender,
                mobileNumber:obj.mobileNumber,
                certificateId:obj.certificateId,
                reason:obj.reason,
                numPerPage: obj.numPerPage,
                pageNum: obj.pageNum
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //报警列表-查询
    initService.getAlarmViewList = function(obj,startTimeStamp,endTimeStamp,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmevent/list";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                type: obj.alarmType,  // 报警类型
                railId: obj.railId,  // 报警类型
                name: obj.name,
                numPerPage: obj.numPerPage,
                pageNum: obj.pageNum,
                startTime: startTimeStamp,
                endTime: endTimeStamp
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //报警-处理
    initService.deal_with = function(uuid,handleMsg,successCallBack,errorCallBack) {
        var result = true;
        var url = "/alarmevent/handle";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                uuid:uuid,
                handleMsg:handleMsg
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //报警-批量处理
    initService.batchHandleEvent = function(obj,handleMsg,successCallBack,errorCallBack) {
        var result = true;
        var temp = "handleMsg=" + handleMsg;
        for(var i=0; i<obj.length; i++){
            temp += "&uuidArr=" + obj[i].uuid;
        }

        var url = "/alarmevent/handleBatch";
        $.ajax({
            url : url,
            type : 'POST',
            data : temp,
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(true);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //人员地图轨迹
    initService.personHistoryMapPath = function(id,startTime,endTime,successCallBack,errorCallBack) {
        var result = true;
        var url = "/location/historypath";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                id:id,
                startTime: startTime,
                endTime: endTime
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //历史轨迹人员信息列表
    initService.getHistoryVisitorList = function(successCallBack,errorCallBack) {
        var result = true;
        var url = "/visit/visitor/all";
        $.ajax({
            url : url,
            type : 'GET',
            data : {},
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //统计查询-报警事件
    initService.statisticalAlarmEvent = function(floorNoArr,type,time,dateType,successCallBack,errorCallBack) {
        var result = true;

        var temp = "type=" + type + "&time=" + time + "&dateType=" + dateType;
        for(var i=0; i<floorNoArr.length; i++){
            temp += "&floorNoArr=" + floorNoArr[i];
        }
        var url = "/statistical/alarmEvent";
        $.ajax({
            url : url,
            type : 'GET',
            data : temp,
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //统计查询-访客统计
    initService.statisticalVisitEvent = function(reason,time,dateType,successCallBack,errorCallBack) {
        var result = true;
        var url = "/statistical/visitEvent";
        $.ajax({
            url : url,
            type : 'POST',
            data : {
                reason:reason,
                time: time,
                dateType: dateType
            },
            success : function(data) {
                //console.log(data);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(err) {
                console.log(err);
            }
        });
        return result;
    };

    //批量上传标签
    initService.uploadExcel = function(fileId,successCallBack,errorCallBack) {
        var result = [];
        var url = "/label/addBatch";
        $.ajaxFileUpload({
            url : url,
            secureuri : false,
            fileElementId : [ fileId ],
            type : 'post',
            dataType : 'json',
            async : false,
            success : function(result) {
                // console.log(result);
                var data = getJsObject(result);
                if (data.errorCode == 0) {
                    successCallBack(data.data);
                } else {
                    errorCallBack(processHttpResponesErrorCode(data,serverInfo));
                }
            },
            error : function(data, status, e) {
                console.log(data);
                console.log(status);
                console.log(e);
                console.log('ajaxfileupload uploadImg error!');
                if(e){
                    showErrorDialog(e.status);
                }
            }
        });
        return result;
    };

	return initService;
}]);