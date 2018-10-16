const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const Case = require('./models/case-model');
const axios = require('axios');
const Users = require('./models/user-model');
const nodemailer = require('nodemailer');
const makeEmail  = require('./mailman');
const slackNotice  = require('./slackbot');



function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

const app = express();

app.use(express.static('public'));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
/*
// create home route
app.get('/', (req, res) => {
    //res.render('home', {user: req.user});
    //res.sendFile('index.html', { root: './views/res' });
    
});*/

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});

app.post('/request', function (req, res) {
    var cid = getRandom(9);
    //makeEmail.introEmail(req.user.useremail, cid, req.body.department, req.body.request, req.body.currentDate, 'default');
    
    makeEmail.htmltest(req.user.useremail, cid, req.user.username, req.body.department, req.body.request, req.body.currentDate, 'default');
    slackNotice.caseCreated(req.user.username, cid, req.body.department, 'pending', req.user.useremail);

    //bot.postMessageToChannel('fn-bd-staff-portal', 'its working');
    //sendEmail(req.user.useremail, cid, req.body.department, req.body.request, req.body.currentDate, 'default');
    new Case({
        caseID: cid,
        requester: req.user.username,
        requesterEmail: req.user.useremail,
        department: req.user.userdept,
        caseCreated: req.body.currentDate,
        caseDescription: req.body.request,
        caseStatus: 'pending',
        appliedTo: req.body.department,
        assignedTo: 'default',
        feedback: 'Not provided yet',
        priority: req.body.priority
    }).save().then((newCase) => {
        console.log('created new case ');
    });
    res.render('thankyou')
});

app.post('/updatecase', function (req, res){
    const caseid = req.body.caseid;
    const status = req.body.status;
    const assignedTo = req.body.assignedTo;
    const feedback = req.body.feedback;

    makeEmail.caseUpdate(
        req.body.useremail, 
        req.body.caseid, 
        req.body.username,
        req.body.department, 
        req.body.request, 
        req.body.currentDate,
        req.body.assignedTo,
        req.body.status
    );

    Case.findOneAndUpdate({caseID: caseid},{caseStatus: status, assignedTo: assignedTo, feedback: feedback}).then(function(){
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.redirect('/profile/unsolved')); 
    });

    slackNotice.caseUpdated(req.body.username, req.body.caseid, req.body.department, req.body.status, req.body.useremail, req.body.assignedTo);
});

app.post('/updateUser', function (req, res){
    const userGID = req.body.userGID;
    const userrole = req.body.userrole;
    const userdept = req.body.userdept;
    console.log(userGID,userrole,userdept);
    
    Users.findOneAndUpdate({googleId: userGID},{userrole: userrole, userdept: userdept}).then(function(){
        Users.find()
        .sort({ date: -1 })
        .then(users => res.redirect('/profile/user')); 
    });
});

app.get('/dummytest/cases', function (req, res){
    Case.find()
    .sort({ date: -1 })
    .then(cases => res.json(cases)); 
});

app.get('/dummytest/users/:id', function (req, res){
    var target_user = req.params.id;
    console.log (target_user)

    Users.find({googleId: target_user})
    .sort({ date: -1 })
    .then(users => res.json(users));

});