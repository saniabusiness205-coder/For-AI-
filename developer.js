// Developer Panel - Agent Management System
const DEVELOPER_PASSWORD = 'Admin123!'; // Change this to your secure password

let editingAgentId = null;

// Check if user is authenticated
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('devAuthenticated') === 'true';
    const loginPanel = document.getElementById('loginPanel');
    const devPanel = document.getElementById('devPanel');

    if (isAuthenticated) {
        loginPanel.style.display = 'none';
        devPanel.style.display = 'block';
        loadAgents();
    } else {
        loginPanel.style.display = 'flex';
        devPanel.style.display = 'none';
    }
}

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password === DEVELOPER_PASSWORD) {
        sessionStorage.setItem('devAuthenticated', 'true');
        errorMessage.style.display = 'none';
        checkAuthentication();
    } else {
        errorMessage.textContent = '❌ Incorrect password. Please try again.';
        errorMessage.style.display = 'block';
        document.getElementById('password').value = '';
    }
});

// Logout
function logout() {
    sessionStorage.removeItem('devAuthenticated');
    document.getElementById('loginForm').reset();
    checkAuthentication();
}

// Initialize agents from localStorage or use empty array
function getAgents() {
    const agents = localStorage.getItem('agents');
    return agents ? JSON.parse(agents) : [];
}

// Save agents to localStorage
function saveAgents(agents) {
    localStorage.setItem('agents', JSON.stringify(agents));
}

