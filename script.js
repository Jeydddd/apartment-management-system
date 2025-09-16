// Global Variables
let currentUser = null;
let selectedRole = null;
let currentAuthMode = 'signup';

// Sample Data for Demo
const sampleData = {
    users: [
        {
            id: 1,
            fullname: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            phone: '123-456-7890',
            role: 'tenant',
            verified: true,
            apartmentId: 1
        },
        {
            id: 2,
            fullname: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            phone: '123-456-7891',
            role: 'owner',
            verified: true,
            businessPermit: 'permit.pdf'
        },
    ],
    apartments: [
        {
            id: 1,
            name: 'Sunset Apartments',
            ownerId: 2,
            ownerName: 'Jane Smith',
            location: 'Downtown',
            price: 1200,
            rooms: 2,
            status: 'occupied',
            tenantId: 1,
            description: 'Beautiful apartment in downtown area'
        },
        {
            id: 2,
            name: 'Garden View Complex',
            ownerId: 2,
            ownerName: 'Jane Smith',
            location: 'Suburbs',
            price: 900,
            rooms: 1,
            status: 'available',
            description: 'Cozy apartment with garden view'
        },
        {
            id: 3,
            name: 'Modern Living',
            ownerId: 2,
            ownerName: 'Jane Smith',
            location: 'City Center',
            price: 1500,
            rooms: 3,
            status: 'available',
            description: 'Modern apartment in city center'
        }
    ],
    payments: [
        {
            id: 1,
            tenantId: 1,
            apartmentId: 1,
            amount: 1200,
            type: 'rent',
            status: 'paid',
            date: '2024-01-01',
            dueDate: '2024-01-01',
            paymentMethod: 'bank-transfer',
            reference: 'TXN123456789',
            paymentProof: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYyZmYiLz48dGV4dCB4PSI0MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb29mPC90ZXh0Pjwvc3ZnPg=='],
            notes: 'Monthly rent payment via bank transfer',
            verifiedAt: '2024-01-01T10:00:00Z',
            verifiedBy: 2
        }
    ],
    maintenanceRequests: [
        {
            id: 1,
            tenantId: 1,
            apartmentId: 1,
            title: 'Leaky Faucet',
            description: 'Kitchen faucet is leaking',
            status: 'pending',
            date: '2024-01-15',
            priority: 'medium'
        }
    ],
    announcements: [
        {
            id: 1,
            title: 'Building Maintenance',
            content: 'Scheduled maintenance on January 20th',
            date: '2024-01-10',
            type: 'maintenance'
        }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser.role);
    } else {
        showPage('landing-page');
    }
}

function loadSampleData() {
    // Load sample data if localStorage is empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(sampleData.users));
        localStorage.setItem('apartments', JSON.stringify(sampleData.apartments));
        localStorage.setItem('payments', JSON.stringify(sampleData.payments));
        localStorage.setItem('maintenanceRequests', JSON.stringify(sampleData.maintenanceRequests));
        localStorage.setItem('announcements', JSON.stringify(sampleData.announcements));
        localStorage.setItem('rentRequests', JSON.stringify([]));
    }
    // Ensure rentRequests key exists
    if (!localStorage.getItem('rentRequests')) {
        localStorage.setItem('rentRequests', JSON.stringify([]));
    }
}

// Page Management
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Role Selection
function selectRole(role) {
    selectedRole = role;
    
    // Update UI to show selected role
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => card.classList.remove('selected'));
    const clickedCard = event.target.closest('.role-card');
    if (clickedCard) clickedCard.classList.add('selected');
    
    // Show/hide business permit field for owners
    const permitGroup = document.getElementById('permit-group');
    if (role === 'owner') {
        permitGroup.style.display = 'block';
    } else {
        permitGroup.style.display = 'none';
    }

    // Reflect selection in auth modal if open
    const chip = document.getElementById('selected-role-chip');
    const chipText = document.getElementById('selected-role-text');
    if (chip && chipText) {
        chip.style.display = 'inline-block';
        chipText.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    }
}

