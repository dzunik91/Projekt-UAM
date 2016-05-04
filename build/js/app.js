var pizzaPlace = angular.module('pizzaPlace', ['ui.router']);
	
			pizzaPlace.config(function($stateProvider, $urlRouterProvider) {
				$stateProvider

				.state('status',{
					url:'/status/:orderId',
					templateUrl: 'views/partial-status.html',
					controller: 'statusController'
				})
				.state('menu',{
					url:'/menu',
					templateUrl: 'views/partial-menu.html',
					controller: 'menuController'
				})

				.state('order',{
					url:'/order',
					templateUrl: 'views/partial-order.html',
					controller: 'orderController'
				})

				.state('contact',{
					url:'/contact',
					templateUrl: 'views/partial-contact.html',
					controller: 'contactController'
				});

				$urlRouterProvider.otherwise('/menu');
			});


			//KONTROLER KONTAKTÓW
pizzaPlace.controller('contactController',['$scope', 'contactService', function($scope, contactService){
	contactService.success(function(data){
		$scope.contact = data;
	});
}]);


//KONTROLER MENU-PIZZE oraz SKŁADNIKI - INGREDIENTS


pizzaPlace.controller('menuController', ['$scope', 'menuService','ingService','cartService','$state', function($scope, menuService,ingService, cartService, $state) {
	
	$scope.today = new Date();
	
	menuService.success(function(data) { 
    $scope.pizzaMenu = data; 
  });

	ingService.success(function(data){
		$scope.pizzaIngredients = data;
	});

	   $scope.cart = cartService.cart;
	   $scope.cartTotal = cartService.cartTotal;
    $scope.addPizza = function(pizza){
        cartService.addPizza(pizza);

        	console.log(cartService.cart);

            };

      $scope.removePizza = function(pizza){
      		cartService.cart.splice($scope.cart.indexOf(pizza), 1);
      };

      $scope.pizzaIncQty = function(pizza){
      	cartService.pizzaIncQty(pizza);
      };

      $scope.pizzaDecQty = function(pizza){
      	cartService.pizzaDecQty(pizza);
      };
      $scope.orderPizza = function(){
      	$state.go('order');
      };
	$scope.instantBuy = function(pizza){
		cartService.instantBuy(pizza);
		$state.go('order');
	};

}]);

//KONTROLER zamówień
pizzaPlace.controller('orderController' , ['$scope','$http', 'menuService','ingService','cartService','$state', function($scope, $http, menuService,ingService, cartService, $state) {
	$scope.cart = cartService.cart;
	$scope.cartTotal = cartService.cartTotal;
	$scope.personOrder = {};

	
	   $scope.orderPizza = function(info){
        
        $scope.personOrder = info;
        
         $scope.orderSummary={
            cart: [],
            orderInfo: {
                phone: $scope.personOrder.phone,
                address: $scope.personOrder.address,
                remarks: $scope.personOrder.remarks
            },
        };
    
           for (var i=0; i<$scope.cart.length ;i++){
            $scope.orderSummary.cart.push({
                id: $scope.cart[i].id,
                quantity: $scope.cart[i].quantity,
                total: $scope.cart[i].price*$scope.cart[i].quantity
            })
        }
        
       $http.post('/order', ($scope.orderSummary))
            .success(function(response){
                $scope.res = JSON.parse(response.id);
                $state.go('status',{
                    orderId:$scope.res 
                });
            }).error(function(response){
                console.log("błąd"  + response);
            })
        
    };


}]);

//Status
pizzaPlace.controller('statusController',['$scope', function($scope){

}]);

//SERVICES

pizzaPlace.service('orderService', function(){
	

});

pizzaPlace.service('cartService', function(){
	this.cart = [];
	this.pizzaIncQty = function(pizza){
		pizza.quantity = pizza.quantity+1;
	};
	this.pizzaDecQty = function(pizza){
      		pizza.quantity = pizza.quantity -1;

      		if(pizza.quantity<1){
      			this.cart.splice(this.cart.indexOf(pizza), 1);
      		};
      };
    this.instantBuy = function(pizza){
    		this.cart.push({
				id: pizza.id,
				name: pizza.name,
				price: pizza.price,
				ingredients: pizza.ingredients,
				quantity: pizza.quantity
		});
    };
	this.addPizza = function(pizza){
			this.cart.push({
				id: pizza.id,
				name: pizza.name,
				price: pizza.price,
				ingredients: pizza.ingredients,
				quantity: pizza.quantity
		});
	};
	 this.cartFinal = function(){
        return this.cart;
    };
	this.cartTotal = function(){
		var sum = 0;

		 for (var i = 0; i < this.cart.length; i++) {
            var pizza = this.cart[i];
            sum += pizza.price*pizza.quantity;
        }

        return sum;
	};
});



