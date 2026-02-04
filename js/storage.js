// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================

const Storage = {
    /**
     * Save contacts to localStorage
     * @param {Array} contacts - Array of contact objects
     * @returns {boolean} Success status
     */
    saveContacts(contacts) {
        try {
            const data = JSON.stringify(contacts);
            localStorage.setItem(CONFIG.STORAGE_KEY, data);
            return true;
        } catch (error) {
            console.error('Error saving contacts:', error);
            if (error.name === 'QuotaExceededError') {
                UI.showToast('Storage quota exceeded. Please delete some contacts.', 'error');
            }
            return false;
        }
    },

    /**
     * Load contacts from localStorage
     * @returns {Array} Array of contact objects
     */
    loadContacts() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            // First time user - load sample contacts
            this.saveContacts(CONFIG.SAMPLE_CONTACTS);
            return CONFIG.SAMPLE_CONTACTS;
        } catch (error) {
            console.error('Error loading contacts:', error);
            return [];
        }
    },

    /**
     * Save app settings to localStorage
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    },

    /**
     * Load app settings from localStorage
     * @returns {Object} Settings object
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(CONFIG.SETTINGS_KEY);
            return data ? JSON.parse(data) : CONFIG.DEFAULT_SETTINGS;
        } catch (error) {
            console.error('Error loading settings:', error);
            return CONFIG.DEFAULT_SETTINGS;
        }
    },

    /**
     * Clear all data from localStorage
     */
    clearAll() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.SETTINGS_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    /**
     * Export contacts as JSON
     * @param {Array} contacts - Contacts to export
     * @returns {string} JSON string
     */
    exportContacts(contacts) {
        return JSON.stringify(contacts, null, 2);
    },

    /**
     * Import contacts from JSON
     * @param {string} jsonData - JSON string of contacts
     * @returns {Array|null} Parsed contacts or null on error
     */
    importContacts(jsonData) {
        try {
            const contacts = JSON.parse(jsonData);
            if (Array.isArray(contacts)) {
                return contacts;
            }
            return null;
        } catch (error) {
            console.error('Error importing contacts:', error);
            return null;
        }
    },
};
