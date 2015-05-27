var express       = require('express');
var app           = express();

var port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/build'));

var router = express.Router();

app.use('/', router);

app.listen(port);
console.log('Listening on port: ' + port);
