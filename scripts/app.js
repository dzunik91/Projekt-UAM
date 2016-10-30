angular.module("ngClassifieds", ["ngMaterial", "ui.router"]).config(function ($mdThemingProvider, $stateProvider) {
    $mdThemingProvider.theme('default').primaryPalette('teal').accentPalette('orange');
    $stateProvider.state('pizzas', {
        url: '/pizzas'
        , templateUrl: 'components/pizzas/pizzas.tpl.html'
        , controller: 'classifiedsCtrl as vm'
    }).state('pizzas.new',{
        url: '/new',
        templateUrl: 'components/pizzas/new/pizzas.new.tpl.html',
        controller: 'newPizzasCtrl as vm'
    }).state('pizzas.edit',{
        url: '/edit',
        templateUrl: 'components/pizzas/new/pizzas.edit.tpl.html',
        controller: 'editPizzasCtrl as vm'
    });
});