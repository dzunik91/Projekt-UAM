(function() {
    "use strict";
    angular
        .module('ngClassifieds')
        .controller('newPizzasCtrl', function($scope, $mdSidenav, $state, $mdDialog, $timeout, classifiedsFactory) {
        
        var vm = this;
        vm.closeSidebar = closeSidebar;
        vm.saveClassified = saveClassified;
        $timeout(function() {
        $mdSidenav('left').open();    
        });
        
        $scope.$watch('vm.sidenavOpen', function(sidenav) {
            if(sidenav === false) {
                $mdSidenav('left')
                  .close()
                  .then(function() {
                    $state.go('pizzas');
                });
            }
        });
        
        function closeSidebar() {
            vm.sidenavOpen = false;
        }
        function saveClassified(classified) {
            if(classified){
                $scope.$emit('newItem', classified);
                vm.sidenavOpen = false;
            }
        }
       
    });
})();