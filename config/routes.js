module.exports = function(app, config, passport, pg, conString) {
	app.get("/", function(req, res) {
		//console.log(req.query);
		if(req.isAuthenticated()) {
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
						var start = 0;
						for(var i = 0; i < poCo.length; i++){
							var temp = new Array();
							for(var j = start; j < result.rows.length; j++){
								if(result.rows[j].postid == poCo[i].postid){
									var obj = result.rows[j];
									temp.push(obj);
								}
								else{
									start = j;
									break;
								}
							}
							comm.push(temp);
						}
						res.render("home", {user: req.user, posts: poCo, comments: comm});
					});
				done();
				});
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

	app.get("/showAll", function(req, res){
		res.render("showAll", {user:req.user});
	});
	
	app.get("/profile", function(req, res) {
		if(req.isAuthenticated()){
			res.render("profile", {user : req.user});
		} 
		else {
			res.redirect("/login");
		}
	});
	
	app.get("/newPost", function(req,res){
		var client = new pg.Client(conString);
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query("SELECT username FROM webalu.users WHERE userid='"+req.user.id+"';", function(err, result){
				if(err){
					return console.error('error running query', err);
				}
				res.render('newPost', {user: req.user, userName: result.rows[0].username});
			});
		});
	});
	
	app.get("/newPo", function(req, res){
		if(req.query){
			var client = new pg.Client(conString);
			pg.connect(conString, function(err, client, done) {
				if(err) {
					return console.error('could not connect to postgres', err);
				}

				client.query("SELECT MAX (postid) FROM webalu.posts", function(err, result){
					if(err) {
						return console.error('error running query', err);
					}
					var postid = result.rows[0].max+1;
					var now = new Date();
					var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
					var hour = now.getHours();
					if(hour < 10) hour = '0'+hour;
					var min = now.getMinutes();
					if(min < 10) min = '0'+min;
					var sec = now.getSeconds();
					if(sec < 10) sec = '0'+sec;
					var time = hour +':'+min+':'+sec;
					client.query("INSERT INTO webalu.posts VALUES('"+postid+"','"+req.user.id+"','"+req.query.content+"','"+date+"','"+time+"');", function(err, result){
						if(err) {
							return console.error('error running query', err);
						}
						res.redirect('/');
					});
				});
			});

		}
	})

	app.get("/editPost", function(req, res){
		var client = new pg.Client(conString);
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			client.query("SELECT post FROM webalu.posts WHERE postid="+req.query.postid, function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				//console.log(result.rows);
				var postCont = result.rows[0].post;
				res.render('editPost', {user:req.user, userName: req.query.username, postID:req.query.postid, postContent: postCont});
			});
			
		});
	});
	
	app.get('/editPo', function(req, res){
		if(req.query){
			var client = new pg.Client(conString);
			pg.connect(conString, function(err, client, done) {
				if(err) {
					return console.error('could not connect to postgres', err);
				}
				
				client.query("UPDATE webalu.posts SET post='"+req.query.content+"'WHERE postid='"+req.query.postid+"'", function(err, result){
					if(err) {
						return console.error('error running query', err);
					}
					res.redirect('/');
				});
			});
			
		}
	})

	app.get('/addComment', function(req, res){
		var client = new pg.Client(conString);
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
			var maxComm;
			client.query("SELECT MAX (commentid) FROM webalu.comments", function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				var max = result.rows[0].max+1;
				var now = new Date();
				var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
				var hour = now.getHours();
				if(hour < 10) hour = '0'+hour;
				var min = now.getMinutes();
				if(min < 10) min = '0'+min;
				var sec = now.getSeconds();
				if(sec < 10) sec = '0'+sec;
				var time = hour +':'+min+':'+sec;
				client.query("INSERT INTO webalu.comments VALUES('"+req.query.postid+"','"+req.user.id+"','"+max+"','"+req.query.newComm+"','"+date+"','"+time+"');", function(err, result){
					if(err) {
						return console.error('error running query', err);
					}
				});
			});	
		});
		res.redirect("/");
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		// TODO: invalidate session on IP
		res.redirect('/');
	});
	
}