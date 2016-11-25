var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL) || pgp("postgres://taylorhalsted@localhost:5432/hustlepuffin");
var mustache = require('mustache-express');
var methodOverride = require('method-override');
var bdPars = require('body-parser');
var fetch = require('node-fetch');

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server alive on port 3000!');
});

app.engine('html',mustache());
app.set('view engine','html');
app.set('views',__dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(bdPars.urlencoded({ extended: false}));
app.use(bdPars.json());
