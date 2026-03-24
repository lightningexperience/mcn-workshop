// Function to show your HTML login form
function displayAuthForm() {
    document.getElementById("loginform").style.visibility = "visible";
}

// Function to hide your HTML login form
function hideAuthForm() {
    document.getElementById("loginform").style.visibility = "hidden";
}

// Function to send the data using Sergey's exact payload structure
function submitAuthForm() {
    const emailInput = document.getElementById("email").value;

    if (emailInput) {
        hideAuthForm();
        
        if (window.SalesforceInteractions) {
            // This is Sergey's exact payload
            SalesforceInteractions.sendEvent({
                interaction: { name: 'emailCapture' }, 
                user: {
                    attributes: {
                        eventType: 'contactPointEmail', 
                        email: emailInput
                    }
                }
            }).then(() => {
                console.log("Success! Email sent to Data Cloud via PM's payload:", emailInput);
                
                // Refresh after 1 second so Data Cloud has time to process the event
                setTimeout(() => { location.reload(); }, 1000); 
            });
        } else {
            console.error("Salesforce SDK not detected.");
        }
    } else {
        console.warn("No email provided.");
    }
}
