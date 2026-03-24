// --- NEW: Check for existing login state as soon as the page loads ---
document.addEventListener("DOMContentLoaded", function() {
    const storedName = sessionStorage.getItem("userFirstName");
    // If we have a stored name, update the button immediately
    if (storedName !== null) {
        updateLoginButtonUI(storedName);
    }
});

// Helper function to handle the UI change so we don't repeat code
function updateLoginButtonUI(firstName) {
    const loginBtn = document.querySelector(".header-right .login");
    if (loginBtn) {
        loginBtn.innerText = firstName ? "Hi, " + firstName : "Hi!";
        loginBtn.removeAttribute("onclick"); // Prevent reopening the form
    }
}

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
        // --- NEW: Save the user's name to browser storage for this session ---
        sessionStorage.setItem("userFirstName", firstNameInput);

        // 1. Do the purely frontend UI work first
        hideAuthForm();
        updateLoginButtonUI(firstNameInput);

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
