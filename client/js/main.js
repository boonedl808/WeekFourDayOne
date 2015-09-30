var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('TweetsController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
   $scope.tweets = [];
   $scope.tweetUser = $routeParams.user + ': ';
   $http.get('/messages')
       .success(function (messages) {
           messages.forEach(function (message) {
               if (message.userName === $scope.tweetUser) {
                   $scope.tweets.unshift(message);
               }
           })

       })
       .error(function (err) {
           console.error(err);
       })
   $scope.postTweet = function () {
       var tweet = {
           text: $scope.tweet,
           userName: $scope.tweetUser
       };
       $http.post('/messages', tweet)
           .success(function () {
               $scope.tweets.unshift(tweet);
           })
           .error(function (err) {
               console.error(err);
           })
   }
}]);

myApp.controller('welcomeController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
   $scope.username = '';
   $scope.login = function () {
       $location.path('/tweets/' + $scope.username);
   }

}]);

myApp.config(function ($routeProvider) {
   $routeProvider
       .when('/login', {
           templateUrl: '../views/welcome.html',
           controller: 'welcomeController'
       })
       .when('/tweets/:user', {
           templateUrl: '../views/tweets.html',
           controller: 'TweetsController'
       })
       .otherwise({
           redirectTo: '/login'
       });
});