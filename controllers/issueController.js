const Issue = require("../models/Issue");

// @route   GET api/issues/:project
// @desc    Get all issues for a project
// @access  Public

const getAllIssues = async (req, res) => {
    try {
        let project = req.params.project;

        let {
            _id,
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            created_on,
            updated_on,
            open
        } = req.query;

        // if query parameters are not empty, create a filter object
        let filter = {
            project: project
        };
        if (_id) filter._id = _id;
        if (issue_title) filter.issue_title = issue_title;
        if (issue_text) filter.issue_text = issue_text;
        if (created_by) filter.created_by = created_by;
        if (assigned_to) filter.assigned_to = assigned_to;
        if (status_text) filter.status_text = status_text;
        if (created_on) filter.created_on = created_on;
        if (updated_on) filter.updated_on = updated_on;
        if (open) filter.open = open;

        // get all issues for a project
        const issues = await Issue.find(filter)

        res.json(issues.map((issue) => {
            return {
                _id: issue._id,
                issue_title: issue.issue_title,
                issue_text: issue.issue_text,
                created_by: issue.created_by,
                assigned_to: issue.assigned_to,
                status_text: issue.status_text,
                created_on: issue.created_on,
                updated_on: issue.updated_on,
                open: issue.open
            }
        }));
    } catch (error) {
        res.json({
            status: "error",
            error: error.message
        })
    }
}

// @route   POST api/issues/:project
// @desc    Create issue for a project
// @access  Public

const createIssue = async (req, res) => {
    try {
        let project = req.params.project;

        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
        // save project to DB
        if (!issue_title || !issue_text || !created_by) {
            res.json({ error: 'required field(s) missing' })
        } else {
            const newIssue = new Issue({
                project: project,
                issue_title: issue_title,
                issue_text: issue_text,
                created_by: created_by,
                assigned_to: assigned_to,
                status_text: status_text
            });
            await newIssue.save();
            res.json(
                {
                    _id: newIssue._id,
                    issue_title: newIssue.issue_title,
                    issue_text: newIssue.issue_text,
                    created_by: newIssue.created_by,
                    assigned_to: newIssue.assigned_to,
                    status_text: newIssue.status_text,
                    open: newIssue.open,
                    created_on: newIssue.created_on,
                    updated_on: newIssue.updated_on,
                }
            )
        }
    } catch (error) {
        res.json({
            status: "error",
            error: error.message
        })
    }
}


// @route   PUT api/issues/:project
// @desc    Update issue for a project
// @access  Public

const updateIssue = async (req, res) => {
    const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body
    console.log(_id, issue_title, issue_text, created_by, assigned_to, status_text, open, "_id, issue_title, issue_text, created_by, assigned_to, status_text, open");
    try {
        let project = req.params.project;
        console.log(project, "project from update");

        if (!_id) {
            console.log({ error: 'missing _id from update' });
            res.json({ error: 'missing _id' })
        }
        // check if issue with _id exists in db
        const issueFound = await Issue.findById(_id)
        console.log(issueFound, "issueFound");
        if (!issueFound){
            res.json({ error: 'could not update', '_id': _id })
        }


        // if no values
        if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
            console.log({ error: 'no update field(s) sent from update', '_id': _id });
            res.json({ error: 'no update field(s) sent', '_id': _id })
        }
        else {

            // if values
            let fields = {
            };
            if (issue_title) fields.issue_title = issue_title;
            if (issue_text) fields.issue_text = issue_text;
            if (created_by) fields.created_by = created_by;
            if (assigned_to) fields.assigned_to = assigned_to;
            if (status_text) fields.status_text = status_text;
            if (open !== undefined) {
                fields.open = open;
            }
            fields.updated_on = Date.now();
            // find by id and see if its exists
            const issue = await Issue.findByIdAndUpdate(_id, fields, { new: true }).exec();
            // update issue
            console.log({ result: "successfully updated  from update", _id: _id });
            res.json(
                {
                    result: "successfully updated",
                    _id: _id
                }
            )





        // Issue.findOne({ _id: _id }, (err, issue) => {
        //     if (err || !issue) {
        //         res.json({ error: "could not update", _id: _id });
        //     } else {
        //         if (issue_title) issue.issue_title = issue_title;
        //         if (issue_text) issue.issue_text = issue_text;
        //         if (created_by) issue.created_by = created_by;
        //         if (assigned_to) issue.assigned_to = assigned_to;
        //         if (status_text) issue.status_text = status_text;
        //         if (open !== undefined) {
        //             issue.open = open;
        //         }
        //         issue.updated_on = Date.now();
        //         issue.save((err, data) => {
        //             if (err || !data) {
        //                 res.json({ error: "could not update", _id: _id });
        //             } else {
        //                 res.json({ result: "successfully updated", _id: _id });
        //             }
        //         });
        //     }
        // });









    }

    } catch (error) {
    console.log({ error: 'could not update  from catch', '_id': _id });
    res.json({ error: 'could not update', '_id': _id })
}
}


// @route   DELETE api/issues/:project
// @desc    Delete issue for a project
// @access  Public

const deleteIssue = async (req, res) => {
    try {
        let project = req.params.project;
        console.log(project, "project from delete");


        const { _id } = req.body

        // if no _id
        if (!_id || !_id.trim()) {
            console.log({ error: 'missing _id from delete' });

            res.json({ error: 'missing _id' })
        } else {
            // find by id and see if it exists else error it out

            // delete by id using mongoose
            Issue.deleteOne({ _id: _id }).then(function () {
                console.log({ result: "successfully deleted", _id: _id });

                res.json(
                    {
                        result: "successfully deleted",
                        _id: _id
                    }
                )
            }).catch(function (error) {
                console.log({ error: 'could not delete', '_id': _id });
                res.json({ error: 'could not delete', '_id': _id })
            });

        }
    } catch (error) {
        console.log({ error: 'could not delete from catch', '_id': _id });
        res.json({ error: 'could not delete', '_id': _id })
    }
}





module.exports = {
    getAllIssues,
    createIssue,
    updateIssue,
    deleteIssue
}