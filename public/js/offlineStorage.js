// Client-side offline storage service
class OfflineStorage {
  constructor() {
    this.STORAGE_KEY = 'offline_submissions';
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', this.syncOfflineData.bind(this));
  }

  async saveOfflineSubmission(formData) {
    try {
      const submissions = this.getStoredSubmissions();
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
      return true;
    } catch (error) {
      console.error('Error saving offline submission:', error);
      return false;
    }
  }

  getStoredSubmissions() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async syncOfflineData() {
    const submissions = this.getStoredSubmissions();
    const unsynced = submissions.filter(sub => !sub.synced);

    for (const submission of unsynced) {
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': submission.token
          },
          body: JSON.stringify({
            form_id: submission.form_id,
            data: submission.data
          })
        });

        if (response.ok) {
          submission.synced = true;
        }
      } catch (error) {
        console.error('Error syncing submission:', error);
      }
    }

    // Update storage with sync status
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));

    // Remove synced submissions
    const remaining = submissions.filter(sub => !sub.synced);
    if (remaining.length === 0) {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining));
    }
  }

  clearOfflineData() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Initialize the offline storage service
const offlineStorage = new OfflineStorage();

// Export for use in other scripts
window.offlineStorage = offlineStorage; 