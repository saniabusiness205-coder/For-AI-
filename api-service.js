// API Service Module
// This module handles all API communication between frontend and backend

// Configuration
const API_CONFIG = {
    // Development
    DEV_API_URL: 'http://localhost:3000/api',
    
    // Production (update with actual URLs)
      PROD_API_URL: 'https://premium-properties-2.onrender.com/api',
          
    // Get the API URL based on environment
    getBaseURL: function() {
        // Check if running in development (localhost)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.DEV_API_URL;
        }
        return this.PROD_API_URL;
    }
};

// API Service Class
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.getBaseURL();
    }

    /**
     * Generic fetch method with error handling
     */
    async request(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}` 
                }));
                throw new Error(error.error || `API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Check backend health
     */
    async checkHealth() {
        return this.request('/health', 'GET');
    }

    /**
     * Get all properties
     */
    async getProperties() {
        return this.request('/properties', 'GET');
    }

    /**
     * Get single property
     */
    async getProperty(id) {
        return this.request(`/properties/${id}`, 'GET');
    }

    /**
     * Schedule a meeting
     */
    async scheduleMeeting(meetingData) {
        return this.request('/schedule-meeting', 'POST', meetingData);
    }

    /**
     * Send WhatsApp contact message
     */
    async sendWhatsAppContact(contactData) {
        return this.request('/whatsapp-contact', 'POST', contactData);
    }

    /**
     * Send inquiry
     */
    async sendInquiry(inquiryData) {
        return this.request('/inquiry', 'POST', inquiryData);
    }

    /**
     * Get agent profile
     */
    async getAgentProfile() {
        return this.request('/agent-profile', 'GET');
    }

    /**
     * Get reviews
     */
    async getReviews() {
        return this.request('/reviews', 'GET');
    }
}

// Create global instance
const apiService = new ApiService();
