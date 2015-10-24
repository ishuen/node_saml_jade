module.exports = function(app, config, passport, pg, conString) {
	app.get("/", function(req, res) {
		if(req.isAuthenticated()) {
		  res.render("home",
		  	{
		  		user : req.user
		  	});
		} else {
			res.render("home",
				{
					user : null
				});
		}
	});

	app.get("/login",
		passport.authenticate(config.passport.strategy,
		{
			successRedirect : "/",
			failureRedirect : "/login",
		})
	);

	app.post('/login/callback',
		passport.authenticate(config.passport.strategy,
			{
				failureRedirect: '/',
				failureFlash: true
			}),
		function(req, res) {
			res.redirect('/');
		}
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.get("/profile", function(req, res) {
    	if(req.isAuthenticated()){
			res.render("profile",
				{
					user : req.user
				});
   		} else {
    	    res.redirect("/login");
	    }
	});

	app.get('/logout', function(req, res) {
		req.logout();
		// TODO: invalidate session on IP
		res.redirect('/');
	});
	
	app.get('/showAll', function(req, res){
		if(req.user){
			var client = new pg.Client(conString);
			client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
	        	client.query('SELECT * FROM webalu.posts', function(err, result) {
	          		if(err) {
	            			return console.error('error running query', err);
	          		}
				for(var i = 0; i < result.rows.length; i++){
					var postID = result.rows[i].postid;
					res.render("showAll",{user: req.user, userid: result.rows[i].userid, post: result.rows[i].post});
					client.query('SELECT * FROM webalu.comments WHERE postID = "postID"', function(err, result){
						if(err){
							return console.error('error running query', err);
						}
						for(var j = 0; j < result.rows.length; j++){
							
						}
					})
				}
				client.end();
			});
			});
		 }
 		else{
 			res.render("showAll",{post:null});
 		}
	})
}