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


