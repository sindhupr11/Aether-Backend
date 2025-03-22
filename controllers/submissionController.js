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
