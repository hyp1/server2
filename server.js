

var express = require('express'),
app = express(),
morgan = require('morgan');

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
  if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
    mongoUser = process.env[mongoServiceName + '_USER'];
  
    if (mongoHost && mongoPort && mongoDatabase) {
      mongoURLLabel = mongoURL = 'mongodb://';
      if (mongoUser && mongoPassword) {
        mongoURL += mongoUser + ':' + mongoPassword + '@';
      }
      // Provide UI label that excludes user id and pw
      mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
      mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  
    }
  }

console.log(mongoURL, 'MONGO VORHER');
console.log(process.env.MONGO_TEST,"MONGOTEST");

var db = null;
function initDB() {
  instance.setup(mongoURL);
  db = instance.DbConnection;
  if (!db) console.error('Keine Datenbank!')
}
initDB();
console.log(db,"DB");


var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(port, ip, function (req, res) {
  console.log('listening on *:' + port);
  console.log(process.env.MONGO_TEST,"MT")
});

console.log('Server running on http://%s:%s', ip, port);

module.exports = app;