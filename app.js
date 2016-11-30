const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://taylorhalsted@localhost:5432/hustlepuffin');
const mustache = require('mustache-express');
const methodOverride = require('method-override');
const bdPars = require('body-parser');
const fetch = require('node-fetch');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const moment = require('moment')

app.engine('html',mustache());
app.set('view engine','html');
app.set('views',__dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(bdPars.urlencoded({ extended: false}));
app.use(bdPars.json());

app.use(session({
  secret: 'ForeverPuff',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.get('/', function(req,res) {
  res.render('index')
})

app.get('/login', function(req,res) {
  res.render('login')
})

app.post('/login', function(req,res) {
  var data = req.body;
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.render('woops');
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp) {
        req.session.user = user;
        res.redirect('/account');
      } else {
        res.render('woops');
      }
    })
  })
})

app.get('/signup', function(req,res) {
  res.render('signup')
})

app.post('/signup', function(req,res) {
  var data = req.body;

  bcrypt.hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users(email, password_digest) VALUES($1, $2)", [data.email, hash]
    ).catch(function(){
      res.render('woops');
    }).then(function(){
      req.session.user = data;
      res.redirect('/account')
    })
  })
})

app.get('/account', function(req,res) {
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
   "logged_in": logged_in,
   "email": email
  }

  res.render('account')
})

app.get('/companies', function(req,res) {
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
   "logged_in": logged_in,
   "email": email
  }

  db.any("SELECT * FROM companies WHERE user_email = $1",[data.email])
  .then(function(cData) {
    var json_data = {};
    if(cData.length != 0) {
      json_data.companies = cData;
    } else {
      json_data.empty = {hustle: "No companies yet, time to hustle."}
    }
    res.render('companies', json_data)
  })
})

app.post('/companies', function(req,res) {
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
   "logged_in": logged_in,
   "email": email
  }

  var input = req.body;

  db.none("INSERT INTO companies(name, phase, industry, description, url, user_email) VALUES($1, $2, $3, $4, $5, $6)",[input.company, input.phase, input.industry, input.desc, input.url, data.email])
  .then(function(){
    res.redirect('/companies')
  })
})

app.delete('/companies/:id', function(req,res) {
  var id = req.params.id;
  db.none("DELETE FROM companies WHERE comp_id = $1",[id])
  .then(function(){
    res.redirect('/companies')
  })
})

app.post('/contacts/:id', function(req,res) {
  var logged_in;
  var email;
  var id = req.params.id;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
   "logged_in": logged_in,
   "email": email
  }

  var input = req.body;

  db.none("INSERT INTO contacts(contact_name, company_id, title, email, phone, found_through, note, date_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",[input.contact, id, input.title, input.email, input.phone, input.found_through, input.note, moment().format("MMM Do YYYY")])
  .then(function(){
    res.redirect('/contacts/'+id)
  })
})

app.get('/contacts/:id', function(req,res) {
  var logged_in;
  var email;
  var id = req.params.id;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
   "logged_in": logged_in,
   "email": email
  }

  var json_data = {};

  db.any("SELECT * FROM companies LEFT JOIN contacts ON companies.comp_id = contacts.company_id WHERE companies.user_email = $1 AND companies.comp_id = $2",[data.email,id])
  .then(function(data) {
    var query = data[0].name.replace(/ /g,'+');
    var search = 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q='+query+'+business+news&mkt=en-us&category=business';
    json_data.company = data[0].name;
    json_data.url = data[0].url;
    json_data.cid = data[0].comp_id;
    if(data[0].company_id != null) {
      json_data.contacts = data;
    } else {
      json_data.empty = {hustle: "No contacts yet, time to hustle."}
    }
    fetch(search, {
      method: 'GET',
      headers: { 'ocp-apim-subscription-key': process.env.API_KEY }
    })
    .then(function(back) {
       return back.json();
    }).then(function(json) {
      json_data.news = json;
      res.render('contacts',json_data)
    })
  })
})

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server alive on port 3000!');
});
