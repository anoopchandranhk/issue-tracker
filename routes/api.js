'use strict';
const {getAllIssues,  createIssue, updateIssue,  deleteIssue} = require("../controllers/issueController")
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(getAllIssues)
    
    .post(createIssue)
    
    .put(updateIssue)
    
    .delete(deleteIssue);
    
};
