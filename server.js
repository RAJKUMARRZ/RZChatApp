var express = require('express')
var app = express()
var ejs = require('ejs');

var mongoose = require('mongoose'); 
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);            // set the port
var database = require('./app/database');            // load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');
path = require('path');

// configuration ===============================================================
mongoose.connect(database.localUrl);    // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;

//app.use(express.static('./uploads'));       // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override'));


//set the template engine ejs
app.set('view engine', 'ejs')

//static directory, public 
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('login')
})

app.get('/index', (req, res) => {
    res.render('index')
})

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
require('./app/routes.js')(app);

//Listen on port 3000
var port = 3000;
server = app.listen(port);
//app.listen(port);
console.log("App listening on port " + port);



//socket.io instantiation
var io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})