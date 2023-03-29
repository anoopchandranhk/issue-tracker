const Issue = require("../models/Issue");

// @route   GET api/issues/:project
// @desc    Get all issues for a project
// @access  Public

const getAllIssues = async (req, res) => {
    try {
        let project = req.params.project;
        console.log("project from get route", project);

        const issues = await Issue.find({ project: project });
        console.log("issues", issues);
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
        issue.issue_title = issue_title;
        issue.issue_text = issue_text;
        issue.created_by = created_by;
        issue.assigned_to = assigned_to;
        issue.status_text = status_text;
        issue.open = open;
        issue.updated_on = Date.now();
        // save issue to DB
        await issue.save();
        res.json(
            {
                result:"successfully updated",
                _id: _id
            }
        )
    } catch (error) {
        res.json({
            status: "error",
            error: error.message
        })
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
        res.json({
            status: "error",
            error: error.message
        })
    }
}





module.exports = {
    getAllIssues,
    createIssue,
    updateIssue,
    deleteIssue
}