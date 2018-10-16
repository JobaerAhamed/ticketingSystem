const nodemailer = require('nodemailer');
const ejs = require("ejs");
const keys = require('./config/keys');

module.exports = {
    htmltest: function(targetEmail, caseid, targetName, dept, desc, date, assignee){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: keys.emailHost.emailSender,
                pass: keys.emailHost.emailOuth
            }
        });
        ejs.renderFile(__dirname + "/email.ejs", {name: targetName, caseid: caseid, dept: dept, desc: desc, date:date, assignee: assignee}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var fromID = 'FN Staff Portal <' + keys.emailHost.emailSender +'>';
                var subline = 'Field Nation Staff request update: [case number-' + caseid + ']';
                var mailOptions = {
                    from: fromID,
                    to: targetEmail,                    
                    subject: subline,
                    html: data
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        });
    },
    caseUpdate: function(targetEmail, caseid, targetName, dept, desc, date, assignee, status){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: keys.emailHost.emailSender,
                pass: keys.emailHost.emailOuth
            }
        });
        ejs.renderFile(__dirname + "/emailCaseUpdate.ejs",
        {   
            name: targetName,
            caseid: caseid, 
            dept: dept, 
            desc: desc, 
            date: date, 
            assignee: assignee, 
            status: status
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var fromID = 'FN Staff Portal <' + keys.emailHost.emailSender +'>';
                var subline = 'Field Nation Staff request update: [case number-' + caseid + ']';
                var mailOptions = {
                    from: fromID,
                    to: targetEmail,                    
                    subject: subline,
                    html: data
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        });
    }
  };