const express = require('express');
const mongodb = require('mongodb')
const path = require('path');
var func = require('./functionality');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
const mongoClient = mongodb.MongoClient;

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(5000);  // listner @ port 5k

app.set('view engine', 'nunjucks');

nunjucks.configure('./assets/views', {
    autoescape: true,
    express: app
});

app.use(express.static('assets/styles'));
app.use(express.static('assets/img'));
app.use(express.static('assets/scripts'));

mongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    console.log(__dirname);
    console.log("listening at 5k");
    if (err) {
        console.error(err);
        client.close();
    } else {
        let db = client.db('bank');
        let bankaccount = db.collection('bankaccount');

        app.route('/transfer')
            .get((req, res) => {
                res.render('transfer');
            });

        app.route('/account-list')
            .get((req, res) => {
                bankaccount.find().toArray((error, result)=>{
                    res.render('account-list', {data: result});
                })             
            });

        app.route('/add-remove-update')
            .get((req, res) => {
                res.render('add-remove-update');
            });

        app.route('/add-remove')
            .get((req, res) => {
                res.render('add-remove');
            })
            .post((request,response) =>{
                var input = new func.Account;
                input.amount = request.body.amount;
                input.account = request.body.account;      
                bankaccount.insertOne(input, (error, result) => {
                  response.render('add-remove-update', {amount: input.amount, account: input.account});
                })
            });
            
        app.route('/')
            .get((req, res) => {
                res.render('boilerplate');
            })

            .post((req, res) => {
                let a = new Account(req.body);    //new account object when we recieve a post req
                console.log(req.body);

                app.route('/destroy')
                    .get((request, response) => {
                        bankaccount.deleteMany({}, (error, result) => {
                            response.render('account-list');
                        })
                    })
            });
    }  // closes the else statemnet (if no err on db startup)
}); //closes the mongo connect client function. 