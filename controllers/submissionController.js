const db = require('../models');

exports.submitResponse = async (req, res) => {
  try {
    const { form_id, data } = req.body;

    const submission = await db.Submission.create({ form_id, data });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
