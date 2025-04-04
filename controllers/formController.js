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
    const { projectId } = req.params;
    const forms = await Form.findAll({
      where: {
        userId: req.user.id,
        ...(projectId && { project_id: projectId })
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

exports.getFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    // Find the form by ID and verify user has access
    const form = await Form.findOne({
      where: { 
        id: formId,
        userId: req.user.id  // Add user authorization check
      },
      include: [{
        model: Field,
        attributes: ['id', 'label', 'type', 'required', 'defaultValue']
      }]
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or unauthorized access' });
    }

    // Return consistent response structure
    res.json({
      id: form.id,
      name: form.name,
      projectName: form.projectName,  // Added projectName
      project_id: form.project_id,
      userId: form.userId,  // Added userId for consistency
      fields: form.Fields.map(field => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        defaultValue: field.defaultValue
      }))
    });

  } catch (error) {
    console.error('Error in getFormById:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Invalid form data' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateForm = async (req, res) => {
  try {
      const { id } = req.params;
      const { fields } = req.body; // Expecting an array of fields

      // Find the form to ensure it exists
      const form = await Form.findOne({
          where: { id, userId: req.user.id }
      });

      if (!form) {
          return res.status(404).json({ error: 'Form not found' });
      }

      if (!Array.isArray(fields) || fields.length === 0) {
          return res.status(400).json({ error: 'Fields array is required' });
      }

      // Find the last field order to append fields in sequence
      const lastField = await Field.findOne({
          where: { form_id: id },
          order: [['order', 'DESC']]
      });
      let order = lastField ? lastField.order + 1 : 1;

      const newFields = fields.map(field => ({
          label: field.label,
          type: field.type,
          required: field.required || false,
          form_id: id,
          is_primary_key: field.is_primary_key || false,
          order: order++,
          form_name: field.type === 'form reference' ? field.form_name : null  // Add form_name for form reference fields
      }));

      // Bulk insert fields into the database
      const addedFields = await Field.bulkCreate(newFields);

      res.status(200).json({
          message: "Fields added successfully",
          fields: addedFields
      });
  } catch (error) {
      console.error('Update form error:', error);
      res.status(500).json({ error: error.message });
  }
};

exports.getFormPrimaryKey = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the form's primary key field
    const primaryKeyField = await Field.findOne({
      where: { 
        form_id: id,
        is_primary_key: true
      }
    });

    if (!primaryKeyField) {
      return res.status(404).json({ error: 'No primary key field found for this form' });
    }

    res.json(primaryKeyField.label);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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


