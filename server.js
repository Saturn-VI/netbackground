var express = require('express');
var app = express();
app.use(express.static(__dirname + '/src'));
var port = 8000;
app.listen(port);
console.log("running");
