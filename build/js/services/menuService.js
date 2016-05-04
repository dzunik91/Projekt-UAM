pizzaPlace.factory('menuService', ['$http', function($http) { 
  return $http.get('/menu') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);

pizzaPlace.factory('ingService', ['$http', function($http) { 
  return $http.get('/ingredients') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);