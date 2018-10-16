const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    caseID: Number,
    requester: String,
    requesterEmail: String,
    department: String,
    caseCreated: String,
    caseDescription: String,
    caseStatus: String,
    appliedTo: String,
    assignedTo: String,
    feedback: String,
    priority: String
});

const Case = mongoose.model('case', requestSchema);

module.exports = Case;