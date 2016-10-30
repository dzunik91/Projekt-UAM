(function() {
    "use strict";
    angular
        .module('ngClassifieds')
        .controller('editPizzasCtrl', function($scope, $mdSidenav, $state, $mdDialog, $timeout, classifiedsFactory) {
        
        var vm = this;
        vm.closeSidebar = closeSidebar;
        vm.saveEdit = saveEdit;
        vm.classified = $state.params.classified;
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
        function saveEdit(classified) {
         $scope.$emit('editSaved', 'Edit Saved!')   
         vm.sidenavOpen = false;
        }
       
    });
})();