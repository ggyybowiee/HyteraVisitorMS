function processHttpResponesErrorCode(responseDataString,serverInfo) {
    var errorMsg = "";
    var responseData = angular.fromJson(responseDataString);

    if(responseData.errorCode == -1){
        // token超时，返回登录
        window.location.href = serverInfo.loginServerIP + '/login.html?type=logout';
    }else{
        if(responseData.errorMsg != null){

            if(responseData.errorMsg.length > 0){
                errorMsg = responseData.errorMsg.join("!\n");
            }
            else{
                for(var key in responseData.filedErr){
                    errorMsg = responseData.filedErr[key];
                }
            }
        }
    }
    return errorMsg;
}