// Authentication Modal
function showAuthModal(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    const form = document.getElementById('auth-form');
    const switchText = document.getElementById('auth-switch');
    const fullnameInput = document.getElementById('fullname');
    const phoneGroup = document.getElementById('phone-group');
    const permitGroup = document.getElementById('permit-group');
    const permitInput = document.getElementById('business-permit');
    
    if (mode === 'signup') {
        title.textContent = 'Sign Up';
        form.querySelector('button').innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        switchText.innerHTML = 'Already have an account? <a href="#" onclick="switchAuthMode(\'login\')">Login</a>';
        
        // Show all fields for signup
        fullnameInput.style.display = 'block';
        phoneGroup.style.display = 'block';
        fullnameInput.closest('.form-group').style.display = 'block';
        phoneGroup.style.display = 'block';
        permitGroup.style.display = selectedRole === 'owner' ? 'block' : 'none';

        // Ensure appropriate required attributes
        fullnameInput.setAttribute('required', '');
        const phoneInput = phoneGroup.querySelector('input');
        if (phoneInput) phoneInput.setAttribute('required', '');
        if (permitInput) {
            if (selectedRole === 'owner') {
                permitInput.setAttribute('required', '');
            } else {
                permitInput.removeAttribute('required');
            }
        }

        // Update selected role chip
        const chip = document.getElementById('selected-role-chip');
        const chipText = document.getElementById('selected-role-text');
        if (chip && chipText && selectedRole) {
            chip.style.display = 'inline-block';
            chipText.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        } else if (chip) {
            chip.style.display = 'none';
        }
    } else {
        title.textContent = 'Login';
        form.querySelector('button').innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchAuthMode(\'signup\')">Sign Up</a>';
        
        // Hide unnecessary fields for login
        fullnameInput.closest('.form-group').style.display = 'none';
        phoneGroup.style.display = 'none';
        permitGroup.style.display = 'none';

        // Remove required from hidden fields so submit isn't blocked
        fullnameInput.removeAttribute('required');
        const phoneInput = phoneGroup.querySelector('input');
        if (phoneInput) phoneInput.removeAttribute('required');
        if (permitInput) permitInput.removeAttribute('required');

        // Hide selected role chip in login
        const chip = document.getElementById('selected-role-chip');
        if (chip) chip.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
    document.getElementById('auth-form').reset();
}

function switchAuthMode(mode) {
    showAuthModal(mode);
}

// Authentication Form Handling
document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (currentAuthMode === 'signup') {
        handleSignup();
    } else {
        handleLogin();
    }
});

function handleSignup() {
    const formData = new FormData(document.getElementById('auth-form'));
    const userData = {
        id: Date.now(),
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        role: selectedRole || 'tenant',
        verified: selectedRole === 'owner' ? false : true,
        businessPermit: selectedRole === 'owner' ? formData.get('business-permit')?.name || null : null
    };
    
    // Validate required fields
    if (!userData.fullname || !userData.email || !userData.password || !userData.phone) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }
    
    if (selectedRole === 'owner' && !userData.businessPermit) {
        showAlert('Business permit is required for apartment owners', 'danger');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(user => user.email === userData.email)) {
        showAlert('Email already exists. Please use a different email.', 'danger');
        return;
    }
    
    // Add user to localStorage
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    showAlert('Account created successfully!', 'success');
    closeAuthModal();
    
    // Auto-login after signup
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showDashboard(userData.role);
}

function handleLogin() {
    const formData = new FormData(document.getElementById('auth-form'));
    const email = formData.get('email');
    const password = formData.get('password');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Try to find by email first
    const userByEmail = users.find(u => u.email === email);

    // Support legacy/demo users that may not have a password saved
    const isPasswordNotSet = userByEmail && (userByEmail.password === undefined || userByEmail.password === null || userByEmail.password === '');
    const isPasswordMatch = userByEmail && userByEmail.password === password;

    if (userByEmail && (isPasswordMatch || isPasswordNotSet)) {
        currentUser = userByEmail;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAlert('Login successful!', 'success');
        closeAuthModal();
        showDashboard(userByEmail.role);
        return;
    }

    // Fallback exact match (in case multiple users share email, or stricter data)
    const strictUser = users.find(u => u.email === email && u.password === password);
    if (strictUser) {
        currentUser = strictUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAlert('Login successful!', 'success');
        closeAuthModal();
        showDashboard(strictUser.role);
        return;
    }

    if (userByEmail) {
        showAlert('Incorrect password. Please try again.', 'danger');
    } else {
        showAlert('No account found with that email. Please sign up.', 'danger');
    }
}

// Dashboard Management
function showDashboard(role) {
    const dashboards = {
        'tenant': 'tenant-dashboard',
        'owner': 'owner-dashboard'
    };
    
    const dashboardId = dashboards[role];
    if (dashboardId) {
        showPage(dashboardId);
        updateUserInfo(role);
        loadDashboardContent(role);
    }
}

