// ============================================
// UI RENDERING & INTERACTIONS
// ============================================

const UI = {
    // Current state
    currentView: 'all', // 'all', 'favorites', 'groups'
    currentContact: null,
    searchQuery: '',

    /**
     * Initialize UI
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            contactList: document.getElementById('contactList'),
            emptyState: document.getElementById('emptyState'),
            addContactBtn: document.getElementById('addContactBtn'),
            bottomNavItems: document.querySelectorAll('.bottom-nav__item'),

            // Modals
            detailModal: document.getElementById('detailModal'),
            formModal: document.getElementById('formModal'),
            groupModal: document.getElementById('groupModal'),
            modalBackdrop: document.getElementById('modalBackdrop'),

            // Detail view elements
            detailCover: document.getElementById('detailCover'),
            detailAvatar: document.getElementById('detailAvatar'),
            detailName: document.getElementById('detailName'),
            detailPhone: document.getElementById('detailPhoneDisplay'),
            detailEmail: document.getElementById('detailEmail'),
            detailCompany: document.getElementById('detailCompany'),
            detailGroups: document.getElementById('detailGroups'),
            detailNotes: document.getElementById('detailNotes'),
            detailBadges: document.getElementById('detailBadges'),
            callHistoryList: document.getElementById('callHistoryList'),

            // Action buttons
            actionCall: document.getElementById('actionCall'),
            actionMessage: document.getElementById('actionMessage'),
            actionVideo: document.getElementById('actionVideo'),
            actionEmail: document.getElementById('actionEmail'),

            // Detail actions
            favoriteBtn: document.getElementById('favoriteBtn'),
            blockBtn: document.getElementById('blockBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            editBtn: document.getElementById('editBtn'),

            // Form elements
            contactForm: document.getElementById('contactForm'),
            formTitle: document.getElementById('formTitle'),
            photoInput: document.getElementById('photoInput'),
            photoPreview: document.getElementById('photoPreview'),
            coverInput: document.getElementById('coverInput'),
            coverPreview: document.getElementById('coverPreview'),
            firstNameInput: document.getElementById('firstNameInput'),
            lastNameInput: document.getElementById('lastNameInput'),
            phoneInput: document.getElementById('phoneInput'),
            emailInput: document.getElementById('emailInput'),
            companyInput: document.getElementById('companyInput'),
            groupTags: document.getElementById('groupTags'),
            addGroupBtn: document.getElementById('addGroupBtn'),
            notesInput: document.getElementById('notesInput'),
            cancelBtn: document.getElementById('cancelBtn'),

            // Group management
            createGroupForm: document.getElementById('createGroupForm'),
            newGroupName: document.getElementById('newGroupName'),
            groupColorPicker: document.getElementById('groupColorPicker'),
            groupsListContent: document.getElementById('groupsListContent'),
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search
        this.elements.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderContactList();
        });

        // Bottom navigation
        this.elements.bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchView(item.dataset.view);
            });
        });

        // Add contact button
        this.elements.addContactBtn.addEventListener('click', () => {
            this.showContactForm();
        });

        // Modal backdrop
        this.elements.modalBackdrop.addEventListener('click', () => {
            this.closeAllModals();
        });

        // Detail modal actions
        this.elements.favoriteBtn?.addEventListener('click', () => {
            this.toggleFavorite();
        });

        this.elements.blockBtn?.addEventListener('click', () => {
            this.toggleBlock();
        });

        this.elements.deleteBtn?.addEventListener('click', () => {
            this.deleteContact();
        });

        this.elements.editBtn?.addEventListener('click', () => {
            this.showContactForm(this.currentContact);
        });

        // Action buttons
        this.elements.actionCall?.addEventListener('click', (e) => this.handleAction(e, 'call'));
        this.elements.actionMessage?.addEventListener('click', (e) => this.handleAction(e, 'message'));
        this.elements.actionVideo?.addEventListener('click', (e) => this.handleAction(e, 'video'));
        this.elements.actionEmail?.addEventListener('click', (e) => this.handleAction(e, 'email'));

        // Form
        this.elements.contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });

        this.elements.cancelBtn?.addEventListener('click', () => {
            this.closeAllModals();
        });

        // Photo uploads
        this.elements.photoInput?.addEventListener('change', (e) => {
            this.handlePhotoUpload(e, 'profile');
        });

        this.elements.coverInput?.addEventListener('change', (e) => {
            this.handlePhotoUpload(e, 'cover');
        });

        // Groups
        this.elements.addGroupBtn?.addEventListener('click', () => {
            this.showGroupSelection();
        });

        this.elements.createGroupForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewGroup();
        });
    },

    /**
     * Switch between views (all, favorites, groups)
     */
    switchView(view) {
        this.currentView = view;

        // Update active nav item
        this.elements.bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        if (view === 'groups') {
            this.showGroupManagement();
        } else {
            this.renderContactList();
        }
    },

    /**
     * Main render function
     */
    render() {
        this.renderContactList();
    },

    /**
     * Render contact list
     */
    renderContactList() {
        let contacts = [];

        // Get contacts based on current view
        if (this.currentView === 'favorites') {
            contacts = Contacts.getFavorites();
        } else if (this.currentView === 'blocked') {
            contacts = Contacts.getBlocked();
        } else {
            contacts = Contacts.getAllContacts();
        }

        // Apply search filter
        if (this.searchQuery) {
            contacts = Contacts.searchContacts(this.searchQuery);
        }

        // Show empty state if no contacts
        if (contacts.length === 0) {
            this.showEmptyState();
            return;
        }

        this.elements.emptyState.classList.add('hidden');

        // Group contacts by first letter
        const grouped = Contacts.groupByLetter(contacts);

        // Render grouped contacts
        let html = '';
        Object.keys(grouped).sort().forEach(letter => {
            html += `
        <div class="contact-list__section">
          <div class="contact-list__header">${letter}</div>
          <div class="contact-list__items">
            ${grouped[letter].map(contact => this.renderContactCard(contact)).join('')}
          </div>
        </div>
      `;
        });

        this.elements.contactList.innerHTML = html;

        // Bind click events to contact cards
        this.bindContactCardEvents();
    },

    /**
     * Render individual contact card
     */
    renderContactCard(contact) {
        const fullName = `${contact.firstName} ${contact.lastName}`.trim();
        const initials = this.getInitials(contact);
        const avatarColor = this.getAvatarColor(contact.firstName);

        return `
      <div class="contact-card" data-id="${contact.id}">
        <div class="avatar avatar--sm" style="background: ${avatarColor}">
          ${contact.photo ? `<img src="${contact.photo}" alt="${fullName}">` : initials}
        </div>
        <div class="contact-card__info">
          <div class="contact-card__name truncate">${fullName}</div>
          <div class="contact-card__phone truncate">${contact.phone}</div>
        </div>
        <div class="contact-card__badge">
          ${contact.isFavorite ? '<span class="badge badge--favorite">★</span>' : ''}
          ${contact.isBlocked ? '<span class="badge badge--blocked">🚫</span>' : ''}
        </div>
      </div>
    `;
    },

    /**
     * Bind click events to contact cards
     */
    bindContactCardEvents() {
        const cards = document.querySelectorAll('.contact-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const contact = Contacts.getContact(id);
                if (contact) {
                    this.showContactDetail(contact);
                }
            });
        });
    },

    /**
     * Show contact detail modal
     */
    showContactDetail(contact) {
        this.currentContact = contact;
        const fullName = `${contact.firstName} ${contact.lastName}`.trim();
        const initials = this.getInitials(contact);
        const avatarColor = this.getAvatarColor(contact.firstName);

        // Update detail view
        // Cover photo
        if (contact.backgroundPhoto) {
            this.elements.detailCover.style.backgroundImage = `url(${contact.backgroundPhoto})`;
            this.elements.detailCover.classList.add('has-image');
        } else {
            this.elements.detailCover.style.backgroundImage = '';
            this.elements.detailCover.classList.remove('has-image');
        }

        this.elements.detailAvatar.style.background = avatarColor;
        this.elements.detailAvatar.innerHTML = contact.photo
            ? `<img src="${contact.photo}" alt="${fullName}">`
            : initials;

        this.elements.detailName.textContent = fullName;
        this.elements.detailPhone.textContent = contact.phone;
        this.elements.detailEmail.textContent = contact.email || 'Not provided';
        this.elements.detailCompany.textContent = contact.company || 'Not provided';
        this.elements.detailNotes.textContent = contact.notes || 'No notes';

        // Render groups
        if (contact.groups && contact.groups.length > 0) {
            const groupsHtml = contact.groups.map(g => {
                const groupInfo = Groups.getAllGroups().find(group => group.name === g) || { color: '#999' };
                return `<span class="group-badge" style="background-color: ${groupInfo.color}20; color: ${groupInfo.color}">${g}</span>`;
            }).join('');
            this.elements.detailGroups.innerHTML = groupsHtml;
        } else {
            this.elements.detailGroups.textContent = 'None';
        }

        // Render call history
        this.renderCallHistory();

        // Update badges
        const badges = [];
        if (contact.isFavorite) badges.push('<span class="badge badge--favorite">★ Favorite</span>');
        if (contact.isBlocked) badges.push('<span class="badge badge--blocked">🚫 Blocked</span>');
        this.elements.detailBadges.innerHTML = badges.join('');

        // Update favorite button
        this.elements.favoriteBtn.innerHTML = contact.isFavorite
            ? '★ Remove from Favorites'
            : '☆ Add to Favorites';

        // Update block button
        this.elements.blockBtn.innerHTML = contact.isBlocked
            ? '✓ Unblock Contact'
            : '🚫 Block Contact';

        this.showModal('detail');
    },

    /**
     * Show contact form modal
     */
    showContactForm(contact = null) {
        if (contact) {
            // Edit mode
            this.currentContact = contact;
            this.elements.formTitle.textContent = 'Edit Contact';
            this.elements.firstNameInput.value = contact.firstName;
            this.elements.lastNameInput.value = contact.lastName;
            this.elements.phoneInput.value = contact.phone;
            this.elements.emailInput.value = contact.email;
            this.elements.companyInput.value = contact.company;
            this.elements.notesInput.value = contact.notes;
            this.currentGroups = contact.groups ? [...contact.groups] : [];

            // Show current photo
            const initials = this.getInitials(contact);
            const avatarColor = this.getAvatarColor(contact.firstName);
            this.elements.photoPreview.style.background = avatarColor;
            this.elements.photoPreview.innerHTML = contact.photo
                ? `<img src="${contact.photo}" alt="${contact.firstName}">`
                : initials;

            // Show cover photo
            if (contact.backgroundPhoto) {
                this.elements.coverPreview.style.backgroundImage = `url(${contact.backgroundPhoto})`;
                this.elements.coverPreview.classList.add('has-image');
            } else {
                this.elements.coverPreview.style.backgroundImage = '';
                this.elements.coverPreview.classList.remove('has-image');
            }

            this.renderGroupTags();
        } else {
            // Add mode
            this.currentContact = null;
            this.currentGroups = [];
            this.elements.formTitle.textContent = 'New Contact';
            this.elements.contactForm.reset();
            this.elements.photoPreview.style.background = CONFIG.AVATAR_COLORS[0];
            this.elements.photoPreview.textContent = '?';
            this.elements.coverPreview.style.backgroundImage = '';
            this.elements.coverPreview.classList.remove('has-image');
            this.renderGroupTags();
        }

        this.showModal('form');
    },

    /**
     * Save contact (add or update)
     */
    saveContact() {
        const data = {
            firstName: this.elements.firstNameInput.value,
            lastName: this.elements.lastNameInput.value,
            phone: this.elements.phoneInput.value,
            email: this.elements.emailInput.value,
            company: this.elements.companyInput.value,
            notes: this.elements.notesInput.value,
            photo: this.elements.photoPreview.querySelector('img')?.src || null,
            backgroundPhoto: this.elements.coverPreview.style.backgroundImage.slice(5, -2) || null,
            groups: this.currentGroups || [],
        };

        // Handle empty background image from style (if it's just 'none' or empty)
        if (data.backgroundPhoto === 'none' || !data.backgroundPhoto) {
            data.backgroundPhoto = null;
        }

        // Validate
        const validation = Contacts.validate(data);
        if (!validation.valid) {
            this.showToast(validation.errors.join(', '), 'error');
            return;
        }

        // Save
        if (this.currentContact) {
            // Update existing
            Contacts.updateContact(this.currentContact.id, data);
            this.showToast('Contact updated successfully', 'success');
        } else {
            // Add new
            Contacts.addContact(data);
            this.showToast('Contact added successfully', 'success');
        }

        this.closeAllModals();
        this.render();
    },

    /**
     * Delete contact
     */
    deleteContact() {
        if (!this.currentContact) return;

        const name = `${this.currentContact.firstName} ${this.currentContact.lastName}`.trim();
        const message = `Are you sure you want to delete ${name}?\n\nThis will remove:\n- Contact information\n- Call history\n- Group assignments\n- Photos`;

        if (confirm(message)) {
            Contacts.deleteContact(this.currentContact.id);
            this.showToast('Contact deleted', 'success');
            this.closeAllModals();
            this.render();
        }
    },

    /**
     * Toggle favorite status
     */
    toggleFavorite() {
        if (!this.currentContact) return;

        const isFavorite = Contacts.toggleFavorite(this.currentContact.id);
        this.currentContact.isFavorite = isFavorite;

        // Update UI
        this.elements.favoriteBtn.innerHTML = isFavorite
            ? '★ Remove from Favorites'
            : '☆ Add to Favorites';

        const badges = [];
        if (this.currentContact.isFavorite) badges.push('<span class="badge badge--favorite">★ Favorite</span>');
        if (this.currentContact.isBlocked) badges.push('<span class="badge badge--blocked">🚫 Blocked</span>');
        this.elements.detailBadges.innerHTML = badges.join('');

        this.showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
        this.render();
    },

    /**
     * Toggle block status
     */
    toggleBlock() {
        if (!this.currentContact) return;

        const isBlocked = Contacts.toggleBlock(this.currentContact.id);
        this.currentContact.isBlocked = isBlocked;

        // Update UI
        this.elements.blockBtn.innerHTML = isBlocked
            ? '✓ Unblock Contact'
            : '🚫 Block Contact';

        const badges = [];
        if (this.currentContact.isFavorite) badges.push('<span class="badge badge--favorite">★ Favorite</span>');
        if (this.currentContact.isBlocked) badges.push('<span class="badge badge--blocked">🚫 Blocked</span>');
        this.elements.detailBadges.innerHTML = badges.join('');

        this.showToast(isBlocked ? 'Contact blocked' : 'Contact unblocked', 'success');
        this.render();
    },

    /**
     * Handle photo upload
     */
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('Image size must be less than 2MB', 'error');
            return;
        }

        // Read and display
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    },

    /**
     * Show modal
     */
    showModal(type) {
        this.elements.modalBackdrop.classList.add('active');

        if (type === 'detail') {
            this.elements.detailModal.classList.add('active');
        } else if (type === 'form') {
            this.elements.formModal.classList.add('active');
        } else if (type === 'group') {
            this.elements.groupModal.classList.add('active');
        }
    },

    /**
     * Close all modals
     */
    closeAllModals() {
        this.elements.modalBackdrop.classList.remove('active');
        this.elements.detailModal?.classList.remove('active');
        this.elements.formModal?.classList.remove('active');
        this.elements.groupModal?.classList.remove('active');
        this.currentContact = null;
    },

    /**
     * Show empty state
     */
    showEmptyState() {
        this.elements.contactList.innerHTML = '';
        this.elements.emptyState.classList.remove('hidden');
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} active`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, CONFIG.ANIMATION.TOAST_DURATION);
    },

    /**
     * Get initials from contact
     */
    getInitials(contact) {
        const first = contact.firstName.charAt(0).toUpperCase();
        const last = contact.lastName ? contact.lastName.charAt(0).toUpperCase() : '';
        return first + last;
    },

    /**
     * Show group management modal
     */
    showGroupManagement() {
        this.renderGroupsList();
        this.showModal('group');
        this.renderColorPicker();
    },

    /**
     * Render color picker
     */
    renderColorPicker() {
        let html = '';
        CONFIG.GROUP_COLORS.forEach((color, index) => {
            html += `
                <div class="color-option ${index === 0 ? 'selected' : ''}" 
                     style="background-color: ${color}" 
                     data-color="${color}"
                     onclick="UI.selectGroupColor(this)">
                </div>
            `;
        });
        this.elements.groupColorPicker.innerHTML = html;
        this.selectedGroupColor = CONFIG.GROUP_COLORS[0];
    },

    /**
     * Select group color
     */
    selectGroupColor(element) {
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedGroupColor = element.dataset.color;
    },

    /**
     * Create new group
     */
    createNewGroup() {
        const name = this.elements.newGroupName.value.trim();
        if (!name) return;

        if (Groups.createGroup(name, this.selectedGroupColor)) {
            this.elements.newGroupName.value = '';
            this.renderGroupsList();
            this.showToast('Group created successfully', 'success');
        } else {
            this.showToast('Group already exists', 'error');
        }
    },

    /**
     * Render groups list in management modal
     */
    renderGroupsList() {
        const groups = Groups.getAllGroups();
        if (groups.length === 0) {
            this.elements.groupsListContent.innerHTML = '<p class="text-center text-muted">No groups yet</p>';
            return;
        }

        let html = '';
        groups.forEach(group => {
            const contactCount = Contacts.getAllContacts().filter(c => c.groups && c.groups.includes(group.name)).length;
            html += `
                <div class="group-item">
                    <div class="group-item__info">
                        <span class="group-dot" style="background-color: ${group.color}"></span>
                        <span class="group-name">${group.name}</span>
                        <span class="group-count">${contactCount} contacts</span>
                    </div>
                    <button class="btn btn--icon btn--ghost btn--sm" onclick="UI.deleteGroup('${group.name}')">🗑️</button>
                </div>
            `;
        });
        this.elements.groupsListContent.innerHTML = html;
    },

    /**
     * Delete group
     */
    deleteGroup(groupName) {
        if (confirm(`Delete group "${groupName}"?`)) {
            if (Groups.deleteGroup(groupName)) {
                this.renderGroupsList();
                this.showToast('Group deleted', 'success');
            }
        }
    },

    /**
     * Show group selection for contact
     */
    showGroupSelection() {
        // Simple prompt for now - could be improved to a modal later
        const groups = Groups.getAllGroups();
        if (groups.length === 0) {
            this.showToast('Create a group first in the Groups tab', 'info');
            return;
        }

        const groupNames = groups.map(g => g.name).join('\n');
        const selected = prompt(`Enter group name to add:\n\n${groupNames}`);

        if (selected) {
            const group = groups.find(g => g.name.toLowerCase() === selected.toLowerCase().trim());
            if (group) {
                this.addGroupTag(group.name);
            } else {
                this.showToast('Group not found', 'error');
            }
        }
    },

    /**
     * Add group tag to contact form
     */
    addGroupTag(groupName) {
        if (!this.currentGroups) this.currentGroups = [];
        if (!this.currentGroups.includes(groupName)) {
            this.currentGroups.push(groupName);
            this.renderGroupTags();
        }
    },

    /**
     * Remove group tag from contact form
     */
    removeGroupTag(groupName) {
        const index = this.currentGroups.indexOf(groupName);
        if (index > -1) {
            this.currentGroups.splice(index, 1);
            this.renderGroupTags();
        }
    },

    /**
     * Render group tags in contact form
     */
    renderGroupTags() {
        const groups = Groups.getAllGroups();
        let html = '';

        this.currentGroups.forEach(groupName => {
            const group = groups.find(g => g.name === groupName) || { color: '#999' };
            html += `
                <span class="group-tag" style="background-color: ${group.color}20; color: ${group.color}; border-color: ${group.color}40">
                    ${groupName}
                    <button type="button" onclick="UI.removeGroupTag('${groupName}')">×</button>
                </span>
            `;
        });

        this.elements.groupTags.innerHTML = html;
    },

    /**
     * Handle functional action buttons
     */
    handleAction(e, type) {
        e.preventDefault();
        if (!this.currentContact) return;

        const contact = this.currentContact;
        let url = '';

        switch (type) {
            case 'call':
                url = `tel:${contact.phone}`;
                Contacts.addCallHistoryEntry(contact.id, 'outgoing', 0);
                this.renderCallHistory(); // Update history immediately
                break;
            case 'message':
                url = `sms:${contact.phone}`;
                break;
            case 'email':
                if (contact.email) {
                    url = `mailto:${contact.email}`;
                } else {
                    this.showToast('No email address for this contact', 'error');
                    return;
                }
                break;
            case 'video':
                // Check if iOS
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                if (isIOS) {
                    url = `facetime:${contact.phone}`;
                } else {
                    // Fallback to whatsapp or standard call
                    this.showToast('Opening video call...', 'info');
                    // Try WhatsApp video call format for Android/Web as fallback example
                    // But standard 'tel' is safer fallback
                    url = `tel:${contact.phone}`;
                }
                break;
        }

        if (url) {
            window.location.href = url;
            this.showToast(`Opening ${type}...`, 'success');
        }
    },

    /**
     * Render call history
     */
    renderCallHistory() {
        const history = Contacts.getCallHistory(this.currentContact.id);

        if (history.length === 0) {
            this.elements.callHistoryList.innerHTML = '<p class="text-muted">No recent activity</p>';
            return;
        }

        let html = '';
        history.forEach(entry => {
            const date = new Date(entry.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString();

            let icon = '📞';
            if (entry.type === 'incoming') icon = '📲';
            if (entry.type === 'missed') icon = '⚠️';

            html += `
                <div class="history-item">
                    <div class="history-item__icon">${icon}</div>
                    <div class="history-item__info">
                        <div class="history-item__type">${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Call</div>
                        <div class="history-item__time">${dateStr} • ${timeStr}</div>
                    </div>
                </div>
            `;
        });

        this.elements.callHistoryList.innerHTML = html;
    },

    /**
     * Handle photo uploads (profile & cover)
     */
    handlePhotoUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > CONFIG.PHOTO.MAX_SIZE) {
            this.showToast('Image size must be less than 500KB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;

            if (type === 'profile') {
                this.elements.photoPreview.innerHTML = `<img src="${result}" alt="Preview">`;
            } else if (type === 'cover') {
                this.elements.coverPreview.style.backgroundImage = `url(${result})`;
                this.elements.coverPreview.classList.add('has-image');
            }
        };
        reader.readAsDataURL(file);
    },

    /**
     * Get initials from contact
     */
    getInitials(contact) {
        const first = contact.firstName.charAt(0).toUpperCase();
        const last = contact.lastName ? contact.lastName.charAt(0).toUpperCase() : '';
        return first + last;
    },

    /**
     * Get avatar color based on name
     */
    getAvatarColor(name) {
        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const index = Math.abs(hash) % CONFIG.AVATAR_COLORS.length;
        return CONFIG.AVATAR_COLORS[index];
    },
};
