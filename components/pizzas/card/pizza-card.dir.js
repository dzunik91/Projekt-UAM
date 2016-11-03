(function () {
    "use strict";
    angular.module("ngClassifieds").directive("pizzaCard", function () {
        return {
            templateUrl: "components/pizzas/card/pizza-card.tpl.html"
            , scope: {
                classifieds: "=classifieds"
                , classifiedFilter: "=classifiedFilter",
                ingredients:"=ingredients",
                classified: "=classified"
            }
            , controller: pizzaCardController
            , controllerAs: "vm"
        }

        function pizzaCardController($state, $scope, $mdDialog) {
            var vm = this;
            vm.editClassified = editClassified;
            vm.deleteClassified = deleteClassified;
            
        vm.ingredients;
        vm.editing;
        vm.classified;

            function editClassified(classified) {
                $state.go('pizzas.edit', {
                    id: classified.id
                    , classified: classified
                    , ingredients: classified.ingredients
                });
            }

            function deleteClassified(event, classified) {
                var confirm = $mdDialog.confirm().title("Are you sure you want to delete " + classified.name + "?").ok("Yes").cancel("No").targetEvent(event);
                $mdDialog.show(confirm).then(function () {
                    var index = vm.classifieds.indexOf(classified);
                    vm.classifieds.splice(index, 1);
                    showToast('Pizza removed!');
                }, function () {});
            }
        }
    })
})();