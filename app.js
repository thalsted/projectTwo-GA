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

  var json_data = {};

  db.any("SELECT * FROM interactions JOIN contacts ON interactions.contact_id = contacts.cont_id JOIN companies ON contacts.company_id = companies.comp_id WHERE companies.user_email = $1 AND (interactions.next_date - CURRENT_DATE) >= 0 AND (interactions.next_date - CURRENT_DATE) < 7 ORDER BY interactions.next_date ASC",[data.email])
  .then(function(cData) {
    if(cData.length === 0) {
      res.redirect('/companies')
    } else {
      cData.forEach(function(x,y) {
        cData[y].interaction_date = moment(x.interaction_date).format("MMMM Do, YYYY | dddd")
        cData[y].next_date = moment(x.next_date).format("MMMM Do, YYYY | dddd")
      })

      var days = []
      for(var i = 0; i < 7; i++) {
        var date = moment().add(i, 'days').format("MMMM Do, YYYY | dddd");
        var holder = [];
        cData.forEach(function(z) {
          if(z.next_date === date) {
            holder.push(z)
          }
        })
        days.push({
          day: date,
          interactions: holder
        })
      }

      var ans = days.filter(function(a) {
        if(a.interactions.length != 0) {
          return a;
        }
      })

      json_data.days = ans;
    res.render('account', json_data)
    }
  })
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
  var address = '';

  if (input.url.includes('http')) {
    address = input.url;
  } else {
    address = 'http://'+input.url;
  }

  db.none("INSERT INTO companies(name, industry, description, url, user_email) VALUES($1, $2, $3, $4, $5)",[input.company, input.industry, input.desc, address, data.email])
  .then(function(){
    res.redirect('/companies')
  })
})

app.put('/companies/:id', function(req,res) {
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
  var address = '';

  if (input.url.includes('http')) {
    address = input.url;
  } else {
    address = 'http://'+input.url;
  }

  db.none("UPDATE companies SET name = $1, industry = $2, description = $3, url = $4 WHERE comp_id = $5",[input.company, input.industry, input.desc, address, id])
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

app.get('/contacts/:id', function(req,res) {
  var id = req.params.id;
  var json_data = {};

  db.any("SELECT * FROM companies LEFT JOIN contacts ON companies.comp_id = contacts.company_id WHERE companies.comp_id = $1",[id])
  .then(function(cData) {
    var query = cData[0].name.replace(/ /g,'+');
    var search = 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q='+query+'+business+news&mkt=en-us&category=business';
    json_data.company = cData[0].name;
    json_data.url = cData[0].url;
    json_data.cid = cData[0].comp_id;
    if(cData[0].company_id != null) {
      json_data.contacts = cData;
    } else {
      json_data.empty = {hustle: "No contacts yet, time to hustle."}
    }
    fetch(search, {
      method: 'GET',
      headers: { 'ocp-apim-subscription-key': process.env.API_KEY}
    })
    .then(function(back) {
       return back.json();
    }).then(function(json) {
      json_data.news = json;
      res.render('contacts',json_data)
    })
  })
})

app.post('/contacts/:id', function(req,res) {
  var id = req.params.id;
  var input = req.body;

  db.none("INSERT INTO contacts(contact_name, company_id, title, email, phone, found_through, note, date_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",[input.contact, id, input.title, input.email, input.phone, input.found_through, input.note, moment().format("MMM Do YYYY")])
  .then(function(){
    res.redirect('/contacts/'+id)
  })
})

app.put('/contacts/:id/:cid', function(req,res) {
  var id = req.params.id;
  var cid = req.params.cid;
  var input = req.body;

  db.none("UPDATE contacts SET contact_name = $1, title = $2, email = $3, phone = $4, found_through = $5, note = $6 WHERE cont_id = $7",[input.contact, input.title, input.email, input.phone, input.found_through, input.note, id])
  .then(function(){
    res.redirect('/contacts/'+cid)
  })
})

app.delete('/contacts/:id/:cid', function(req,res) {
  var id = req.params.id;
  var cid = req.params.cid;

  db.none("DELETE FROM contacts WHERE cont_id = $1",[id])
  .then(function(){
    res.redirect('/contacts/'+cid)
  })
})

app.get('/interactions/:id', function(req,res) {
  var id = req.params.id;

  db.any("SELECT * FROM contacts LEFT JOIN interactions ON contacts.cont_id = interactions.contact_id WHERE contacts.cont_id = $1",[id])
  .then(function(cData) {
    var json_data = {};
    json_data.person = cData[0].contact_name;
    json_data.cid = cData[0].cont_id;
    if(cData[0].contact_id != null) {
      cData.forEach(function(x,y) {
        cData[y].interaction_date = moment(x.interaction_date).format("MMMM Do, YYYY | dddd")
        cData[y].next_date = moment(x.next_date).format("MMMM Do, YYYY | dddd")
      })
      json_data.interactions = cData;
    } else {
      json_data.empty = {hustle: "No interactions yet, time to hustle."}
    }
    res.render('interactions', json_data)
  })
})

app.post('/interactions/:id', function(req,res) {
  var id = req.params.id;
  var input = req.body;

  db.none("INSERT INTO interactions(contact_id, interaction_date, type, next_step, next_date, notes) VALUES($1, $2, $3, $4, $5, $6)",[id, input.int_date, input.type, input.next, input.next_date, input.note])
  .then(function(){
    res.redirect('/interactions/'+id)
  })
})

app.delete('/interactions/:id/:cid', function(req,res) {
  var id = req.params.id;
  var cid = req.params.cid;

  db.none("DELETE FROM interactions WHERE int_id = $1",[id])
  .then(function(){
    res.redirect('/interactions/'+cid)
  })
})

const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server alive on port 3000!');
});
