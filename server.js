var express     = require('express'),
	request     = require('request');

var pkg         = require('./package.json');

var app = express();
// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));

	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: process.env.SECRET }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// set up routes
app.get('/', function(req, res) {
    res.render("index", {
        project: pkg.name
    });
});

// start listening
app.listen( 5000 , function() {
  console.log('Express server listening on 5000');
});