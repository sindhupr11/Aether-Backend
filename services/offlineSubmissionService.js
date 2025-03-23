const db = require('../models');

class OfflineSubmissionService {
  async saveOfflineSubmission(formId, userId, submissionData) {
    try {
      const offlineSubmission = await db.OfflineSubmission.create({
        form_id: formId,
        user_id: userId,
        data: submissionData,
        synced: false
      });
      return offlineSubmission;
    } catch (error) {
      console.error('Error saving offline submission:', error);
      throw error;
    }
  }

  async syncPendingSubmissions() {
    try {
      const pendingSubmissions = await db.OfflineSubmission.findAll({
        where: { synced: false }
      });

      for (const submission of pendingSubmissions) {
        try {
          // Create the actual submission in the main submissions table
          await db.Submission.create({
            form_id: submission.form_id,
            data: submission.data
          });

          // Mark as synced
          submission.synced = true;
          submission.synced_at = new Date();
          await submission.save();
        } catch (error) {
          console.error(`Failed to sync submission ${submission.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error syncing pending submissions:', error);
      throw error;
    }
  }

  async getPendingSubmissions(userId) {
    try {
      return await db.OfflineSubmission.findAll({
        where: {
          user_id: userId,
          synced: false
        },
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      console.error('Error getting pending submissions:', error);
      throw error;
    }
  }
}

module.exports = new OfflineSubmissionService(); 