.controller('loginCtrl', ['$scope','Page','ngDialog','$localStorage','$http', 'urls','$window','$state', function($scope, Page, ngDialog, $localStorage, $http, urls, $window, $state){
	Page.setTitle('LogIn');

	$scope.activeTab = 'news';
	$scope.tabActive = function(value)
	{
		$scope.activeTab = value;
	}

	/*$http.get('http://localhost:3000/api/login').then(function(res){
		$scope.title = res.data;
	})*/

	$scope.user = {};
	$scope.submit = function(){
		$http.post("http://localhost:3000/api/login", $scope.user).then(function(data){
			$localStorage.token = data.data;
			//$localStorage.user = data.data;
			//$state.go('user.default.dashboard');
		}, function(error){
			$scope.error = error.errorMsg;
		});		
	}
}])