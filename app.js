var express = require('express'),
  http = require('http'),
  path = require('path'),
  passport = require("passport");
var pg = require('pg');
var conString = "postgres://wu:@localhost/wu";

var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env];

require('./config/passport')(passport, config);


var app = express();

app.configure(function () {
  app.set('port', config.app.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session(
    {
      secret: 'this shit hits'
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  console.log ("Development mode.");
  app.use(express.errorHandler());
});
app.configure ('production', function () {
  console.log ("Production mode.");
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', { error: err }); 
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404',
      {
        url : req.url
      });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
     client.end();
  });
});

require('./config/routes')(app, config, passport, pg, conString);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
