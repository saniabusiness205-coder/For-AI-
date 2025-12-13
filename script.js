// Default sample properties data
const defaultProperties = [
    {
        id: 1,
        name: "Modern Downtown Loft",
        type: "apartment",
        price: 650000,
        address: "456 Downtown Ave, City, State",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
        beds: 2,
        baths: 2,
        sqft: 1200,
        description: "Beautiful modern loft in the heart of downtown with floor-to-ceiling windows and premium finishes.",
        amenities: ["Floor-to-ceiling windows", "Modern finishes", "Central location"]
    },
    {
        id: 2,
        name: "Luxury Beach House",
        type: "house",
        price: 1200000,
        address: "789 Beach Road, Coastal City, State",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
        beds: 4,
        baths: 3,
        sqft: 3500,
        description: "Stunning beachfront property with direct ocean access, private pool, and panoramic views.",
        amenities: ["Ocean access", "Private pool", "Panoramic views"]
    },
    {
        id: 3,
        name: "Suburban Family Home",
        type: "house",
        price: 450000,
        address: "123 Oak Street, Suburb, State",
        image: "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=250&fit=crop",
        beds: 3,
        baths: 2,
        sqft: 2000,
        description: "Perfect family home in a quiet neighborhood with spacious backyard and modern kitchen.",
        amenities: ["Quiet neighborhood", "Spacious backyard", "Modern kitchen"]
    },
    {
        id: 4,
        name: "Urban Condo",
        type: "condo",
        price: 550000,
        address: "321 City Center, Metro City, State",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
        beds: 2,
        baths: 2,
        sqft: 1400,
        description: "Contemporary condo with premium amenities, gym access, and concierge service.",
        amenities: ["Gym access", "Concierge", "Premium amenities"]
    },
    {
        id: 5,
        name: "Country Estate",
        type: "house",
        price: 850000,
        address: "500 Country Lane, Rural Area, State",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
        beds: 5,
        baths: 4,
        sqft: 4000,
        description: "Spacious estate on 5 acres with barn, guest house, and beautiful landscaping.",
        amenities: ["5 acres", "Guest house", "Beautiful landscaping"]
    },
    {
        id: 6,
        name: "Cozy Studio Apartment",
        type: "apartment",
        price: 350000,
        address: "654 Elm Street, Downtown, State",
        image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=250&fit=crop",
        beds: 1,
        baths: 1,
        sqft: 550,
        description: "Charming studio apartment perfect for professionals with modern amenities.",
        amenities: ["Modern amenities", "Professional friendly", "Downtown location"]
    }
];

// Get properties from admin panel or use defaults
let properties = [];

function getProperties() {
    const adminProperties = localStorage.getItem('adminProperties');
    if (adminProperties) {
        const stored = JSON.parse(adminProperties);
        return stored.map(p => ({
            ...p,
            price: p.price || parseFloat(p.price)
        }));
    }
    return defaultProperties;
}

// Load properties on page load
document.addEventListener('DOMContentLoaded', function() {
    properties = getProperties();
    displayPropertiesCarousel(properties);
    setupFilterButtons();
    setupMobileMenu();
    setupContactForm();
    setupSearchFunctionality();
    setupContactTabs();
    loadAgentProfile();
    loadClientReviews();
});

