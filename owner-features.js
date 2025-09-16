// Owner-specific functionality
function loadOwnerSection(section) {
    const content = document.getElementById('owner-content');
    
    switch (section) {
        case 'my-apartments':
            content.innerHTML = generateMyApartmentsContent();
            break;
        case 'my-tenants':
            content.innerHTML = generateMyTenantsContent();
            break;
        case 'rent-requests':
            content.innerHTML = generateRentRequestsContent();
            break;
        case 'payments':
            content.innerHTML = generateOwnerPaymentsContent();
            break;
        case 'maintenance':
            content.innerHTML = generateOwnerMaintenanceContent();
            break;
        case 'profile-management':
            content.innerHTML = generateOwnerProfileManagementContent();
            break;
    }
}

function generateMyApartmentsContent() {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const ownerApartments = apartments.filter(apt => apt.ownerId === currentUser.id);
    
    let apartmentsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-building"></i> My Apartments</h2>
    `;
    
    // Check if owner is verified
    if (!currentUser.verified) {
        apartmentsHtml += `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i> 
                Upload your Business Permit to add apartments. 
                <a href="#" onclick="showOwnerSection('profile-management')">Go to Profile Management</a>
            </div>
        `;
    } else {
        apartmentsHtml += `
            <button class="btn btn-primary mb-20" onclick="showAddApartmentForm()">
                <i class="fas fa-plus"></i> Add New Apartment
            </button>
        `;
    }
    
    if (ownerApartments.length === 0) {
        apartmentsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No apartments found.
            </div>
        `;
    } else {
        apartmentsHtml += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Rooms</th>
                            <th>Status</th>
                            <th>Tenant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        ownerApartments.forEach(apartment => {
            const tenant = apartment.tenantId ? 
                JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === apartment.tenantId) : null;
            
            apartmentsHtml += `
                <tr>
                    <td>${apartment.name}</td>
                    <td>${apartment.location}</td>
                    <td>$${apartment.price}</td>
                    <td>${apartment.rooms}</td>
                    <td><span class="badge badge-${apartment.status === 'available' ? 'success' : 'warning'}">${apartment.status}</span></td>
                    <td>${tenant ? tenant.fullname : 'None'}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editApartment(${apartment.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger" onclick="deleteApartment(${apartment.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        
        apartmentsHtml += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    apartmentsHtml += `</div>`;
    return apartmentsHtml;
}

function generateMyTenantsContent() {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const ownerApartments = apartments.filter(apt => apt.ownerId === currentUser.id);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    let tenantsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-users"></i> My Tenants</h2>
    `;
    
    const tenants = [];
    ownerApartments.forEach(apartment => {
        if (apartment.tenantId) {
            const tenant = users.find(u => u.id === apartment.tenantId);
            if (tenant) {
                tenants.push({...tenant, apartment: apartment});
            }
        }
    });
    
    if (tenants.length === 0) {
        tenantsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No tenants found.
            </div>
        `;
    } else {
        tenantsHtml += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Apartment</th>
                            <th>Rent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        tenants.forEach(tenant => {
            tenantsHtml += `
                <tr>
                    <td>${tenant.fullname}</td>
                    <td>${tenant.email}</td>
                    <td>${tenant.phone}</td>
                    <td>${tenant.apartment.name}</td>
                    <td>$${tenant.apartment.price}</td>
                    <td>
                        <button class="btn btn-outline" onclick="viewTenantDetails(${tenant.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-danger" onclick="removeTenant(${tenant.id})">
                            <i class="fas fa-user-times"></i> Remove
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tenantsHtml += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    tenantsHtml += `</div>`;
    return tenantsHtml;
}

function generateRentRequestsContent() {
    const rentRequests = JSON.parse(localStorage.getItem('rentRequests') || '[]');
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter rent requests for current owner's apartments
    const ownerApartments = apartments.filter(apt => apt.ownerId === currentUser.id);
    const ownerApartmentIds = ownerApartments.map(apt => apt.id);
    const ownerRentRequests = rentRequests.filter(req => ownerApartmentIds.includes(req.apartmentId));
    
    let rentRequestsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-handshake"></i> Rent Requests</h2>
    `;
    
    if (ownerRentRequests.length === 0) {
        rentRequestsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No rent requests found.
            </div>
        `;
    } else {
        rentRequestsHtml += `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Apartment</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        ownerRentRequests.forEach(request => {
            const apartment = apartments.find(apt => apt.id === request.apartmentId);
            const tenant = users.find(u => u.id === request.tenantId);
            
            rentRequestsHtml += `
                <tr>
                    <td>${tenant ? tenant.fullname : 'Unknown'}</td>
                    <td>${apartment ? apartment.name : 'Unknown'}</td>
                    <td>${new Date(request.date).toLocaleDateString()}</td>
                    <td><span class="badge badge-${getStatusBadgeClass(request.status)}">${request.status}</span></td>
                    <td>
                        ${request.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="approveRentRequest(${request.id})">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="rejectRentRequest(${request.id})">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        ` : `
                            <span class="text-muted">No actions available</span>
                        `}
                    </td>
                </tr>
            `;
        });
        
        rentRequestsHtml += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    rentRequestsHtml += `</div>`;
    return rentRequestsHtml;
}

function generateOwnerPaymentsContent() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const ownerApartments = apartments.filter(apt => apt.ownerId === currentUser.id);
    const ownerApartmentIds = ownerApartments.map(apt => apt.id);
    const ownerPayments = payments.filter(payment => ownerApartmentIds.includes(payment.apartmentId));
    
    let paymentsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-chart-line"></i> Payment Reports</h2>
    `;
    
    if (ownerPayments.length === 0) {
        paymentsHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No payment records found.
            </div>
        `;
    } else {
        const totalIncome = ownerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const paidPayments = ownerPayments.filter(p => p.status === 'paid');
        const pendingPayments = ownerPayments.filter(p => p.status === 'pending');
        
        paymentsHtml += `
            <div class="row mb-20">
                <div class="card" style="flex: 1; margin-right: 10px;">
                    <h3>Total Income</h3>
                    <p style="font-size: 2rem; color: #28a745; font-weight: bold;">₱${totalIncome}</p>
                </div>
                <div class="card" style="flex: 1; margin-right: 10px;">
                    <h3>Paid Payments</h3>
                    <p style="font-size: 2rem; color: #28a745; font-weight: bold;">${paidPayments.length}</p>
                </div>
                <div class="card" style="flex: 1;">
                    <h3>Pending Payments</h3>
                    <p style="font-size: 2rem; color: #ffc107; font-weight: bold;">${pendingPayments.length}</p>
                </div>
            </div>
            
            <div class="payments-grid">
        `;
        
        ownerPayments.forEach(payment => {
            const apartment = apartments.find(apt => apt.id === payment.apartmentId);
            const tenant = users.find(u => u.id === payment.tenantId);
            
            paymentsHtml += `
                <div class="payment-card">
                    <div class="payment-header">
                        <h3>${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment</h3>
                        <span class="badge badge-${payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}">${payment.status}</span>
                    </div>
                    <div class="payment-details">
                        <p><strong>Tenant:</strong> ${tenant ? tenant.fullname : 'Unknown'}</p>
                        <p><strong>Apartment:</strong> ${apartment ? apartment.name : 'Unknown'}</p>
                        <p><strong>Amount:</strong> ₱${payment.amount}</p>
                        <p><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
                        <p><strong>Method:</strong> ${payment.paymentMethod || 'N/A'}</p>
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
                    <div class="payment-actions">
                        ${payment.status === 'pending' ? `
                            <button class="btn btn-success" onclick="verifyPayment(${payment.id}, 'paid')">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-danger" onclick="verifyPayment(${payment.id}, 'rejected')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        paymentsHtml += `
            </div>
        `;
    }
    
    paymentsHtml += `</div>`;
    
    // Fix image sizes after content is loaded
    setTimeout(() => {
        const proofImages = document.querySelectorAll('.proof-image, .payment-proof img');
        proofImages.forEach(img => {
            img.style.width = '80px';
            img.style.height = '80px';
            img.style.maxWidth = '80px';
            img.style.maxHeight = '80px';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
        });
    }, 100);
    
    return paymentsHtml;
}

function generateOwnerMaintenanceContent() {
    const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const ownerApartments = apartments.filter(apt => apt.ownerId === currentUser.id);
    const ownerApartmentIds = ownerApartments.map(apt => apt.id);
    const ownerRequests = requests.filter(req => ownerApartmentIds.includes(req.apartmentId) && req.status !== 'completed');
    
    let maintenanceHtml = `
        <div class="content-section">
            <h2><i class="fas fa-tools"></i> Maintenance Requests</h2>
    `;
    
    if (ownerRequests.length === 0) {
        maintenanceHtml += `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No maintenance requests found.
            </div>
        `;
    } else {
        ownerRequests.forEach(request => {
            const apartment = apartments.find(apt => apt.id === request.apartmentId);
            const tenant = apartment && apartment.tenantId ? 
                JSON.parse(localStorage.getItem('users') || '[]').find(u => u.id === apartment.tenantId) : null;
            
            maintenanceHtml += `
                <div class="card">
                    <div class="flex-between">
                        <h3>${request.title}</h3>
                        <span class="badge badge-${getStatusBadgeClass(request.status)}">${request.status}</span>
                    </div>
                    <p><strong>Apartment:</strong> ${apartment ? apartment.name : 'Unknown'}</p>
                    <p><strong>Tenant:</strong> ${tenant ? tenant.fullname : 'Unknown'}</p>
                    <p><strong>Description:</strong> ${request.description}</p>
                    <p><strong>Priority:</strong> ${request.priority}</p>
                    <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
                    <div class="mt-20">
                        <button class="btn btn-success" onclick="updateMaintenanceStatus(${request.id}, 'in-progress')">
                            <i class="fas fa-play"></i> Start Work
                        </button>
                        <button class="btn btn-primary" onclick="updateMaintenanceStatus(${request.id}, 'completed')">
                            <i class="fas fa-check"></i> Complete
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    maintenanceHtml += `</div>`;
    return maintenanceHtml;
}

function generateOwnerProfileManagementContent() {
    return `
        <div class="content-section">
            <h2><i class="fas fa-user-cog"></i> Profile Management</h2>
            
            <div class="card">
                <h3>Profile Information</h3>
                <form id="owner-profile-form">
                    <div class="form-group">
                        <label for="owner-fullname">Full Name</label>
                        <input type="text" id="owner-fullname" name="fullname" value="${currentUser.fullname}" required>
                    </div>
                    <div class="form-group">
                        <label for="owner-email">Email</label>
                        <input type="email" id="owner-email" name="email" value="${currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="owner-phone">Phone</label>
                        <input type="tel" id="owner-phone" name="phone" value="${currentUser.phone}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Profile
                    </button>
                </form>
            </div>
            
            <div class="card">
                <h3>Business Permit</h3>
                <form id="permit-form">
                    <div class="form-group">
                        <label for="business-permit-file">Upload Business Permit</label>
                        <input type="file" id="business-permit-file" name="business-permit" accept=".pdf,.jpg,.jpeg,.png" required>
                        <small>Upload your business permit to add apartments</small>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-upload"></i> Upload Permit
                    </button>
                </form>
            </div>
        </div>
    `;
}

// Owner-specific functions
function showAddApartmentForm() {
    if (!currentUser.verified) {
        showAlert('Please upload your business permit first', 'warning');
        return;
    }
    
    const formHtml = `
        <div class="content-section">
            <h2><i class="fas fa-plus"></i> Add New Apartment</h2>
            <form id="apartment-form">
                <div class="form-group">
                    <label for="apartment-name">Apartment Name</label>
                    <input type="text" id="apartment-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="apartment-location">Location</label>
                    <input type="text" id="apartment-location" name="location" required>
                </div>
                <div class="form-group">
                    <label for="apartment-price">Monthly Rent</label>
                    <input type="number" id="apartment-price" name="price" required>
                </div>
                <div class="form-group">
                    <label for="apartment-rooms">Number of Rooms</label>
                    <input type="number" id="apartment-rooms" name="rooms" required>
                </div>
                <div class="form-group">
                    <label for="apartment-description">Description</label>
                    <textarea id="apartment-description" name="description" rows="4"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Add Apartment
                </button>
                <button type="button" class="btn btn-outline" onclick="showOwnerSection('my-apartments')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </form>
        </div>
    `;
    
    document.getElementById('owner-content').innerHTML = formHtml;
    
    // Add form submission handler
    document.getElementById('apartment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const apartment = {
            id: Date.now(),
            name: formData.get('name'),
            ownerId: currentUser.id,
            ownerName: currentUser.fullname,
            location: formData.get('location'),
            price: parseInt(formData.get('price')),
            rooms: parseInt(formData.get('rooms')),
            status: 'available',
            description: formData.get('description')
        };
        
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        apartments.push(apartment);
        localStorage.setItem('apartments', JSON.stringify(apartments));
        
        showAlert('Apartment added successfully!', 'success');
        showOwnerSection('my-apartments');
    });
}

function editApartment(apartmentId) {
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const apartment = apartments.find(apt => apt.id === apartmentId);
    
    if (!apartment) return;
    
    const formHtml = `
        <div class="content-section">
            <h2><i class="fas fa-edit"></i> Edit Apartment</h2>
            <form id="edit-apartment-form">
                <div class="form-group">
                    <label for="edit-apartment-name">Apartment Name</label>
                    <input type="text" id="edit-apartment-name" name="name" value="${apartment.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-apartment-location">Location</label>
                    <input type="text" id="edit-apartment-location" name="location" value="${apartment.location}" required>
                </div>
                <div class="form-group">
                    <label for="edit-apartment-price">Monthly Rent</label>
                    <input type="number" id="edit-apartment-price" name="price" value="${apartment.price}" required>
                </div>
                <div class="form-group">
                    <label for="edit-apartment-rooms">Number of Rooms</label>
                    <input type="number" id="edit-apartment-rooms" name="rooms" value="${apartment.rooms}" required>
                </div>
                <div class="form-group">
                    <label for="edit-apartment-description">Description</label>
                    <textarea id="edit-apartment-description" name="description" rows="4">${apartment.description || ''}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Update Apartment
                </button>
                <button type="button" class="btn btn-outline" onclick="showOwnerSection('my-apartments')">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </form>
        </div>
    `;
    
    document.getElementById('owner-content').innerHTML = formHtml;
    
    // Add form submission handler
    document.getElementById('edit-apartment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const apartmentIndex = apartments.findIndex(apt => apt.id === apartmentId);
        
        if (apartmentIndex !== -1) {
            apartments[apartmentIndex] = {
                ...apartments[apartmentIndex],
                name: formData.get('name'),
                location: formData.get('location'),
                price: parseInt(formData.get('price')),
                rooms: parseInt(formData.get('rooms')),
                description: formData.get('description')
            };
            
            localStorage.setItem('apartments', JSON.stringify(apartments));
            showAlert('Apartment updated successfully!', 'success');
            showOwnerSection('my-apartments');
        }
    });
}

function deleteApartment(apartmentId) {
    if (confirm('Are you sure you want to delete this apartment?')) {
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const filteredApartments = apartments.filter(apt => apt.id !== apartmentId);
        localStorage.setItem('apartments', JSON.stringify(filteredApartments));
        
        showAlert('Apartment deleted successfully!', 'success');
        showOwnerSection('my-apartments');
    }
}

function updateMaintenanceStatus(requestId, status) {
    const requests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
        
        showAlert(`Maintenance request ${status} successfully!`, 'success');
        showOwnerSection('maintenance');
    }
}

function viewTenantDetails(tenantId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tenant = users.find(u => u.id === tenantId);
    
    if (!tenant) return;
    
    const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
    const tenantApartment = apartments.find(apt => apt.tenantId === tenantId);
    
    const detailsHtml = `
        <div class="content-section">
            <h2><i class="fas fa-user"></i> Tenant Details</h2>
            <div class="card">
                <h3>${tenant.fullname}</h3>
                <p><strong>Email:</strong> ${tenant.email}</p>
                <p><strong>Phone:</strong> ${tenant.phone}</p>
                <p><strong>Apartment:</strong> ${tenantApartment ? tenantApartment.name : 'None'}</p>
                <p><strong>Rent:</strong> ${tenantApartment ? '$' + tenantApartment.price : 'N/A'}</p>
            </div>
            <button class="btn btn-outline" onclick="showOwnerSection('my-tenants')">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>
    `;
    
    document.getElementById('owner-content').innerHTML = detailsHtml;
}

function removeTenant(tenantId) {
    if (confirm('Are you sure you want to remove this tenant?')) {
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const apartmentIndex = apartments.findIndex(apt => apt.tenantId === tenantId);
        
        if (apartmentIndex !== -1) {
            apartments[apartmentIndex].tenantId = null;
            apartments[apartmentIndex].status = 'available';
            localStorage.setItem('apartments', JSON.stringify(apartments));
            
            showAlert('Tenant removed successfully!', 'success');
            showOwnerSection('my-tenants');
        }
    }
}

function verifyPayment(paymentId, status) {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex !== -1) {
        payments[paymentIndex].status = status;
        payments[paymentIndex].verifiedAt = new Date().toISOString();
        payments[paymentIndex].verifiedBy = currentUser.id;
        
        localStorage.setItem('payments', JSON.stringify(payments));
        
        const statusText = status === 'paid' ? 'approved' : 'rejected';
        showAlert(`Payment ${statusText} successfully!`, 'success');
        showOwnerSection('payments');
    }
}

function approveRentRequest(requestId) {
    const rentRequests = JSON.parse(localStorage.getItem('rentRequests') || '[]');
    const requestIndex = rentRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        const request = rentRequests[requestIndex];
        
        // Update rent request status
        rentRequests[requestIndex].status = 'approved';
        rentRequests[requestIndex].approvedAt = new Date().toISOString();
        
        // Assign tenant to apartment
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const apartmentIndex = apartments.findIndex(apt => apt.id === request.apartmentId);
        
        if (apartmentIndex !== -1) {
            apartments[apartmentIndex].tenantId = request.tenantId;
            apartments[apartmentIndex].status = 'occupied';
            localStorage.setItem('apartments', JSON.stringify(apartments));
        }
        
        localStorage.setItem('rentRequests', JSON.stringify(rentRequests));
        
        showAlert('Rent request approved successfully!', 'success');
        showOwnerSection('rent-requests');
    }
}

function rejectRentRequest(requestId) {
    const rentRequests = JSON.parse(localStorage.getItem('rentRequests') || '[]');
    const requestIndex = rentRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        rentRequests[requestIndex].status = 'rejected';
        rentRequests[requestIndex].rejectedAt = new Date().toISOString();
        
        localStorage.setItem('rentRequests', JSON.stringify(rentRequests));
        
        showAlert('Rent request rejected successfully!', 'success');
        showOwnerSection('rent-requests');
    }
}