function updateUserInfo(role) {
    const nameElement = document.getElementById(`${role}-name`);
    if (nameElement && currentUser) {
        nameElement.textContent = `Welcome, ${currentUser.fullname}`;
    }
}

function loadDashboardContent(role) {
    const contentElement = document.getElementById(`${role}-content`);
    if (contentElement) {
        // Load default section based on role
        const defaultSections = {
            'tenant': 'my-unit',
            'owner': 'my-apartments'
        };
        
        const defaultSection = defaultSections[role];
        if (defaultSection) {
            showSection(role, defaultSection);
        }
    }
}

// Section Management
function showSection(role, section) {
    const contentElement = document.getElementById(`${role}-content`);
    if (!contentElement) return;
    
    // Update active menu item
    const menuItems = document.querySelectorAll(`#${role}-dashboard .nav-menu a`);
    menuItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.querySelector(`#${role}-dashboard .nav-menu a[onclick*="${section}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Load section content
    switch (role) {
        case 'tenant':
            loadTenantSection(section);
            break;
        case 'owner':
            loadOwnerSection(section);
            break;
    }
}

// Tenant Sections
function showTenantSection(section) {
    showSection('tenant', section);
}

function loadTenantSection(section) {
    const content = document.getElementById('tenant-content');
    
    switch (section) {
        case 'my-unit':
            content.innerHTML = generateMyUnitContent();
            break;
        case 'payments':
            content.innerHTML = generatePaymentsContent();
            break;
        case 'maintenance':
            content.innerHTML = generateMaintenanceContent();
            break;
        case 'announcements':
            content.innerHTML = generateAnnouncementsContent();
            break;
        case 'find-apartment':
            content.innerHTML = generateFindApartmentContent();
            break;
    }
}

function generateMyUnitContent() {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const userApartment = apartments.find(apt => apt.tenantId === currentUser.id);
    
    if (!userApartment) {
        return `
            <div class="content-section">
                <h2><i class="fas fa-home"></i> My Unit</h2>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> You are not currently assigned to any apartment.
                </div>
                <button class="btn btn-primary" onclick="showTenantSection('find-apartment')">
                    <i class="fas fa-search"></i> Find an Apartment
                </button>
            </div>
        `;
    }
    
    return `
        <div class="content-section">
            <h2><i class="fas fa-home"></i> My Unit</h2>
            <div class="card">
                <h3>${userApartment.name}</h3>
                <p><strong>Location:</strong> ${userApartment.location}</p>
                <p><strong>Rent:</strong> ₱${userApartment.price}/month</p>
                <p><strong>Rooms:</strong> ${userApartment.rooms}</p>
                <p><strong>Owner:</strong> ${userApartment.ownerName}</p>
                <p><strong>Description:</strong> ${userApartment.description}</p>
            </div>
        </div>
    `;
}

function generatePaymentsContent() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const userPayments = payments.filter(payment => payment.tenantId === currentUser.id);
    
    let paymentsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-credit-card"></i> Payments</h2>
            <button class="btn btn-primary mb-20" onclick="showPaymentForm()">
                <i class="fas fa-plus"></i> Submit Payment
            </button>
    `;
    
    if (userPayments.length === 0) {
        paymentsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No payment history found.
            </div>
        `;
    } else {
        paymentsHtml += `
            <div class="payments-grid">
        `;
        
        userPayments.forEach(payment => {
            paymentsHtml += `
                <div class="payment-card">
                    <div class="payment-header">
                        <h3>${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment</h3>
                        <span class="badge badge-${payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}">${payment.status}</span>
                    </div>
                    <div class="payment-details">
                        <p><strong>Amount:</strong> ₱${payment.amount}</p>
                        <p><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${new Date(payment.dueDate).toLocaleDateString()}</p>
                        ${payment.paymentMethod ? `<p><strong>Method:</strong> ${payment.paymentMethod}</p>` : ''}
                        ${payment.reference ? `<p><strong>Reference:</strong> ${payment.reference}</p>` : ''}
                    </div>
                    ${payment.paymentProof ? `
                        <div class="payment-proof">
                            <h4>Payment Proof:</h4>
                            <div class="proof-images">
                                ${payment.paymentProof.map(proof => `
                                    <div class="proof-image-container">
                                        <img src="${proof}" alt="Payment Proof" class="proof-image" onclick="openImageModal('${proof}')">
                                        <button class="btn btn-sm btn-outline" onclick="downloadImage('${proof}')">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${payment.notes ? `<div class="payment-notes"><strong>Notes:</strong> ${payment.notes}</div>` : ''}
                </div>
            `;
        });
        
        paymentsHtml += `
            </div>
        `;
    }
    
    paymentsHtml += `</div>`;
    
    // Fix image sizes after content is loaded
    setTimeout(fixPaymentImageSizes, 100);
    
    return paymentsHtml;
}

function generateMaintenanceContent() {
    const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
    const userRequests = requests.filter(req => req.tenantId === currentUser.id);
    
    let maintenanceHtml = `
        <div class="content-section">
            <h2><i class="fas fa-tools"></i> Maintenance Requests</h2>
            <button class="btn btn-primary mb-20" onclick="showNewMaintenanceForm()">
                <i class="fas fa-plus"></i> Submit New Request
            </button>
    `;
    
    if (userRequests.length === 0) {
        maintenanceHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No maintenance requests found.
            </div>
        `;
    } else {
        userRequests.forEach(request => {
            maintenanceHtml += `
                <div class="card">
                    <h3>${request.title}</h3>
                    <p><strong>Description:</strong> ${request.description}</p>
                    <p><strong>Status:</strong> <span class="badge badge-${getStatusBadgeClass(request.status)}">${request.status}</span></p>
                    <p><strong>Priority:</strong> ${request.priority}</p>
                    <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
                </div>
            `;
        });
    }
    
    maintenanceHtml += `</div>`;
    return maintenanceHtml;
}

function generateAnnouncementsContent() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    let announcementsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-bullhorn"></i> Announcements</h2>
    `;
    
    if (announcements.length === 0) {
        announcementsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No announcements available.
            </div>
        `;
    } else {
        announcements.forEach(announcement => {
            announcementsHtml += `
                <div class="card">
                    <h3>${announcement.title}</h3>
                    <p>${announcement.content}</p>
                    <p><strong>Date:</strong> ${new Date(announcement.date).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> <span class="badge badge-info">${announcement.type}</span></p>
                </div>
            `;
        });
    }
    
    announcementsHtml += `</div>`;
    return announcementsHtml;
}

function generateFindApartmentContent() {
    return `
        <div class="content-section">
            <h2><i class="fas fa-search"></i> Find Apartment</h2>
            <div class="search-filters">
                <div class="filter-group">
                    <label for="tenant-search-location">Location</label>
                    <input type="text" id="tenant-search-location" placeholder="Enter city or area">
                </div>
                <div class="filter-group">
                    <label for="tenant-search-price-min">Min Price</label>
                    <input type="number" id="tenant-search-price-min" placeholder="Min price">
                </div>
                <div class="filter-group">
                    <label for="tenant-search-price-max">Max Price</label>
                    <input type="number" id="tenant-search-price-max" placeholder="Max price">
                </div>
                <div class="filter-group">
                    <label for="tenant-search-rooms">Rooms</label>
                    <select id="tenant-search-rooms">
                        <option value="">Any</option>
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4+">4+ Rooms</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="searchTenantApartments()">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
            <div id="tenant-apartment-results" class="apartment-grid">
                ${generateApartmentCards()}
            </div>
        </div>
    `;
}

// Utility Functions
function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    
    // Insert at top of current page
    const currentPage = document.querySelector('.page.active');
    const container = currentPage.querySelector('.container') || currentPage.querySelector('.main-content');
    
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }
}

