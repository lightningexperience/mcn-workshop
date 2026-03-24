// Function to show the login form
function displayAuthForm() {
    document.getElementById("loginform").style.visibility = "visible";
}

// Function to hide the login form
function hideAuthForm() {
    document.getElementById("loginform").style.visibility = "hidden";
}

// Function to handle frontend UI and send data to Data Cloud
function submitAuthForm() {
    const emailInput = document.getElementById("email").value;
    const firstNameInput = document.getElementById("firstname").value;
    const lastNameInput = document.getElementById("lastname").value;

    if (emailInput) {
        // 1. Do the purely frontend UI work first
        hideAuthForm();
        
        // Find the login button in the header and update it
        const loginBtn = document.querySelector(".header-right .login");
        if (loginBtn) {
            // Change the text to "Hi, [Name]" (or just "Hi!" if they left the name blank)
            loginBtn.innerText = firstNameInput ? "Hi, " + firstNameInput : "Hi!";
            // Remove the onclick event so clicking it doesn't reopen the form
            loginBtn.removeAttribute("onclick");
        }

        // 2. Send the data to the Salesforce SDK
        if (window.SalesforceInteractions) {
            SalesforceInteractions.sendEvent({
                interaction: {
                    name: "User Login" 
                },
                user: {
                    identities: {
                        emailAddress: emailInput // Matches your "Exact Normalized Email" rule!
                    },
                    attributes: {
                        firstName: firstNameInput,
                        lastName: lastNameInput
                    }
                }
            }).then(() => {
                console.log("Success! Identity sent to Salesforce:", emailInput);
            });
        } else {
            console.warn("Salesforce Interactions SDK not loaded yet.");
        }
    } else {
        console.warn("No email provided.");
    }
}