// Load and display agents
function loadAgents() {
    const agents = getAgents();
    const tbody = document.getElementById('agentsBody');
    const emptyMessage = document.getElementById('emptyMessage');

    if (agents.length === 0) {
        tbody.innerHTML = '';
        document.getElementById('agentsTable').style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }

    document.getElementById('agentsTable').style.display = 'table';
    emptyMessage.style.display = 'none';

    tbody.innerHTML = agents.map((agent, index) => {
        const expiryDate = new Date(agent.expiryDate);
        const today = new Date();
        const isExpired = expiryDate < today;
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        const statusBadgeClass = isExpired ? 'status-expired' : 'status-active';
        const statusText = isExpired ? `❌ Expired (${Math.abs(daysLeft)} days ago)` : `✅ Active (${daysLeft} days left)`;

        return `
            <tr>
                <td>${escapeHtml(agent.name)}</td>
                <td>${escapeHtml(agent.domain)}</td>
                <td>${escapeHtml(agent.email)}</td>
                <td>${escapeHtml(agent.phone)}</td>
                <td>${new Date(agent.expiryDate).toLocaleDateString()}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="openEditModal(${index})">✏️ Edit</button>
                        <button class="delete-btn" onclick="deleteAgent(${index})">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Add new agent
document.getElementById('agentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const agentName = document.getElementById('agentName').value.trim();
    const agentDomain = document.getElementById('agentDomain').value.trim();
    const agentEmail = document.getElementById('agentEmail').value.trim();
    const agentPhone = document.getElementById('agentPhone').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const agentStatus = document.getElementById('agentStatus').value;

    if (!agentName || !agentDomain || !agentEmail || !agentPhone || !expiryDate) {
        showNotification('❌ Please fill in all required fields', 'error');
        return;
    }

    const agents = getAgents();
    
    // Check if domain already exists
    if (agents.some(agent => agent.domain.toLowerCase() === agentDomain.toLowerCase())) {
        showNotification('❌ Domain already exists. Please use a different domain.', 'error');
        return;
    }

    const newAgent = {
        id: Date.now(),
        name: agentName,
        domain: agentDomain,
        email: agentEmail,
        phone: agentPhone,
        expiryDate: expiryDate,
        status: agentStatus,
        createdAt: new Date().toISOString()
    };

    agents.push(newAgent);
    saveAgents(agents);
    showNotification(`✅ Agent "${agentName}" added successfully!`, 'success');
    this.reset();
    loadAgents();
});

// Open edit modal
function openEditModal(index) {
    const agents = getAgents();
    const agent = agents[index];

    if (!agent) return;

    editingAgentId = index;
    document.getElementById('editAgentName').value = agent.name;
    document.getElementById('editAgentDomain').value = agent.domain;
    document.getElementById('editAgentEmail').value = agent.email;
    document.getElementById('editAgentPhone').value = agent.phone;
    document.getElementById('editExpiryDate').value = agent.expiryDate;
    document.getElementById('editAgentStatus').value = agent.status;

    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingAgentId = null;
}

// Update agent
document.getElementById('editForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    if (editingAgentId === null) return;

    const agents = getAgents();
    const agentName = document.getElementById('editAgentName').value.trim();
    const agentDomain = document.getElementById('editAgentDomain').value.trim();
    const agentEmail = document.getElementById('editAgentEmail').value.trim();
    const agentPhone = document.getElementById('editAgentPhone').value.trim();
    const expiryDate = document.getElementById('editExpiryDate').value;
    const agentStatus = document.getElementById('editAgentStatus').value;

    if (!agentName || !agentDomain || !agentEmail || !agentPhone || !expiryDate) {
        showNotification('❌ Please fill in all required fields', 'error');
        return;
    }

    // Check if domain is unique (excluding current agent)
    if (agents.some((agent, idx) => 
        idx !== editingAgentId && 
        agent.domain.toLowerCase() === agentDomain.toLowerCase())) {
        showNotification('❌ Domain already exists. Please use a different domain.', 'error');
        return;
    }

    agents[editingAgentId] = {
        ...agents[editingAgentId],
        name: agentName,
        domain: agentDomain,
        email: agentEmail,
        phone: agentPhone,
        expiryDate: expiryDate,
        status: agentStatus,
        updatedAt: new Date().toISOString()
    };

    saveAgents(agents);
    showNotification(`✅ Agent "${agentName}" updated successfully!`, 'success');
    closeEditModal();
    loadAgents();
});

// Delete agent
function deleteAgent(index) {
    const agents = getAgents();
    const agent = agents[index];

    if (!agent) return;

    if (confirm(`⚠️ Are you sure you want to delete "${agent.name}"? This action cannot be undone.`)) {
        agents.splice(index, 1);
        saveAgents(agents);
        showNotification(`✅ Agent "${agent.name}" deleted successfully!`, 'success');
        loadAgents();
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
};

// Check authentication on page load
window.addEventListener('DOMContentLoaded', checkAuthentication);

// Check subscription expiry and send notifications
function checkSubscriptionExpiry() {
    const agents = getAgents();
    const today = new Date();

    agents.forEach(agent => {
        const expiryDate = new Date(agent.expiryDate);
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        // Send notification on expiry day
        if (daysLeft === 0) {
            sendExpiryNotification(agent, 'today');
        }
        // Send notification 7 days before expiry
        else if (daysLeft === 7) {
            sendExpiryNotification(agent, '7days');
        }
        // Send notification 1 day before expiry
        else if (daysLeft === 1) {
            sendExpiryNotification(agent, '1day');
        }
        // Send notification on expired date
        else if (daysLeft < 0) {
            sendExpiryNotification(agent, 'expired');
        }
    });
}

// Send expiry notification via WhatsApp or Email
function sendExpiryNotification(agent, type) {
    let message = '';

    switch(type) {
        case '7days':
            message = `Hi ${agent.name}, your subscription for ${agent.domain} expires in 7 days (${new Date(agent.expiryDate).toLocaleDateString()}). Please renew to avoid service interruption.`;
            break;
        case '1day':
            message = `Hi ${agent.name}, your subscription for ${agent.domain} expires tomorrow (${new Date(agent.expiryDate).toLocaleDateString()}). Please renew immediately.`;
            break;
        case 'today':
            message = `Hi ${agent.name}, your subscription for ${agent.domain} expires today. Please renew now to keep your service active.`;
            break;
        case 'expired':
            message = `Hi ${agent.name}, your subscription for ${agent.domain} has expired. Please contact support to reactivate your service.`;
            break;
    }

    // Send via WhatsApp
    sendWhatsAppNotification(agent, message);
    
    // Send via Email
    sendEmailNotification(agent, message, type);
}

// Send WhatsApp notification
function sendWhatsAppNotification(agent, message) {
    const phoneNumber = agent.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    // Log the action (in real implementation, this would be sent to backend)
    console.log(`WhatsApp notification sent to ${agent.phone}:`, message);

    // You can store these notifications in localStorage for reference
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
        agentId: agent.id,
        type: 'whatsapp',
        message: message,
        sentAt: new Date().toISOString()
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Send Email notification
function sendEmailNotification(agent, message, type) {
    // Log the action (in real implementation, this would use a backend email service)
    console.log(`Email notification sent to ${agent.email}:`, message);

    // Store notification record
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
        agentId: agent.id,
        type: 'email',
        message: message,
        sentAt: new Date().toISOString()
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Run expiry check every hour
setInterval(checkSubscriptionExpiry, 60 * 60 * 1000);
// Also run on page load
checkSubscriptionExpiry();
