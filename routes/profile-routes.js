const router = require('express').Router();
const bodyParser = require('body-parser');
var Case = require('../models/case-model');
const Users = require('../models/user-model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    //res.send('you are logged in, this is your profile - ' + req.user);
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('adminHome', { cases: cases, user: req.user}));  
        //res.render('adminHome', { cases: cases, user: req.user});
    }else{
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('profile', { cases: cases, user: req.user}));        
    }
    //res.render('profile', { user: req.user });
});

router.get('/createcase', authCheck, (req, res) =>{
    //console.log(req.user);
    res.render('submitCase', {user: req.user})
});
router.get('/solved', authCheck, (req, res) =>{
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => 
            Users.find()
            .then(users  => res.render('adminSolved', { cases: cases, user: users, viewer: req.user})));
    } else{
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('profileSolved', { cases: cases, user: req.user}));
    }
});
router.get('/unsolved', authCheck, (req, res) =>{
    //console.log(req.user);
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => 
            Users.find()
            .then(users  => res.render('adminPending', { cases: cases, user: users, viewer: req.user})));
    } else{
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('profileUnsolved', { cases: cases, user: req.user}));
    }
/*
    Case.find()
    .sort({ date: -1 })
    .then(cases => res.render('profileUnsolved', { cases: cases, user: req.user})); */
});

router.get('/inprogress', authCheck, (req, res) =>{
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => 
            Users.find()
            .then(users  => res.render('adminInprogress', { cases: cases, user: users, viewer: req.user})));
    } else{
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('profileInprogres', { cases: cases, user: req.user})); 
    }
});
/*
router.get('/user', authCheck, (req, res) =>{
    //console.log(req.user);
    Case.find()
    .sort({ date: -1 })
    .then(cases => 
        Users.find()
        .then(users  => res.render('adminUsers', { cases: cases, user: users, viewer: req.user}))); 
});*/


router.get('/user', authCheck, (req, res) => {
    //res.send('you are logged in, this is your profile - ' + req.user);
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => 
            Users.find()
            .then(users  => res.render('adminUsers', { cases: cases, user: users, viewer: req.user}))); 
            //res.render('adminHome', { cases: cases, user: req.user});
    }else{
        res.redirect('/profile');     
    }
    //res.render('profile', { user: req.user });
});

router.post('/searchcase', authCheck, (req, res) => {
    res.redirect('/profile/searchcase/'+req.body.search)
});



router.get('/searchcase/:id', authCheck, (req, res) => {
    if(req.user.userrole == 'admin'){
        Case.find()
        .sort({ date: -1 })
        .then(cases => 
            Users.find()
            .then(users  => res.render('adminsearchCase', { cases: cases, user: users, viewer: req.user, searchItem: req.params.id}))); 
            //res.render('adminHome', { cases: cases, user: req.user});
    }else{
        Case.find()
        .sort({ date: -1 })
        .then(cases => res.render('profilesearchCase', { cases: cases, user: req.user, searchItem: req.params.id}));    
    }
    //res.render('profile', { user: req.user });
});





module.exports = router;