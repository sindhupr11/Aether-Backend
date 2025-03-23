//backend/controllers/submissionController.js
const db = require('../models');
const offlineSubmissionService = require('../services/offlineSubmissionService');
const jwt = require('jsonwebtoken');

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

    await offlineSubmissionService.syncPendingSubmissions();

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New method for offline submissions
exports.submitOfflineResponse = async (req, res) => {
  try {
    const { form_id, data, token } = req.body;
    
    let user_id;
    try {
      // Try to decode the token locally without verification
      const decoded = jwt.decode(token.replace('Bearer ', ''));
      user_id = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Save submission offline
    const offlineSubmission = await offlineSubmissionService.saveOfflineSubmission(
      form_id,
      user_id,
      data
    );

    return res.status(200).json({
      message: 'Submission saved offline',
      submission: offlineSubmission
    });
  } catch (error) {
    console.error('Error submitting offline response:', error);
    res.status(500).json({ error: 'Failed to submit offline response' });
  }
};

exports.getPendingSubmissions = async (req, res) => {
  try {
    const user_id = req.user.id;
    const pendingSubmissions = await offlineSubmissionService.getPendingSubmissions(user_id);
    res.status(200).json(pendingSubmissions);
  } catch (error) {
    console.error('Error getting pending submissions:', error);
    res.status(500).json({ error: 'Failed to get pending submissions' });
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
const generatePDF = async (submissions) => {
  // You'll need to install and import a PDF library like PDFKit
  // This is a placeholder for the actual implementation
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument();
  
  // Create a buffer to store the PDF
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add content to PDF
      doc.text('Form Submissions');
      doc.moveDown();
      
      submissions.forEach((submission, index) => {
        doc.text(`Submission ${index + 1}:`);
        doc.text(JSON.stringify(submission.data, null, 2));
        doc.moveDown();
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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