// Display properties in grid
function displayProperties(propertiesToDisplay) {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';

    propertiesToDisplay.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-type', property.type);
        
        const priceDisplay = typeof property.price === 'number' ? 
            '$' + property.price.toLocaleString() : 
            property.price;
        
        card.innerHTML = `
            <div class="property-image-container">
                <img src="${property.image}" alt="${property.name}" class="property-image">
                <span class="property-badge">Featured</span>
            </div>
            <div class="property-details">
                <span class="property-type">${capitalize(property.type)}</span>
                <h3>${property.name}</h3>
                <p class="property-price">${priceDisplay}</p>
                <p class="property-address">${property.address}</p>
                <div class="property-features">
                    <span>🛏️ ${property.beds} Beds</span>
                    <span>🚿 ${property.baths} Baths</span>
                    <span>📐 ${property.sqft} sqft</span>
                </div>
                <button class="view-btn" onclick="openPropertyModal(${property.id})">View Details</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Filter properties
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter properties
            const filter = this.getAttribute('data-filter');
            let filtered = properties;
            
            if (filter !== 'all') {
                filtered = properties.filter(p => p.type === filter);
            }
            
            displayPropertiesCarousel(filtered);
        });
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
}

// Open property modal
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    const modal = document.getElementById('propertyModal');
    const modalBody = document.getElementById('modalBody');
    
    const priceDisplay = typeof property.price === 'number' ? 
        '$' + property.price.toLocaleString() : 
        property.price;
    
    const amenitiesHtml = (property.amenities || []).length > 0 ? 
        `<div class="amenities-list" style="margin: 1.5rem 0;">
            <h4>Amenities:</h4>
            <ul style="list-style: none; padding: 0;">
                ${property.amenities.map(a => `<li style="padding: 5px 0;">✓ ${a}</li>`).join('')}
            </ul>
        </div>` : '';
    
    modalBody.innerHTML = `
        <div class="modal-body-content">
            <img src="${property.image}" alt="${property.name}">
            <h2>${property.name}</h2>
            <p class="modal-price">${priceDisplay}</p>
            <p class="modal-address">${property.address}</p>
            <p class="modal-description">${property.description}</p>
            ${amenitiesHtml}
            <div class="modal-features">
                <div class="modal-feature">
                    <strong>Bedrooms:</strong> ${property.beds}
                </div>
                <div class="modal-feature">
                    <strong>Bathrooms:</strong> ${property.baths}
                </div>
                <div class="modal-feature">
                    <strong>Square Feet:</strong> ${property.sqft}
                </div>
                <div class="modal-feature">
                    <strong>Type:</strong> ${capitalize(property.type)}
                </div>
            </div>
            <button class="submit-btn" style="margin-top: 1.5rem;">Schedule a Viewing</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
const modal = document.getElementById('propertyModal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Setup contact form - WhatsApp form
function setupContactForm() {
    const whatsappForm = document.getElementById('whatsappForm');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('wpName').value;
            const email = document.getElementById('wpEmail').value;
            const message = document.getElementById('wpMessage').value;
            
            // Validate form
            if (name && email && message) {
                // Create WhatsApp message with client details
                const whatsappMessage = `*New Inquiry from Premium Properties Website*\n\n📋 *Client Details:*\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 *Message:*\n${message}`;
                
                // Encode message for URL
                const encodedMessage = encodeURIComponent(whatsappMessage);
                
                // Get agent's WhatsApp number from config
                const agentWhatsApp = WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER;
                
                // Create WhatsApp URL
                const whatsappURL = `https://wa.me/${agentWhatsApp}?text=${encodedMessage}`;
                
                // Open WhatsApp
                window.open(whatsappURL, '_blank');
                
                // Show success message
                alert(`Thank you, ${name}! Opening WhatsApp to send your message to our agent...`);
                
                // Reset form
                whatsappForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
}

// Utility function to capitalize strings
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
document.querySelector('.search-box button').addEventListener('click', function() {
    const searchInput = document.querySelector('.search-box input');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm) {
        const filtered = properties.filter(p => 
            p.address.toLowerCase().includes(searchTerm) ||
            p.name.toLowerCase().includes(searchTerm)
        );
        
        if (filtered.length > 0) {
            displayProperties(filtered);
            // Scroll to properties section
            document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('No properties found matching your search.');
        }
    } else {
        alert('Please enter a location to search.');
    }
});

function setupSearchFunctionality() {
    // Search is already handled above in DOMContentLoaded
}

// PROPERTY CAROUSEL - Show one property at a time
let currentPropertyIndex = 0;
let filteredProperties = [];

function displayPropertiesCarousel(propertiesToDisplay) {
    filteredProperties = propertiesToDisplay;
    currentPropertyIndex = 0;
    
    if (propertiesToDisplay.length === 0) {
        document.getElementById('propertyCarousel').innerHTML = '<p style="padding: 40px; text-align: center;">No properties found</p>';
        return;
    }

    displayCurrentProperty();
    setupCarouselButtons();
}

function displayCurrentProperty() {
    if (filteredProperties.length === 0) return;

    const property = filteredProperties[currentPropertyIndex];
    const carousel = document.getElementById('propertyCarousel');
    
    const priceDisplay = typeof property.price === 'number' ? 
        '$' + property.price.toLocaleString() : 
        property.price;
    
    carousel.innerHTML = `
        <div class="property-card" data-type="${property.type}">
            <div class="property-image-container">
                <img src="${property.image}" alt="${property.name}" class="property-image">
                <span class="property-badge">Featured</span>
            </div>
            <div class="property-details">
                <span class="property-type">${capitalize(property.type)}</span>
                <h3>${property.name}</h3>
                <p class="property-price">${priceDisplay}</p>
                <p class="property-address">${property.address}</p>
                <div class="property-features">
                    <span>🛏️ ${property.beds} Beds</span>
                    <span>🚿 ${property.baths} Baths</span>
                    <span>📐 ${property.sqft} sqft</span>
                </div>
                <button class="view-btn" onclick="openPropertyModal(${property.id})">View Details</button>
            </div>
        </div>
    `;
}

// Carousel Navigation
function setupCarouselButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Remove old listeners
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));

    const newPrevBtn = document.getElementById('prevBtn');
    const newNextBtn = document.getElementById('nextBtn');

    newPrevBtn.addEventListener('click', () => {
        currentPropertyIndex = (currentPropertyIndex - 1 + filteredProperties.length) % filteredProperties.length;
        displayCurrentProperty();
    });

    newNextBtn.addEventListener('click', () => {
        currentPropertyIndex = (currentPropertyIndex + 1) % filteredProperties.length;
        displayCurrentProperty();
    });

    // Enable touch/swipe support
    enableCarouselSwipe();
}

