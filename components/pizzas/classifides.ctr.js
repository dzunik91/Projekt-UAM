(function () {
    "use strict";
    angular.module("ngClassifieds").controller("classifiedsCtrl", function ($scope, $http, $state, classifiedsFactory, $mdSidenav, $mdToast, $mdDialog) {
        var vm = this;
        vm.openSidebar = openSidebar;
        vm.closeSidebar = closeSidebar;
        vm.saveClassified = saveClassified;
        vm.editClassified = editClassified;
        vm.saveEdit = saveEdit;
        vm.deleteClassified = deleteClassified;
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

        function editClassified(classified) {
            vm.editing = true;
            openSidebar();
            vm.classified = classified;
        }

        function saveEdit() {
            vm.editing = false;
            vm.classified = {};
            closeSidebar();
            showToast("Edit saved !");
        }

        function deleteClassified(event, classified) {
            var confirm = $mdDialog.confirm().title("Are you sure you want to delete " + classified.name + "?").ok("Yes").cancel("No").targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                var index = vm.classifieds.indexOf(classified);
                vm.classifieds.splice(index, 1);
            }, function () {});
        }

        function showToast(message) {
            $mdToast.show($mdToast.simple().content(message).position('top, right').hideDelay(3000));
        }
    });
})();