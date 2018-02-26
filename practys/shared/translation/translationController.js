/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   translationController.js
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   29/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

app.controller('translationController',['$scope', 'translationService', '$cookies',
function ($scope, translationService, $cookies){
	alert('test');
	console.log($cookies.lang);

    translationService.getTranslation($scope, 'en-us');  
}]);