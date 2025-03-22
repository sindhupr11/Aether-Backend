//backend/controllers/formController.js
const { Form, Project, Field } = require('../models');

exports.createForm = async (req, res) => {
  try {
    const { name, projectName, projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const form = await Form.create({
      name,
      projectName: project.name, 
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

exports.getFormSchema = async (req, res) => {
  try {
    const { id } = req.params;
    
    const form = await Form.findOne({
      where: { id, userId: req.user.id },
      include: [{
        model: Field,
        attributes: ['id', 'label', 'type', 'required']
      }]
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const schema = {
      type: 'object',
      properties: {},
      required: []
    };

    form.Fields.forEach(field => {
      schema.properties[field.label] = {
        type: field.type,
        fieldId: field.id
      };
      
      if (field.required) {
        schema.required.push(field.label);
      }
    });
    
    res.json(schema);
  } catch (error) {
    console.error('Get form schema error:', error);
    res.status(500).json({ error: error.message });
  }
};

// exports.updateForm = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const form = await Form.findOne({
//       where: { id, userId: req.user.id }
//     });

//     if (!form) {
//       return res.status(404).json({ error: 'Form not found' });
//     }

//     await form.save();
//     res.json(form);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteForm = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await Form.destroy({
//       where: { id, userId: req.user.id }
//     });
    
//     if (!result) {
//       return res.status(404).json({ error: 'Form not found' });
//     }
    
//     res.json({ message: 'Form deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


