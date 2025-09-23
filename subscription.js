// Email Subscription Functionality

document.addEventListener('DOMContentLoaded', function() {
    const subscriptionForm = document.getElementById('subscription-form');
    const subscriptionMessage = document.getElementById('subscription-message');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Show loading state
            const submitBtn = this.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Subscribing...';
            submitBtn.disabled = true;
            
            try {
                // Log the data that would be sent to Google Sheets
                console.log('Subscription data to be sent to Google Sheets:', {
                    email,
                    timestamp: new Date().toISOString()
                });
                
                // Simulate successful API call (normally we would make an actual API call here)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                subscriptionMessage.innerText = 'Thank you for subscribing!';
                subscriptionMessage.className = 'success-message';
                
                // Reset form
                emailInput.value = '';
                
            } catch (error) {
                console.error('Error submitting form:', error);
                
                // Show error message
                subscriptionMessage.innerText = 'Sorry, there was an error. Please try again later.';
                subscriptionMessage.className = 'error-message';
            } finally {
                // Restore button state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    subscriptionMessage.innerText = '';
                    subscriptionMessage.className = '';
                }, 5000);
            }
        });
    }
});

/* 
To implement actual Google Sheets integration, you would:
1. Create a Google Sheet with columns for email and timestamp
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
    data.email
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success'
  })).setMimeType(ContentService.MimeType.JSON);
}
*/