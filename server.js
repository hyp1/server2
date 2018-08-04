

var instance = require('./database');
var logs = require('./logs');


Object.assign = require('object-assign');
//app.engine('html', require('ejs').renderFile); //console log modules unten!

//if (ACCESSLOG) app.use(morgan('combined'));

app.use('/logs', logs);

app.use('/', express.static('public'), function (req, res) {
  //console.log(req.headers);
  //res.sendFile(express.static('public')+'index.html');
  res.sendFile('index.html', { root: __dirname + '/public' });
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";


console.log("RUNNING");
console.log(process.env.MONGO_TEST,"MONGOTEST");


var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(port, ip, function (req, res) {
  console.log('listening on *:' + port);
  console.log(process.env.MONGO_TEST,"MT")
});

console.log('Server running on http://%s:%s', ip, port);