function getStatusBadgeClass(status) {
    const statusClasses = {
        'pending': 'warning',
        'in-progress': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return statusClasses[status] || 'info';
}

function generateApartmentCards() {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const availableApartments = apartments.filter(apt => apt.status === 'available');
    
    if (availableApartments.length === 0) {
        return '<div class="alert alert-info">No available apartments found.</div>';
    }
    
    return availableApartments.map(apartment => `
        <div class="apartment-card">
            <div class="apartment-image">
                <i class="fas fa-building"></i>
            </div>
            <div class="apartment-info">
                <h3>${apartment.name}</h3>
                <p><strong>Owner:</strong> ${apartment.ownerName}</p>
                <p><strong>Location:</strong> ${apartment.location}</p>
                <p><strong>Rooms:</strong> ${apartment.rooms}</p>
                <div class="apartment-price">₱${apartment.price}/month</div>
                <span class="apartment-status status-${apartment.status}">${apartment.status}</span>
                <div class="mt-20">
                    <button class="btn btn-primary" onclick="requestToRent(${apartment.id})">
                        <i class="fas fa-handshake"></i> Request to Rent
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Navigation Functions
function goToLanding() {
    showPage('landing-page');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('landing-page');
    showAlert('Logged out successfully', 'success');
}

function showFindApartment() {
    showPage('find-apartment-page');
}

// Search Functions
function searchApartments() {
    const location = document.getElementById('search-location').value;
    const minPrice = document.getElementById('search-price-min').value;
    const maxPrice = document.getElementById('search-price-max').value;
    const rooms = document.getElementById('search-rooms').value;
    const status = document.getElementById('search-status').value;
    
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    let filteredApartments = apartments;
    
    if (location) {
        filteredApartments = filteredApartments.filter(apt => 
            apt.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    if (minPrice) {
        filteredApartments = filteredApartments.filter(apt => apt.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
        filteredApartments = filteredApartments.filter(apt => apt.price <= parseInt(maxPrice));
    }
    
    if (rooms) {
        filteredApartments = filteredApartments.filter(apt => apt.rooms.toString() === rooms);
    }
    
    if (status) {
        filteredApartments = filteredApartments.filter(apt => apt.status === status);
    }
    
    displayApartmentResults(filteredApartments);
}

function searchTenantApartments() {
    // Similar to searchApartments but for tenant dashboard
    searchApartments();
}

function displayApartmentResults(apartments) {
    const resultsContainer = document.getElementById('apartment-results') || 
                           document.getElementById('tenant-apartment-results');
    
    if (!resultsContainer) return;
    
    if (apartments.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-info">No apartments found matching your criteria.</div>';
        return;
    }
    
    resultsContainer.innerHTML = apartments.map(apartment => `
        <div class="apartment-card">
            <div class="apartment-image">
                <i class="fas fa-building"></i>
            </div>
            <div class="apartment-info">
                <h3>${apartment.name}</h3>
                <p><strong>Owner:</strong> ${apartment.ownerName}</p>
                <p><strong>Location:</strong> ${apartment.location}</p>
                <p><strong>Rooms:</strong> ${apartment.rooms}</p>
                <div class="apartment-price">₱${apartment.price}/month</div>
                <span class="apartment-status status-${apartment.status}">${apartment.status}</span>
                <div class="mt-20">
                    <button class="btn btn-primary" onclick="requestToRent(${apartment.id})">
                        <i class="fas fa-handshake"></i> Request to Rent
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function requestToRent(apartmentId) {
    if (!currentUser) {
        showAlert('Please login to request an apartment', 'warning');
        return;
    }

    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const apartment = apartments.find(a => a.id === apartmentId);
    if (!apartment) {
        showAlert('Apartment not found', 'danger');
        return;
    }

    const rentRequests = JSON.parse(localStorage.getItem('rentRequests') || '[]');
    const alreadyRequested = rentRequests.some(r => r.apartmentId === apartmentId && r.tenantId === currentUser.id && r.status === 'pending');
    if (alreadyRequested) {
        showAlert('You already have a pending request for this apartment.', 'info');
        return;
    }

    const newRequest = {
        id: Date.now(),
        apartmentId,
        ownerId: apartment.ownerId,
        tenantId: currentUser.id,
        date: new Date().toISOString(),
        status: 'pending'
    };

    rentRequests.push(newRequest);
    localStorage.setItem('rentRequests', JSON.stringify(rentRequests));
    showAlert('Rent request submitted successfully!', 'success');
}

// Owner Functions
function showOwnerSection(section) {
    showSection('owner', section);
}

// Payment Form
function showPaymentForm() {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const userApartment = apartments.find(apt => apt.tenantId === currentUser.id);
    
    if (!userApartment) {
        showAlert('You need to be assigned to an apartment to make payments', 'warning');
        return;
    }
    
    const formHtml = `
        <div class="content-section">
            <h2><i class="fas fa-credit-card"></i> Submit Payment</h2>
            <form id="payment-form" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="payment-type">Payment Type</label>
                    <select id="payment-type" name="type" required>
                        <option value="rent">Rent</option>
                        <option value="utilities">Utilities</option>
                        <option value="maintenance">Maintenance Fee</option>
                        <option value="deposit">Security Deposit</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="payment-amount">Amount (₱)</label>
                    <input type="number" id="payment-amount" name="amount" min="1" required>
                </div>
                <div class="form-group">
                    <label for="payment-method">Payment Method</label>
                    <select id="payment-method" name="paymentMethod" required>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="gcash">GCash</option>
                        <option value="paymaya">PayMaya</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="payment-reference">Reference Number/Transaction ID</label>
                    <input type="text" id="payment-reference" name="reference" placeholder="Enter reference number">
                </div>
                <div class="form-group">
                    <label for="payment-proof">Payment Proof (Images)</label>
                    <input type="file" id="payment-proof" name="paymentProof" accept="image/*" multiple required>
                    <small>Upload screenshots or photos of your payment confirmation</small>
                </div>
                <div class="form-group">
                    <label for="payment-notes">Additional Notes</label>
                    <textarea id="payment-notes" name="notes" rows="3" placeholder="Any additional information about this payment"></textarea>
                </div>
                <div class="form-group">
                    <label for="payment-date">Payment Date</label>
                    <input type="date" id="payment-date" name="paymentDate" required>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit Payment
                </button>
                <button type="button" class="btn btn-outline" onclick="showTenantSection('payments')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </form>
        </div>
    `;
    
    document.getElementById('tenant-content').innerHTML = formHtml;
    
    // Set default payment date to today
    document.getElementById('payment-date').value = new Date().toISOString().split('T')[0];
    
    // Add form submission handler
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const files = formData.getAll('paymentProof');
        
        // Convert images to base64 for storage
        const processImages = async () => {
            const imagePromises = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            });
            
            const paymentProofImages = await Promise.all(imagePromises);
            
            const payment = {
                id: Date.now(),
                tenantId: currentUser.id,
                apartmentId: userApartment.id,
                type: formData.get('type'),
                amount: parseFloat(formData.get('amount')),
                paymentMethod: formData.get('paymentMethod'),
                reference: formData.get('reference') || null,
                paymentProof: paymentProofImages,
                notes: formData.get('notes') || null,
                status: 'pending',
                date: formData.get('paymentDate'),
                dueDate: new Date().toISOString().split('T')[0], // Same as payment date for now
                submittedAt: new Date().toISOString()
            };
            
            const payments = JSON.parse(localStorage.getItem('payments') || '[]');
            payments.push(payment);
            localStorage.setItem('payments', JSON.stringify(payments));
            
            showAlert('Payment submitted successfully! It will be reviewed by the property owner.', 'success');
            showTenantSection('payments');
        };
        
        processImages();
    });
}

