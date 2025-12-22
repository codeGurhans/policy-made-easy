// JavaScript for policy detail page
document.addEventListener('DOMContentLoaded', function() {
    // Get policy ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const policyId = window.location.pathname.split('/').pop();
    
    if (policyId && policyId !== 'policy-detail.html') {
        loadPolicy(policyId);
    } else {
        // Redirect to policies page if no ID is found
        window.location.href = '/policies';
    }
});

async function loadPolicy(policyId) {
    try {
        const response = await fetch(`/api/policies/${policyId}`);
        const policy = await response.json();
        
        displayPolicy(policy);
    } catch (error) {
        console.error('Error loading policy:', error);
        document.getElementById('policyContent').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error loading policy details. Please try again later.
            </div>
        `;
    }
}

function displayPolicy(policy) {
    // Update page title
    document.getElementById('pageTitle').textContent = `${policy.name} - PolicyLens India`;
    document.getElementById('policyBreadcrumb').textContent = policy.name;
    
    // Build the policy content HTML
    let contentHtml = `
        <div class="policy-detail">
            <h2>${policy.name}</h2>
            <div class="d-flex flex-wrap gap-2 mb-4">
                <span class="policy-category">${policy.category}</span>
                <span class="badge bg-${policy.status === 'active' ? 'success' : 'warning'}">${policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}</span>
                <span class="text-muted">${policy.target_group}</span>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h3>What is this policy?</h3>
                </div>
                <div class="card-body">
                    <p>${policy.description}</p>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h3>Who is it for?</h3>
                </div>
                <div class="card-body">
                    <p>${policy.target_group}</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h3>Pros</h3>
                        </div>
                        <div class="card-body">
                            <ul class="pros-list">
    `;
    
    policy.pros.forEach(pro => {
        contentHtml += `<li>${pro}</li>`;
    });
    
    contentHtml += `
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-danger text-white">
                            <h3>Cons / Limitations</h3>
                        </div>
                        <div class="card-body">
                            <ul class="cons-list">
    `;
    
    policy.cons.forEach(con => {
        contentHtml += `<li>${con}</li>`;
    });
    
    contentHtml += `
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <h3>How to avail</h3>
                </div>
                <div class="card-body">
                    ${policy.how_to_avail}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('policyContent').innerHTML = contentHtml;
    
    // Populate official links
    const linksContainer = document.getElementById('officialLinksList');
    linksContainer.innerHTML = '';
    
    policy.official_links.forEach(link => {
        const linkItem = document.createElement('li');
        linkItem.innerHTML = `<a href="${link.url}" target="_blank" class="text-decoration-none">${link.name} <i class="fas fa-external-link-alt"></i></a>`;
        linksContainer.appendChild(linkItem);
    });
}