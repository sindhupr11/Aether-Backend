//backend/controllers/formController.js
const { Form } = require('../models');

exports.createForm = async (req, res) => {
  try {
    const { name, projectName, sections } = req.body;
    const form = await Form.create({
      name,
      projectName,
      sections,
      userId: req.user.id
    });
    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const { projectName } = req.query;
    const forms = await Form.findAll({
      where: {
        userId: req.user.id,
        ...(projectName && { projectName })
      }
    });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.body;
    
    const form = await Form.findOne({
      where: { id, userId: req.user.id }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    form.sections = sections;
    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Form.destroy({
      where: { id, userId: req.user.id }
    });
    
    if (!result) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
