// ============================================
// MAIN APP INITIALIZATION
// ============================================

const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('📱 Contact App initializing...');

        // Initialize contacts data
        Contacts.init();

        // Initialize UI
        UI.init();

        // Set up service worker (optional for PWA)
        this.registerServiceWorker();

        console.log('✅ Contact App ready!');
    },

    /**
     * Register service worker for PWA support (optional)
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Uncomment to enable PWA features
            // navigator.serviceWorker.register('/sw.js')
            //   .then(reg => console.log('Service Worker registered', reg))
            //   .catch(err => console.log('Service Worker registration failed', err));
        }
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
