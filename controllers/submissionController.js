//backend/controllers/submissionController.js
const db = require('../models');

exports.submitResponse = async (req, res) => {
  try {
    const { form_id, data } = req.body;

    // First check if the form exists
    const form = await db.Form.findByPk(form_id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const submission = await db.Submission.create({ form_id, data });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFormSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;

    // Check if form exists
    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get all submissions for this form
    const submissions = await db.Submission.findAll({
      where: { form_id: formId },
      order: [['createdAt', 'DESC']]
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFieldSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const { fieldName } = req.body;

    if (!fieldName) {
      return res.status(400).json({ error: 'Field name is required' });
    }

    // Check if form exists
    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get all submissions for this form
    const submissions = await db.Submission.findAll({
      where: { form_id: formId },
      order: [['createdAt', 'DESC']]
    });

    // Extract the specified field data from each submission
    const fieldData = submissions.map(submission => {
      const submissionData = submission.data;
      return {
        submissionId: submission.id,
        value: submissionData[fieldName],
        createdAt: submission.createdAt
      };
    });

    res.json(fieldData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmissionIdentifiers = async (req, res) => {
  try {
    const { formId } = req.params;

    // Check if form exists and get its primary key field
    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get the primary key field for this form
    const primaryKeyField = await db.Field.findOne({
      where: {
        form_id: formId,
        is_primary_key: true
      }
    });

    if (!primaryKeyField) {
      return res.status(404).json({ error: 'No primary key field found for this form' });
    }

    // Get all submissions for this form
    const submissions = await db.Submission.findAll({
      where: { form_id: formId },
      order: [['createdAt', 'DESC']]
    });

    // Extract just the submission ID and primary key value
    const identifiers = submissions.map(submission => ({
      submissionId: submission.id,
      [primaryKeyField.label]: submission.data[primaryKeyField.label]
    }));

    res.json(identifiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmissionByPrimaryKey = async (req, res) => {
  try {
    const { formId } = req.params;
    const { primaryKeyValue } = req.body;

    if (!primaryKeyValue) {
      return res.status(400).json({ error: 'Primary key value is required' });
    }

    // Check if form exists
    const form = await db.Form.findByPk(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get the primary key field for this form
    const primaryKeyField = await db.Field.findOne({
      where: {
        form_id: formId,
        is_primary_key: true
      }
    });

    if (!primaryKeyField) {
      return res.status(404).json({ error: 'No primary key field found for this form' });
    }

    // Find submission where the primary key field matches the provided value
    const submission = await db.Submission.findOne({
      where: { 
        form_id: formId,
        [`data.${primaryKeyField.label}`]: primaryKeyValue
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Find the submission by ID
    const submission = await db.Submission.findByPk(submissionId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Return just the submission data (JSONB)
    res.json(submission.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



