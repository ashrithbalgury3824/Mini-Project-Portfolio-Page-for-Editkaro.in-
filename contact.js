// Contact Page JavaScript

// Handle FAQ toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('open');
        });
    });

    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Get form field values
            const name = formDataObj.name;
            const email = formDataObj.email;
            const phone = formDataObj.phone;
            const message = formDataObj.message;
            
            // Log the data that would be sent to Google Sheets
            console.log('Form data to be sent to Google Sheets:', {
                name, email, phone, message,
                timestamp: new Date().toISOString()
            });
            
            // Simulate successful API call (normally we would make an actual API call here)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            formStatus.innerText = 'Thank you! Your message has been sent successfully.';
            formStatus.className = 'form-status success';
            
            // Reset form
            contactForm.reset();
            
            // Reset form status after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            formStatus.innerText = 'Sorry, there was an error sending your message. Please try again later.';
            formStatus.className = 'form-status error';
        } finally {
            // Restore button state
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});

/* 
To implement actual Google Sheets integration, you would:
1. Create a Google Sheet with columns for name, email, phone, message, and timestamp
2. Create a Google Apps Script bound to that sheet
3. Deploy the script as a web app
4. Replace the console.log above with an actual fetch API call to your deployed web app URL

Example Google Apps Script code:
-------------------------------
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email, 
    data.phone,
    data.message
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success'
  })).setMimeType(ContentService.MimeType.JSON);
}
*/