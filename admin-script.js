// Admin credentials (in real app, this would be from a backend)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPropertiesFromStorage();
    setupEventListeners();
    checkLoginStatus();
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        showAdminPanel();
        loadDashboard();
    } else {
        showLoginPage();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Add property form
    document.getElementById('addPropertyForm').addEventListener('submit', handleAddProperty);
    document.getElementById('propertyImage').addEventListener('change', previewImage);

    // Edit form
    document.getElementById('editPropertyForm').addEventListener('submit', handleEditProperty);
    document.getElementById('editPropertyImage').addEventListener('change', previewEditImage);

    // Settings
    document.getElementById('whatsappForm').addEventListener('submit', handleWhatsAppSettings);
    document.getElementById('settingsForm').addEventListener('submit', handleSaveSettings);
    document.getElementById('passwordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('agentProfileForm').addEventListener('submit', handleAgentProfile);
    document.getElementById('agentImage').addEventListener('change', previewAgentImage);
    document.getElementById('resetBtn').addEventListener('click', handleResetData);

    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeEditModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeEditModal);
    window.addEventListener('click', closeModalOnOutsideClick);

    // Search
    document.getElementById('propertySearch').addEventListener('input', handlePropertySearch);

    // Mobile menu
    document.querySelector('.menu-toggle').addEventListener('click', toggleSidebar);
    document.querySelector('.close-sidebar').addEventListener('click', closeSidebar);

    // Image upload click
    document.querySelector('.image-upload').addEventListener('click', function() {
        document.getElementById('propertyImage').click();
    });

    document.getElementById('editImagePreview').parentElement.addEventListener('click', function() {
        document.getElementById('editPropertyImage').click();
    });

    // Agent image upload
    const agentImageUpload = document.getElementById('agentImagePreview')?.parentElement;
    if (agentImageUpload) {
        agentImageUpload.addEventListener('click', function() {
            document.getElementById('agentImage').click();
        });
    }
}

// LOGIN HANDLERS
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        showAdminPanel();
        loadDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        showLoginPage();
        showNotification('Logged out successfully!', 'success');
    }
}

// NAVIGATION
function handleNavigation(e) {
    e.preventDefault();
    
    const section = this.getAttribute('data-section');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    this.classList.add('active');

    // Show section
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    if (section === 'dashboard') {
        loadDashboard();
    } else if (section === 'properties') {
        loadPropertiesTable();
    } else if (section === 'settings') {
        loadAgentProfileForm();
    }

    closeSidebar();
}

