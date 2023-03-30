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
    try {
        let project = req.params.project;

        if (!_id) {
            res.json({ error: 'missing _id' })
        }
        // if no values
        else if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
            res.json({ error: 'no update field(s) sent', '_id': _id })
        }
        else {

            // if values
            let fields = {
                // project: project
            };
            // if (_id) fields._id = _id;
            if (issue_title) fields.issue_title = issue_title;
            if (issue_text) fields.issue_text = issue_text;
            if (created_by) fields.created_by = created_by;
            if (assigned_to) fields.assigned_to = assigned_to;
            if (status_text) fields.status_text = status_text;
            if (open !== undefined) { 
                fields.open = open; 
            }
            fields.updated_on = Date.now();
            const issue = await Issue.findByIdAndUpdate(_id, fields, { new: true }).exec();
            // update issue
            res.json(
                {
                    result: "successfully updated",
                    _id: _id
                }
            )
        }

    } catch (error) {
        res.json({ error: 'could not update', '_id': _id })
    }
}


// @route   DELETE api/issues/:project
// @desc    Delete issue for a project
// @access  Public

const deleteIssue = async (req, res) => {
    try {
        let project = req.params.project;

        const { _id } = req.body

        // if no _id
        if (!_id || !_id.trim()) {
            res.json({ error: 'missing _id' })
        } else {
            
            // delete by id using mongoose
            Issue.deleteOne({ _id: _id }).then(function(){
                res.json(
                    {
                        result: "successfully deleted",
                        _id: _id
                    }
                )
            }).catch(function(error){
                res.json({ error: 'could not delete', '_id': _id })
            });

        }
    } catch (error) {
        res.json({ error: 'could not delete', '_id': _id })
    }
}





module.exports = {
    getAllIssues,
    createIssue,
    updateIssue,
    deleteIssue
}