'use strict';

angular.module('myThesis',['ngAnimate','ngSanitize'])
.directive('spinner', function () {
	return {
		restrict: 'E',
		templateUrl: 'loader.html'
	}
})
.directive('questionForm', function () {
	return {
		restrict: 'E',
		templateUrl: 'form.html'
	}
})
.directive('answerCard', function () {
	return {
		restrict: 'E',
		templateUrl: 'answer.html'
	}
})
.controller('appController', function ($http, $scope) {
	var _self = this;
	var api_key =  "AIzaSyCjfXiIozh4m2mFkz-M8B3ql3ZKZVsscho";
	_self.serverAPI = "https://kgsearch.googleapis.com/v1/entities:search?key=" + api_key + "&query=";
	
	$scope.loading = false;
	$scope.formIsSubmitted = false;
	$scope.dataIsReady = false;
	$scope.facts = [];

	$scope.search = function () {
		$scope.facts = [];
		$scope.dataIsReady = false;
		$scope.loading = true;

		if ( $scope.loading ) {
			$http.get( _self.serverAPI + $scope.q)
			.then(function (res) {
				res.data.itemListElement.forEach(function (elm, i){
					if( elm.resultScore > 100 ) {
						var factdata = {};
						var data = elm.result;

						factdata.types = data['@type'].filter(function (instanceType){
							return instanceType !== 'Thing';
						});

						if( data.hasOwnProperty('name') ) {
							factdata.name = data['name'];
						}

						if( data.hasOwnProperty('detailedDescription') ) {
							factdata.desc = data.detailedDescription.articleBody;
						}

						if ( factdata.hasOwnProperty('name') && factdata.types.length > 0 && factdata.hasOwnProperty('desc') ) {
							$scope.facts.push(factdata);
						}
					}

				});
				$scope.dataIsReady = true;
				$scope.loading = false;
			});
		}
	}
});