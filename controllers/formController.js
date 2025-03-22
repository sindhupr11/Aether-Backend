//backend/controllers/formController.js
const { Form, Project } = require('../models');

exports.createForm = async (req, res) => {
  try {
    const { name, projectName, sections, projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Fetch the project to get its name
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const form = await Form.create({
      name,
      projectName: project.name, // Use the project name from the database
      sections,
      userId: req.user.id,
      project_id: projectId
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

exports.getFormSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findOne({
      where: { id, userId: req.user.id },
      attributes: ['sections'] // Only fetch the sections field
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ schema: form.sections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
