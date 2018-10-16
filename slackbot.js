const keys = require('./config/keys');
const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token: keys.slackbot.api_key,
    name: 'Staff Update'
});


module.exports ={
    caseCreated: function(user, cid, appliedTo, status, userEmail){
        const message ='Hi '+user+'\n'
        +'Your request was successsfully submitted to '+appliedTo+'\n'
        +'Your case refference number is '+cid+ ' status: '+status+'\n'
        +'Thank you'
        ;

        axios.get('https://slack.com/api/users.list?token='+ keys.slackbot.api_key)
        .then(function (response) {
            var members = response.data.members;
            for (var x = 0; x < members.length; x++){
                if (members[x].profile.email == userEmail){
                    bot.postMessageToUser(members[x].name, message);
                }
            }       
        })
    },
    caseUpdated: function(user, cid, appliedTo, status, userEmail, assignee){

        const message ='Hi '+ user +', '
        +'Your requirement case `'+cid+'` to '+ appliedTo
        +' has been updated to "*'+status+'*", by '
        +assignee +'. Please check your email for more details.'+' Thank you.'
        ;

        axios.get('https://slack.com/api/users.list?token='+ keys.slackbot.api_key)
        .then(function (response) {
            var members = response.data.members;
            for (var x = 0; x < members.length; x++){
                if (members[x].profile.email == userEmail){
                    bot.postMessageToUser(members[x].name, message);
                }
            }       
        })
    }

}

