// ============================================
// CONTACT DATA OPERATIONS
// ============================================

const Contacts = {
    // In-memory contact list
    list: [],

    /**
     * Initialize contacts from storage
     */
    init() {
        this.list = Storage.loadContacts();
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Add new contact
     * @param {Object} contactData - Contact information
     * @returns {Object|null} Created contact or null on error
     */
    addContact(contactData) {
        try {
            const contact = {
                id: this.generateId(),
                firstName: contactData.firstName.trim(),
                lastName: contactData.lastName?.trim() || '',
                phone: contactData.phone.trim(),
                email: contactData.email?.trim() || '',
                company: contactData.company?.trim() || '',
                notes: contactData.notes?.trim() || '',
                photo: contactData.photo || null,
                backgroundPhoto: contactData.backgroundPhoto || null,
                isFavorite: false,
                isBlocked: false,
                groups: contactData.groups || [],
                callHistory: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            this.list.push(contact);
            this.save();
            return contact;
        } catch (error) {
            console.error('Error adding contact:', error);
            return null;
        }
    },

    /**
     * Update existing contact
     * @param {string} id - Contact ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated contact or null on error
     */
    updateContact(id, updates) {
        try {
            const index = this.list.findIndex(c => c.id === id);
            if (index === -1) return null;

            this.list[index] = {
                ...this.list[index],
                ...updates,
                updatedAt: Date.now(),
            };

            this.save();
            return this.list[index];
        } catch (error) {
            console.error('Error updating contact:', error);
            return null;
        }
    },

    /**
     * Delete contact
     * @param {string} id - Contact ID
     * @returns {boolean} Success status
     */
    deleteContact(id) {
        try {
            const index = this.list.findIndex(c => c.id === id);
            if (index === -1) return false;

            this.list.splice(index, 1);
            this.save();
            return true;
        } catch (error) {
            console.error('Error deleting contact:', error);
            return false;
        }
    },

    /**
     * Get contact by ID
     * @param {string} id - Contact ID
     * @returns {Object|null} Contact or null if not found
     */
    getContact(id) {
        return this.list.find(c => c.id === id) || null;
    },

    /**
     * Get all contacts
     * @returns {Array} All contacts
     */
    getAllContacts() {
        return [...this.list];
    },

    /**
     * Search contacts by query
     * @param {string} query - Search query
     * @returns {Array} Matching contacts
     */
    searchContacts(query) {
        if (!query || query.trim() === '') {
            return this.getAllContacts();
        }

        const searchTerm = query.toLowerCase().trim();
        return this.list.filter(contact => {
            const searchableFields = [
                contact.firstName,
                contact.lastName,
                contact.phone,
                contact.email,
                contact.company,
            ].join(' ').toLowerCase();

            return searchableFields.includes(searchTerm);
        });
    },

    /**
     * Toggle favorite status
     * @param {string} id - Contact ID
     * @returns {boolean} New favorite status
     */
    toggleFavorite(id) {
        const contact = this.getContact(id);
        if (!contact) return false;

        contact.isFavorite = !contact.isFavorite;
        contact.updatedAt = Date.now();
        this.save();
        return contact.isFavorite;
    },

    /**
     * Get favorite contacts
     * @returns {Array} Favorite contacts
     */
    getFavorites() {
        return this.list.filter(c => c.isFavorite);
    },

    /**
     * Toggle block status
     * @param {string} id - Contact ID
     * @returns {boolean} New block status
     */
    toggleBlock(id) {
        const contact = this.getContact(id);
        if (!contact) return false;

        contact.isBlocked = !contact.isBlocked;
        contact.updatedAt = Date.now();
        this.save();
        return contact.isBlocked;
    },

    /**
     * Get blocked contacts
     * @returns {Array} Blocked contacts
     */
    getBlocked() {
        return this.list.filter(c => c.isBlocked);
    },

    /**
     * Get contacts by group
     * @param {string} groupName - Group name
     * @returns {Array} Contacts in group
     */
    getContactsByGroup(groupName) {
        return this.list.filter(c => c.groups && c.groups.includes(groupName));
    },

    /**
     * Get all unique groups
     * @returns {Array} Array of group names
     */
    getAllGroups() {
        const groups = new Set();
        this.list.forEach(contact => {
            if (contact.groups && Array.isArray(contact.groups)) {
                contact.groups.forEach(group => groups.add(group));
            }
        });
        return Array.from(groups).sort();
    },

    /**
     * Assign contact to group
     * @param {string} id - Contact ID
     * @param {string} groupName - Group name
     * @returns {boolean} Success status
     */
    assignToGroup(id, groupName) {
        const contact = this.getContact(id);
        if (!contact) return false;

        if (!contact.groups) contact.groups = [];
        if (!contact.groups.includes(groupName)) {
            contact.groups.push(groupName);
            contact.updatedAt = Date.now();
            this.save();
            return true;
        }
        return false;
    },

    /**
     * Remove contact from group
     * @param {string} id - Contact ID
     * @param {string} groupName - Group name
     * @returns {boolean} Success status
     */
    removeFromGroup(id, groupName) {
        const contact = this.getContact(id);
        if (!contact || !contact.groups) return false;

        const index = contact.groups.indexOf(groupName);
        if (index > -1) {
            contact.groups.splice(index, 1);
            contact.updatedAt = Date.now();
            this.save();
            return true;
        }
        return false;
    },

    /**
     * Sort contacts alphabetically by name
     * @param {Array} contacts - Contacts to sort
     * @returns {Array} Sorted contacts
     */
    sortByName(contacts = this.list) {
        return [...contacts].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    },

    /**
     * Group contacts by first letter
     * @param {Array} contacts - Contacts to group
     * @returns {Object} Contacts grouped by letter
     */
    groupByLetter(contacts = this.list) {
        const sorted = this.sortByName(contacts);
        const grouped = {};

        sorted.forEach(contact => {
            const letter = contact.firstName.charAt(0).toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(contact);
        });

        return grouped;
    },

    /**
     * Add call history entry
     * @param {string} id - Contact ID
     * @param {string} type - Call type (outgoing, incoming, missed)
     * @param {number} duration - Duration in seconds
     */
    addCallHistoryEntry(id, type = 'outgoing', duration = 0) {
        const contact = this.getContact(id);
        if (!contact) return;

        if (!contact.callHistory) contact.callHistory = [];

        contact.callHistory.unshift({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            type,
            timestamp: Date.now(),
            duration,
        });

        // Keep last 50 entries
        if (contact.callHistory.length > 50) {
            contact.callHistory = contact.callHistory.slice(0, 50);
        }

        contact.updatedAt = Date.now();
        this.save();
    },

    /**
     * Get call history for contact
     * @param {string} id - Contact ID
     * @returns {Array} Call history entries
     */
    getCallHistory(id) {
        const contact = this.getContact(id);
        return contact ? (contact.callHistory || []) : [];
    },

    /**
     * Validate contact data
     * @param {Object} data - Contact data to validate
     * @returns {Object} Validation result {valid: boolean, errors: Array}
     */
    validate(data) {
        const errors = [];

        // Validate first name
        if (!data.firstName || data.firstName.trim().length < CONFIG.VALIDATION.NAME_MIN_LENGTH) {
            errors.push('First name is required');
        }
        if (data.firstName && data.firstName.length > CONFIG.VALIDATION.NAME_MAX_LENGTH) {
            errors.push('First name is too long');
        }

        // Validate phone
        if (!data.phone || data.phone.trim().length < CONFIG.VALIDATION.PHONE_MIN_LENGTH) {
            errors.push('Phone number is required');
        }
        if (data.phone && data.phone.length > CONFIG.VALIDATION.PHONE_MAX_LENGTH) {
            errors.push('Phone number is too long');
        }

        // Validate email (if provided)
        if (data.email && !CONFIG.VALIDATION.EMAIL_PATTERN.test(data.email)) {
            errors.push('Invalid email format');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    },

    /**
     * Save contacts to storage
     */
    save() {
        Storage.saveContacts(this.list);
    },
};
