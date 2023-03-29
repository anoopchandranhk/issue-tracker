const Issue = require("../models/Issue");

// @route   GET api/issues/:project
// @desc    Get all issues for a project
// @access  Public

const getAllIssues = async (req, res) => {
    try {
        let project = req.params.project;
        console.log("project from get route", project);

        // get query parameters
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
        // console.log("_id", _id, "👍");

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


        // console.log("issues", issues);
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
        console.log("project from post route", project);

        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
        // console.log("issue_title", issue_title, "👍");
        // console.log("issue_text", issue_text, "👍");
        // console.log("created_by", created_by, "👍");
        // console.log("assigned_to", assigned_to, "👍");
        // console.log("status_text", status_text, "👍");
        // save project to DB
        if(!issue_title || !issue_text || !created_by){
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
    try {
        let project = req.params.project;
        console.log("project from put route", project);

        const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body
        // if no id
        if(!_id){
            res.json({ error: 'missing _id' })
        } else {

            // console.log("issue_title", issue_title, "👍");
            // console.log("issue_text", issue_text, "👍");
            // console.log("created_by", created_by, "👍");
            // console.log("assigned_to", assigned_to, "👍");
            // console.log("status_text", status_text, "👍");
            // console.log("open", open, "👍");
            // find issue from DB
            const issue = await Issue.findOne({ project: project, _id: _id });
            console.log("issue", issue);
            // update issue
            // if values
            if(issue_title) issue.issue_title = issue_title;
            if(issue_text) issue.issue_text = issue_text;
            if(created_by) issue.created_by = created_by;
            if(assigned_to) issue.assigned_to = assigned_to;
            if(status_text) issue.status_text = status_text;
            if(open) issue.open = open;
            issue.updated_on = Date.now();
            // save issue to DB
            await issue.save();
            res.json(
                {
                    result:"successfully updated",
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
        console.log("project from delete route", project);

        const { _id } = req.body
        // console.log("_id", _id, "👍");

        // if no _id
        if(!_id){
            res.json({ error: 'missing _id' })
        }
        // find issue from DB
        const issue = await Issue.findOne({ project: project, _id: _id });
        console.log("issue", issue);

        // delete issue from DB
        await issue.remove();
        res.json(
            {
                result: "successfully deleted",
                _id: _id
            }
        )
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