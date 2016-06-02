'use strict';

var pizzaPlace = angular.module('pizzaPlace', ['ui.router', 'angular.filter', 'ui.bootstrap', 'ngAnimate']);

pizzaPlace.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('status', {
            url: '/status/:orderId',
            templateUrl: 'views/partial-status.html',
            controller: 'statusController'
        })
        .state('menu', {
            url: '/menu',
            templateUrl: 'views/partial-menu.html',
            controller: 'menuController'
        })

    .state('order', {
        url: '/order',
        templateUrl: 'views/partial-order.html',
        controller: 'orderController'
    })

    .state('contact', {
        url: '/contact',
        templateUrl: 'views/partial-contact.html',
        controller: 'contactController'
    });

    $urlRouterProvider.otherwise('/menu');
});


//KONTROLER KONTAKTÓW
pizzaPlace.controller('contactController', ['$scope', 'contactService', function($scope, contactService) {
    contactService.success(function(data) {
        $scope.contact = data;
    });
}]);


//KONTROLER MENU-PIZZE oraz SKŁADNIKI - INGREDIENTS


pizzaPlace.controller('menuController', ['$scope', 'menuService', 'ingService', 'cartService', '$state', '$uibModal', '$log', function($scope, menuService, ingService, cartService, $state, $uibModal, $log) {
    //zmienne potrzebne na oblcizenia
    $scope.today = new Date();
    $scope.extraIngredient = cartService.extraIngredient;
    $scope.extraIngCount = cartService.extraIngredient.length;
    $scope.animationsEnabled = true;

    $scope.open = function(pizza) {
        cartService.extraIngredient = [];
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/partial-menu-modal.html',
            controller: 'modalController',
            resolve: {
                pizza: function() {
                    return pizza;
                }
            }
        });

    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    //OPOBRANIE MENU ORAZ SKŁADNIKÓW

    menuService.success(function(data) {
        $scope.pizzaMenu = data;
    });

    ingService.success(function(data) {
        $scope.pizzaIngredients = data;
    });

    $scope.cart = cartService.cart;
    $scope.cartTotal = cartService.cartTotal;
    /*    $scope.addPizza = function (pizza) {

            cartService.addPizza(pizza);

            console.log(cartService.cart);

                };*/




    $scope.removePizza = function(pizza) {
        cartService.cart.splice($scope.cart.indexOf(pizza), 1);
    };



    $scope.pizzaIncQty = function(pizza) {
        cartService.pizzaIncQty(pizza);
    };

    $scope.pizzaDecQty = function(pizza) {
        cartService.pizzaDecQty(pizza);
    };
    $scope.orderPizza = function() {
        $state.go('order');
    };
    $scope.instantBuy = function(pizza) {
        cartService.instantBuy(pizza);
        $state.go('order');
    };

}]);
//KONTROLER MODALA
pizzaPlace.controller('modalController', ['$scope', '$uibModalInstance', 'pizza', 'menuService', 'ingService', 'cartService', function($scope, $uibModalInstance, pizza, menuService, ingService, cartService) {

    $scope.cart = cartService.cart;
    $scope.cartTotal = cartService.cartTotal;

    $scope.test = cartService.extraIngredientSum;
  
    ingService.success(function(data) {
        $scope.restIngredients = data;
    });

    $scope.extraIngredientSum = function(){
        cartService.extraIngredientSum;
    };

    $scope.extraIngredient = cartService.extraIngredient;

    $scope.toggle = function (ingredient) {
            var idx = $scope.extraIngredient.indexOf(ingredient);
            if (idx > -1)
                $scope.extraIngredient.splice(idx, 1);
            else
                $scope.extraIngredient.push(ingredient);
        };
        $scope.isExists = function (ingredient) {
            return $scope.extraIngredient.indexOf(ingredient) > -1;
        };
    /*$scope.addExtraIngredient = function(ingredient) {
        cartService.addExtraIngredient(ingredient);
				//console.log(cartService.extraIngredientSum());
    };*/

    $scope.pizza = pizza;

    $scope.removeBasicIng = function(ingredient){
        $scope.pizza.ingredients.splice($scope.pizza.ingredients.indexOf(ingredient), 1);
    };

    $scope.ok = function(pizza) {

        cartService.addPizza(pizza);
        console.log(cartService.cart);
        $uibModalInstance.close();
				//console.log(cartService.cartTotal);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);

//KONTROLER zamówień
pizzaPlace.controller('orderController', ['$scope', '$http', '$state', '$stateParams', 'menuService', 'ingService', 'cartService', function($scope, $http, $state, $stateParams, menuService, ingService, cartService) {
    $scope.cart = cartService.cart;
    $scope.cartTotal = cartService.cartTotal;
    /*$scope.personOrder = {};*/
    $scope.client = {};
    $scope.orderFinish = function(info) {

        $scope.client = info;

        $scope.orderSummary = {
            order: [],
            orderInfo: {
                phone: $scope.client.phone,
                address: $scope.client.address,
                remarks: $scope.client.remarks
            },
            extras: []
        };

        for (var i = 0; i < $scope.cart.length; i++) {
            $scope.orderSummary.order.push({
                id: $scope.cart[i].id,
                quantity: $scope.cart[i].quantity,
                extraIngredient: $scope.cart[i].extraIngredient,
                totalSum: $scope.cart[i].totalSum
            })
        }

        $http.post('/order', ($scope.orderSummary))
            .success(function(response) {
                $scope.res = JSON.parse(response.id);
                $state.go('status', {
                    orderId: $scope.res
                });
            }).error(function(response) {
                console.log("błąd" + response);
            })

    };
}]);

//Status
pizzaPlace.controller('statusController', ['$scope', 'statusService', '$stateParams', '$http', '$timeout', function($scope, statusService, $stateParams, $http, $timeout) {


    $http.get("/order/" + $stateParams.orderId)
        .success(function(response) {
            $scope.timeOrdered = response.ordered;
            $scope.timeEstimated = response.estimated;


            $scope.orderedDate = new Date(response.ordered);
            $scope.estimatedDate = new Date(response.estimated);



            $scope.minutesOrdered = ($scope.orderedDate).getMinutes();
            $scope.minutesEstimated = ($scope.estimatedDate).getMinutes();

            $scope.deliveryTime = ($scope.minutesEstimated) - ($scope.minutesOrdered);
        });


}]);

//SERVICES

pizzaPlace.service('cartService', function() {

    this.cart = [];
    this.extraIngredient = [];
    this.pizzaIncQty = function(pizza) {
        pizza.quantity = pizza.quantity + 1;
    };
    this.pizzaDecQty = function(pizza) {
        pizza.quantity = pizza.quantity - 1;

        if (pizza.quantity < 1) {
            this.cart.splice(this.cart.indexOf(pizza), 1);
        }
    };
    this.addExtraIngredient = function(ingredient) {
        this.extraIngredient.push({
            id: ingredient.id,
            label: ingredient.label,
            price: ingredient.price
        });
    };
    this.instantBuy = function(pizza) {
        this.cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            ingredients: pizza.ingredients,
            quantity: pizza.quantity
        });
    };
    this.addPizza = function(pizza) {
        this.cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            ingredients: pizza.ingredients,
            extraIngredient: this.extraIngredient,
            quantity: pizza.quantity,
            totalSum: (pizza.price * pizza.quantity) + this.extraIngredientSum(),
            extraIngredientSum: this.extraIngredientSum()
        });
    };

    this.extraIngredientSum = function() {
        var sumIng = 0;
        for (var j = 0; j < this.extraIngredient.length; j++) {
            var ingredient = this.extraIngredient[j];
            sumIng += ingredient.price;
        }
        return sumIng;
    };

    this.cartTotal = function() {
        var sum = 0;
        for(var i = 0; i < this.cart.length; i++){
          var pizza = this.cart[i];
          sum += (pizza.price + pizza.extraIngredientSum);
        }
        return sum;
    };


});

pizzaPlace.service('statusService', function() {

});



