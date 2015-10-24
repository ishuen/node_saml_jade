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
			pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			var poCo = new Array();
	        	client.query('SELECT * FROM webalu.posts, webalu.users WHERE webalu.posts.userid = webalu.users.userid ORDER BY webalu.posts.postid ASC', function(err, result) {
	          		if(err) {
	            			return console.error('error running query', err);
	          		}
				poCo = result.rows.slice();
				client.query('SELECT * FROM webalu.comments, webalu.users WHERE webalu.comments.userid = webalu.users.userid ORDER BY webalu.comments.postid ASC, webalu.comments.comday ASC, webalu.comments.comtime ASC', function(err, result){
					if(err){
						return console.error('error running query', err);
					}
					var comm = new Array();
					for(var i = 0; i < poCo.length; i++){
						var temp = new Array();
						var temp2;
						while(temp2 = result.rows.pop()){
							if(temp2.postid == poCo[i].postid){
								temp.unshift(temp2);
							}
							else{
								result.rows.push(temp2);
								break;
							}
						}
						if(temp != ""){
							comm.unshift(temp);
						}
					}
					res.render("showAll",{user: req.user, posts: JSON.stringify(poCo), comments: JSON.stringify(comm)});
				})
				done();
			});
			
			
			});
		 }
 		else{
 			res.render("showAll",{post:null});
 		}
	})
}