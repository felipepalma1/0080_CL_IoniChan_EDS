module.exports = function(Post) {



	Post.observe('before save', function(ctx, next) {


    if (ctx.instance) {
		ctx.instance.fecha= Date.now();
		
    }

    next();
  });	
};
