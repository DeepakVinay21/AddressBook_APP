// ============================================
// APP CONFIGURATION
// ============================================

const CONFIG = {
    // LocalStorage keys
    STORAGE_KEY: 'contactsApp_contacts',
    SETTINGS_KEY: 'contactsApp_settings',

    // Default settings
    DEFAULT_SETTINGS: {
        theme: 'auto', // 'light', 'dark', 'auto'
        sortBy: 'name', // 'name', 'recent'
    },

    // Avatar colors (will be assigned based on name hash)
    AVATAR_COLORS: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ],

    // Validation rules
    VALIDATION: {
        NAME_MIN_LENGTH: 1,
        NAME_MAX_LENGTH: 50,
        PHONE_MIN_LENGTH: 7,
        PHONE_MAX_LENGTH: 20,
        EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    // Animation durations (ms)
    ANIMATION: {
        FAST: 150,
        BASE: 250,
        SLOW: 350,
        TOAST_DURATION: 3000,
    },

    // Contact fields
    CONTACT_FIELDS: {
        REQUIRED: ['firstName', 'phone'],
        OPTIONAL: ['lastName', 'email', 'company', 'notes', 'photo', 'backgroundPhoto'],
    },

    // Group colors
    GROUP_COLORS: [
        '#667eea', // Purple
        '#f093fb', // Pink
        '#4facfe', // Blue
        '#43e97b', // Green
        '#fa709a', // Rose
        '#30cfd0', // Cyan
        '#fbbf24', // Amber
        '#f87171', // Red
    ],

    // Call history types
    CALL_TYPES: {
        OUTGOING: 'outgoing',
        INCOMING: 'incoming',
        MISSED: 'missed',
    },

    // Photo limits
    PHOTO: {
        MAX_SIZE: 500 * 1024, // 500KB
        MAX_WIDTH: 800,
        MAX_HEIGHT: 800,
        QUALITY: 0.8,
    },

    // Action button protocols
    PROTOCOLS: {
        CALL: 'tel:',
        SMS: 'sms:',
        EMAIL: 'mailto:',
        FACETIME: 'facetime:',
    },

    // Sample contacts for first-time users
    SAMPLE_CONTACTS: [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1 (555) 123-4567',
            email: 'john.doe@example.com',
            company: 'Tech Corp',
            notes: 'Met at conference',
            photo: null,
            backgroundPhoto: null,
            isFavorite: true,
            isBlocked: false,
            groups: ['Work', 'Colleagues'],
            callHistory: [],
            createdAt: Date.now() - 86400000 * 7,
            updatedAt: Date.now() - 86400000 * 7,
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+1 (555) 987-6543',
            email: 'jane.smith@example.com',
            company: 'Design Studio',
            notes: 'Graphic designer',
            photo: null,
            backgroundPhoto: null,
            isFavorite: false,
            isBlocked: false,
            groups: ['Work'],
            callHistory: [],
            createdAt: Date.now() - 86400000 * 5,
            updatedAt: Date.now() - 86400000 * 5,
        },
        {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            phone: '+1 (555) 456-7890',
            email: 'mike.j@example.com',
            company: '',
            notes: 'College friend',
            photo: null,
            backgroundPhoto: null,
            isFavorite: true,
            isBlocked: false,
            groups: ['Friends'],
            callHistory: [],
            createdAt: Date.now() - 86400000 * 3,
            updatedAt: Date.now() - 86400000 * 3,
        },
    ],
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
