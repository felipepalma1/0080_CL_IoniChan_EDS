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
$scope.noMasPost = false;
//Extraemos los datos del tema
$scope.tema= [];
Tema
    .findById({id : $stateParams.id})
    .$promise
    .then(function(data){
      $scope.tema= data;
    });


//Extraemos todos los post que se encuentren en el tema
$scope.posts=[]
Tema
  .posts({id : $stateParams.id, filter : { order : 'enumeracion DESC', limit: '10'}})
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


//Permite abrir la foto del post
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

//Muestra el texto completo del post o lo esconde
$scope.toggleDescripcion= function(post) {
  post.resumido=!post.resumido;
};

//Refresca la pagina y trae nuevos posts
$scope.doRefresh=function() {

  //Comprueba si el tema no tiene ningun post
  if($scope.posts.length>0)
     lastPost=$scope.posts[0].enumeracion;
   else
    return

      
  Tema
  .posts({id : $stateParams.id, filter: 
                                      { 
                                        where: {
                                              enumeracion: {gt: lastPost}
                                               }
                                      }
                                    })
  .$promise
  .then(function(data) {
    
    if(data.length>0){

     angular.forEach(data, function(value) {
        Post
          .comentarios.count({id : value.id} )
          .$promise
          .then(function(data) {
            value.comentarios=(data.count);
          });
        $scope.posts.unshift(value);
     })
    
    }
  })
  .finally(function() {
     $scope.$broadcast('scroll.refreshComplete');
  });
};

//trae post viejos
$scope.postViejos = function() {
 
  //Comprueba si el tema no tiene ningun post
  if($scope.posts.length>0)
    firstPost=$scope.posts[$scope.posts.length-1].enumeracion;
       
  else
    return;
  
    

  Tema
  .posts({id : $stateParams.id, filter: 
                                      { 
                                        order : 'enumeracion DESC', limit: '10',
                                        where: {
                                              enumeracion: {lt: firstPost}
                                               }
                                      }
                                    })
  .$promise
  .then(function(data) {
    
    if(data.length>0){

     angular.forEach(data, function(value) {
        Post
          .comentarios.count({id : value.id} )
          .$promise
          .then(function(data) {
            value.comentarios=(data.count);
          });
        $scope.posts.push(value);
       
     })
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }

    else{
      $scope.noMasPost=true;
    }


   
     
    

    
  })

  


  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.postViejos();
  });


})

.controller('NewPostCtrl', function($scope, $stateParams,$state,Tema, Post) {
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
        .then(
          function(data) {
          console.log(data);
          $scope.mensaje="Su post se ha creado con éxito";
          post.autor="";
          post.temaId="";
          post.contenido="";
          post.titulo="";
          $scope.mensajeStado=true;
        },function(err) {
          console.log(err);
          $scope.mensaje="Error al crear el post.";
          $scope.mensajeStado=true;
       

        });
  };


  

})

.controller('HomeCtrl', function($scope, $stateParams) {
});
