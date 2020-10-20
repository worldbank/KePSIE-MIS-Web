var app = angular.module('addUserApp', [ 'ngMessages' ]);

app
.controller(
	'addUserCtrl',
	function($scope, $http) {

		$scope.roles = [ {
			RoleID : 1,
			RoleName : 'Admin'
		}, {
			RoleID : 2,
			RoleName : 'B&Cs - ITEG'
		}, {
			RoleID : 3,
			RoleName : 'B&Cs - Licensing decision-makers'
		}, {
			RoleID : 4,
			RoleName : 'B&Cs - Other B&Cs members'
		}, {
			RoleID : 5,
			RoleName : 'MOH Coordinator'
		}, {
			RoleID : 6,
			RoleName : 'WB -Supervisors'
		}, {
			RoleID : 7,
			RoleName : 'WB - HIA Team'
		}, {
			RoleID : 8,
			RoleName : 'WB - Research team'
		}, {
			RoleID : 9,
			RoleName : 'High-level - KTF, WB'
		}, {
			RoleID : 10,
			RoleName : 'Steering Committee'
		}, {
			RoleID : 11,
			RoleName : 'Logistics Firm'
		},
		{
			RoleID : 12,
			RoleName : 'Counties - CEC'
		}, {
			RoleID : 13,
			RoleName : 'Counties - CDH'
		}, {
			RoleID : 14,
			RoleName : 'Counties - Focal points'
		}, {
			RoleID : 15,
			RoleName : 'Inspector'
		} ];

		$scope.groups = [
		{
			GrpID : 1,
			GrpName : 'Clinical Officers Council'
		},
		{
			GrpID : 2,
			GrpName : 'Medical Laboratory Technicians and Technologists Board'
		},
		{
			GrpID : 3,
			GrpName : 'Medical Practitioners and Dentists Board'
		},
		{
			GrpID : 4,
			GrpName : 'Nutritionists and Dieticians Institute'
		},
		{
			GrpID : 5,
			GrpName : 'Nursing Council of Kenya'
		},
		{
			GrpID : 6,
			GrpName : 'Pharmacy and Poisons Board'
		},
		{
			GrpID : 7,
			GrpName : 'Public Health Officers and Technicians Council'
		}, {
			GrpID : 8,
			GrpName : 'Radiation Protection Board'
		} ];

		$scope.organizations = [
		{
			OrgID : 1,
			OrgName : 'MOH'
		},
		{
			OrgID : 2,
			OrgName : 'Clinical Officers Council'
		},
		{
			OrgID : 3,
			OrgName : 'Medical Laboratory Technicians and Technologists Board'
		},
		{
			OrgID : 4,
			OrgName : 'Medical Practitioners and Dentists Board'
		},
		{
			OrgID : 5,
			OrgName : 'Nutritionists and Dieticians Institute'
		},
		{
			OrgID : 6,
			OrgName : 'Nursing Council of Kenya'
		},
		{
			OrgID : 7,
			OrgName : 'Pharmacy and Poisons Board'
		},
		{
			OrgID : 8,
			OrgName : 'Public Health Officers and Technicians Council'
		}, {
			OrgID : 9,
			OrgName : 'Radiation Protection Board'
		}, {
			OrgID : 10,
			OrgName : 'Kakamega County Government'
		}, {
			OrgID : 11,
			OrgName : 'Kilifi County Government'
		}, {
			OrgID : 12,
			OrgName : 'Meru County Government'
		}, {
			OrgID : 13,
			OrgName : 'World Bank Group'
		}, {
			OrgID : 13,
			OrgName : 'Other'
		} ];

		$scope.changePhoto = function() {

			console.log("changePhoto click");
			var file = $scope.myFile;
			console.log(file);
			console.log("file is ");
			console.dir(file);

			if (file == undefined
				|| file.type.split('/')[0] == 'image')

			{
				$scope.fileType = false;
			} else {
				$scope.fileType = true;
			}

		}

		$scope.checkemail = function() {

			var data = {
				email : $scope.user.email
			};
			$http.post(routesPrefix + '/user/checkEmail', data)
			.success(function(response) {
				console.log(response);
				if (response != "") {
					$scope.emailExist = true;

				} else {

					$scope.emailExist = false;
				}
			});

		}

		$scope.organizationname = function() {
			if ($scope.user.organization == "Other") {
				$scope.otherOrganization = true;
				$scope.user.otherOrganization = null;
			} else {
				$scope.otherOrganization = false;
				$scope.user.otherOrganization = "  ";
				$scope.userDetailAddForm.otherOrganization
				.$setUntouched();

							// scope.$apply();
						}
					}

					$scope.rolename = function() {

						if ($scope.user.role == "Inspector") {
							$scope.showInspectorId = true;
							$scope.user.inspectorId = null;

						} else {
							$scope.showInspectorId = false;
							$scope.user.inspectorId = "  ";
							$scope.userDetailAddForm.inspectorId
							.$setUntouched();
							// scope.$apply();
						}

						var displayCounty = [ "WB -Supervisors",
						"Counties - CEC", "Counties - CDH",
						'Counties - Focal points','Inspector'];

						if (displayCounty.indexOf($scope.user.role) != -1) {

							$scope.reportViewer = true;
							$scope.user.county = null;
							$scope.userDetailAddForm.county.$setUntouched();

						} else {

							$scope.reportViewer = false;
							$scope.user.county = "  ";
							$scope.userDetailAddForm.county.$setUntouched();
							// scope.$apply();
							// $scope.user.county=null;
						}

						if ($scope.user.role == 'B&Cs - ITEG'
							|| $scope.user.role == 'B&Cs - Licensing decision-makers') {

							$scope.grpDetail = true;
						$scope.user.group = null;
						$scope.userDetailAddForm.group.$setUntouched();

					} else {

						$scope.grpDetail = false;
						$scope.user.group = "  ";
						$scope.userDetailAddForm.group.$setUntouched();
					}
				}

				$scope.userDetailAdd = function(userDetailAddForm) {

					if (userDetailAddForm.$invalid || $scope.fileType
						|| $scope.emailExist)

					{

						$scope.submitted = true;
						return;
					} else {
						var formatedName = $scope.user.name.trim();

						$scope.user.createdAt = new Date();
						$scope.user.modifiedAt = new Date();

						$scope.user.is_deleted = "false";

						if ($scope.myFile != undefined)

						{
							var formatedName = $scope.user.name.trim().toLowerCase();
							var name = "";
							formatedName = formatedName.split(" ");
							for (var i = 0; i < formatedName.length; i++) {

								name += formatedName[i].charAt(0)
								.toUpperCase()
								+ formatedName[i].slice(1) + " ";
							}
							$scope.user.name = name.trim();
							var file = $scope.myFile;
							console.log(file);
							console.log("file is ");
							console.dir(file);
							console.log($scope.myFile.name);

							var path = $scope.myFile.name;
							var uploadUrl = routesPrefix + "/user/upload";
							var pth;

							var fd = new FormData();
							fd.append('file', file);
							console.log("fd");
							console.log(fd);
							$http
							.post(
								uploadUrl,
								fd,
								{
									transformRequest : angular.identity,
									headers : {
										'Content-Type' : undefined
									}
								})
							.success(
								function(res) {

									$scope.user.path = res.path;
									$scope.user.filename = res.filename;

									console.log($scope.user);
									$http
									.post(
										routesPrefix
										+ '/user/save',
										$scope.user)
									.success(
										function(
											response) {
											window.location.href = routesPrefix
											+ "/user/all";
										});
								});
						} else {

							console.log($scope.user);
							$http.post(routesPrefix + '/user/save',
								$scope.user).success(
								function(response) {
									console.log("success");
									console.log(response);
									window.location.href = routesPrefix
									+ "/user/all";
								});

							}
						}
					}
				});

app.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);
