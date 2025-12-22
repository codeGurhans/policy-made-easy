// JavaScript for results page
document.addEventListener('DOMContentLoaded', function() {
    const resultData = localStorage.getItem('eligibilityResult');
    
    if (resultData) {
        const result = JSON.parse(resultData);
        displayResults(result);
    } else {
        // If no data in localStorage, redirect to questionnaire
        window.location.href = '/questionnaire';
    }
});

function displayResults(result) {
    const container = document.getElementById('resultsContainer');
    
    if (result.eligible_policies.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <h4 class="alert-heading">No Matching Schemes Found</h4>
                <p>Based on your profile, we couldn't find any government schemes that you currently qualify for.</p>
                <p>Consider checking back later as new schemes are introduced regularly, or review your profile information.</p>
                <hr>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <a href="/questionnaire" class="btn btn-primary me-md-2">Update Profile</a>
                    <a href="/policies" class="btn btn-outline-primary">Explore All Policies</a>
                </div>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Eligibility Results</h4>
            <p>You may qualify for <strong>${result.eligible_policies.length}</strong> government policy/scheme${result.eligible_policies.length > 1 ? 's' : ''} based on your profile.</p>
        </div>
        
        <div class="row">
    `;
    
    result.eligible_policies.forEach(policy => {
        html += `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${policy.name}</h5>
                            <span class="badge bg-success">Eligible</span>
                        </div>
                        <p class="card-text">${policy.description}</p>
                        <div class="mt-2">
                            <span class="policy-category">${policy.category}</span>
                            <span class="text-muted ms-2">${policy.target_group}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="/policy/${policy.id}" class="btn btn-primary">Learn More & Apply</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="card mt-4">
            <div class="card-header">
                <h5>Your Profile</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Age Range:</strong> ${result.user_profile.age_range}</p>
                        <p><strong>Occupation:</strong> ${result.user_profile.occupation}</p>
                        <p><strong>Income Range:</strong> ${result.user_profile.income_range}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Student Status:</strong> ${result.user_profile.student_status}</p>
                        <p><strong>State:</strong> ${result.user_profile.state}</p>
                        <p><strong>Family Income:</strong> ${result.user_profile.family_income || 'Not specified'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}