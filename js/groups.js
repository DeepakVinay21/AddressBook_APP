// ============================================
// GROUP MANAGEMENT
// ============================================

const Groups = {
    /**
     * Initialize groups
     */
    init() {
        this.list = this.loadGroups();
    },

    /**
     * Load groups from storage or use defaults
     */
    loadGroups() {
        const saved = localStorage.getItem('contactsApp_groups');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            { name: 'Family', color: '#f87171' },
            { name: 'Friends', color: '#43e97b' },
            { name: 'Work', color: '#667eea' }
        ];
    },

    /**
     * Save groups to storage
     */
    save() {
        localStorage.setItem('contactsApp_groups', JSON.stringify(this.list));
    },

    /**
     * Get all groups
     */
    getAllGroups() {
        return [...this.list];
    },

    /**
     * Create new group
     */
    createGroup(name, color = '#667eea') {
        if (this.list.some(g => g.name.toLowerCase() === name.toLowerCase())) {
            return false; // Group exists
        }

        this.list.push({ name, color });
        this.save();
        return true;
    },

    /**
     * Delete group
     */
    deleteGroup(name) {
        const index = this.list.findIndex(g => g.name === name);
        if (index === -1) return false;

        this.list.splice(index, 1);
        this.save();
        return true;
    }
};

Groups.init();
