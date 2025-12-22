// JavaScript for policies explorer page
document.addEventListener('DOMContentLoaded', function() {
    loadPolicies();
    
    // Add event listeners for search and filters
    document.getElementById('searchInput').addEventListener('input', filterPolicies);
    document.getElementById('categoryFilter').addEventListener('change', filterPolicies);
    document.getElementById('statusFilter').addEventListener('change', filterPolicies);
});

async function loadPolicies() {
    try {
        const response = await fetch('/api/policies');
        const policies = await response.json();
        
        displayPolicies(policies);
    } catch (error) {
        console.error('Error loading policies:', error);
        document.getElementById('policiesContainer').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Error loading policies. Please try again later.
                </div>
            </div>
        `;
    }
}

function displayPolicies(policies) {
    const container = document.getElementById('policiesContainer');
    
    if (policies.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    No policies found matching your criteria.
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    policies.forEach(policy => {
        html += `
            <div class="col-md-6 mb-4 policy-item" 
                 data-category="${policy.category}" 
                 data-status="${policy.status}"
                 data-search="${policy.name.toLowerCase()} ${policy.description.toLowerCase()}">
                <div class="card policy-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${policy.name}</h5>
                            <span class="policy-status badge bg-${policy.status === 'active' ? 'success' : 'warning'}">
                                ${policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </span>
                        </div>
                        <p class="card-text">${policy.description}</p>
                        <div class="mt-2">
                            <span class="policy-category">${policy.category}</span>
                            <span class="text-muted ms-2">${policy.target_group}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="/policy/${policy.id}" class="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filterPolicies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    const policyItems = document.querySelectorAll('.policy-item');
    
    policyItems.forEach(item => {
        const matchesSearch = searchTerm === '' || item.dataset.search.includes(searchTerm);
        const matchesCategory = category === '' || item.dataset.category === category;
        const matchesStatus = status === '' || item.dataset.status === status;
        
        if (matchesSearch && matchesCategory && matchesStatus) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}