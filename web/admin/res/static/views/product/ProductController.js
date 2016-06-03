(function () {
	'use strict';
	angular.module('controllers')
		.filter('authFilter', function () {
			return function (input) {
				return {
					"0": "审核中",
					"1": "已通过",
					"2": "不通过",
					"3": "已违规"
				}[input];
			};
		})
		.controller('ProductController', [
			'$scope', '$rootScope', '$http', '$uibModal', '$filter', 'adminProduct', '$stateParams', '$location', 'mutiSelected',
			function ($scope, $rootScope, $http, $uibModal, $filter, adminProduct, $stateParams, $location, mutiSelected) {
				$scope.authList = [{
					id: "0",
					name: '审核中',
					cur: false
				}, {
					id: "1",
					name: '已通过',
					cur: false
				}, {
					id: "2",
					name: '不通过',
					cur: false
				}, {
					id: "3",
					name: '已违规',
					cur: false
				}, ];

				$stateParams.detail = JSON.parse($stateParams.detail || '{}');

				//刷新页面公共方法
				function refreshPage(detail) {
					$location.path('/product/' + JSON.stringify(detail));
				}

				//从url详情中初始化页面
				function initUI(detail) {
					if (detail.query) {
						if (detail.query.create_at) {
							if (detail.query.create_at["$gte"]) {
								$scope.startTime.time = new Date(detail.query.create_at["$gte"]);
							}

							if (detail.query.create_at["$lte"]) {
								$scope.endTime.time = new Date(detail.query.create_at["$lte"]);
							}
						}
						mutiSelected.initMutiSelected($scope.authList, detail.query.auth_type);
					}

					detail.from = detail.from || 0;
					detail.limit = detail.limit || 10;
					$scope.pagination.pageSize = detail.limit;
					$scope.pagination.currentPage = (detail.from / detail.limit) + 1;
					detail.sort = detail.sort || {
						create_at: -1
					};
					$scope.sort = detail.sort;
				}

				//从页面获取详情
				function refreshDetailFromUI(detail) {
					var gte = $scope.startTime.time ? $scope.startTime.time.getTime() : undefined;
					var lte = $scope.endTime.time ? $scope.endTime.time.getTime() : undefined;

					var createAt = gte && lte ? {
						"$gte": gte,
						"$lte": lte
					} : undefined;

					detail.query = detail.query || {};
					detail.query.auth_type = mutiSelected.getInQueryFormMutilSelected($scope.authList);
					detail.query.create_at = createAt;
					detail.from = ($scope.pagination.pageSize) * ($scope.pagination.currentPage - 1);
					detail.limit = $scope.pagination.pageSize;
					detail.sort = $scope.sort;
					return detail;
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
						refreshPage(refreshDetailFromUI($stateParams.detail));
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
					refreshPage(refreshDetailFromUI($stateParams.detail));
				};
				//认证筛选
				$scope.authBtn = function (id) {
					$scope.pagination.currentPage = 1;
					mutiSelected.curList($scope.authList, id);
					refreshPage(refreshDetailFromUI($stateParams.detail));
				};
				//排序
				$scope.sortData = function (sortby) {
					if ($scope.sort[sortby]) {
						$scope.sort[sortby] = -$scope.sort[sortby];
					} else {
						$scope.sort = {};
						$scope.sort[sortby] = -1;
					}
					$scope.pagination.currentPage = 1;
					refreshPage(refreshDetailFromUI($stateParams.detail));
				};
				//重置清空状态
				$scope.clearStatus = function () {
					$scope.pagination.currentPage = 1;
					$scope.startTime.time = '';
					$scope.endTime.time = '';
					$stateParams.detail = {};
					mutiSelected.clearCur($scope.authList);
					refreshPage(refreshDetailFromUI($stateParams.detail));
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
					adminProduct.search(detail).then(function (resp) {
						if (resp.data.data.total === 0) {
							$scope.loading.loadData = true;
							$scope.loading.notData = true;
							$scope.userList = [];
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
								loadList(refreshDetailFromUI($stateParams.detail));
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
									loadList(refreshDetailFromUI($stateParams.detail));
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
