angular.module('cancerchan.controllers', [])

.controller('AppCtrl', function($scope, Tema) {

  $scope.temas= [];

  Tema
      .find()
      .$promise
      .then(function(data){
        $scope.temas= data;
      });

  
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PostCtrl',function($scope,$stateParams, Tema ,Post, $ionicModal) {

$scope.tema= [];

Tema
    .findById({id : $stateParams.id})
    .$promise
    .then(function(data){
      $scope.tema= data;
    });


$scope.posts=[]

Tema
  .posts({id : $stateParams.id})
  .$promise
  .then(function(data) {
     $scope.posts=data;
     angular.forEach(data, function(value) {
        Post
          .comentarios.count({id : value.id })
          .$promise
          .then(function(data) {
            value.comentarios=(data.count);
          });
     })
  });



$ionicModal.fromTemplateUrl('image-modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});

$scope.openModal = function() {
      $scope.imagePost=this.post.url_foto;
      $scope.modal.show();
};

$scope.closeModal = function() {
  $scope.modal.hide();
};

$scope.$on('$destroy', function() {
      $scope.modal.remove();
    });


$scope.toggleDescripcion= function(post) {
  post.resumido=!post.resumido;
};

})

.controller('NewPostCtrl', function($scope, $stateParams, Tema, Post) {
  $scope.tema= [];

  Tema
      .findById({id : $stateParams.id})
      .$promise
      .then(function(data){
        $scope.tema= data;
      });


  $scope.sendForm=function(post) {
    post.temaId=$scope.tema.id;
    Post
        .create(post)
        .$promise
        .then(function(data) {
          post.autor= "";
          post.contenido= "";
          post.titulo= "";
         console.log(data);
        })
  };    
})

.controller('HomeCtrl', function($scope, $stateParams) {
});
