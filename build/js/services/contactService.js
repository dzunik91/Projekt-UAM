pizzaPlace.factory('contactService', ['$http', function($http) { 
  return $http.get('/contact') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);