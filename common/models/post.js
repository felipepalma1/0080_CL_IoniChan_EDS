module.exports = function(Post) {


	Post.observe('before save', function(ctx, next) {
	var Comentario = ctx.Model.app.models.Comentario;
    if (ctx.instance) {
		Post.count(function (err,data) {
			    ctx.instance.enumeracion=data;
			    ctx.instance.fecha= Date.now();
				Comentario.count(function(err,data) {
					ctx.instance.enumeracion=ctx.instance.enumeracion+data+1;
					console.log(ctx.instance);
					next();
			});
		});
    }
    else{
    	next();
    }
    
  });	
};
