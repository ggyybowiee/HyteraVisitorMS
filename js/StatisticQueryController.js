(function() {
	app.controller("StatisticQueryCtrl", ["$scope", "$state", "serviceHttp", "$timeout", "serverInfo", function($scope, $state, serviceHttp, $timeout, serverInfo) {
		console.log("StatisticQueryCtrl");
		$scope.$emit('menuSelectParam', "statisticQuery");

		$scope.changeData = function (item) {
			console.log(item);
		};

		$scope.statisticQuery = {
			alarmType: "",
			dateType: "",
			alarmEventStartTime: "",
			// alarmEventEndTime: "",
			alarmList: [],
			alarmTotal: -1,
			visitorReason: "",
			visitorDateType: "",
			visitorEventStartTime: "",
			// visitorEventEndTime: "",
			visitorList: [],
			visitorTotal: -1
		};
		$scope.alarmTypeList = [{type: "overBoundaryAlarm",text: "越界报警"},{type: "stayAlarm",text: "滞留报警"}];
		$scope.dateTypeList = [{type: "3",text: "日"},{type: "2",text: "月"},{type: "1",text: "年"}];
		$scope.visitorReasonList = [{reason:"业务洽谈"},{reason:"来访参观"},{reason:"面试"},{reason:"其他"}];
		$scope.alarmLoading = false;
		$scope.visitorLoading = false;
		/** 
		 * 随机生成颜色 
		 * @return 随机生成的十六进制颜色 
		*/  
		  
		function randomColor() {　　
			var colorStr = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();　　
			return "#" + "000000".substring(0, 6 - colorStr) + colorStr;
		}

		/** 
		 * 十六进制颜色转换为RGB颜色 
		 * @param color 要转换的十六进制颜色 
		 * @return RGB颜色 
		 */
		function colorHexToRGB(color) {　　
			color = color.toUpperCase();　　
			var regexpHex = /^#[0-9a-fA-F]{3,6}$/; //Hex  
			　　
			if (regexpHex.test(color)) {　　　　
				var hexArray = [];
				var count = 1;　　　　
				for (var i = 1; i <= 3; i++) {　　　　　　
					if (color.length - 2 * i > 3 - i) {　　　　　　　　
						hexArray.push(Number("0x" + color.substring(count, count + 2)));　　　　　　　　
						count += 2;　　　　　　
					} else {　　　　　　　　
						hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));　　　　　　　　
						count += 1;　　　　　　
					}　　　　
				}　　　　
				return hexArray.join(",");　　
			} else {　　　　
				return color;　　
			}
		}
		//时间类型改变时
		$scope.dateChange = function (type) {
			$("#alarmClear").click();
			$('#alarmEventStartTime').datetimepicker('remove');
			if (type == "3") {
				$('#alarmEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy-mm-dd",
					minView: 2,
					autoclose: true
				});
			}
			else if(type == "2"){
				$('#alarmEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy-mm",
					startView: "year",
					minView: 3,
					autoclose: true
				});
			}
			else if(type == "1"){
				$('#alarmEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy",
					startView: "decade",
					minView: 4,
					autoclose: true
				});
			}
		};

		//报警事件搜索
		$scope.alarmQuerySearch = function () {
			// console.log("alarmQuerySearch");
			if ($scope.statisticQuery.alarmType == "") {
				swal("警告", "请选择报警类型", "error");
				return;
			}
			if ($scope.statisticQuery.dateType == "") {
				swal("警告", "请选择时间类型", "error");
				return;
			}
			if ($scope.statisticQuery.alarmEventStartTime == "") {
				swal("警告", "开始时间不能为空", "error");
				return;
			}
			/*if ($scope.statisticQuery.alarmEventEndTime == "") {
				swal("警告", "结束时间不能为空", "error");
				return;
			}*/

			var startStamp = moment($scope.statisticQuery.alarmEventStartTime).format('X')*1000;
			/*var endStamp = moment($scope.statisticQuery.alarmEventEndTime).format('X')*1000;

			if (startStamp - endStamp > 0) {
				swal("警告", "结束时间不能大于开始时间", "error");
				return;
			}*/

			$scope.statisticQuery.alarmList = [];
			$scope.statisticQuery.alarmTotal = -1;
			$scope.alarmLoading = true;

			serviceHttp.statisticalAlarmEvent(
				serverInfo.floorNos,
			    $scope.statisticQuery.alarmType,
			    startStamp,
			    $scope.statisticQuery.dateType,
			    // endStamp,
			    function (successData) {
			        // console.log(successData);
			        $timeout(function () {
			        	$scope.alarmLoading = false;
			        	$scope.statisticQuery.alarmList = successData;
			        	$scope.statisticQuery.alarmTotal = successData.length;

			        	if ($scope.statisticQuery.alarmTotal > 0) {
    			        	$timeout(function () {
    		        			var myChart = echarts.init(document.getElementById('alarmChart'));

    		        			var legendData = [];
    		        			var xData = [];
    		        			var yData = [];
    		        			var Series = [];
    		        			var SeriesData = [];
    		        			var res = successData;

    		        			for (var i in res) {
    		        				legendData.push({
    		        					name: res[i].floorNo,
    		        					icon: 'circle'
    		        				});
    		        				SeriesData = [];
    		        				for (var j in res[i].data) {
    		        					if (i == 0) {
    		        						if ($scope.statisticQuery.dateType == "3") {
    		        							xData.push(res[i].data[j].time + ":00");
    		        						}
    		        						else{
    		        							xData.push(res[i].data[j].time);
    		        						}
    		        						yData.push({
    		        							textStyle: {
    		        								color: '#000'
    		        							}
    		        						});
    		        					}
    		        					SeriesData.push({
    		        						value: res[i].data[j].count,
    		        					});
    		        				}
    		        				var rcolor = randomColor();
    		        				var rbgcolor = colorHexToRGB(rcolor);
    		        				Series.push({
    		        					name: res[i].floorNo,
    		        					type: 'line',
    		        					smooth: true,
    		        					symbol: 'circle',
    		        					symbolSize: 5,
    		        					showSymbol: false,
    		        					lineStyle: {
    		        					    normal: {
    		        					        width: 1
    		        					    }
    		        					},
    		        					areaStyle: {
    		        			            normal: {
    		        			                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    		        			                    offset: 0,
    		        			                    color: 'rgba(' + rbgcolor + ', 0.3)'
    		        			                }, {
    		        			                    offset: 0.8,
    		        			                    color: 'rgba(' + rbgcolor + ', 0)'
    		        			                }], false),
    		        			                shadowColor: 'rgba(0, 0, 0, 0.1)',
    		        			                shadowBlur: 10
    		        			            }
    		        			        },
    		        			        itemStyle: {
    		        			            normal: {
    		        			                color: 'rgb(' + rbgcolor + ')',
    		        			                borderColor: 'rgba(' + rbgcolor + ', 0.2)',
    		        			                borderWidth: 12

    		        			            }
    		        			        },
    		        					data: SeriesData
    		        				});
    		        			}

    		        			option = {
    		        			    backgroundColor: '#fafafa',
    		        			    toolbox: {
    		        		            feature: {
    		        		                saveAsImage: {}
    		        		            },
    		        		            right: '4%'
    		        		        },
    		        			    tooltip: {
    		        			        trigger: 'axis',
    		        			        axisPointer: {
    		        			            lineStyle: {
    		        			                color: '#57617B'
    		        			            }
    		        			        }
    		        			    },
    		        			    legend: {
    		        			        itemWidth: 14,
    		        			        itemHeight: 7,
    		        			        itemGap: 18,
    		        			        textStyle: {
    		        			            fontSize: 12,
    		        			            color: '#000'
    		        			        },
    		        			        data: legendData
    		        			    },
    		        			    grid: {
    		        			        left: '3%',
    		        			        right: '4%',
    		        			        bottom: '3%',
    		        			        containLabel: true
    		        			    },
    		        			    xAxis: [{
    		        			        type: 'category',
    		        			        boundaryGap: false,
    		        			        axisLine: {
    		        			            lineStyle: {
    		        			                color: '#57617B'
    		        			            }
    		        			        },
    		        			        data: xData,
    		        			    }],
    		        			    yAxis: [{
    		        			        type: 'value',
    		        			        name: '报警次数',
    		        			        axisTick: {
    		        			            show: false
    		        			        },
    		        			        axisLine: {
    		        			            lineStyle: {
    		        			                color: '#000'
    		        			            }
    		        			        },
    		        			        axisLabel: {
    		        			            margin: 10,
    		        			            textStyle: {
    		        			                fontSize: 14
    		        			            }
    		        			        },
    		        			        splitLine: {
    		        			            lineStyle: {
    		        			                color: '#ccc'
    		        			            }
    		        			        },
    		        			        data: yData,
    		        			    }],
    		        			    series: Series
    		        			};
    		        			myChart.setOption(option);
    			        	},300);
			        	}
			        },500);
			    },
			    function (errorData) {
			        swal("出错啦", errorData, "error");
			        $timeout(function () {
			        	$scope.alarmLoading = false;
			        },500);
			    }
			);
		};

		//访客时间类型改变时
		$scope.visitorDateChange = function (type) {
			// console.log(type);
			$("#visitorClear").click();
			$('#visitorEventStartTime').datetimepicker('remove');
			if (type == "3") {
				$('#visitorEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy-mm-dd",
					minView: 2,
					autoclose: true
				});
			}
			else if(type == "2"){
				$('#visitorEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy-mm",
					startView: "year",
					minView: 3,
					autoclose: true
				});
			}
			else if(type == "1"){
				$('#visitorEventStartTime').datetimepicker({
					language: 'zh-CN',
					format: "yyyy",
					startView: "decade",
					minView: 4,
					autoclose: true
				});
			}
		};

		//访客事件搜索
		$scope.visitorQuerySearch = function () {
			// console.log("visitorQuerySearch");
			if ($scope.statisticQuery.visitorReason == "") {
				swal("警告", "请选择事由", "error");
				return;
			}

			if ($scope.statisticQuery.visitorDateType == "") {
				swal("警告", "请选择时间类型", "error");
				return;
			}

			if ($scope.statisticQuery.visitorEventStartTime == "") {
				swal("警告", "开始时间不能为空", "error");
				return;
			}

			/*if ($scope.statisticQuery.visitorEventEndTime == "") {
				swal("警告", "结束时间不能为空", "error");
				return;
			}*/

			var startStamp = moment($scope.statisticQuery.visitorEventStartTime).format('X')*1000;
			/*var endStamp = moment($scope.statisticQuery.visitorEventEndTime).format('X')*1000;

			if (startStamp - endStamp > 0) {
				swal("警告", "结束时间不能大于开始时间", "error");
				return;
			}*/

			$scope.statisticQuery.visitorList = [];
			$scope.statisticQuery.visitorTotal = -1;
			$scope.visitorLoading = true;

			serviceHttp.statisticalVisitEvent(
			    $scope.statisticQuery.visitorReason,
			    startStamp,
			    $scope.statisticQuery.visitorDateType,
			    // endStamp,
			    function (successData) {
			        // console.log(successData);
			        $timeout(function () {
			        	$scope.visitorLoading = false;
			        	$scope.statisticQuery.visitorList = successData;
			        	$scope.statisticQuery.visitorTotal = successData.length;

			        	if ($scope.statisticQuery.visitorTotal > 0) {
				        	$timeout(function () {
		        				var myChart = echarts.init(document.getElementById('visitorChart'));

		        				var res = successData;
		        				// var res = [{"count":220,"date":"00"},{"count":182,"date":"01"},{"count":191,"date":"02"},{"count":134,"date":"03"},{"count":150,"date":"04"},{"count":120,"date":"05"},{"count":110,"date":"06"},{"count":125,"date":"07"},{"count":145,"date":"08"},{"count":122,"date":"09"},{"count":165,"date":"10"},{"count":122,"date":"11"}];
		        				var xData = [];
		        				var counts = [];
		        				for (var i in res) {
		        					// xData.push(res[i].date + ":00");
		        					xData.push(res[i].time);
		        					counts.push(res[i].count);
		        				}

		        				var rcolor = randomColor();
		        				var rbgcolor = colorHexToRGB(rcolor);

		        				option = {
		        				    backgroundColor: '#fafafa',
		        		    	    toolbox: {
		        		                feature: {
		        		                    saveAsImage: {}
		        		                },
		        		                right: '4%'
		        		            },
		        		    	    tooltip: {
		        		    	        trigger: 'axis',
		        		    	        axisPointer: {
		        		    	            lineStyle: {
		        		    	                color: '#57617B'
		        		    	            }
		        		    	        }
		        		    	    },
		        				    legend: {
		        				        icon: 'circle',
		        				        itemWidth: 14,
		        				        itemHeight: 7,
		        				        itemGap: 18,
		        				        data: [ $scope.statisticQuery.visitorReason ],
		        				        textStyle: {
		        				            fontSize: 12,
		        				            color: '#000'
		        				        }
		        				    },
		        				    grid: {
		        				        left: '3%',
		        				        right: '4%',
		        				        bottom: '3%',
		        				        containLabel: true
		        				    },
		        				    xAxis: [{
		        				        type: 'category',
		        				        boundaryGap: false,
		        				        axisLine: {
		        				            lineStyle: {
		        				                color: '#57617B'
		        				            }
		        				        },
		        				        data: xData
		        				    }],
		        				    yAxis: [{
		        				        type: 'value',
		        				        name: '访客次数',
		        				        axisTick: {
		        				            show: false
		        				        },
		        				        axisLine: {
		        				            lineStyle: {
		        				                color: '#000'
		        				            }
		        				        },
		        				        axisLabel: {
		        				            margin: 10,
		        				            textStyle: {
		        				                fontSize: 14
		        				            }
		        				        },
		        				        splitLine: {
		        				            lineStyle: {
		        				                color: '#ccc'
		        				            }
		        				        }
		        				    }],
		        				    series: [{
		        				        name: $scope.statisticQuery.visitorReason,
		        				        type: 'line',
		        				        smooth: true,
		        				        symbol: 'circle',
		        				        symbolSize: 5,
		        				        showSymbol: false,
		        				        lineStyle: {
		        				            normal: {
		        				                width: 1
		        				            }
		        				        },
		        				        areaStyle: {
		        				            normal: {
		        				                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		        				                    offset: 0,
		        				                    color: 'rgba(' + rbgcolor + ', 0.3)'
		        				                }, {
		        				                    offset: 0.8,
		        				                    color: 'rgba(' + rbgcolor + ', 0)'
		        				                }], false),
		        				                shadowColor: 'rgba(0, 0, 0, 0.1)',
		        				                shadowBlur: 10
		        				            }
		        				        },
		        				        itemStyle: {
		        				            normal: {
		        				                color: 'rgb(' + rbgcolor + ')',
		        				                borderColor: 'rgba(' + rbgcolor + ', 0.2)',
		        				                borderWidth: 12

		        				            }
		        				        },
		        				        data: counts
		        				    }]
		        				};
		        				myChart.setOption(option);
				        	},300);
			        	}
			        	
			        },500);
			    },
			    function (errorData) {
			        swal("出错啦", errorData, "error");
			        $timeout(function () {
			        	$scope.visitorLoading = false;
			        },500);
			    }
			);
		};
	}]);
})();