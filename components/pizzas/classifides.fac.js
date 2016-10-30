(function () {
    "use strict";
    angular.module("ngClassifieds").factory("classifiedsFactory", function ($http) {
        function getClassifieds() {
            return $http.get('/menu');
        }

        function getIngredients() {
            return $http.get('/ingredients');
        }
        return {
            getClassifieds: getClassifieds,
            getIngredients: getIngredients
        }
    });
})();