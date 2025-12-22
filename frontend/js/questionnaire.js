// JavaScript for questionnaire page
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eligibilityForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            age_range: document.getElementById('ageRange').value,
            occupation: document.getElementById('occupation').value,
            income_range: document.getElementById('incomeRange').value,
            student_status: document.getElementById('studentStatus').value,
            state: document.getElementById('state').value,
            family_income: document.getElementById('familyIncome').value
        };
        
        // Validate required fields
        for (let key in formData) {
            if (key !== 'family_income' && !formData[key]) {
                alert(`Please fill in the ${key.replace('_', ' ')}`);
                return;
            }
        }
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Checking Eligibility...';
            submitBtn.disabled = true;
            
            // Send data to backend
            const response = await fetch('/api/policies/check-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Redirect to results page with data
                localStorage.setItem('eligibilityResult', JSON.stringify(result));
                window.location.href = '/results';
            } else {
                alert('Error checking eligibility: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error checking eligibility. Please try again.');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});