const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
// require dotenv config
require('dotenv').config();
let issueId = process.env.PLATFORM_ENV === "production" ? "6423bbec17bf687475a662dc" : "6423da0919fa4d6af808ee79"
let deleteIssueId = process.env.PLATFORM_ENV === "production" ? "64244515e066a12afeb3153c" : "642446c5eb232edbd2f0f41f"
chai.use(chaiHttp);

suite('Functional Tests', function () {

    // Create an issue with every field: POST request to /api/issues/{project}

    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Every field filled in',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
                assert.equal(res.body.assigned_to, 'Chai and Mocha');
                assert.equal(res.body.status_text, 'In QA');
                assert.equal(res.body.open, true);
                assert.property(res.body, '_id');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                done();
            });
    });

    // Create an issue with only required fields: POST request to /api/issues/{project}

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields filled in'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Title');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.equal(res.body.open, true);
                assert.property(res.body, '_id');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                done();
            });
    });



    // Create an issue with missing required fields: POST request to /api/issues/{project}

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
        chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Title',
                created_by: 'Functional Test - Missing required fields'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    });

    // View issues on a project: GET request to /api/issues/{project}
    test('View issues on a project: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/apitest')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text');
                assert.property(res.body[0], 'created_on');
                assert.property(res.body[0], 'updated_on');
                assert.property(res.body[0], 'created_by');
                assert.property(res.body[0], 'assigned_to');
                assert.property(res.body[0], 'open');
                assert.property(res.body[0], 'status_text');
                assert.property(res.body[0], '_id');
                done();
            });
    });


    // View issues on a project with one filter: GET request to /api/issues/{project}
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/apitest')
            .query({
                open: true
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text');
                assert.property(res.body[0], 'created_on');
                assert.property(res.body[0], 'updated_on');
                assert.property(res.body[0], 'created_by');
                assert.property(res.body[0], 'assigned_to');
                assert.property(res.body[0], 'open');
                assert.property(res.body[0], 'status_text');
                assert.property(res.body[0], '_id');
                done();
            });
    });


    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai.request(server)
            .get('/api/issues/apitest')
            .query({
                open: true,
                assigned_to: 'Chai and Mocha'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], 'issue_title');
                assert.property(res.body[0], 'issue_text');
                assert.property(res.body[0], 'created_on');
                assert.property(res.body[0], 'updated_on');
                assert.property(res.body[0], 'created_by');
                assert.property(res.body[0], 'assigned_to');
                assert.property(res.body[0], 'open');
                assert.property(res.body[0], 'status_text');
                assert.property(res.body[0], '_id');
                done();
            });
    });


    // Update one field on an issue: PUT request to /api/issues/{project}
    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issueId,
                issue_title: 'Updated Title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, issueId);
                done();
            });
    });


    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issueId,
                issue_title: 'Updated Title',
                issue_text: 'Updated Text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, issueId);
                done();
            });
    });


    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                issue_title: 'Updated Title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });


    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issueId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, issueId);
                done();
            });
    });



    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '423b3b6c59f841fa7344a4',
                issue_title: 'Updated Title'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, '423b3b6c59f841fa7344a4');
                done();
            });
    });



    // Delete an issue: DELETE request to /api/issues/{project}
    test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: deleteIssueId
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, deleteIssueId);
                done();
            });
    });


    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: '6423b3b6c59f841fa734'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, '6423b3b6c59f841fa734');
                done();
            });
    });


    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });


});
