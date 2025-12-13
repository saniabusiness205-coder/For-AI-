// Configuration for WhatsApp Integration
// Update the WhatsApp number below with your agent's WhatsApp number

const WHATSAPP_CONFIG = {
    // Agent's WhatsApp Number (format: country code + number without + or spaces)
    // Example: "+1 (555) 123-4567" becomes "15551234567"
    AGENT_WHATSAPP_NUMBER: "15551234567",
    
    // Business Name (shown in messages)
    BUSINESS_NAME: "Premium Properties",
    
    // Optional: Different numbers for different regions
    // Uncomment and modify as needed
    /*
    REGIONAL_NUMBERS: {
        'US': '15551234567',
        'UK': '442071838750',
        'India': '919876543210',
    }
    */
};

// Function to get WhatsApp number
function getWhatsAppNumber() {
    return WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER;
}

// Function to update WhatsApp number (can be called from admin panel)
function updateWhatsAppNumber(newNumber) {
    // Remove all non-digit characters
    const cleanNumber = newNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
        alert('Please enter a valid WhatsApp number');
        return false;
    }
    
    WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER = cleanNumber;
    localStorage.setItem('agentWhatsApp', cleanNumber);
    alert('WhatsApp number updated successfully!');
    return true;
}

// Load WhatsApp number from storage if available
document.addEventListener('DOMContentLoaded', function() {
    const storedNumber = localStorage.getItem('agentWhatsApp');
    if (storedNumber) {
        WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER = storedNumber;
    }
});