// Image Modal Functions
function openImageModal(imageSrc) {
    // Remove any existing modal first
    closeImageModal();
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close" onclick="closeImageModal()">&times;</span>
            <img src="${imageSrc}" alt="Payment Proof" class="modal-image">
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Add escape key to close
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function downloadImage(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `payment-proof-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Force payment proof images to be small
function fixPaymentImageSizes() {
    const proofImages = document.querySelectorAll('.proof-image, .payment-proof img');
    proofImages.forEach(img => {
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.maxWidth = '80px';
        img.style.maxHeight = '80px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
    });
}

// Run the fix when the page loads and when content changes
document.addEventListener('DOMContentLoaded', fixPaymentImageSizes);
window.addEventListener('load', fixPaymentImageSizes);

// Close any open modals when window is resized or minimized
window.addEventListener('resize', closeImageModal);
window.addEventListener('blur', closeImageModal);

// Maintenance Request Form
function showNewMaintenanceForm() {
    const formHtml = `
        <div class="content-section">
            <h2><i class="fas fa-plus"></i> Submit Maintenance Request</h2>
            <form id="maintenance-form">
                <div class="form-group">
                    <label for="maintenance-title">Title</label>
                    <input type="text" id="maintenance-title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="maintenance-description">Description</label>
                    <textarea id="maintenance-description" name="description" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="maintenance-priority">Priority</label>
                    <select id="maintenance-priority" name="priority" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit Request
                </button>
                <button type="button" class="btn btn-outline" onclick="showTenantSection('maintenance')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </form>
        </div>
    `;
    
    document.getElementById('tenant-content').innerHTML = formHtml;
    
    // Add form submission handler
    document.getElementById('maintenance-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const userApartment = apartments.find(apt => apt.tenantId === currentUser.id);

        if (!userApartment) {
            showAlert('You must be assigned to an apartment to submit a maintenance request.', 'danger');
            return;
        }
        
        const formData = new FormData(this);
        const request = {
            id: Date.now(),
            tenantId: currentUser.id,
            apartmentId: userApartment.id,
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };
        
        const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
        requests.push(request);
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        showAlert('Maintenance request submitted successfully!', 'success');
        showTenantSection('maintenance');
    });
}
