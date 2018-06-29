// command prompt: mongod --dbpath ./data/

// dependencies 

var express = require('express');

const app = express();

const mongodb = require('mongodb');

var nunjucks = require('nunjucks');

const bodyParser = require('body-parser');

var func = require('./scripts/function.js');

// middleware--------------------------------------------------------------------------------------------------

app.use(express.static('images'));

app.use(express.static('styles'));

app.use(express.static('scripts'));

app.use(bodyParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

// nunjucks----------------------------------------------------------------------------------------------------

nunjucks.configure('src/views',{

  autoescape: true,

  express: app

});

app.set('view engine','nunjucks');

// mongoDB -----------------------------------------------------------------------------------------------------

const mongoClient = mongodb.MongoClient;

mongoClient.connect('mongodb://localhost:27017/',(error, client) => {

  if(error){

    client.close();

  } else{

    let db = client.db('bankaccounts');

    let bankaccount = db.collection('useraccount');

//-------------------------------------------------------------------------------------------------------------

  app.route('/')

    .get((request,response)=>{

      response.render('boilerplate');

  });

  

  app.route('/transfer')

    .get((request,response)=>{

    response.render('transfer');

    })

    .post((request,response)=>{
      bankaccount.findOne({account: req.body.account1}, (error, result) => {
        if (error) {
          console.error(error);
          client.close();
        }
        
      })
  });

  

  app.route('/account-list')

    .get((request,response)=>{

      bankaccount.find().toArray((error, result) => {
        response.render('account-list', {data: result});
      })

  });

  app.route('/destroy')

    .get((request,response)=>{

      bankaccount.deleteMany({}, (error, result) => {
        response.render('account-list');
      })
    })
  

  app.route('/add-remove')

    .get((request,response) => {
      bankaccount.find().toArray((error, result) => {
        response.render('add-remove', {data: result});
      })

    })

    .post((request,response) =>{
      var input = new func.Account;
      input.amount = request.body.amount;
      input.account = request.body.account;      
      bankaccount.insertOne(input, (error, result) => {
        response.render('add-remove-update', {amount: input.amount, account: input.account});
      })
  });

  

}});

app.listen(4321);