//backend/controllers/formController.js
const db = require('../models');

exports.createForm = async (req, res) => {
  try {
    const { name, description, project_id, fields } = req.body;

    const form = await db.Form.create({ name, description, project_id });

    if (fields && fields.length > 0) {
      const fieldRecords = fields.map(field => ({ ...field, form_id: form.id }));
      await db.Field.bulkCreate(fieldRecords);
    }

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFormsByProject = async (req, res) => {
  try {
    const { project_id } = req.params;

    const forms = await db.Form.findAll({ where: { project_id }, include: db.Field });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