function enableCarouselSwipe() {
    const carousel = document.getElementById('propertyCarousel');
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (startX > endX + 50) {
            // Swiped left - show next
            currentPropertyIndex = (currentPropertyIndex + 1) % filteredProperties.length;
            displayCurrentProperty();
        } else if (startX < endX - 50) {
            // Swiped right - show previous
            currentPropertyIndex = (currentPropertyIndex - 1 + filteredProperties.length) % filteredProperties.length;
            displayCurrentProperty();
        }
    }
}

// ROI CALCULATOR
function calculateROI() {
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;

    if (propertyPrice <= 0 || monthlyRent <= 0) {
        alert('Please enter valid property price and monthly rent');
        return;
    }

    // Calculate loan amount
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;

    // Calculate monthly payment (P&I only)
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    let monthlyPayment = 0;

    if (monthlyRate > 0) {
        monthlyPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
        monthlyPayment = loanAmount / numberOfPayments;
    }

    // Add property tax, insurance, maintenance (estimate as 1.5% of property value annually)
    const monthlyTaxInsurance = (propertyPrice * 0.015) / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyTaxInsurance;

    // Calculate profit
    const monthlyProfit = monthlyRent - totalMonthlyPayment;
    const annualROI = (monthlyProfit * 12 / propertyPrice) * 100;

    // Display results
    document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
    document.getElementById('monthlyProfit').textContent = '$' + monthlyProfit.toFixed(2);
    document.getElementById('annualROI').textContent = annualROI.toFixed(2) + '%';
    document.getElementById('roiResults').classList.remove('hidden');
}

// AGENT PROFILE
async function loadAgentProfile() {
    try {
        const response = await apiService.getAgentProfile();
        
        if (response.success && response.profile) {
            const agentData = response.profile;
            
            document.getElementById('agentName').textContent = agentData.name;
            document.getElementById('agentBio').textContent = agentData.bio;
            if (agentData.image) {
                document.getElementById('agentImage').src = agentData.image.includes('<img') ? agentData.image : agentData.image;
            }
            document.getElementById('propertiesSold').textContent = agentData.propertiesSold;
            document.getElementById('happyClients').textContent = agentData.happyClients;
            document.getElementById('yearsExp').textContent = agentData.yearsExp;
            document.getElementById('reraLicense').textContent = agentData.reraLicense;
        } else {
            // Fallback to default if API doesn't have data
            loadDefaultAgentProfile();
        }
    } catch (error) {
        console.warn('Could not load agent profile from API, using defaults:', error);
        loadDefaultAgentProfile();
    }
}