// DASHBOARD
function loadDashboard() {
    const properties = loadPropertiesFromStorage();
    const total = properties.length;
    const active = properties.filter(p => p.active !== false).length;
    const thisMonth = properties.filter(p => {
        const created = new Date(p.created || new Date());
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('totalProperties').textContent = total;
    document.getElementById('activeListings').textContent = active;
    document.getElementById('thisMonth').textContent = thisMonth;
}

// PROPERTIES TABLE
function loadPropertiesTable() {
    const properties = loadPropertiesFromStorage();
    const tbody = document.getElementById('propertiesTableBody');
    tbody.innerHTML = '';

    if (properties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No properties yet. <a href="#" onclick="showSection(\'add-property\')">Add one now</a></td></tr>';
        return;
    }

    properties.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${property.image}" alt="Property" class="property-img"></td>
            <td>${property.name}</td>
            <td>${capitalize(property.type)}</td>
            <td>$${formatNumber(property.price)}</td>
            <td>${property.address}</td>
            <td>${property.beds}</td>
            <td>${property.baths}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal(${property.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProperty(${property.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// PROPERTY SEARCH
function handlePropertySearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const properties = loadPropertiesFromStorage();
    const filtered = properties.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.address.toLowerCase().includes(searchTerm)
    );

    const tbody = document.getElementById('propertiesTableBody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No properties found</td></tr>';
        return;
    }

    filtered.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${property.image}" alt="Property" class="property-img"></td>
            <td>${property.name}</td>
            <td>${capitalize(property.type)}</td>
            <td>$${formatNumber(property.price)}</td>
            <td>${property.address}</td>
            <td>${property.beds}</td>
            <td>${property.baths}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal(${property.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProperty(${property.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ADD PROPERTY
function handleAddProperty(e) {
    e.preventDefault();

    const imageFile = document.getElementById('propertyImage').files[0];
    if (!imageFile) {
        showNotification('Please select an image', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const properties = loadPropertiesFromStorage();
        const newProperty = {
            id: Date.now(),
            name: document.getElementById('propertyName').value,
            type: document.getElementById('propertyType').value,
            price: parseFloat(document.getElementById('propertyPrice').value),
            address: document.getElementById('propertyAddress').value,
            beds: parseInt(document.getElementById('propertyBeds').value),
            baths: parseInt(document.getElementById('propertyBaths').value),
            sqft: parseInt(document.getElementById('propertySqft').value),
            description: document.getElementById('propertyDescription').value,
            amenities: document.getElementById('propertyAmenities').value.split(',').map(a => a.trim()),
            image: event.target.result,
            created: new Date().toISOString(),
            active: true
        };

        properties.push(newProperty);
        localStorage.setItem('adminProperties', JSON.stringify(properties));
        
        document.getElementById('addPropertyForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        showNotification('Property added successfully!', 'success');
        loadDashboard();
        loadPropertiesTable();
    };
    reader.readAsDataURL(imageFile);
}

// EDIT PROPERTY
function openEditModal(propertyId) {
    const properties = loadPropertiesFromStorage();
    const property = properties.find(p => p.id === propertyId);

    if (!property) return;

    document.getElementById('editPropertyName').value = property.name;
    document.getElementById('editPropertyType').value = property.type;
    document.getElementById('editPropertyPrice').value = property.price;
    document.getElementById('editPropertyAddress').value = property.address;
    document.getElementById('editPropertyBeds').value = property.beds;
    document.getElementById('editPropertyBaths').value = property.baths;
    document.getElementById('editPropertySqft').value = property.sqft;
    document.getElementById('editPropertyDescription').value = property.description || '';
    document.getElementById('editPropertyAmenities').value = (property.amenities || []).join(', ');
    
    const imagePreview = document.getElementById('editImagePreview');
    imagePreview.innerHTML = `<img src="${property.image}" alt="Property">`;
    
    document.getElementById('editPropertyForm').setAttribute('data-property-id', propertyId);
    document.getElementById('editModal').classList.remove('hidden');
}

function handleEditProperty(e) {
    e.preventDefault();

    const propertyId = parseInt(document.getElementById('editPropertyForm').getAttribute('data-property-id'));
    const properties = loadPropertiesFromStorage();
    const propertyIndex = properties.findIndex(p => p.id === propertyId);

    if (propertyIndex === -1) return;

    const imageFile = document.getElementById('editPropertyImage').files[0];
    
    const updateProperty = () => {
        properties[propertyIndex] = {
            ...properties[propertyIndex],
            name: document.getElementById('editPropertyName').value,
            type: document.getElementById('editPropertyType').value,
            price: parseFloat(document.getElementById('editPropertyPrice').value),
            address: document.getElementById('editPropertyAddress').value,
            beds: parseInt(document.getElementById('editPropertyBeds').value),
            baths: parseInt(document.getElementById('editPropertyBaths').value),
            sqft: parseInt(document.getElementById('editPropertySqft').value),
            description: document.getElementById('editPropertyDescription').value,
            amenities: document.getElementById('editPropertyAmenities').value.split(',').map(a => a.trim()),
            updated: new Date().toISOString()
        };

        localStorage.setItem('adminProperties', JSON.stringify(properties));
        closeEditModal();
        showNotification('Property updated successfully!', 'success');
        loadPropertiesTable();
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            properties[propertyIndex].image = event.target.result;
            updateProperty();
        };
        reader.readAsDataURL(imageFile);
    } else {
        updateProperty();
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function closeModalOnOutsideClick(e) {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeEditModal();
    }
}

// DELETE PROPERTY
function deleteProperty(propertyId) {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const properties = loadPropertiesFromStorage();
    const filtered = properties.filter(p => p.id !== propertyId);
    localStorage.setItem('adminProperties', JSON.stringify(filtered));
    
    showNotification('Property deleted successfully!', 'success');
    loadPropertiesTable();
    loadDashboard();
}

// SETTINGS
function handleWhatsAppSettings(e) {
    e.preventDefault();
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    
    if (!whatsappNumber || whatsappNumber.trim() === '') {
        showNotification('Please enter a WhatsApp number', 'error');
        return;
    }
    
    // Clean the number (remove all non-digits)
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
        showNotification('Please enter a valid WhatsApp number', 'error');
        return;
    }
    
    // Save to local storage and update config
    localStorage.setItem('agentWhatsApp', cleanNumber);
    
    // Update the config for immediate use
    if (typeof WHATSAPP_CONFIG !== 'undefined') {
        WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER = cleanNumber;
    }
    
    showNotification('WhatsApp number updated successfully!', 'success');
    document.getElementById('whatsappForm').reset();
}

function handleSaveSettings(e) {
    e.preventDefault();
    const username = document.getElementById('settingsUsername').value;
    const email = document.getElementById('settingsEmail').value;
    const phone = document.getElementById('settingsPhone').value;

    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminPhone', phone);
    
    showNotification('Settings saved successfully!', 'success');
}

function handleChangePassword(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    localStorage.setItem('adminPassword', newPassword);
    document.getElementById('passwordForm').reset();
    showNotification('Password changed successfully!', 'success');
}

function handleAgentProfile(e) {
    e.preventDefault();
    
    const agentData = {
        name: document.getElementById('agentName').value,
        title: document.getElementById('agentTitle').value,
        reraLicense: document.getElementById('reraLicense').value,
        bio: document.getElementById('agentBio').value,
        propertiesSold: document.getElementById('propertiesSold').value,
        happyClients: document.getElementById('happyClients').value,
        yearsExp: document.getElementById('yearsExp').value,
        image: document.getElementById('agentImagePreview').innerHTML
    };

    localStorage.setItem('agentProfile', JSON.stringify(agentData));
    
    // Update the main website
    updateAgentProfileOnSite(agentData);
    
    showNotification('Agent profile updated successfully!', 'success');
    document.getElementById('agentProfileForm').reset();
    document.getElementById('agentImagePreview').innerHTML = '';
}

function updateAgentProfileOnSite(agentData) {
    // This will be called via iframe or when the page reloads
    if (agentData.name) document.getElementById('agentName').textContent = agentData.name;
    if (agentData.reraLicense) document.getElementById('reraLicense').textContent = agentData.reraLicense;
    if (agentData.bio) document.getElementById('agentBio').textContent = agentData.bio;
    if (agentData.propertiesSold) document.getElementById('propertiesSold').textContent = agentData.propertiesSold;
    if (agentData.happyClients) document.getElementById('happyClients').textContent = agentData.happyClients;
    if (agentData.yearsExp) document.getElementById('yearsExp').textContent = agentData.yearsExp;
}

function previewAgentImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('agentImagePreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Agent Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function loadAgentProfileForm() {
    const agentData = JSON.parse(localStorage.getItem('agentProfile')) || {
        name: 'John Smith',
        title: 'Senior Real Estate Agent',
        reraLicense: 'RE/2024/0001234',
        bio: 'Experienced real estate professional dedicated to helping clients find their perfect home with integrity and expertise.',
        propertiesSold: '500+',
        happyClients: '1000+',
        yearsExp: '15+'
    };

    document.getElementById('agentName').value = agentData.name || '';
    document.getElementById('agentTitle').value = agentData.title || '';
    document.getElementById('reraLicense').value = agentData.reraLicense || '';
    document.getElementById('agentBio').value = agentData.bio || '';
    document.getElementById('propertiesSold').value = agentData.propertiesSold || '';
    document.getElementById('happyClients').value = agentData.happyClients || '';
    document.getElementById('yearsExp').value = agentData.yearsExp || '';
}

function handleResetData() {
    if (confirm('Are you sure? This will delete all properties and cannot be undone!')) {
        localStorage.removeItem('adminProperties');
        loadDashboard();
        loadPropertiesTable();
        showNotification('All data has been reset!', 'success');
    }
}

// IMAGE PREVIEW
function previewImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewEditImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('editImagePreview');
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// STORAGE FUNCTIONS
function loadPropertiesFromStorage() {
    const stored = localStorage.getItem('adminProperties');
    return stored ? JSON.parse(stored) : [];
}

function savePropertiesToStorage(properties) {
    localStorage.setItem('adminProperties', JSON.stringify(properties));
}

// Also save properties to window for main website access
function syncPropertiesToMainSite() {
    const properties = loadPropertiesFromStorage();
    localStorage.setItem('websiteProperties', JSON.stringify(properties));
}

// NOTIFICATIONS
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

// UI HELPERS
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminPanel').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').classList.remove('hidden');
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('active');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSection(sectionId) {
    const link = document.querySelector(`[data-section="${sectionId}"]`);
    if (link) {
        link.click();
    }
}

// Sync with main website periodically
setInterval(syncPropertiesToMainSite, 5000);
