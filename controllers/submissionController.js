//backend/controllers/submissionController.js
const db = require('../models');
const PDFDocument = require('pdfkit');

exports.submitResponse = async (req, res) => {
  try {
    const { form_id, data } = req.body;
    const user_id = req.user.id; // From auth middleware

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
    const { format } = req.body;

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

    // Handle different formats
    switch (format?.toLowerCase()) {
      case 'csv':
        const csv = await convertToCSV(submissions);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=form_${formId}_submissions.csv`);
        return res.send(csv);

      case 'pdf':
        const pdf = await generatePDF(submissions);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=form_${formId}_submissions.pdf`);
        return res.send(pdf);

      default:
        // If no format specified, return JSON as before
        return res.json(submissions);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to convert submissions to CSV
const convertToCSV = async (submissions) => {
  if (submissions.length === 0) return '';
  
  // Get headers from the first submission's data
  const headers = Object.keys(submissions[0].data);
  const csvHeader = headers.join(',') + '\n';
  
  // Convert each submission to CSV row
  const csvRows = submissions.map(submission => {
    return headers.map(header => {
      const value = submission.data[header];
      // Handle special characters and commas in the value
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');

  return csvHeader + csvRows;
};

// Helper function to generate PDF
function generatePDF(submissions) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title
      doc.fontSize(20).text('Submissions Report', { align: 'center' });
      doc.moveDown(2);

      // Add content to the PDF
      submissions.forEach((submission, index) => {
        // Submission header with timestamp
        doc.fontSize(14)
          .fillColor('#2563eb')
          .text(`Submission ${index + 1}`, { underline: true });
        
        doc.fontSize(10)
          .fillColor('#666666')
          .text(`Submitted on: ${new Date(submission.createdAt).toLocaleString()}`);
        
        doc.moveDown(0.5);

        // Submission data
        doc.fontSize(12).fillColor('#000000');
        Object.entries(submission.data).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, {
            indent: 20,
            continued: false
          });
        });

        // Add separator between submissions
        doc.moveDown();
        if (index < submissions.length - 1) {
          doc.strokeColor('#cccccc')
             .moveTo(50, doc.y)
             .lineTo(550, doc.y)
             .stroke();
        }
        doc.moveDown();
      });

      // Finalize PDF file
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

//all submission of a field
exports.getFieldSubmissions = async (req, res) => {
  try {
    const { formName, fieldName } = req.body;

    if (!fieldName) {
      return res.status(400).json({ error: 'Field name is required' });
    }

    // Check if form exists
    const form = await db.Form.findOne({ where: { name: formName } });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get all submissions for this form
    const submissions = await db.Submission.findAll({
      where: { form_id: form.id },
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

//id + pk
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

//one entry
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



