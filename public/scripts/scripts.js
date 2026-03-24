// 1. Function to show your HTML login form
function displayAuthForm() {
    document.getElementById("loginform").style.visibility = "visible";
}

// 2. Function to hide your HTML login form
function hideAuthForm() {
    document.getElementById("loginform").style.visibility = "hidden";
}

// 3. Function to capture the data and send it to Data Cloud
function submitAuthForm() {
    const emailInput = document.getElementById("email").value;
    const firstNameInput = document.getElementById("firstname").value;
    const lastNameInput = document.getElementById("lastname").value;

    if (emailInput) {
        // Hide the form immediately for a snappy UX
        hideAuthForm();
        
        if (window.SalesforceInteractions) {
            
            // PAYLOAD 1: The Core Identity (Routes to mcn02-identity DLO)
            SalesforceInteractions.sendEvent({
                interaction: { name: 'User Login' },
                user: {
                    attributes: {
                        eventType: 'identity', 
                        email: emailInput,
                        firstName: firstNameInput,
                        lastName: lastNameInput,
                        isAnonymous: 0 // 0 means they are known now!
                    }
                }
            }).then(() => {
                console.log("Success! Core Identity payload sent:", emailInput);
                
                // PAYLOAD 2: Party Identification (Helps Identity Resolution stitch the profile)
                SalesforceInteractions.sendEvent({
                    user: {
                        attributes: {
                            eventType: 'partyIdentification',
                            IDName: emailInput,
                            IDType: 'WebUser' // Matches the IR rule in your Data Cloud setup
                        }
                    }
                });

                // Refresh after 1 second so Data Cloud has time to process the event
                setTimeout(() => { location.reload(); }, 1000); 
            });
        } else {
            console.error("Salesforce SDK not detected on the page.");
        }
    } else {
        console.warn("No email provided.");
    }
}
