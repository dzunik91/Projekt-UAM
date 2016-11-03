(function () {
    "use strict";
    angular.module("ngClassifieds").controller("classifiedsCtrl", function ($scope, $http, $state, classifiedsFactory, $mdSidenav, $mdToast, $mdDialog) {
        var vm = this;
        vm.openSidebar = openSidebar;
        vm.closeSidebar = closeSidebar;
        vm.saveClassified = saveClassified;
        //vm.editClassified = editClassified;
        vm.saveEdit = saveEdit;
        //vm.deleteClassified = deleteClassified;
        vm.classifieds;
        vm.ingredients;
        vm.editing;
        vm.classified;
        classifiedsFactory.getClassifieds().then(function (classifieds) {
            vm.classifieds = classifieds.data;
        });
        classifiedsFactory.getIngredients().then(function (ingredients) {
            vm.ingredients = ingredients.data;
        });
        
        $scope.$on('newItem', function(event, classified){
            classified.id = vm.classifieds.length + 1;
            vm.classifieds.push(classified);
            showToast('Pizza saved!');
        });
        
        $scope.$on('editSaved', function(event, message) {
            showToast(message);
        })

        function openSidebar() {
            $state.go('pizzas.new');
        }

        function closeSidebar() {
            $mdSidenav('left').close();
        }

        function saveClassified(classified) {
            if (classified) {
                vm.classifieds.push(classified);
                vm.classified = {};
                vm.closeSidebar();
                showToast("Item saved !");
            }
        }

        

        function saveEdit() {
            vm.editing = false;
            vm.classified = {};
            closeSidebar();
            showToast("Edit saved !");
        }

        

        function showToast(message) {
            $mdToast.show($mdToast.simple().content(message).position('top, right').hideDelay(3000));
        }
    });
})();