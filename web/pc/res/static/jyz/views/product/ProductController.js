(function () {
	'use strict';
	angular.module('controllers')
		.filter('authFilter', function () {
			return function (input) {
				return {
					"0": "未通过",
					"1": "审核通过",
					"2": "审核不通过",
					"3": "违规下线"
				}[input];
			};
		})
		.controller('ProductController', [
			'$scope', '$rootScope', '$http', '$uibModal', '$filter', 'adminProduct', '$stateParams', '$location',
			function ($scope, $rootScope, $http, $uibModal, $filter, adminProduct, $stateParams, $location) {
				$scope.authList = [{
					id: "0",
					name: '未审核',
					cur: false
				}, {
					id: "1",
					name: '审核通过',
					cur: false
				}, {
					id: "2",
					name: '审核不通过',
					cur: false
				}, {
					id: "3",
					name: '违规下线',
					cur: false
				}, ];

				$stateParams.detail = JSON.parse($stateParams.detail || '{}');

				//刷新页面公共方法
				function refreshPage(detail) {
					$location.path('/product/' + JSON.stringify(detail));
				}

				function initList(list, id) {
					angular.forEach(list, function (value, key) {
						if (value.id == id) {
							if (value.cur) {
								value.cur = false;
							} else {
								value.cur = true;
							}
						} else {
							value.cur = false;
						}
					});
				}

				function getCurId(list) {
					for (var value of list) {
						if (value.cur) {
							return value.id;
						}
					}

					return undefined;
				}

				function curList(list, id) {
					angular.forEach(list, function (value, key) {
						if (value.id == id) {
							value.cur = !value.cur;
						} else {
							value.cur = false;
						}
					});
				}

				function clearCur(list) {
					angular.forEach(list, function (value, key) {
						value.cur = false;
					});
				}

				//从url详情中初始化页面
				function initUI(detail) {
					if (detail.createAt) {
						if (detail.createAt["$gte"]) {
							$scope.startTime.time = new Date(detail.createAt["$gte"]);
						}

						if (detail.createAt["$lte"]) {
							$scope.endTime.time = new Date(detail.createAt["$lte"]);
						}
					}

					if (detail.authType) {
						initList($scope.authList, detail.authType);
					}

					detail.currentPage = detail.currentPage || 1;
					$scope.pagination.currentPage = detail.currentPage;
				}

				//从页面获取详情
				function getDetailFromUI() {
					var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
					var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;
					var authType = getCurId($scope.authList);
					var createAt = gte && lte ? {
						"$gte": gte,
						"$lte": lte
					} : undefined;

					return {
						currentPage: $scope.pagination.currentPage,
						authType: authType,
						createAt: createAt
					}
				}

				//数据加载显示状态
				$scope.loading = {
					loadData: false,
					notData: false
				};
				//分页控件
				$scope.pagination = {
					currentPage: 1,
					totalItems: 0,
					maxSize: 5,
					pageSize: 10,
					pageChanged: function () {
						refreshPage(getDetailFromUI());
					}
				};
				//时间筛选控件
				$scope.startTime = {
					clear: function () {
						this.dt = null;
					},
					dateOptions: {
						formatYear: 'yy',
						startingDay: 1
					},
					status: {
						opened: false
					},
					open: function ($event) {
						this.status.opened = true;
					},
					today: function () {
						this.dt = new Date();
					}
				};
				$scope.startTime.today();
				$scope.endTime = {
					clear: function () {
						this.dt = null;
					},
					dateOptions: {
						formatYear: 'yy',
						startingDay: 1
					},
					status: {
						opened: false
					},
					open: function ($event) {
						this.status.opened = true;
					},
					today: function () {
						this.dt = new Date();
					}
				};
				$scope.endTime.today();
				$scope.searchTimeBtn = function () {
					var start = new Date($scope.startTime.time).getTime();
					var end = new Date($scope.endTime.time).getTime();
					if (start > end) {
						alert('开始时间比结束时间大，请重新选择');
						return;
					}
					if (end - start < 86400000) {
						alert('结束时间必须必比开始时间大一天，请重新选择');
						return;
					}

					$scope.pagination.currentPage = 1;
					refreshPage(getDetailFromUI());
				};
				//认证筛选
				$scope.authBtn = function (id) {
					$scope.pagination.currentPage = 1;
					curList($scope.authList, id);
					refreshPage(getDetailFromUI());
				};
				//重置清空状态
				$scope.clearStatus = function () {
					$scope.pagination.currentPage = 1;
					$scope.startTime.time = '';
					$scope.endTime.time = '';
					clearCur($scope.authList);
					refreshPage(getDetailFromUI());
				};

				//提示消息
				function tipsMsg(msg, time) {
					time = time || 2000;
					$uibModal.open({
						size: 'sm',
						template: '<div class="modal-header"><h3 class="modal-title">消息提醒</h3></div><div class="modal-body"><p class="text-center">' + msg +
							'</p></div>',
						controller: function ($scope, $timeout, $modalInstance) {
							$scope.ok = function () {
								$modalInstance.close();
							};
							$timeout(function () {
								$scope.ok();
							}, time);
						}
					});
				}
				//加载数据
				function loadList(detail) {
					var data = {
						"query": {
							auth_type: detail.authType,
							create_at: detail.createAt
						},
						"from": ($scope.pagination.pageSize) * (detail.currentPage - 1),
						"limit": $scope.pagination.pageSize
					};
					adminProduct.search(data).then(function (resp) {
						if (resp.data.data.total === 0) {
							$scope.loading.loadData = true;
							$scope.loading.notData = true;
						} else {
							$scope.userList = resp.data.data.products;
							$scope.pagination.totalItems = resp.data.data.total;
							$scope.loading.loadData = true;
							$scope.loading.notData = false;
						}
					}, function (resp) {
						//返回错误信息
						$scope.loadData = false;
						console.log(resp);

					});
				}
				//初始化UI
				initUI($stateParams.detail);
				//初始化数据
				loadList($stateParams.detail);

				$scope.productAuth = function (pid, uid, product) {
					if (confirm("你确定该作品合格")) {
						adminProduct.auth({
							"_id": pid,
							"new_auth_type": '1',
							"designerid": uid,
							"auth_message": '审核通过，作品合格'
						}).then(function (resp) {
							if (resp.data.msg === "success") {
								tipsMsg('审核成功');
								product.auth_type = '1';
							}
						}, function (resp) {
							//返回错误信息
							$scope.loadData = false;
							console.log(resp);
						});
					}
				};

				$scope.open = function (tips, pid, type, uid, product) {
					var modalInstance = $uibModal.open({
						template: '<div class="modal-header"><h3>' + tips + '</h3></div><div class="modal-body"><div class="form-group"><label for="">填写' + tips +
							'原因</label><textarea class="form-control" ng-model="errorMsg" rows="3"></textarea></div></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">' +
							tips + '</button><button class="btn btn-warning" ng-click="cancel()">取消操作</button></div>',
						controller: function ($scope, $modalInstance) {
							$scope.ok = function () {
								if (!$scope.errorMsg) {
									alert('请填写内容');
									return;
								}
								$http({
									method: "POST",
									url: RootUrl + 'api/v2/web/admin/update_product_auth',
									data: {
										"_id": pid,
										"new_auth_type": type,
										"designerid": uid,
										"auth_message": $scope.errorMsg
									}
								}).then(function (resp) {
									//返回信息
									console.log(resp);
									$modalInstance.close();
									tipsMsg('操作成功');
									product.auth_type = type;
									console.log(product);
								}, function (resp) {
									//返回错误信息
									console.log(resp);
								});
							};
							$scope.cancel = function () {
								$modalInstance.dismiss('取消操作');
							};
						}
					});
					modalInstance.opened.then(function () { //模态窗口打开之后执行的函数
						console.log('modal is opened');
					});
					modalInstance.result.then(function (result) {
						console.log(result);
					}, function (reason) {
						console.log(reason); //点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
					});
				};
			}
		]);
})();
