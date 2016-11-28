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

  db.many("SELECT * FROM companies WHERE user_email = $1",[data.email])
  .catch(function(err){
    console.log(err)
  })
  .then(function(cData) {
    var json_data = {companies: cData}
    console.log(json_data)
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

  db.many("SELECT * FROM contacts JOIN companies ON contacts.company_id = companies.id WHERE companies.user_email = $1 AND contacts.company_id = $2",[data.email,id])
  .then(function(data) {
    console.log(data)
  })

  res.render('companies')
})

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server alive on port 3000!');
});