function loadDefaultAgentProfile() {
    const agentData = getDefaultAgentProfile();
    
    document.getElementById('agentName').textContent = agentData.name;
    document.getElementById('agentBio').textContent = agentData.bio;
    if (agentData.image) {
        document.getElementById('agentImage').src = agentData.image;
    }
    document.getElementById('propertiesSold').textContent = agentData.propertiesSold;
    document.getElementById('happyClients').textContent = agentData.happyClients;
    document.getElementById('yearsExp').textContent = agentData.yearsExp;
    document.getElementById('reraLicense').textContent = agentData.reraLicense;
}

function getDefaultAgentProfile() {
    return {
        name: 'John Smith',
        title: 'Senior Real Estate Agent',
        bio: 'Experienced real estate professional dedicated to helping clients find their perfect home with integrity and expertise.',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=400&fit=crop',
        propertiesSold: '500+',
        happyClients: '1000+',
        yearsExp: '15+',
        reraLicense: 'RE/2024/0001234'
    };
}

// LOAD CLIENT REVIEWS
async function loadClientReviews() {
    const container = document.getElementById('reviewsContainer');
    
    try {
        const response = await apiService.getReviews();
        
        if (response.success && response.reviews) {
            const reviews = response.reviews;
            
            if (reviews.length === 0) {
                container.innerHTML = '<p style="color: #999;">No reviews yet</p>';
                return;
            }

            container.innerHTML = reviews.map(review => `
                <div class="review-item">
                    <div class="review-author">${review.name}</div>
                    <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                    <div class="review-text">"${review.text}"</div>
                </div>
            `).join('');
        } else {
            loadDefaultReviews();
        }
    } catch (error) {
        console.warn('Could not load reviews from API, using defaults:', error);
        loadDefaultReviews();
    }
}

function loadDefaultReviews() {
    const reviews = JSON.parse(localStorage.getItem('clientReviews')) || getDefaultReviews();
    const container = document.getElementById('reviewsContainer');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="color: #999;">No reviews yet</p>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-author">${review.name}</div>
            <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            <div class="review-text">"${review.text}"</div>
        </div>
    `).join('');
}

function getDefaultReviews() {
    return [
        {
            name: 'Sarah Johnson',
            rating: 5,
            text: 'Excellent service! Found my dream home quickly.'
        },
        {
            name: 'Michael Brown',
            rating: 5,
            text: 'Very professional and knowledgeable. Highly recommended!'
        }
    ];
}

// CONTACT - Setup forms
function setupContactTabs() {
    // Setup Schedule Form - Send to Backend API
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('scheduleName').value;
            const email = document.getElementById('scheduleEmail').value;
            const date = document.getElementById('scheduleDate').value;
            const time = document.getElementById('scheduleTime').value;
            
            if (name && email && date && time) {
                try {
                    // Send to backend API
                    const response = await apiService.scheduleMeeting({
                        name,
                        email,
                        date,
                        time
                    });

                    if (response.success) {
                        // Format date to readable format
                        const dateObj = new Date(date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                        
                        // Create WhatsApp message
                        const message = `*New Meeting Request from Premium Properties*\n\n📋 *Client Details:*\n👤 Name: ${name}\n📧 Email: ${email}\n📅 Preferred Date: ${formattedDate}\n⏰ Preferred Time: ${time}\n\nPlease confirm this appointment.`;
                        
                        const encodedMessage = encodeURIComponent(message);
                        const agentWhatsApp = WHATSAPP_CONFIG.AGENT_WHATSAPP_NUMBER;
                        const whatsappURL = `https://wa.me/${agentWhatsApp}?text=${encodedMessage}`;
                        
                        // Show confirmation
                        alert(`Thank you, ${name}! Your request has been recorded. Opening WhatsApp to contact our agent...`);
                        
                        // Open WhatsApp
                        window.open(whatsappURL, '_blank');
                        
                        // Reset form
                        this.reset();
                    }
                } catch (error) {
                    alert('Error submitting your request. Please try again.');
                    console.error('Form submission error:', error);
                }
            }
        });
    }
}

