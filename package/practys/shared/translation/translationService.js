/*********************************************************************
 *
 *  Great Innovus Solutions Private Limited
 *
 *  Module      :   translationService.js
 *
 *  Description :   routing 
 *
 *  Developer   :   Karthick
 * 
 *  Date        :   29/08/2016
 *
 *  Version     :   1.0
 *
 **********************************************************************/

app.service('translationService', function ($resource) {

    this.getTranslation = function ($scope, language) {
        console.log('lang');
        var path = 'translations/tran_' + language + '.json';
        var ssid = 'localeObj';

        //sessionStorage.removeItem(ssid);

        if (sessionStorage) {
            if (sessionStorage.getItem(ssid)) {
                $scope.translation = JSON.parse(sessionStorage.getItem(ssid));
                $scope.translation.language = language;
            } else {
                $resource(path).get(function(data) {
                    $scope.translation = data;
                    $scope.translation.language = language;
                    sessionStorage.setItem(ssid, JSON.stringify($scope.translation));
                });
            };
        } else {
            $resource(path).get(function (data) {
                console.log(data);
                $scope.translation = data;
                $scope.translation.language = language;
            });
        }
    };
});